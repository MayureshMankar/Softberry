import mongoose from 'mongoose';

// Connection state tracking
let isConnecting = false;
let connectionPromise: Promise<boolean> | null = null;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;

// MongoDB connection options with improved settings
const mongoOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  retryWrites: true, // Automatically retry write operations
  w: 'majority' as const, // Write concern
};

// Enhanced connection function with retry logic
export const connectDB = async (): Promise<boolean> => {
  // If already connected, return success
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    console.log('✅ Already connected to MongoDB');
    return true;
  }
  
  // If already connecting, wait for the existing connection
  if (isConnecting && connectionPromise) {
    return await connectionPromise;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  const fallbackEnabled = (process.env.MONGO_LOCAL_FALLBACK ?? 'true').toLowerCase() !== 'false';
  const localUri = process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/perfume-store';
  
  // If no URI provided, optionally try a quick local fallback in dev
  if (!mongoUri || mongoUri.trim() === '') {
    console.log('⚠️  MONGODB_URI not provided.');
    if (fallbackEnabled && process.env.NODE_ENV !== 'production') {
      console.log('🔎 Attempting quick local MongoDB connection:', localUri);
      try {
        await mongoose.connect(localUri, { ...mongoOptions, serverSelectionTimeoutMS: 3000 });
        console.log('✅ Connected to local MongoDB successfully');
        return true;
      } catch (err: any) {
        console.warn('❌ Local MongoDB not available:', err.message);
      }
    }
    console.log('➡️  Running in memory-only mode.');
    console.log('📝 To enable MongoDB:');
    console.log('   1. Set MONGODB_URI in your .env file (Atlas or self-hosted)');
    console.log('   2. Or run a local instance and set MONGO_LOCAL_URI (default used if not set)');
    return false;
  }
  
  // Start new connection with retry logic
  isConnecting = true;
  connectionPromise = attemptConnection(mongoUri);
  
  try {
    const result = await connectionPromise;
    return result;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
};

// Connection attempt with detailed logging
async function attemptConnection(mongoUri: string): Promise<boolean> {
  while (connectionAttempts < MAX_RETRY_ATTEMPTS) {
    connectionAttempts++;
    
    try {
      console.log(`🔍 MongoDB connection attempt ${connectionAttempts}/${MAX_RETRY_ATTEMPTS}`);
      console.log('🔗 URI:', mongoUri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));
      
      await mongoose.connect(mongoUri, mongoOptions);
      console.log('✅ Connected to MongoDB successfully');
      connectionAttempts = 0; // Reset on success
      return true;
      
    } catch (error: any) {
      console.error(`❌ Connection attempt ${connectionAttempts} failed:`, error.message);
      
      // Provide specific error guidance
      if (error.message.includes('authentication failed') || error.message.includes('AuthenticationFailed')) {
        console.error('🔐 Authentication Error - Check your credentials:');
        console.error('   1. Verify username and password in connection string');
        console.error('   2. Ensure user exists in MongoDB Atlas');
        console.error('   3. Check database permissions for the user');
        console.error('   4. Make sure cluster is not paused');
        break; // Don't retry auth failures
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('🌐 Network Error - Check your connection:');
        console.error('   1. Verify internet connectivity');
        console.error('   2. Check if cluster hostname is correct');
        console.error('   3. Ensure cluster is not paused in Atlas');
      } else if (error.message.includes('serverSelectionTimeoutMS')) {
        console.error('⏱️  Server Selection Timeout:');
        console.error('   1. Check if MongoDB cluster is running');
        console.error('   2. Verify network access settings in Atlas');
        console.error('   3. Check firewall and IP whitelist settings');
      } else if (error.message.toLowerCase().includes('querysrv') || error.message.toLowerCase().includes('ecannrefused') || error.message.toLowerCase().includes('econnrefused')) {
        console.error('🧭 SRV lookup/connection issue detected.');
        console.error('   • If using mongodb+srv, try the "Standard connection string (no SRV)" from Atlas');
        console.error('   • Set it as MONGODB_URI in .env');
        console.error('   • Or set MONGO_LOCAL_URI and enable MONGO_LOCAL_FALLBACK for local dev');
      }
      
      if (connectionAttempts < MAX_RETRY_ATTEMPTS) {
        const delay = Math.min(1000 * connectionAttempts, 5000);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('❌ All MongoDB connection attempts failed');
  // Quick local fallback if enabled and in development
  const fallbackEnabled = (process.env.MONGO_LOCAL_FALLBACK ?? 'true').toLowerCase() !== 'false';
  const localUri = process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/perfume-store';
  if (fallbackEnabled && process.env.NODE_ENV !== 'production') {
    console.log('🔎 Attempting local MongoDB as fallback:', localUri);
    try {
      await mongoose.connect(localUri, { ...mongoOptions, serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to local MongoDB successfully (fallback)');
      connectionAttempts = 0;
      return true;
    } catch (err: any) {
      console.warn('❌ Local MongoDB fallback failed:', err.message);
    }
  }
  console.log('⚠️  Application will continue in memory-only mode');
  console.log('📝 For troubleshooting:');
  console.log('   1. Use Standard (non-SRV) connection string from Atlas');
  console.log('   2. Or run a local MongoDB and set MONGO_LOCAL_URI');
  connectionAttempts = 0; // Reset for future attempts
  return false;
}

// Export as connectToDatabase for compatibility
export const connectToDatabase = connectDB;

// Health check function
export const isConnected = (): boolean => {
  return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
};

// Get connection status
export const getConnectionStatus = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
};

// Handle connection events with better error handling
mongoose.connection.on('connected', () => {
  console.log('📦 Mongoose connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
  // Don't throw uncaught exceptions, just log the error
});

mongoose.connection.on('disconnected', () => {
  console.log('📦 Mongoose disconnected from MongoDB');
});

// Handle authentication errors specifically
mongoose.connection.on('reconnectFailed', () => {
  console.error('❌ MongoDB reconnection failed - check your credentials');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    await mongoose.connection.close();
    console.log('📦 MongoDB connection closed through app termination');
  }
  process.exit(0);
});

export default mongoose;
