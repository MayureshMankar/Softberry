import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { connectToDatabase } from "./db.js";
import { validateEnv } from "./utils/env.js";
import { logger } from "./utils/logger.js";
import { WebSocketServer } from "ws";
import { createServer } from "http";

// Validate environment variables on startup
const env = validateEnv();

const app = express();

// Use morgan for HTTP request logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: { write: (message) => logger.http(message.trim()) }
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https:", "http:"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Vite needs this in dev
      "connect-src": ["'self'", "ws:", "wss:", "https://api.razorpay.com"],
    },
  },
}));

const allowedOrigins = (env.ALLOWED_ORIGINS || "http://localhost:5173").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: env.NODE_ENV === "production" ? allowedOrigins : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
  skip: (req) => env.NODE_ENV !== "production",
});

// Apply rate limiting to all requests
app.use("/api", limiter);

if (env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    logger.debug(`[Body Parser] ${req.method} ${req.url} - Content-Length: ${req.headers["content-length"] || "Unknown"}`);
    next();
  });
}

app.use(cookieParser(env.SESSION_SECRET));

app.use(express.json({ 
  limit: '15mb'
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: '15mb',
  parameterLimit: 50000
}));

// Error handling for body parser
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error?.type === 'entity.too.large') {
    logger.error(`[Body Parser Error] Request entity too large: ${req.method} ${req.url}`);
    return res.status(413).json({ 
      error: 'Payload too large',
      message: 'Request entity too large. Please reduce the size of your request.'
    });
  }
  next(error);
});

// Session configuration
const sessionSecret = env.SESSION_SECRET;
const mongoUri = env.MONGODB_URI;

logger.info('🔍 Environment check:');
logger.info(`- NODE_ENV: ${env.NODE_ENV}`);
logger.info(`- PORT: ${env.PORT}`);
logger.info(`- MONGODB_URI: ${mongoUri ? 'Set' : 'Not set'}`);
logger.info(`- SESSION_SECRET: ${sessionSecret ? 'Set' : 'Not set'} (Length: ${sessionSecret.length})`);

// Configure session middleware with fallback for development
if (env.NODE_ENV === 'production' && mongoUri) {
  try {
    logger.info('🔍 Configuring MongoDB session store for production...');
    app.use(session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
        touchAfter: 24 * 3600,
        stringify: false,
      }),
      cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none', // IMPORTANT for cross-origin production
      },
    }));
    logger.info('✅ Session store configured with MongoDB for production');
  } catch (error) {
    logger.warn(`⚠️ MongoDB session store failed in production, using memory store: ${(error as Error).message}`);
    setupMemorySessionStore();
  }
} else {
  logger.info('🔍 Using memory session store for development');
  setupMemorySessionStore();
}

function setupMemorySessionStore() {
  logger.info(`- SESSION_SECRET for memory store: ${env.SESSION_SECRET ? 'Set' : 'Not set'} (Length: ${env.SESSION_SECRET.length})`);
  app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  }));
  logger.info('✅ Memory session store configured');
}

// Remove old logging middleware as we use morgan now

// Start server initialization
const startServer = async () => {
  try {
    // Initialize database connection
    logger.info('🚀 Starting server initialization...');
    const mongoConnected = await connectToDatabase();
    
    if (mongoConnected) {
      logger.info('✅ MongoDB connection established');
    } else {
      logger.warn('⚠️  Server starting without MongoDB - using memory-only mode');
    }
    
    // Create HTTP server
    const server = createServer(app);

    // Attach WebSocket server to existing HTTP server via upgrade on /ws/admin
    // WebSockets are supported on standard long-running servers like Render
    try {
      const wss = new WebSocketServer({ noServer: true });
        server.on('upgrade', (req, socket, head) => {
          try {
            const { url } = req;
            if (!url || !url.startsWith('/ws/admin')) {
              socket.destroy();
              return;
            }
            wss.handleUpgrade(req, socket as any, head, (ws) => {
              wss.emit('connection', ws, req);
            });
          } catch {
            try { socket.destroy(); } catch {}
          }
        });

        // Store connected admin clients
        const adminClients = new Set();
        
        wss.on('connection', (ws) => {
          logger.info('WebSocket client connected');
          
          ws.on('message', (message) => {
            try {
              const data = JSON.parse(message.toString());
              if (data.type === 'admin_auth') {
                const adminSecret = process.env.ADMIN_SECRET || 'Client-Admin-Secret';
                if (data.secret === adminSecret) {
                  adminClients.add(ws);
                  ws.send(JSON.stringify({ type: 'auth_success' }));
                  logger.info('Admin client authenticated');
                } else {
                  ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid admin secret' }));
                  ws.close();
                }
              }
            } catch (error) {
              logger.error(`Error parsing WebSocket message: ${error}`);
            }
          });
          
          ws.on('close', () => {
            adminClients.delete(ws);
            logger.info('WebSocket client disconnected');
          });
          
          ws.on('error', (error) => {
            logger.error(`WebSocket error: ${error}`);
            adminClients.delete(ws);
          });
        });

        (app as any).locals.adminClients = adminClients;
        (app as any).locals.notifyAdminClients = function(eventData: any) {
          if (adminClients && adminClients.size > 0) {
            const message = JSON.stringify({ type: 'order_update', data: eventData });
            adminClients.forEach((client: any) => {
              if (client.readyState === client.OPEN) {
                client.send(message);
              }
            });
          }
        };
      logger.info('✅ WebSocket upgrade route ready at /ws/admin');
    } catch (wsError) {
      logger.warn(`⚠️ WebSocket initialization failed: ${wsError}`);
    }

    // Serve uploaded images statically
    const uploadsPath = path.join(process.cwd(), 'client', 'public', 'uploads');
    app.use('/uploads', express.static(uploadsPath));
    logger.info(`📁 Static file serving configured for uploads at: ${uploadsPath}`);

    // Register API routes BEFORE Vite middleware
    await registerRoutes(app);

    // Setup Vite or Serve Static
    if (env.NODE_ENV === "development" && !process.env.RENDER) {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Global Error Handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = env.NODE_ENV === "production" && status === 500 
        ? "Internal Server Error" 
        : err.message || "Internal Server Error";
      
      logger.error(`${_req.method} ${_req.url} - ${status} - ${err.message}`);
      if (env.NODE_ENV !== "production") {
        logger.error(err.stack);
      }

      res.status(status).json({ 
        error: true,
        message,
        ...(env.NODE_ENV !== "production" && { stack: err.stack })
      });
    });

    // Start server listening
    server.listen(env.PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode at http://0.0.0.0:${env.PORT}`);
      logger.info(`🔌 WebSocket endpoint available at ws://0.0.0.0:${env.PORT}/ws/admin`);
    });

    return app;
  } catch (error) {
    logger.error(`Fatal error during server startup: ${error}`);
    process.exit(1);
  }
};

// Run the server
startServer();