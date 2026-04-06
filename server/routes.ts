import type { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { storage } from "./storage.js";
import {
  insertCartItemSchema,
  insertOrderSchema,
  insertWishlistSchema,
  insertProductSchema,
  insertUserSchema,
  updateProductSchema,
  updateOrderSchema
} from "@shared/schema";
import {
  authenticateToken,
  optionalAuth,
  getUserId,
  getCurrentUser,
  registerUser,
  loginUser,
  updateUserProfile,
  changePassword,
} from "./auth";
import { isConnected, getConnectionStatus } from "./db";
import { 
  sendCustomerOrderConfirmation, 
  sendCustomerStatusUpdate,
  sendAdminNewOrderNotification,
  sendAdminStatusUpdateSummary,
  sendEmail 
} from "./emailService";
import { Types } from "mongoose";
import type { NextFunction } from "express";
import { Order, User } from "@shared/schema";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_your_key_here",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_key_secret_here"
});

// Check if Razorpay is properly configured
const isRazorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
  process.env.RAZORPAY_KEY_ID !== "rzp_test_your_key_here" && 
  process.env.RAZORPAY_KEY_SECRET !== "your_key_secret_here" &&
  process.env.RAZORPAY_KEY_ID.trim() !== "" && 
  process.env.RAZORPAY_KEY_SECRET.trim() !== "");

// Admin authentication middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_SECRET || "Client-Admin-Secret";
  
  if (authHeader && (authHeader === adminSecret || authHeader.trim() === adminSecret)) {
    return next();
  }
  
  const user = getCurrentUser(req);
  if (user && (user as any).isAdmin) {
    return next();
  }
  
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res.redirect("/admin/login");
  }
  
  return res.status(403).json({ message: "Admin access required" });
}

export async function registerRoutes(app: Express) {
  let lastStaticCheckTime = 0;
  // Seed data on startup
  await storage.seedData();

  // Health check endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mongodb: {
        connected: isConnected(),
        status: getConnectionStatus(),
        uri: process.env.MONGODB_URI ? "configured" : "not configured"
      },
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/health/mongodb", (req, res) => {
    const connected = isConnected();
    const status = getConnectionStatus();
    
    res.status(connected ? 200 : 503).json({
      connected,
      status,
      uri: process.env.MONGODB_URI ? "configured" : "not configured",
      timestamp: new Date().toISOString()
    });
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;
      
      if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ 
          message: "All fields are required",
          errors: ["Email, first name, last name, and password are required"]
        });
      }
      
      const result = await registerUser({ email, firstName, lastName, password });
      
      if (result.success) {
        res.status(201).json({
          message: "Registration successful",
          user: result.user,
          token: result.token
        });
      } else {
        res.status(400).json({
          message: "Registration failed",
          errors: result.errors
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email and password are required",
          errors: ["Email and password are required"]
        });
      }
      
      const result = await loginUser({ email, password });
      
      if (result.success) {
        res.json({
          message: "Login successful",
          user: result.user,
          token: result.token
        });
      } else {
        res.status(401).json({
          message: "Login failed",
          errors: result.errors
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.get("/api/auth/user", optionalAuth, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      
      if (user) {
        // Return authenticated user (without password)
        const userResponse = { ...user, password: undefined };
        res.json(userResponse);
      } else {
        // Return guest user for development
        const guestUser = {
          id: "guest-user",
          email: "guest@example.com",
          firstName: "Guest",
          lastName: "User",
        };
        res.json(guestUser);
      }
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  app.put("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { firstName, lastName, email } = req.body;
      const result = await updateUserProfile(user._id.toString(), {
        firstName,
        lastName,
        email
      });
      
      if (result.success) {
        res.json({
          message: "Profile updated successfully",
          user: result.user
        });
      } else {
        res.status(400).json({
          message: "Profile update failed",
          errors: result.errors
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Profile update failed" });
    }
  });
  
  app.put("/api/auth/password", authenticateToken, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: "Current password and new password are required",
          errors: ["Current password and new password are required"]
        });
      }
      
      const result = await changePassword(user._id.toString(), {
        currentPassword,
        newPassword
      });
      
      if (result.success) {
        res.json({ message: "Password changed successfully" });
      } else {
        res.status(400).json({
          message: "Password change failed",
          errors: result.errors
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Password change failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    // For JWT-based auth, logout is handled client-side by removing the token
    res.json({ message: "Logout successful" });
  });

  // Image upload endpoint (Base64 approach)
  app.post("/api/admin/upload-image", optionalAuth, async (req: Request, res: Response) => {
    try {
      const { imageData, filename } = req.body;
      
      if (!imageData || !filename) {
        return res.status(400).json({ 
          message: "No image data provided",
          errors: ["Please provide imageData and filename"]
        });
      }

      // Validate base64 format
      const base64Match = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!base64Match) {
        return res.status(400).json({
          message: "Invalid image format",
          errors: ["Image must be in base64 format"]
        });
      }

      const mimeType = base64Match[1];
      const base64Data = base64Match[2];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(mimeType)) {
        return res.status(400).json({
          message: "Invalid file type",
          errors: ["Only JPEG, PNG, and WebP images are allowed"]
        });
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'client', 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.round(Math.random() * 1E9);
      const extension = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
      const uniqueFilename = `image-${timestamp}-${randomSuffix}.${extension}`;
      
      // Save file
      const filePath = path.join(uploadsDir, uniqueFilename);
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // Increased to 10MB
      if (buffer.length > maxSize) {
        return res.status(400).json({
          message: "File too large",
          errors: ["Image must be smaller than 10MB"]
        });
      }
      
      fs.writeFileSync(filePath, buffer);

      // Return the image URL
      const imageUrl = `/uploads/${uniqueFilename}`;
      
      res.json({
        message: "Image uploaded successfully",
        imageUrl: imageUrl,
        filename: uniqueFilename,
        size: buffer.length,
        mimetype: mimeType
      });
    } catch (error: any) {
      console.error('Image upload error:', error);
      res.status(500).json({ 
        message: "Image upload failed",
        errors: [error.message || "Upload failed"]
      });
    }
  });

  // Sync homepage products endpoint
  app.post("/api/admin/sync-homepage-products", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { product } = req.body;
      
      if (!product) {
        return res.status(400).json({ 
          message: "No product data provided",
          errors: ["Please provide product data to sync"]
        });
      }

      // Path to homepage-products.ts file
      const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
      
      // Read the current file content
      let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
      
      // Find the homepageProducts array section
      const arrayStart = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
      if (arrayStart === -1) {
        return res.status(500).json({ 
          message: "Failed to parse homepage products file",
          errors: ["Could not find homepageProducts array in file"]
        });
      }
      
      const arrayEnd = fileContent.lastIndexOf('];');
      if (arrayEnd === -1) {
        return res.status(500).json({ 
          message: "Failed to parse homepage products file",
          errors: ["Could not find end of homepageProducts array"]
        });
      }
      
      // Check if product already exists
      const productId = product.id;
      if (!productId) {
        return res.status(400).json({ 
          message: "Invalid product data",
          errors: ["Product must have an id field"]
        });
      }
      
      // Format product object as TypeScript with proper validation
      const formatProduct = (prod: any): string => {
        // Validate required fields
        if (!prod.name || !prod.price || !prod.brand || !prod.category || !prod.slug) {
          throw new Error("Missing required product fields");
        }
        
        const formatArray = (arr: any[]) => {
          if (!arr || arr.length === 0) return '[]';
          return `[\n    ${arr.map(item => `"${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',\n    ')}\n  ]`;
        };
        
        // Escape special characters in strings
        const escapeString = (str: string) => {
          if (!str) return '';
          return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        };
        
        return `  {
    id: "${escapeString(prod.id)}",
    name: "${escapeString(prod.name)}",
    description: "${escapeString(prod.description || '')}",
    shortDescription: "${escapeString(prod.shortDescription || '')}",
    price: ${prod.price},
    ${prod.originalPrice ? `originalPrice: ${prod.originalPrice},` : ''}
    imageUrl: "${escapeString(prod.imageUrl || '')}",
    brand: "${escapeString(prod.brand)}",
    category: "${escapeString(prod.category)}",
    slug: "${escapeString(prod.slug)}",
    volume: "${escapeString(prod.volume || '')}",
    fragranceFamily: "${escapeString(prod.fragranceFamily || '')}",
    topNotes: ${formatArray(prod.topNotes || [])},
    middleNotes: ${formatArray(prod.middleNotes || [])},
    baseNotes: ${formatArray(prod.baseNotes || [])},
    longevity: "${escapeString(prod.longevity || '')}",
    sillage: "${escapeString(prod.sillage || '')}",
    gender: "${escapeString(prod.gender || 'Unisex')}",
    isActive: ${prod.isActive !== undefined ? prod.isActive : true},
    isFeatured: ${prod.isFeatured || false},
    isNewArrival: ${prod.isNewArrival || false},
    isBestSeller: ${prod.isBestSeller || false},
    isLimitedEdition: ${prod.isLimitedEdition || false},
    stockQuantity: ${prod.stockQuantity || 0},
    reviewCount: ${prod.reviewCount || 0},
    averageRating: ${prod.averageRating || 0}${prod.themeStyles ? `,
    themeStyles: ${JSON.stringify(prod.themeStyles)}` : ''}
  }`;
      };
      
      // Validate product data before formatting
      try {
        const formattedProduct = formatProduct(product);
        const productExists = fileContent.includes(`id: "${productId}"`);
        
        if (productExists) {
          // Update existing product
          const productRegex = new RegExp(`  \\{[^}]*id:\\s*"${productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?\\n  \\}`, 'g');
          fileContent = fileContent.replace(productRegex, formattedProduct);
        } else {
          // Add new product - insert in the correct location within the array
          const arrayStartIndex = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
          const arrayEndIndex = fileContent.indexOf('];', arrayStartIndex);
          
          if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
            // Extract the part of the file that contains the array
            const arraySection = fileContent.substring(arrayStartIndex, arrayEndIndex + 2);
            
            // Find the last product in the array
            const lastProductEnd = arraySection.lastIndexOf('  }');
            if (lastProductEnd !== -1 && lastProductEnd > 0) {
              // Insert the new product after the last product with a comma
              const insertPosition = arrayStartIndex + lastProductEnd + 3; // +3 to account for "  }"
              const beforeInsert = fileContent.substring(0, insertPosition);
              const afterInsert = fileContent.substring(insertPosition);
              
              fileContent = beforeInsert + ',\n' + formattedProduct + afterInsert;
            } else {
              // No existing products, insert right after the opening bracket
              const openingBracketIndex = arraySection.indexOf('[');
              if (openingBracketIndex !== -1) {
                const insertPosition = arrayStartIndex + openingBracketIndex + 1;
                const beforeInsert = fileContent.substring(0, insertPosition);
                const afterInsert = fileContent.substring(insertPosition);
                
                fileContent = beforeInsert + '\n' + formattedProduct + afterInsert;
              } else {
                // Fallback: insert before the closing bracket
                const beforeInsert = fileContent.substring(0, arrayEndIndex);
                const afterInsert = fileContent.substring(arrayEndIndex);
                
                fileContent = beforeInsert + '\n' + formattedProduct + '\n' + afterInsert;
              }
            }
          }
        }
        
        // Write the updated content back to the file
        fs.writeFileSync(homepageProductsPath, fileContent);
        
        res.json({
          message: productExists ? "Product updated in homepage products successfully" : "Product added to homepage products successfully",
          product
        });
      } catch (formatError: any) {
        return res.status(400).json({ 
          message: "Failed to format product data",
          errors: [formatError.message || "Invalid product data format"]
        });
      }
    } catch (error: any) {
      console.error('Sync homepage products error:', error);
      res.status(500).json({ 
        message: "Failed to sync homepage products",
        errors: [error.message || "Sync failed"]
      });
    }
  });

  // Import static data to database endpoint
  app.post("/api/admin/import-static-data", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      console.log("Import static data endpoint called");
      console.log("Request headers in import endpoint:", req.headers);
      console.log("Authorization header in import endpoint:", req.headers.authorization);
      
      // Path to homepage-products.ts file
      const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
      console.log("Homepage products file path:", homepageProductsPath);
      
      // Check if file exists
      if (!fs.existsSync(homepageProductsPath)) {
        console.error("Homepage products file not found at:", homepageProductsPath);
        return res.status(500).json({ 
          message: "Homepage products file not found",
          errors: ["File not found at: " + homepageProductsPath]
        });
      }
      
      // Read the current file content
      let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
      console.log("File read successfully, content length:", fileContent.length);
      
      // Extract only the homepageProducts array section
      const arrayStart = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
      if (arrayStart === -1) {
        return res.status(500).json({ 
          message: "Failed to parse homepage products file",
          errors: ["Could not find homepageProducts array in file"]
        });
      }
      
      const arrayEnd = fileContent.indexOf('];', arrayStart);
      if (arrayEnd === -1) {
        return res.status(500).json({ 
          message: "Failed to parse homepage products file",
          errors: ["Could not find end of homepageProducts array"]
        });
      }
      
      // Extract just the array content
      const arrayContent = fileContent.substring(arrayStart, arrayEnd + 2);
      console.log("Array content length:", arrayContent.length);
      
      // Extract products using regex from the array content only
      const products: any[] = [];
      const productRegex = /  \{\s*id:\s*"([^"]+)"[\s\S]*?  \}/g;
      let match;
      
      while ((match = productRegex.exec(arrayContent)) !== null) {
        // Extract individual fields for each product
        const productBlock = match[0];
        const productId = match[1];
        
        // Extract fields using regex
        const nameMatch = productBlock.match(/name:\s*"([^"]+)"/);
        const descriptionMatch = productBlock.match(/description:\s*"([^"]*)"/);
        const shortDescriptionMatch = productBlock.match(/shortDescription:\s*"([^"]*)"/);
        const priceMatch = productBlock.match(/price:\s*(\d+)/);
        const originalPriceMatch = productBlock.match(/originalPrice:\s*(\d+)/);
        const imageUrlMatch = productBlock.match(/imageUrl:\s*"([^"]*)"/);
        const brandMatch = productBlock.match(/brand:\s*"([^"]+)"/);
        const categoryMatch = productBlock.match(/category:\s*"([^"]+)"/);
        const slugMatch = productBlock.match(/slug:\s*"([^"]+)"/);
        const volumeMatch = productBlock.match(/volume:\s*"([^"]*)"/);
        const fragranceFamilyMatch = productBlock.match(/fragranceFamily:\s*"([^"]*)"/);
        const longevityMatch = productBlock.match(/longevity:\s*"([^"]*)"/);
        const sillageMatch = productBlock.match(/sillage:\s*"([^"]*)"/);
        const genderMatch = productBlock.match(/gender:\s*"([^"]*)"/);
        const isActiveMatch = productBlock.match(/isActive:\s*(true|false)/);
        const isFeaturedMatch = productBlock.match(/isFeatured:\s*(true|false)/);
        const isNewArrivalMatch = productBlock.match(/isNewArrival:\s*(true|false)/);
        const isBestSellerMatch = productBlock.match(/isBestSeller:\s*(true|false)/);
        const isLimitedEditionMatch = productBlock.match(/isLimitedEdition:\s*(true|false)/);
        const stockQuantityMatch = productBlock.match(/stockQuantity:\s*(\d+)/);
        const reviewCountMatch = productBlock.match(/reviewCount:\s*(\d+)/);
        const averageRatingMatch = productBlock.match(/averageRating:\s*([\d.]+)/);
        
        // Parse array fields
        const topNotes: string[] = [];
        const middleNotes: string[] = [];
        const baseNotes: string[] = [];
        
        // Extract notes arrays
        const topNotesMatch = productBlock.match(/topNotes:\s*$(\s*"[^"]*"(?:,\s*"[^"]*")*\s*)?$/);
        if (topNotesMatch && topNotesMatch[1]) {
          const notes = topNotesMatch[1].match(/"([^"]*)"/g);
          if (notes) {
            notes.forEach(note => topNotes.push(note.replace(/"/g, '')));
          }
        }
        
        const middleNotesMatch = productBlock.match(/middleNotes:\s*$(\s*"[^"]*"(?:,\s*"[^"]*")*\s*)?$/);
        if (middleNotesMatch && middleNotesMatch[1]) {
          const notes = middleNotesMatch[1].match(/"([^"]*)"/g);
          if (notes) {
            notes.forEach(note => middleNotes.push(note.replace(/"/g, '')));
          }
        }
        
        const baseNotesMatch = productBlock.match(/baseNotes:\s*$(\s*"[^"]*"(?:,\s*"[^"]*")*\s*)?$/);
        if (baseNotesMatch && baseNotesMatch[1]) {
          const notes = baseNotesMatch[1].match(/"([^"]*)"/g);
          if (notes) {
            notes.forEach(note => baseNotes.push(note.replace(/"/g, '')));
          }
        }
        
        const product = {
          id: productId,
          name: nameMatch ? nameMatch[1] : '',
          description: descriptionMatch ? descriptionMatch[1] : '',
          shortDescription: shortDescriptionMatch ? shortDescriptionMatch[1] : '',
          price: priceMatch ? parseInt(priceMatch[1]) : 0,
          originalPrice: originalPriceMatch ? parseInt(originalPriceMatch[1]) : undefined,
          imageUrl: imageUrlMatch ? imageUrlMatch[1] : '',
          brand: brandMatch ? brandMatch[1] : '',
          category: categoryMatch ? categoryMatch[1] : '',
          slug: slugMatch ? slugMatch[1] : '',
          volume: volumeMatch ? volumeMatch[1] : '',
          fragranceFamily: fragranceFamilyMatch ? fragranceFamilyMatch[1] : '',
          topNotes,
          middleNotes,
          baseNotes,
          longevity: longevityMatch ? longevityMatch[1] : '',
          sillage: sillageMatch ? sillageMatch[1] : '',
          gender: genderMatch ? genderMatch[1] : 'Unisex',
          isActive: isActiveMatch ? isActiveMatch[1] === 'true' : true,
          isFeatured: isFeaturedMatch ? isFeaturedMatch[1] === 'true' : false,
          isNewArrival: isNewArrivalMatch ? isNewArrivalMatch[1] === 'true' : false,
          isBestSeller: isBestSellerMatch ? isBestSellerMatch[1] === 'true' : false,
          isLimitedEdition: isLimitedEditionMatch ? isLimitedEditionMatch[1] === 'true' : false,
          stockQuantity: stockQuantityMatch ? parseInt(stockQuantityMatch[1]) : 0,
          reviewCount: reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0,
          averageRating: averageRatingMatch ? parseFloat(averageRatingMatch[1]) : 0
        };
        
        // Only add products with valid names (to avoid category/brand entries)
        if (product.name && product.slug) {
          products.push(product);
        }
      }
      
      console.log(`Extracted ${products.length} products from static file`);
      
      // Import each product to the database
      let importedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;
      
      for (const staticProduct of products) {
        try {
          console.log(`Processing product: ${staticProduct.name} (${staticProduct.slug})`);
          
          // Check if product already exists in database by slug
          const existingProduct = await storage.getProductBySlug(staticProduct.slug);
          console.log(`Product exists in DB: ${!!existingProduct}`);
          
          // Handle brand and category mapping
          let brandId = null;
          let categoryId = null;
          
          if (staticProduct.brand) {
            // Try to find brand by name first (case-insensitive)
            const brands = await storage.getBrands();
            const matchedBrand = brands.find(b => 
              b.name.toLowerCase() === staticProduct.brand.toLowerCase() || 
              b.slug === staticProduct.brand.toLowerCase().replace(/\s+/g, '-')
            );
            
            if (matchedBrand) {
              brandId = matchedBrand._id;
              console.log(`Found brand: ${matchedBrand.name} (${brandId})`);
            } else {
              console.log(`Brand not found: ${staticProduct.brand}`);
            }
          }
          
          if (staticProduct.category) {
            // Try to find category by name first (case-insensitive)
            const categories = await storage.getCategories();
            const matchedCategory = categories.find(c => 
              c.name.toLowerCase() === staticProduct.category.toLowerCase() || 
              c.slug === staticProduct.category.toLowerCase().replace(/\s+/g, '-')
            );
            
            if (matchedCategory) {
              categoryId = matchedCategory._id;
              console.log(`Found category: ${matchedCategory.name} (${categoryId})`);
            } else {
              console.log(`Category not found: ${staticProduct.category}`);
            }
          }
          
          // Prepare product data with proper brandId and categoryId
          const productData = {
            ...staticProduct,
            brandId,
            categoryId
          };
          
          // Remove brand and category fields as we're using brandId and categoryId
          delete productData.brand;
          delete productData.category;
          
          if (existingProduct) {
            // Update existing product using the database ID
            console.log(`Updating existing product: ${existingProduct._id} (${staticProduct.slug})`);
            await storage.updateProductById(existingProduct._id.toString(), productData);
            updatedCount++;
          } else {
            // Create new product
            console.log(`Creating new product with data:`, productData);
            // Remove the id field as MongoDB will generate a new one
            delete productData.id;
            
            await storage.createProduct(productData);
            importedCount++;
          }
        } catch (error) {
          console.error(`Error importing product ${staticProduct.name}:`, error);
          errorCount++;
        }
      }
      
      const result = {
        message: "Static data import completed",
        imported: importedCount,
        updated: updatedCount,
        errors: errorCount,
        total: products.length
      };
      
      console.log("Import result:", result);
      res.json(result);
    } catch (error: any) {
      console.error('Import static data error:', error);
      res.status(500).json({ 
        message: "Failed to import static data",
        errors: [error.message || "Import failed"]
      });
    }
  });

  // Check for static file changes endpoint
  app.get("/api/admin/check-static-changes", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      // Path to homepage-products.ts file
      const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
      
      // Check if file exists
      if (!fs.existsSync(homepageProductsPath)) {
        return res.status(404).json({ 
          message: "Homepage products file not found",
          hasChanges: false
        });
      }
      
      // Get file stats to check modification time
      const stats = fs.statSync(homepageProductsPath);
      const lastModified = stats.mtime.getTime();
      
      const lastCheckTime = lastStaticCheckTime || 0;
      lastStaticCheckTime = lastModified;
      
      // Check if file has been modified since last check
      const hasChanges = lastModified > lastCheckTime;
      
      res.json({
        hasChanges,
        lastModified,
        lastCheckTime
      });
    } catch (error: any) {
      console.error('Check static changes error:', error);
      res.status(500).json({ 
        message: "Failed to check static file changes",
        hasChanges: false
      });
    }
  });

  // Admin Product API routes
  app.get("/api/admin/products", authenticateAdmin, async (req, res) => {
    try {
      console.log("Admin products API endpoint called"); // Debug log
      console.log("Request headers:", req.headers); // Debug log
      // Prevent caching for admin endpoints
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': 'W/"' + Date.now() + '-' + Math.random().toString(36).substring(2, 15) + '"'
      });
      // For admin, we want to see all products including inactive ones
      console.log("Calling storage.getProducts with includeInactive: true");
      const products = await storage.getProducts({ includeInactive: true });
      console.log("Products fetched, sending response:", products.length); // Debug log
      console.log("Product details:", products.map(p => ({ id: p._id, name: p.name, isActive: p.isActive }))); // Debug log
      
      // Add additional validation to ensure we're sending all products
      const activeProducts = products.filter(p => p.isActive);
      const inactiveProducts = products.filter(p => !p.isActive);
      console.log(`Returning ${activeProducts.length} active products and ${inactiveProducts.length} inactive products`);
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/admin/products", authenticateAdmin, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      
      // Also sync with homepage-products.ts file
      try {
        const brandName = typeof product.brand === 'object' && product.brand ? (product.brand as any).name : (product.brand as any);
        const categoryName = typeof product.category === 'object' && product.category ? (product.category as any).name : (product.category as any);
        const homepageProduct = {
          ...product,
          id: product._id?.toString() || (product as any).id,
          brand: String(brandName || "Unknown Brand"),
          category: String(categoryName || "Unknown Category")
        };
        
        // Path to homepage-products.ts file
        const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
        
        // Read the current file content
        let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
        
        // Format product object as TypeScript
        const formatArray = (arr: any[]) => {
          if (!arr || arr.length === 0) return '[]';
          return `[\n    ${arr.map(item => `"${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',\n    ')}\n  ]`;
        };
        
        // Escape special characters in strings
        const escapeString = (str: string) => {
          if (!str) return '';
          return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        };
        
        const formattedProduct = `  {
    id: "${escapeString(homepageProduct.id)}",
    name: "${escapeString(homepageProduct.name)}",
    description: "${escapeString(homepageProduct.description || '')}",
    shortDescription: "${escapeString(homepageProduct.shortDescription || '')}",
    price: ${homepageProduct.price},
    ${homepageProduct.originalPrice ? `originalPrice: ${homepageProduct.originalPrice},` : ''}
    imageUrl: "${escapeString(homepageProduct.imageUrl || '')}",
    brand: "${escapeString(homepageProduct.brand)}",
    category: "${escapeString(homepageProduct.category)}",
    slug: "${escapeString(homepageProduct.slug)}",
    volume: "${escapeString(homepageProduct.volume || '')}",
    fragranceFamily: "${escapeString(homepageProduct.fragranceFamily || '')}",
    topNotes: ${formatArray(homepageProduct.topNotes || [])},
    middleNotes: ${formatArray(homepageProduct.middleNotes || [])},
    baseNotes: ${formatArray(homepageProduct.baseNotes || [])},
    longevity: "${escapeString(homepageProduct.longevity || '')}",
    sillage: "${escapeString(homepageProduct.sillage || '')}",
    gender: "${escapeString(homepageProduct.gender || 'Unisex')}",
    isActive: ${homepageProduct.isActive !== undefined ? homepageProduct.isActive : true},
    isFeatured: ${homepageProduct.isFeatured || false},
    isNewArrival: ${homepageProduct.isNewArrival || false},
    isBestSeller: ${homepageProduct.isBestSeller || false},
    isLimitedEdition: ${homepageProduct.isLimitedEdition || false},
    stockQuantity: ${homepageProduct.stockQuantity || 0},
    reviewCount: ${homepageProduct.reviewCount || 0},
    averageRating: ${homepageProduct.averageRating || 0}
  }`;
        
        // Add new product to the file
        const arrayStartIndex = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
        const arrayEndIndex = fileContent.indexOf('];', arrayStartIndex);
        
        if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
          // Find the position to insert the new product
          // Look for the last product entry before the closing bracket
          const arraySection = fileContent.substring(arrayStartIndex, arrayEndIndex + 2);
          
          // Find the last product in the array
          const lastProductEnd = arraySection.lastIndexOf('  }');
          if (lastProductEnd !== -1 && lastProductEnd > 0) {
            // Insert the new product after the last product with a comma
            const insertPosition = arrayStartIndex + lastProductEnd + 3; // +3 to account for "  }"
            const beforeInsert = fileContent.substring(0, insertPosition);
            const afterInsert = fileContent.substring(insertPosition);
            
            fileContent = beforeInsert + ',\n' + formattedProduct + afterInsert;
          } else {
            // No existing products, insert right after the opening bracket
            const openingBracketIndex = arraySection.indexOf('[');
            if (openingBracketIndex !== -1) {
              const insertPosition = arrayStartIndex + openingBracketIndex + 1;
              const beforeInsert = fileContent.substring(0, insertPosition);
              const afterInsert = fileContent.substring(insertPosition);
              
              fileContent = beforeInsert + '\n' + formattedProduct + afterInsert;
            } else {
              // Fallback: insert before the closing bracket
              const beforeInsert = fileContent.substring(0, arrayEndIndex);
              const afterInsert = fileContent.substring(arrayEndIndex);
              
              fileContent = beforeInsert + '\n' + formattedProduct + '\n' + afterInsert;
            }
          }
          
          // Write the updated content back to the file
          fs.writeFileSync(homepageProductsPath, fileContent);
        }
      } catch (syncError) {
        console.error('Failed to sync with homepage-products.ts:', syncError);
        // Don't fail the create operation if sync fails
      }
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      // Provide more detailed error information
      if (error instanceof Error) {
        res.status(500).json({ 
          message: "Failed to create product",
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      } else {
        res.status(500).json({ 
          message: "Failed to create product",
          error: String(error)
        });
      }
    }
  });

  app.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      console.log("Updating product:", req.params.id); // Debug log
      console.log("Update data:", req.body); // Debug log
      
      const product = await storage.updateProduct(req.params.id, req.body);
      
      console.log("Product updated successfully:", {
        id: product._id,
        name: product.name,
        isActive: product.isActive
      }); // Debug log
      
      // Also sync with homepage-products.ts file
      try {
        const brandName = typeof product.brand === 'object' && product.brand ? (product.brand as any).name : (product.brand as any);
        const categoryName = typeof product.category === 'object' && product.category ? (product.category as any).name : (product.category as any);
        const homepageProduct = {
          ...product,
          id: product._id?.toString() || (product as any).id,
          brand: String(brandName || "Unknown Brand"),
          category: String(categoryName || "Unknown Category")
        };
        
        // Path to homepage-products.ts file
        const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
        
        // Read the current file content
        let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
        
        // Format product object as TypeScript
        const formatArray = (arr: any[]) => {
          if (!arr || arr.length === 0) return '[]';
          return `[\n    ${arr.map(item => `"${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',\n    ')}\n  ]`;
        };
        
        // Escape special characters in strings
        const escapeString = (str: string) => {
          if (!str) return '';
          return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        };
        
        const formattedProduct = `  {
    id: "${escapeString(homepageProduct.id)}",
    name: "${escapeString(homepageProduct.name)}",
    description: "${escapeString(homepageProduct.description || '')}",
    shortDescription: "${escapeString(homepageProduct.shortDescription || '')}",
    price: ${homepageProduct.price},
    ${homepageProduct.originalPrice ? `originalPrice: ${homepageProduct.originalPrice},` : ''}
    imageUrl: "${escapeString(homepageProduct.imageUrl || '')}",
    brand: "${escapeString(homepageProduct.brand)}",
    category: "${escapeString(homepageProduct.category)}",
    slug: "${escapeString(homepageProduct.slug)}",
    volume: "${escapeString(homepageProduct.volume || '')}",
    fragranceFamily: "${escapeString(homepageProduct.fragranceFamily || '')}",
    topNotes: ${formatArray(homepageProduct.topNotes || [])},
    middleNotes: ${formatArray(homepageProduct.middleNotes || [])},
    baseNotes: ${formatArray(homepageProduct.baseNotes || [])},
    longevity: "${escapeString(homepageProduct.longevity || '')}",
    sillage: "${escapeString(homepageProduct.sillage || '')}",
    gender: "${escapeString(homepageProduct.gender || 'Unisex')}",
    isActive: ${homepageProduct.isActive !== undefined ? homepageProduct.isActive : true},
    isFeatured: ${homepageProduct.isFeatured || false},
    isNewArrival: ${homepageProduct.isNewArrival || false},
    isBestSeller: ${homepageProduct.isBestSeller || false},
    isLimitedEdition: ${homepageProduct.isLimitedEdition || false},
    stockQuantity: ${homepageProduct.stockQuantity || 0},
    reviewCount: ${homepageProduct.reviewCount || 0},
    averageRating: ${homepageProduct.averageRating || 0}
  }`;
        
        // Update existing product in the file
        const productId = homepageProduct.id;
        const productRegex = new RegExp(`  \\{[^}]*id:\\s*"${productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?\\n  \\}`, 'g');
        
        // Check if product exists in the homepageProducts array section
        const arrayStartIndex = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
        const arrayEndIndex = fileContent.indexOf('];', arrayStartIndex);
        
        if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
          const arraySection = fileContent.substring(arrayStartIndex, arrayEndIndex + 2);
          
          if (productRegex.test(arraySection)) {
            // Product exists in the array, update it
            const fullRegex = new RegExp(`  \\{[^}]*id:\\s*"${productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?\\n  \\}`, 'g');
            fileContent = fileContent.replace(fullRegex, formattedProduct);
            
            // Write the updated content back to the file
            fs.writeFileSync(homepageProductsPath, fileContent);
          } else {
            // Product not found in file, add it as a new product
            // Find the correct position to insert the new product
            // Look for the last product entry before the closing bracket
            const lastProductEnd = arraySection.lastIndexOf('  }');
            
            if (lastProductEnd !== -1 && lastProductEnd > 0) {
              // Insert the new product after the last product with a comma
              const insertPosition = arrayStartIndex + lastProductEnd + 3; // +3 to account for "  }"
              const beforeInsert = fileContent.substring(0, insertPosition);
              const afterInsert = fileContent.substring(insertPosition);
              
              fileContent = beforeInsert + ',\n' + formattedProduct + afterInsert;
            } else {
              // No existing products, insert right after the opening bracket
              const openingBracketIndex = arraySection.indexOf('[');
              if (openingBracketIndex !== -1) {
                const insertPosition = arrayStartIndex + openingBracketIndex + 1;
                const beforeInsert = fileContent.substring(0, insertPosition);
                const afterInsert = fileContent.substring(insertPosition);
                
                fileContent = beforeInsert + '\n' + formattedProduct + afterInsert;
              } else {
                // Fallback: insert before the closing bracket
                const beforeInsert = fileContent.substring(0, arrayEndIndex);
                const afterInsert = fileContent.substring(arrayEndIndex);
                
                fileContent = beforeInsert + '\n' + formattedProduct + '\n' + afterInsert;
              }
            }
          }
        }
      } catch (syncError) {
        console.error('Failed to sync with homepage-products.ts:', syncError);
        // Don't fail the update operation if sync fails
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin Brand API routes
  app.get("/api/admin/brands", authenticateAdmin, async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.get("/api/admin/brands/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/brands", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/brands/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/brands/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Category API routes
  app.get("/api/admin/categories", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.get("/api/admin/categories/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.post("/api/admin/categories", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.put("/api/admin/categories/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.delete("/api/admin/categories/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });



  // Admin User API routes
  app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.get("/api/admin/users/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.post("/api/admin/users", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.put("/api/admin/users/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.delete("/api/admin/users/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Review API routes
  app.get("/api/admin/reviews", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.get("/api/admin/reviews/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.post("/api/admin/reviews", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.put("/api/admin/reviews/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.delete("/api/admin/reviews/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Cart API routes
  app.get("/api/admin/carts", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.get("/api/admin/carts/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.post("/api/admin/carts", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.put("/api/admin/carts/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.delete("/api/admin/carts/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Wishlist API routes
  app.get("/api/admin/wishlists", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/wishlists/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/wishlists", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/wishlists/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/wishlists/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Coupon API routes
  app.get("/api/admin/coupons", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/coupons/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/coupons", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/coupons/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/coupons/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Shipping API routes
  app.get("/api/admin/shippings", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/shippings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/shippings", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/shippings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/shippings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Payment API routes
  app.get("/api/admin/payments", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/payments/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/payments", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/payments/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/payments/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Notification API routes
  app.get("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/notifications/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/notifications/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/notifications/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Setting API routes
  app.get("/api/admin/settings", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.get("/api/admin/settings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/settings", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/settings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/settings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Log API routes
  app.get("/api/admin/logs", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/logs/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/logs", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/logs/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/logs/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Backup API routes
  app.get("/api/admin/backups", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/backups/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/backups", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/backups/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/backups/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Restore API routes
  app.get("/api/admin/restores", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/restores/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/restores", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/restores/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/restores/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Import API routes
  app.get("/api/admin/imports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/imports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/imports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/imports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/imports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Export API routes
  app.get("/api/admin/exports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.get("/api/admin/exports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.post("/api/admin/exports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.put("/api/admin/exports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });
  app.delete("/api/admin/exports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Report API routes
  app.get("/api/admin/reports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/reports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Dashboard API routes
  app.get("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/dashboard/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/dashboard/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/dashboard/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Analytics API routes
  app.get("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/analytics/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/analytics/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/analytics/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Notification API routes
  app.get("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/notifications/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/notifications", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/notifications/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/notifications/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Setting API routes
  app.get("/api/admin/settings", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/settings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/settings", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/settings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/settings/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Log API routes
  app.get("/api/admin/logs", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/logs/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/logs", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/logs/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/logs/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Backup API routes
  app.get("/api/admin/backups", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/backups/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/backups", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/backups/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/backups/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Restore API routes
  app.get("/api/admin/restores", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/restores/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/restores", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/restores/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/restores/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Import API routes
  app.get("/api/admin/imports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/imports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/imports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/imports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/imports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Export API routes
  app.get("/api/admin/exports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/exports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/exports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/exports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/exports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Report API routes
  app.get("/api/admin/reports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/reports", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/reports/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Dashboard API routes
  app.get("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/dashboard/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/dashboard", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/dashboard/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/dashboard/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  // Admin Analytics API routes
  app.get("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.get("/api/admin/analytics/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.post("/api/admin/analytics", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.put("/api/admin/analytics/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/analytics/:id", authenticateAdmin, async (req, res) => {
    res.status(501).json({ message: "Not implemented" });
  });

  app.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      
      // Also sync with homepage-products.ts file
      try {
        // Path to homepage-products.ts file
        const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
        
        // Read the current file content
        let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
        
        // Find and remove the product from the homepageProducts array
        const productId = req.params.id;
        const productRegex = new RegExp(`  \\{[^}]*id:\\s*"${productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?\\n  \\}`, 'g');
        
        // Check if product exists in the homepageProducts array section
        const arrayStartIndex = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
        const arrayEndIndex = fileContent.indexOf('];', arrayStartIndex);
        
        if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
          const arraySection = fileContent.substring(arrayStartIndex, arrayEndIndex + 2);
          
          if (productRegex.test(arraySection)) {
            fileContent = fileContent.replace(productRegex, '');
            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');

            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            
            // Write the updated content back to the file
            fs.writeFileSync(homepageProductsPath, fileContent);
          }
        }
      } catch (syncError) {
        console.error('Failed to sync delete with homepage-products.ts:', syncError);
        // Don't fail the delete operation if sync fails
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const {
        category,
        brand,
        search,
        minPrice,
        maxPrice,
        gender,
        fragranceFamily,
        sortBy,
        sortOrder,
        limit,
        offset,
      } = req.query;
      const filters = {
        category: category as string,
        brand: brand as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        gender: gender as string,
        fragranceFamily: fragranceFamily as string,
        sortBy: sortBy as 'price' | 'name' | 'rating' | 'newest',
        sortOrder: sortOrder as 'asc' | 'desc',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
  app.post("/api/products", async (req, res) => {
    try {
      const product = req.body;
      const newProduct = await storage.createProduct(product);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = req.body;
      const updatedProduct = await storage.updateProduct(req.params.id, product);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      // Delete a product
      await storage.deleteProduct(req.params.id);
      
      // Also sync with homepage-products.ts file
      try {
        // Path to homepage-products.ts file
        const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
        
        // Read the current file content
        let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
        
        // Find and remove the product from the homepageProducts array
        const productId = req.params.id;
        const productRegex = new RegExp(`  \\{[^}]*id:\\s*"${productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?\\n  \\}`, 'g');
        
        // Check if product exists in the homepageProducts array section
        const arrayStartIndex = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
        const arrayEndIndex = fileContent.indexOf('];', arrayStartIndex);
        
        if (arrayStartIndex !== -1 && arrayEndIndex !== -1) {
          const arraySection = fileContent.substring(arrayStartIndex, arrayEndIndex + 2);
          
          if (productRegex.test(arraySection)) {
            fileContent = fileContent.replace(productRegex, '');
            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            // Also remove any extra commas that might be left
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            fileContent = fileContent.replace(/\s*,\s*\n\s*\n/g, '\n');
            
            // Write the updated content back to the file
            fs.writeFileSync(homepageProductsPath, fileContent);
          }
        }
      } catch (syncError) {
        console.error('Failed to sync delete with homepage-products.ts:', syncError);
        // Don't fail the delete operation if sync fails
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product routes
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await storage.getFeaturedProducts(limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/new-arrivals", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await storage.getNewArrivals(limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      res.status(500).json({ message: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/best-sellers", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
      const products = await storage.getBestSellers(limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
      res.status(500).json({ message: "Failed to fetch best sellers" });
    }
  });

  app.get("/api/products/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const filters = {
        limit,
        sortBy: 'newest' as const,
        sortOrder: 'desc' as const,
      };
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching recent products:", error);
      res.status(500).json({ message: "Failed to fetch recent products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Brand routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:slug", async (req, res) => {
    try {
      const brand = await storage.getBrandBySlug(req.params.slug);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });

  // Cart routes (with optional authentication)
  app.get("/api/cart", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { productId, quantity } = req.body;
      
      if (!productId) {
        return res.status(400).json({ 
          message: "Product ID is required",
          errors: [{ code: "missing_field", field: "productId", message: "Product ID is required" }]
        });
      }
      
      // Check if productId is a valid ObjectId
      // If not, it might be a slug from homepage products
      let actualProductId = productId;
      if (!Types.ObjectId.isValid(productId)) {
        // Try to find the product by slug in the database
        const product = await storage.getProductBySlug(productId);
        if (product && product._id) {
          // Use the real database product ID
          actualProductId = product._id.toString();
        } else {
          // For homepage products that don't exist in DB, create a temporary product
          // This ensures all homepage products can be added to cart
          
          // Extract a readable name from the slug
          const productName = productId
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase());
          
          // Create a temporary product in the database
          const tempProductData = {
            name: productName,
            price: 15000, // Default price for temporary products
            slug: productId,
            isActive: true,
            stockQuantity: 999, // High stock for temporary products
            reviewCount: 0,
            averageRating: 4.5, // Default rating
            imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          };
          
          try {
            const tempProduct = await storage.createProduct(tempProductData);
            actualProductId = tempProduct._id.toString();
          } catch (createError) {
            console.error(`Failed to create temporary product for slug ${productId}:`, createError);
            // If we can't create a temporary product, use a fallback approach
            // Create a minimal temporary product with just essential fields
            const minimalProductData = {
              name: productName,
              price: 15000,
              slug: productId,
              isActive: true,
              stockQuantity: 999,
            };
            
            try {
              const tempProduct = await storage.createProduct(minimalProductData);
              actualProductId = tempProduct._id.toString();
            } catch (minimalCreateError) {
              console.error(`Failed to create minimal temporary product for slug ${productId}:`, minimalCreateError);
              // If we still can't create a temporary product, return an error
              return res.status(400).json({ 
                message: `Unable to add product to cart: ${productId}`,
                errors: [{ code: "product_creation_failed", message: `Could not process product: ${productId}` }]
              });
            }
          }
        }
      }
      
      // Validate that we have a valid product ID at this point
      if (!Types.ObjectId.isValid(actualProductId)) {
        return res.status(400).json({ 
          message: `Invalid product ID after processing: ${actualProductId}`,
          errors: [{ code: "invalid_id", message: `Invalid product ID: ${actualProductId}` }]
        });
      }
      
      const cartItemData = { 
        userId, 
        productId: actualProductId, 
        quantity: quantity || 1 
      };
      
      const validatedData = insertCartItemSchema.parse(cartItemData);
      const cartItem = await storage.addToCart(validatedData);
      
      res.status(201).json(cartItem);
    } catch (error: any) {
      console.error("Cart add error:", error.message);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          message: "Invalid cart item data", 
          errors: error.errors 
        });
      }
      if (error.message?.includes('Invalid') && error.message?.includes('ID')) {
        return res.status(400).json({ 
          message: error.message,
          errors: [{ code: "invalid_id", message: error.message }]
        });
      }
      if (error.message === 'Product not found with ID:') {
        return res.status(400).json({ 
          message: "Product not found",
          errors: [{ code: "product_not_found", message: "The requested product could not be found" }]
        });
      }
      // Handle database connection errors gracefully
      if (error.message?.includes('Database not available') || error.message?.includes('MongoDB')) {
        return res.status(503).json({ 
          message: "Service temporarily unavailable",
          errors: [{ code: "service_unavailable", message: "Database connection error" }]
        });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", optionalAuth, async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      if (error.message?.includes('Invalid') && error.message?.includes('ID')) {
        return res.status(400).json({ 
          message: error.message,
          errors: [{ code: "invalid_id", message: error.message }]
        });
      }
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", optionalAuth, async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      if (error.message?.includes('Invalid') && error.message?.includes('ID')) {
        return res.status(400).json({ 
          message: error.message,
          errors: [{ code: "invalid_id", message: error.message }]
        });
      }
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      if (error.message?.includes('Invalid') && error.message?.includes('ID')) {
        return res.status(400).json({ 
          message: error.message,
          errors: [{ code: "invalid_id", message: error.message }]
        });
      }
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Wishlist routes (with optional authentication)
  app.get("/api/wishlist", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const wishlist = await storage.getWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const wishlistData = { ...req.body, userId };
      
      const validatedData = insertWishlistSchema.parse(wishlistData);
      const wishlistItem = await storage.addToWishlist(validatedData);
      
      res.status(201).json(wishlistItem);
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid wishlist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.removeFromWishlist(userId, req.params.productId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Razorpay configuration check endpoint
  app.get("/api/razorpay/config", (req, res) => {
    res.json({
      configured: isRazorpayConfigured
    });
  });

  // Razorpay order creation endpoint
  app.post("/api/razorpay/order", async (req, res) => {
    try {
      // Check if Razorpay is configured
      if (!isRazorpayConfigured) {
        return res.status(503).json({ 
          message: "Razorpay payment method is not configured",
          error: "RAZORPAY_NOT_CONFIGURED"
        });
      }

      const { amount, currency, receipt } = req.body;
      
      // Create Razorpay order
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`
      };
      
      const order = await razorpay.orders.create(options);
      
      res.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount
      });
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ 
        message: "Failed to create Razorpay order",
        error: error.message 
      });
    }
  });

  // Order routes (with optional authentication)
  app.get("/api/orders", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", optionalAuth, async (req, res) => {
    try {
      console.log('\n\n🚨🚨🚨 ORDER PLACEMENT ROUTE CALLED (optionalAuth) 🚨🚨🚨');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('User from getCurrentUser:', JSON.stringify(getCurrentUser(req), null, 2));
      console.log('UserId from getUserId:', getUserId(req));
      console.log('\n');
      
      const userId = getUserId(req);
      let user = getCurrentUser(req);
      
      // Fallback: If user is not authenticated, create a minimal user object from shipping address
      if (!user && req.body.shippingAddress?.email) {
        console.log('📧 Using shipping email as fallback:', req.body.shippingAddress.email);
        user = {
          _id: userId,
          email: req.body.shippingAddress.email,
          firstName: req.body.shippingAddress.firstName || 'Customer',
          lastName: req.body.shippingAddress.lastName || ''
        };
      } else if (!user) {
        console.log('⚠️ No user and no shipping email found');
      }
      
      const orderData = { ...req.body, userId };
      
      const validatedData = insertOrderSchema.parse(orderData);
      const newOrder = await storage.createOrder(validatedData);
      
      console.log('✅ ORDER CREATED in optionalAuth route:', { 
        orderId: newOrder._id?.toString(),
        userId: newOrder.userId?.toString(),
        totalAmount: newOrder.totalAmount,
        status: newOrder.status 
      });
      
      // Send confirmation emails
      if (user && user.email) {
        try {
          console.log('📧 ====== SENDING EMAILS FROM OPTIONAL AUTH ROUTE ======');
          
          // Get cart items and create order items in DB
          const serverCartItems = await storage.getCartItems(userId).catch(() => []) as any[];
          const sourceItems = (serverCartItems && serverCartItems.length > 0) ? serverCartItems : (req.body.cartItems || []);
          const orderItems = [];
          for (const item of sourceItems) {
            let productId = item.product?._id?.toString() || item.productId?._id?.toString() || item.product?.id?.toString() || item.productId?.toString() || item._id?.toString();
            if (!productId) continue;
            const quantity = item.quantity || 1;
            let unitPrice = item.product?.price || item.productId?.price || item.unitPrice || 0;
            if (typeof unitPrice === 'string') unitPrice = parseFloat(unitPrice);
            const orderItem = { orderId: newOrder._id.toString(), productId, quantity, unitPrice, totalPrice: unitPrice * quantity };
            orderItems.push(await storage.addOrderItem(orderItem));
          }
          console.log('🧾 Order items created:', orderItems.length);
          const populatedOrder = { ...newOrder, items: orderItems.map((item, i) => ({ ...item, product: sourceItems[i]?.product || sourceItems[i]?.productId || null })) };
          
          console.log('👤 User data:', JSON.stringify({ 
            _id: user._id?.toString(),
            email: user.email, 
            firstName: user.firstName, 
            lastName: user.lastName 
          }, null, 2));
          
          // Send professional emails
          console.log('📧 Sending professional order confirmation emails...');
          
          // Send confirmation to customer
          const customerResult = await sendCustomerOrderConfirmation(populatedOrder, user);
          
          // Send notification to admin
          const adminResult = await sendAdminNewOrderNotification(populatedOrder, user);
          
          console.log('📧 Email results - Customer:', customerResult.success ? '✅' : '❌', '| Admin:', adminResult.success ? '✅' : '❌');
          
          console.log('📧 ====== EMAIL SENDING COMPLETE ======');
        } catch (emailError) {
          console.error("❌ CATCH ERROR sending order confirmation emails:", emailError);
          // Don't fail the order creation if email sending fails
        }
      } else {
        console.log('⚠️  No user email available, skipping email sending');
      }
      
      res.status(201).json(newOrder);
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:orderId", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const order = await storage.getOrder(req.params.orderId);
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.put("/api/orders/:orderId", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const validatedData = updateOrderSchema.parse(req.body);
      const updated = await Order.findOneAndUpdate(
        { _id: req.params.orderId, userId: new Types.ObjectId(userId) },
        validatedData,
        { new: true }
      ).lean();
      if (!updated) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating order:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete("/api/orders/:orderId", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      await Order.deleteOne({ _id: req.params.orderId, userId: new Types.ObjectId(userId) });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  // Product routes (with optional authentication)
  app.get("/api/products", optionalAuth, async (req, res) => {
    try {
      const filters: any = {};
      if (typeof req.query.includeInactive === "string" && req.query.includeInactive === "true") {
        filters.includeInactive = true;
      }
      if (typeof req.query.search === "string") filters.search = req.query.search;
      if (typeof req.query.category === "string") filters.category = req.query.category;
      if (typeof req.query.brand === "string") filters.brand = req.query.brand;
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const productData = { ...req.body, userId };
      
      const validatedData = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedData);
      
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.get("/api/products/:productId", optionalAuth, async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.productId);
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.put("/api/products/:productId", optionalAuth, async (req, res) => {
    try {
      const validatedData = updateProductSchema.parse(req.body);
      const product = await storage.updateProductById(req.params.productId, validatedData);
      res.json(product);
    } catch (error: any) {
      console.error("Error updating product:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:productId", optionalAuth, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.productId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // User routes (with optional authentication)
  app.get("/api/user", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/user", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { firstName, lastName, email } = req.body || {};
      const result = await updateUserProfile(userId, { firstName, lastName, email });
      if (!result.success || !result.user) {
        return res.status(400).json({ message: "Profile update failed", errors: result.errors || [] });
      }
      res.json(result.user);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/user", optionalAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      await User.deleteOne({ _id: new Types.ObjectId(userId) });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Create order endpoint with payment processing
  app.post("/api/orders", authenticateToken, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { 
        cartItems, 
        totalAmount, 
        shippingAddress, 
        billingAddress, 
        paymentMethod,
        paymentDetails
      } = req.body;

      if (!cartItems || !totalAmount || !shippingAddress || !paymentMethod) {
        return res.status(400).json({ 
          message: "Missing required order information",
          errors: ["Cart items, total amount, shipping address, and payment method are required"]
        });
      }

      // Process payment based on payment method
      let paymentStatus = "pending";
      
      if (paymentMethod === "razorpay") {
        // For Razorpay, we'll mark as completed since the payment is processed on frontend
        paymentStatus = "completed";
      } else if (paymentMethod === "credit-card") {
        // Simulate credit card processing
        paymentStatus = "completed";
      } else if (paymentMethod === "paypal") {
        // Simulate PayPal processing
        paymentStatus = "completed";
      } else if (paymentMethod === "cod") {
        // Cash on delivery
        paymentStatus = "pending";
      }

      // Create the order
      const orderData = {
        userId: user._id.toString(),
        totalAmount,
        status: "processing",
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentStatus,
        trackingNumber: `TRK${Date.now()}`
      };

      const newOrder = await storage.createOrder(orderData);
      console.log('✅ ORDER CREATED:', { 
        orderId: newOrder._id?.toString(),
        userId: newOrder.userId?.toString(),
        totalAmount: newOrder.totalAmount,
        status: newOrder.status 
      });

      // Add order items - prefer server-side cart for reliable product IDs
      const serverCartItems = await storage.getCartItems(user._id.toString()).catch(() => []) as any[];
      const sourceItems = (serverCartItems && serverCartItems.length > 0) ? serverCartItems : cartItems;
      
      const orderItems: any[] = [];
      let processedCount = 0;
      for (const item of sourceItems) {
        // Handle different possible structures for cart items
        let productId: string | undefined;
        
        // Check various possible locations for product ID
        if (item.product?._id) {
          productId = item.product._id.toString();
        } else if (item.productId?._id) {
          productId = item.productId._id.toString();
        } else if (item.product?.id) {
          productId = item.product.id.toString();
        } else if (item.productId?.id) {
          productId = item.productId.id.toString();
        } else if (item.productId) {
          try {
            productId = item.productId.toString();
          } catch {
            // ignore
          }
        } else if (item._id) {
          productId = item._id.toString();
        } else if (item.product?._id?.toString) {
          productId = item.product._id.toString();
        } else if (item.product?.id?.toString) {
          productId = item.product.id.toString();
        }
        
        if (!productId) {
          console.error("Could not determine product ID from cart item for order creation:", {
            keys: Object.keys(item || {}),
          });
          continue;
        }

        // Get quantity (default to 1 if not specified)
        const quantity = item.quantity || 1;
        
        // Get unit price from various possible locations
        let unitPrice = 0;
        if (item.product?.price !== undefined) {
          unitPrice = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
        } else if (item.productId?.price !== undefined) {
          unitPrice = typeof item.productId.price === 'string' ? parseFloat(item.productId.price) : item.productId.price;
        } else if (item.unitPrice !== undefined) {
          unitPrice = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
        } else if (item.product?.originalPrice !== undefined) {
          unitPrice = typeof item.product.originalPrice === 'string' ? parseFloat(item.product.originalPrice) : item.product.originalPrice;
        }
        
        const totalPrice = unitPrice * quantity;

        const orderItem = {
          orderId: newOrder._id.toString(),
          productId: productId,
          quantity: quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice
        };
        
        const newOrderItem = await storage.addOrderItem(orderItem);
        orderItems.push(newOrderItem);
        processedCount++;
      }
      console.log(`🧾 Order items created for order ${newOrder._id}: ${processedCount}`);

      // Populate order with items for email
      const populatedOrder: any = {
        ...newOrder,
        items: orderItems.map((item: any, index: number) => {
          const src = sourceItems[index] || {};
          const product = src.product || src.productId || null;
          return {
            ...item,
            product
          };
        })
      };

      // Send confirmation emails
      try {
        console.log('📧 ====== ORDER CONFIRMATION EMAIL START ======');
        console.log('👤 User data:', JSON.stringify({ 
          _id: user._id?.toString(),
          email: user.email, 
          firstName: user.firstName, 
          lastName: user.lastName 
        }, null, 2));
        console.log('📦 Order data:', JSON.stringify({
          orderId: newOrder._id?.toString(),
          totalAmount: newOrder.totalAmount,
          itemsCount: populatedOrder.items?.length || 0,
          hasItems: !!populatedOrder.items && populatedOrder.items.length > 0
        }, null, 2));
        
        // Send email to customer
        console.log(`📧 Attempting to send to customer: ${user?.email}`);
        const customerEmailResult = await sendOrderConfirmationEmail(populatedOrder, user);
        console.log('📧 Customer email RESULT:', JSON.stringify(customerEmailResult, null, 2));
        if (customerEmailResult.success) {
          console.log('✅ Customer order confirmation email SENT successfully');
        } else {
          const errorMsg = customerEmailResult.error instanceof Error ? customerEmailResult.error.message : String(customerEmailResult.error);
          console.error('❌ FAILED to send customer email:', errorMsg);
        }
        
        // Send notification to admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        console.log(`📧 Admin email configured: ${adminEmail}`);
        const adminEmailResult = await sendAdminOrderNotificationEmail(populatedOrder, user);
        console.log('📧 Admin email RESULT:', JSON.stringify(adminEmailResult, null, 2));
        if (adminEmailResult.success) {
          console.log('✅ Admin order notification email SENT successfully');
        } else {
          const errorMsg = adminEmailResult.error instanceof Error ? adminEmailResult.error.message : String(adminEmailResult.error);
          console.error('❌ FAILED to send admin email:', errorMsg);
        }
        
        console.log('📧 ====== ORDER CONFIRMATION EMAIL END ======');
        
        // Log email configuration status
        const hasSMTPConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
        if (process.env.NODE_ENV === 'development' && !hasSMTPConfig) {
          console.log('📝 Note: Emails are being sent to Ethereal.email for testing in development mode.');
          console.log('📝 To receive real emails, configure SMTP settings in your .env file.');
        }
      } catch (emailError) {
        console.error("❌ CATCH ERROR sending order confirmation emails:", emailError);
        console.error("Stack trace:", emailError instanceof Error ? emailError.stack : 'No stack');
        // Don't fail the order creation if email sending fails
      }

      // Clear the user's cart
      try {
        await storage.clearCart(user._id.toString());
      } catch (cartError) {
        console.error("Error clearing cart after order creation:", cartError);
      }

      // Notify admin clients of the new order
      const notifyAdminClients = (req.app as any).locals.notifyAdminClients;
      if (notifyAdminClients) {
        notifyAdminClients({
          action: 'order_created',
          order: populatedOrder
        } as any);
      }

      res.status(201).json({
        message: "Order created successfully",
        order: populatedOrder
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order", error: error.message });
    }
  });

  // Update order status (admin only)
  app.patch("/api/orders/:id/status", authenticateToken, authenticateAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ 
          message: "Status is required",
          errors: ["Status is required"]
        });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('userId', 'firstName lastName email');

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Minimal email sending - ONLY send to customer on status change
      try {
        const oldStatus = req.body.previousStatus || '';
        const newStatus = status;
        
        // Only send email if status actually changed
        if (oldStatus !== newStatus) {
          console.log(`📧 Status changed: '${oldStatus}' → '${newStatus}' - sending customer notification...`);
          
          // Send update to customer ONLY (no admin emails)
          await sendCustomerStatusUpdate(updatedOrder as any, updatedOrder.userId);
          
          console.log('✅ Customer status update email sent');
        } else {
          console.log('ℹ️ Status unchanged - no email sent');
        }
      } catch (emailErr) {
        console.error('Error sending status update email:', emailErr);
      }

      // Notify admin clients of the order update
      const notifyAdminClients = (app as any).locals.notifyAdminClients;
      if (notifyAdminClients) {
        notifyAdminClients({
          action: 'status_updated',
          order: updatedOrder
        });
      }

      res.json({
        message: "Order status updated successfully",
        order: updatedOrder
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin Order Management Routes (require admin authentication)
  
  // Get all orders for admin
  app.get("/api/admin/orders", authenticateAdmin, async (req, res) => {
    console.log("Admin orders route called"); // Debug log
    try {
      const orders = await Order.find()
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .lean();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Resend order confirmation (admin/manual)

  // Manual send order confirmation email (admin only - no auto-send)
  app.post("/api/admin/orders/:id/send-email", authenticateAdmin, async (req, res) => {
    try {
      console.log('📧 Manual email send requested for order:', req.params.id);
      
      const order = await Order.findById(req.params.id)
        .populate('userId', 'firstName lastName email')
        .lean();
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(req.params.id);
      const orderWithItems = {
        ...order,
        items: orderItems.map((item: any) => ({
          ...item,
          product: item.productId || null
        }))
      };
      
      const user = order.userId;
      if (!user?.email) {
        return res.status(400).json({ message: "User email not available" });
      }
      
      // Send customer confirmation
      const customerResult = await sendCustomerOrderConfirmation(orderWithItems, user);
      
      // Send admin notification  
      const adminResult = await sendAdminNewOrderNotification(orderWithItems, user);
      
      console.log('✅ Manual emails sent successfully');
      
      res.json({
        message: "Order confirmation emails sent successfully",
        customerResult,
        adminResult
      });
    } catch (error: any) {
      console.error("Error sending manual email:", error);
      res.status(500).json({ 
        message: "Failed to send confirmation emails",
        error: error.message 
      });
    }
  });

  app.post("/api/orders/:id/resend-confirmation", authenticateAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const items = await storage.getOrderItems(req.params.id);
      const orderWithItems: any = {
        ...order,
        items: items.map((it: any) => ({
          ...it,
          product: it.productId || null
        }))
      };
      // fetch user (already populated minimally on getOrder)
      const user = (order as any).userId;
      if (!user?.email) {
        return res.status(400).json({ message: "User email not available on order" });
      }
      const userResult = await sendOrderConfirmationEmail(orderWithItems, user);
      const adminResult = await sendAdminNewOrderNotification(orderWithItems, user);
      return res.json({ message: "Resent order emails", userResult, adminResult });
    } catch (e: any) {
      console.error("Error resending confirmation:", e);
      return res.status(500).json({ message: "Failed to resend confirmation", error: e.message });
    }
  });
  
  // Admin: send test email to verify SMTP
  app.post("/api/admin/test-email", authenticateAdmin, async (req, res) => {
    try {
      const to = process.env.ADMIN_EMAIL || 'softberryskincare@gmail.com';
      const subject = 'Soft Berry Skincare • Test Email';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email</h2>
          <p>If you received this, SMTP is working with current .env settings.</p>
        </div>
      `;
      const result = await sendEmail(to, subject, html);
      if (result.success) {
        return res.json({ message: 'Test email sent', info: result });
      }
      return res.status(500).json({ message: 'Failed to send test email', error: result.error });
    } catch (e: any) {
      return res.status(500).json({ message: 'Error sending test email', error: e.message });
    }
  });
  
  // Get specific order details for admin
  app.get("/api/admin/orders/:id", authenticateAdmin, async (req, res) => {
    console.log("Admin order details route called"); // Debug log
    try {
      // First get the order
      const order = await Order.findById(req.params.id)
        .populate('userId', 'firstName lastName email createdAt')
        .lean();
        
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Then get the order items and populate product details
      const orderItems = await storage.getOrderItems(req.params.id);
      
      // Normalize item shape for admin UI: expose populated product as `product`
      const normalizedItems = orderItems.map((item: any) => {
        const product = item.productId || item.product || null;
        return {
          _id: item._id,
          orderId: item.orderId,
          productId: item.productId, // keep original reference
          product,                   // normalized for client
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          createdAt: item.createdAt
        };
      });
      
      // Add the items to the order object
      const orderWithItems = {
        ...order,
        items: normalizedItems
      };
      
      res.json(orderWithItems);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update order status
  app.patch("/api/admin/orders/:id/status", authenticateAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ 
          message: "Status is required",
          errors: ["Status is required"]
        });
      }

      // STEP 1: Get the CURRENT status from database BEFORE updating
      const currentOrder = await Order.findOne({ _id: req.params.id }).lean() as any;
      if (!currentOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const actualOldStatus = currentOrder.status; // Get actual current status
      console.log(`📊 Current status in DB: '${actualOldStatus}', New status: '${status}'`);

      // STEP 2: Update the order with new status
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      )
      .populate('userId', 'firstName lastName email')
      .lean();

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // STEP 3: Send email ONLY if status actually changed in database
      try {
        // Only send email if status ACTUALLY changed
        if (actualOldStatus !== status) {
          console.log(`📧 Status changed: '${actualOldStatus}' → '${status}' - sending customer notification...`);
          
          // Send update to customer ONLY (no admin emails)
          await sendCustomerStatusUpdate(updatedOrder as any, updatedOrder.userId);
          
          console.log('✅ Customer status update email sent');
        } else {
          console.log(`ℹ️ Status unchanged ('${status}' === '${status}') - no email sent`);
        }
      } catch (emailErr) {
        console.error('Error sending status update email:', emailErr);
      }

      // Notify admin clients of the order update
      const notifyAdminClients = (app as any).locals.notifyAdminClients;
      if (notifyAdminClients) {
        notifyAdminClients({
          action: 'status_updated',
          order: updatedOrder
        });
      }

      res.json({
        message: "Order status updated successfully",
        order: updatedOrder
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  
  // Return the app so it can be used to create an HTTP server
  return app;
}
