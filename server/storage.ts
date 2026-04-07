import {
  User,
  Product,
  Category,
  Brand,
  CartItem,
  Order,
  OrderItem,
  Wishlist,
  type IUser,
  type IProduct,
  type ICategory,
  type IBrand,
  type ICartItem,
  type IOrder,
  type IOrderItem,
  type IWishlist,
  insertUserSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertProductSchema
} from "../shared/schema.js";
import { connectToDatabase } from "./db.js";
import mongoose, { Types } from "mongoose";
import { 
  sendOrderConfirmationEmail, 
  sendAdminOrderNotificationEmail,
  sendCustomerOrderConfirmation,
  sendAdminNewOrderNotification
} from "./emailService.js";
import { z } from 'zod';

// Type definitions for API responses
export type User = IUser;
export type UpsertUser = Partial<IUser> & { email?: string };
export type Product = IProduct;
export type ProductWithDetails = IProduct & {
  brand?: IBrand;
  category?: ICategory;
};
export type CartItem = ICartItem;
export type CartItemWithProduct = ICartItem & {
  product: IProduct;
};
export type Order = IOrder;
export type OrderItem = IOrderItem;
export type Category = ICategory;
export type Brand = IBrand;
export type Wishlist = IWishlist;
export type InsertCartItem = {
  userId: string;
  productId: string;
  quantity?: number;
};
export type InsertOrder = {
  userId: string;
  totalAmount: number;
  status?: string;
  shippingAddress?: any;
  billingAddress?: any;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
};
export type InsertOrderItem = {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};
export type InsertWishlist = {
  userId: string;
  productId: string;
};

export interface IStorage {
  // User operations (mandatory for authentication)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(filters?: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    fragranceFamily?: string;
    sortBy?: 'price' | 'name' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): Promise<ProductWithDetails[]>;
  getProduct(id: string): Promise<ProductWithDetails | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithDetails | undefined>;
  getFeaturedProducts(limit?: number): Promise<ProductWithDetails[]>;
  getNewArrivals(limit?: number): Promise<ProductWithDetails[]>;
  getBestSellers(limit?: number): Promise<ProductWithDetails[]>;
  
  // Admin Product operations
  createProduct(productData: any): Promise<ProductWithDetails>;
  updateProduct(id: string, updateData: any): Promise<ProductWithDetails>;
  deleteProduct(id: string): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Brand operations
  getBrands(): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  
  // Cart operations
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Order operations
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Wishlist operations
  getWishlist(userId: string): Promise<Wishlist[]>;
  addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;
  
  // Seed data
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Ensure MongoDB connection is established
    connectToDatabase().catch(err => {
      console.warn('MongoDB connection failed during storage initialization:', err.message);
    });
  }

  // Helper method to convert ObjectId to string
  private toObjectId(id: string): Types.ObjectId {
    // Handle special guest user case
    if (id === 'guest-user') {
      return new Types.ObjectId('000000000000000000000001');
    }
    
    // Validate if it's a valid ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ObjectId format: ${id}`);
    }
    
    return new Types.ObjectId(id);
  }
  
  // Helper method to safely convert ObjectId
  private safeToObjectId(id: string): Types.ObjectId | null {
    try {
      return this.toObjectId(id);
    } catch (error) {
      return null;
    }
  }
  
  // Helper method to validate ObjectId format
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  // Helper method to check if MongoDB is connected
  private async ensureConnection(): Promise<boolean> {
    try {
      // Check if already connected (use string comparison for TypeScript compatibility)
      const readyState = mongoose.connection.readyState;
      if (readyState === mongoose.ConnectionStates.connected) {
        return true;
      }
      
      // If not connected, try to connect
      if (readyState === mongoose.ConnectionStates.disconnected) {
        await connectToDatabase();
      }
      
      return mongoose.connection.readyState === mongoose.ConnectionStates.connected;
    } catch (error) {
      console.warn('MongoDB not available:', (error as Error).message);
      return false;
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      // Return guest user when MongoDB is not available
      if (id === 'guest-user') {
        return {
          _id: new Types.ObjectId('000000000000000000000001'),
          email: 'guest@example.com',
          firstName: 'Guest',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as User;
      }
      return undefined;
    }
    
    const user = await User.findById(id).lean() as unknown as User | null;
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return undefined;
    }
    
    const user = await User.findOne({ email: email.toLowerCase() }).lean() as unknown as User | null;
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }
    
    if (userData.email) {
      // Try to find existing user by email
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        // Update existing user
        Object.assign(existingUser, userData);
        await existingUser.save();
        return existingUser;
      }
    }
    
    // Create new user
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  // Product operations
  async getProducts(filters: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    fragranceFamily?: string;
    sortBy?: 'price' | 'name' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
    includeInactive?: boolean; // Add this new parameter
  } = {}): Promise<ProductWithDetails[]> {
    console.log("getProducts called with filters:", filters); // Debug log
    const isConnected = await this.ensureConnection();
    console.log("Database connection status:", isConnected); // Debug log
    if (!isConnected) {
      console.log("Database not connected, returning empty array"); // Debug log
      return []; // Return empty array if no database
    }
    
    // Build filter conditions
    const conditions: any = {};
    
    // Only filter by isActive if includeInactive is not true
    if (!filters.includeInactive) {
      conditions.isActive = true;
      console.log("Filtering products by isActive = true");
    } else {
      console.log("Including all products (active and inactive)");
    }
    
    if (filters.search) {
      conditions.name = { $regex: filters.search, $options: 'i' };
    }
    if (filters.minPrice !== undefined) {
      conditions.price = { ...conditions.price, $gte: filters.minPrice };
    }
    if (filters.maxPrice !== undefined) {
      conditions.price = { ...conditions.price, $lte: filters.maxPrice };
    }
    if (filters.gender) {
      conditions.gender = filters.gender;
    }
    if (filters.fragranceFamily) {
      conditions.fragranceFamily = filters.fragranceFamily;
    }
    
    // Handle category and brand filters
    if (filters.category) {
      const category = await Category.findOne({ slug: filters.category });
      if (category) {
        conditions.categoryId = category._id;
      }
    }
    if (filters.brand) {
      const brand = await Brand.findOne({ slug: filters.brand });
      if (brand) {
        conditions.brandId = brand._id;
      }
    }

    // Build sort conditions
    let sortCondition: any = { createdAt: -1 }; // default newest
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      switch (filters.sortBy) {
        case 'price':
          sortCondition = { price: sortOrder };
          break;
        case 'name':
          sortCondition = { name: sortOrder };
          break;
        case 'rating':
          sortCondition = { averageRating: sortOrder };
          break;
        case 'newest':
          sortCondition = { createdAt: -1 };
          break;
      }
    }

    // Execute query with pagination
    const query = Product.find(conditions)
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .sort(sortCondition);
    
    if (filters.offset) {
      query.skip(filters.offset);
    }
    if (filters.limit) {
      query.limit(filters.limit);
    } else if (!filters.limit && !filters.offset) {
      query.limit(100); // default limit
    }
    
    console.log("Executing product query with conditions:", conditions); // Debug log
    const products = await query.lean();
    console.log("Products found:", products.length); // Debug log
    
    // Add debug logging for product statuses
    const activeProducts = products.filter(p => p.isActive);
    const inactiveProducts = products.filter(p => !p.isActive);
    console.log(`Found ${activeProducts.length} active products and ${inactiveProducts.length} inactive products`);
    
    return products.map((product: any) => ({
      ...product,
      id: product._id?.toString(),
      brand: product.brandId || undefined,
      category: product.categoryId || undefined,
    }));
  }

  async getProduct(id: string): Promise<ProductWithDetails | undefined> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return undefined;
    }
    
    let query: any;
    
    // Handle special cases like 'recent' and 'featured'
    if (id === 'recent') {
      query = Product.findOne({ isActive: true })
        .sort({ createdAt: -1 }); // Get most recent product
    } else if (id === 'featured') {
      query = Product.findOne({ isActive: true, featured: true })
        .sort({ averageRating: -1 }); // Get featured product with highest rating
    } else {
      // Handle regular ObjectId queries
      const productObjectId = this.safeToObjectId(id);
      if (!productObjectId) {
        console.warn(`Invalid product ID: ${id}`);
        return undefined;
      }
      query = Product.findOne({ _id: productObjectId, isActive: true });
    }
    
    const product = await query
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .lean() as any;

    if (!product) return undefined;

    return {
      ...product,
      id: product._id?.toString(),
      brand: product.brandId || undefined,
      category: product.categoryId || undefined,
    } as ProductWithDetails;
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return undefined;
    }
    
    try {
      // First try to find active products
      let product = await Product.findOne({ slug, isActive: true })
        .populate('brandId', 'name description logoUrl slug createdAt')
        .populate('categoryId', 'name description imageUrl slug createdAt')
        .lean() as any;
      
      // If not found, try to find any product with this slug
      if (!product) {
        product = await Product.findOne({ slug })
          .populate('brandId', 'name description logoUrl slug createdAt')
          .populate('categoryId', 'name description imageUrl slug createdAt')
          .lean() as any;
      }

      if (!product) return undefined;

      return {
        ...product,
        id: product._id?.toString(),
        brand: product.brandId || undefined,
        category: product.categoryId || undefined,
      } as ProductWithDetails;
    } catch (error) {
      console.error(`Error fetching product by slug ${slug}:`, error);
      return undefined;
    }
  }

  async updateProductById(id: string, productData: any): Promise<ProductWithDetails> {
    try {
      const isConnected = await this.ensureConnection();
      if (!isConnected) {
        throw new Error('Database not available');
      }

      // Handle empty imageUrl - if it's an empty string or whitespace, set it to undefined
      if (!productData.imageUrl || productData.imageUrl.trim() === '') {
        productData.imageUrl = undefined;
      }

      // Store brandId and categoryId as strings for validation
      // Only convert if they are strings, not if they are already ObjectId objects
      let brandIdString: string | undefined = undefined;
      let categoryIdString: string | undefined = undefined;
      
      if (productData.brandId && typeof productData.brandId === 'string') {
        brandIdString = productData.brandId;
        productData.brandId = this.safeToObjectId(productData.brandId);
      } else if (productData.brandId && typeof productData.brandId === 'object') {
        // If it's already an ObjectId, keep it as is
        // But store the string version for validation
        brandIdString = productData.brandId.toString();
      }
      
      if (productData.categoryId && typeof productData.categoryId === 'string') {
        categoryIdString = productData.categoryId;
        productData.categoryId = this.safeToObjectId(productData.categoryId);
      } else if (productData.categoryId && typeof productData.categoryId === 'object') {
        // If it's already an ObjectId, keep it as is
        // But store the string version for validation
        categoryIdString = productData.categoryId.toString();
      }

      // Validate product data with Zod schema
      try {
        // For updates, we need to be more lenient with validation
        // Some fields might not be present in partial updates
        // Use string versions of brandId and categoryId for validation
        const validationData = {
          ...productData,
          brandId: brandIdString,
          categoryId: categoryIdString
        };
        
        const validatedData = insertProductSchema.partial().parse(validationData);
        console.log("Product update data validated successfully:", validatedData);
      } catch (validationError: any) {
        console.error("Product update validation failed:", validationError);
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors.map(err => `${err.path.join('.')}: ${err.message}`);
          throw new Error(`Product update validation failed: ${errorMessages.join(', ')}`);
        }
        throw validationError;
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          ...productData,
        },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new Error('Product not found');
      }

      // Return with populated references
      const populatedProduct = await Product.findById(updatedProduct._id)
        .populate('brandId', 'name description logoUrl slug createdAt')
        .populate('categoryId', 'name description imageUrl slug createdAt')
        .lean();

      return {
        ...populatedProduct,
        id: (populatedProduct as any)?._id?.toString(),
        brand: (populatedProduct as any)?.brandId || undefined,
        category: (populatedProduct as any)?.categoryId || undefined,
      } as any;
    } catch (error) {
      console.error("Error in updateProductById:", error);
      throw error;
    }
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithDetails[]> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return [];
    }
    
    // First try to get actual featured products
    const featuredProducts = await Product.find({ isActive: true, isFeatured: true })
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .sort({ averageRating: -1 })
      .limit(limit)
      .lean();

    if (featuredProducts.length > 0) {
      return featuredProducts.map((product: any) => ({
        ...product,
        id: product._id?.toString(),
        brand: product.brandId || undefined,
        category: product.categoryId || undefined,
      }));
    }
    
    // Fallback to highest rated products
    return this.getProducts({ limit, sortBy: 'rating', sortOrder: 'desc' });
  }

  async getNewArrivals(limit = 8): Promise<ProductWithDetails[]> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return [];
    }
    
    const products = await Product.find({ isActive: true, isNewArrival: true })
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return products.map((product: any) => ({
      ...product,
      id: product._id?.toString(),
      brand: product.brandId || undefined,
      category: product.categoryId || undefined,
    }));
  }

  async getBestSellers(limit = 8): Promise<ProductWithDetails[]> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return [];
    }
    
    const products = await Product.find({ isActive: true, isBestSeller: true })
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .sort({ reviewCount: -1 })
      .limit(limit)
      .lean();

    return products.map((product: any) => ({
      ...product,
      id: product._id?.toString(),
      brand: product.brandId || undefined,
      category: product.categoryId || undefined,
    }));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    await connectToDatabase();
    return await Category.find().sort({ name: 1 }).lean() as unknown as Category[];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    await connectToDatabase();
    const category = await Category.findOne({ slug }).lean() as unknown as Category | null;
    return category || undefined;
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    await connectToDatabase();
    return await Brand.find().sort({ name: 1 }).lean() as unknown as Brand[];
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    await connectToDatabase();
    const brand = await Brand.findOne({ slug }).lean() as unknown as Brand | null;
    return brand || undefined;
  }

  // Admin Product operations
  async createProduct(productData: any): Promise<ProductWithDetails> {
    try {
      const isConnected = await this.ensureConnection();
      if (!isConnected) {
        throw new Error('Database not available');
      }

      // Handle empty imageUrl - if it's an empty string or whitespace, set it to undefined
      // This will allow the Zod validation to pass since imageUrl is optional
      if (!productData.imageUrl || productData.imageUrl.trim() === '') {
        productData.imageUrl = undefined;
      } else {
        // Trim whitespace from imageUrl if it exists
        productData.imageUrl = productData.imageUrl.trim();
      }

      // Validate product data with Zod schema
      try {
        const validatedData = insertProductSchema.parse(productData);
        console.log("✓ Product data validated successfully:", validatedData.name);
        console.log("✓ Image URL:", validatedData.imageUrl || '(no image)');
      } catch (validationError: any) {
        console.error("✗ Product validation failed:", validationError);
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors.map(err => `${err.path.join('.')}: ${err.message}`);
          throw new Error(`Product validation failed: ${errorMessages.join(', ')}`);
        }
        throw validationError;
      }

      // Convert brand and category IDs if provided
      let brandObjectId = null;
      let categoryObjectId = null;

      if (productData.brandId) {
        brandObjectId = this.safeToObjectId(productData.brandId);
      }
      if (productData.categoryId) {
        categoryObjectId = this.safeToObjectId(productData.categoryId);
      }

      const newProduct = new Product({
        ...productData,
        brandId: brandObjectId,
        categoryId: categoryObjectId,
      });

      await newProduct.save();

      // Return with populated references
      const populatedProduct = await Product.findById(newProduct._id)
        .populate('brandId', 'name description logoUrl slug createdAt')
        .populate('categoryId', 'name description imageUrl slug createdAt')
        .lean();

      return {
        ...populatedProduct,
        id: (populatedProduct as any)?._id?.toString(),
        brand: (populatedProduct as any)?.brandId || undefined,
        category: (populatedProduct as any)?.categoryId || undefined,
      } as any;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error; // Re-throw the error to be caught by the route handler
    }
  }

  async updateProduct(id: string, updateData: any): Promise<ProductWithDetails> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }

    // Validate the ID format
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid product ID: ${id}`);
    }
    
    console.log(`Updating product ${id} with data:`, updateData); // Debug log

    // Handle empty imageUrl - if it's an empty string or whitespace, set it to undefined
    // This will allow the Zod validation to pass since imageUrl is optional
    if (!updateData.imageUrl || updateData.imageUrl.trim() === '') {
      updateData.imageUrl = undefined;
    }

    // Convert brand and category IDs if provided
    let brandObjectId = null;
    let categoryObjectId = null;

    if (updateData.brandId) {
      brandObjectId = this.safeToObjectId(updateData.brandId);
    }
    if (updateData.categoryId) {
      categoryObjectId = this.safeToObjectId(updateData.categoryId);
    }

    const updatePayload = {
      ...updateData,
      brandId: brandObjectId,
      categoryId: categoryObjectId,
      updatedAt: new Date(),
    };
    
    console.log(`Update payload for product ${id}:`, updatePayload); // Debug log

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    )
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .lean();

    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    
    console.log(`Product ${id} updated successfully:`, {
      id: (updatedProduct as any)._id,
      name: (updatedProduct as any).name,
      isActive: (updatedProduct as any).isActive
    }); // Debug log

    // Return with populated references
    const populatedProduct = await Product.findById((updatedProduct as any)._id)
      .populate('brandId', 'name description logoUrl slug createdAt')
      .populate('categoryId', 'name description imageUrl slug createdAt')
      .lean();

    return {
      ...populatedProduct,
      id: (populatedProduct as any)?._id?.toString(),
      brand: (populatedProduct as any)?.brandId || undefined,
      category: (populatedProduct as any)?.categoryId || undefined,
    } as any;
  }

  async deleteProduct(id: string): Promise<void> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }

    // Validate the ID format
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid product ID: ${id}`);
    }

    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Product not found');
    }

    // Also remove from any carts or wishlists
    try {
      await CartItem.deleteMany({ productId: id });
      await Wishlist.deleteMany({ productId: id });
    } catch (error) {
      console.warn('Warning: Failed to clean up cart/wishlist references:', error);
    }
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      return []; // Return empty cart if no database
    }
    
    // Handle guest user case
    const userObjectId = this.safeToObjectId(userId);
    if (!userObjectId) {
      console.warn(`Invalid user ID for cart: ${userId}`);
      return [];
    }
    
    const cartItems = await CartItem.find({ userId: userObjectId })
      .populate('productId')
      .sort({ createdAt: -1 })
      .lean();

    return cartItems.map((item: any) => ({
      ...item,
      id: item._id?.toString(), // Ensure the cart item has an id field
      product: {
        ...item.productId,
        id: item.productId?._id?.toString(),
      },
    }));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }
    
    const quantity = cartItem.quantity || 1;
    const userObjectId = this.safeToObjectId(cartItem.userId);
    const productObjectId = this.safeToObjectId(cartItem.productId);
    
    if (!userObjectId) {
      throw new Error(`Invalid user ID: ${cartItem.userId}`);
    }
    
    // If product ID is not a valid ObjectId, try to find by slug
    let actualProductObjectId = productObjectId;
    if (!productObjectId) {
      // Try to find product by slug
      const productBySlug = await Product.findOne({ slug: cartItem.productId });
      if (productBySlug) {
        actualProductObjectId = productBySlug._id;
        console.log(`Found product by slug: ${cartItem.productId}`);
      } else {
        // If still not found, create a minimal temporary product
        console.log(`Product not found by slug, creating temporary product for: ${cartItem.productId}`);
        const productName = cartItem.productId
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
          
        const tempProductData = {
          name: productName,
          price: 15000,
          slug: cartItem.productId,
          isActive: true,
          stockQuantity: 999,
        };
        
        try {
          const tempProduct = new Product(tempProductData);
          await tempProduct.save();
          actualProductObjectId = tempProduct._id;
          console.log(`Created temporary product: ${productName}`);
        } catch (createError) {
          console.error(`Failed to create temporary product:`, createError);
          throw new Error(`Could not process product: ${cartItem.productId}`);
        }
      }
    }
    
    // Check if the product exists
    const product = await Product.findById(actualProductObjectId);
    if (!product) {
      throw new Error(`Product not found with ID: ${cartItem.productId}`);
    }
    
    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      userId: userObjectId,
      productId: actualProductObjectId,
    });

    if (existingItem) {
      // Update quantity if item exists
      existingItem.quantity += quantity;
      await existingItem.save();
      return existingItem;
    }

    // Insert new item
    const newItem = new CartItem({
      userId: userObjectId,
      productId: actualProductObjectId,
      quantity,
    });
    await newItem.save();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }
    
    // Validate the ID format
    if (!this.isValidObjectId(id)) {
      throw new Error(`Invalid cart item ID: ${id}`);
    }
    
    const updatedItem = await CartItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    
    if (!updatedItem) {
      throw new Error('Cart item not found');
    }
    
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }
    
    // Validate the ID format
    if (!id || id === 'undefined' || !this.isValidObjectId(id)) {
      throw new Error(`Invalid cart item ID: ${id}`);
    }
    
    const result = await CartItem.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Cart item not found');
    }
  }

  async clearCart(userId: string): Promise<void> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      throw new Error('Database not available');
    }
    
    const userObjectId = this.safeToObjectId(userId);
    if (!userObjectId) {
      throw new Error(`Invalid user ID: ${userId}`);
    }
    
    await CartItem.deleteMany({ userId: userObjectId });
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    await connectToDatabase();
    return await Order.find({ userId: this.toObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean() as unknown as Order[];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    await connectToDatabase();
    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')
      .lean() as unknown as Order | null;
    return order || undefined;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    await connectToDatabase();
    
    // Get order items and populate product details
    const orderItems = await OrderItem.find({ orderId: this.toObjectId(orderId) })
      .populate({
        path: 'productId',
        select: 'name slug imageUrl description shortDescription price brandId categoryId volume averageRating stockQuantity fragranceFamily gender isActive',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name' }
        ]
      })
      .lean() as unknown as OrderItem[];
      
    return orderItems;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    await connectToDatabase();
    
    const newOrder = new Order({
      ...order,
      userId: this.toObjectId(order.userId),
    });
    await newOrder.save();
    
    // Populate the order with user details for email
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('userId', 'firstName lastName email')
      .lean();
      
    return populatedOrder as unknown as Order;
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    await connectToDatabase();
    
    const newOrderItem = new OrderItem({
      ...orderItem,
      orderId: this.toObjectId(orderItem.orderId),
      productId: this.toObjectId(orderItem.productId),
    });
    await newOrderItem.save();
    return newOrderItem;
  }

  // Wishlist operations
  async getWishlist(userId: string): Promise<Wishlist[]> {
    await connectToDatabase();
    return await Wishlist.find({ userId: this.toObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean() as unknown as Wishlist[];
  }

  async addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist> {
    await connectToDatabase();
    
    const newItem = new Wishlist({
      userId: this.toObjectId(wishlistItem.userId),
      productId: this.toObjectId(wishlistItem.productId),
    });
    await newItem.save();
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await connectToDatabase();
    await Wishlist.deleteOne({
      userId: this.toObjectId(userId),
      productId: this.toObjectId(productId),
    });
  }

  // Seed data
  async seedData(): Promise<void> {
    const isConnected = await this.ensureConnection();
    if (!isConnected) {
      console.log('⚠️  Skipping seed data - MongoDB not available');
      return;
    }
    
    // Insert guest user for development
    const guestUser = await User.findOne({ email: "guest@example.com" });
    if (!guestUser) {
      const newGuestUser = new User({
        _id: new Types.ObjectId("000000000000000000000001"), // Fixed ID for guest
        email: "guest@example.com",
        firstName: "Guest",
        lastName: "User",
      });
      await newGuestUser.save();
    }

    // Insert categories
    const categoryData = [
      {
        name: "Floral Elegance",
        description: "Delicate blooms and romantic florals that capture the essence of sophisticated femininity and timeless elegance.",
        slug: "floral-elegance",
        imageUrl: "https://pixabay.com/get/g605f009d3ed93b04c84518d5972790f8827c8e2d805a8248c4cc28e4a1074ebe2e815645fc2598d82779f766683385df0229ce7be3e4a8e43358b6e5e0912137_1280.jpg",
      },
      {
        name: "Woody Sophistication",
        description: "Rich, warm woods and amber notes that exude confidence and create an aura of mysterious sophistication.",
        slug: "woody-sophistication",
        imageUrl: "https://pixabay.com/get/gc4ddb7b14ee07dbed38edc3561a5b9bec59a8dc55ce171a696d5d74eabf55c3c902779c24a6fa180f6a21ab03f162c7e3fa937fb46d2b070ab81cd3144815028_1280.jpg",
      },
      {
        name: "Fresh & Citrus",
        description: "Invigorating citrus and fresh aquatic notes that energize the senses and provide a burst of vitality.",
        slug: "fresh-citrus",
        imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      },
      {
        name: "Oriental",
        description: "Rich, warm spices and resins that create an exotic and luxurious fragrance experience.",
        slug: "oriental",
      },
      {
        name: "Oud",
        description: "Premium Middle Eastern fragrances with precious agarwood and exotic ingredients.",
        slug: "oud",
      },
      {
        name: "Floral",
        description: "Delicate and feminine fragrances featuring flower essences and soft accords.",
        slug: "floral",
      },
      {
        name: "Spicy",
        description: "Warm and exotic spice blends that create a bold and distinctive scent profile.",
        slug: "spicy",
      },
      {
        name: "Citrus",
        description: "Bright and energizing citrus notes that provide a fresh and uplifting fragrance experience.",
        slug: "citrus",
      }
    ];

    const insertedCategories = [];
    for (const catData of categoryData) {
      const existingCategory = await Category.findOne({ slug: catData.slug });
      if (!existingCategory) {
        const newCategory = new Category(catData);
        await newCategory.save();
        insertedCategories.push(newCategory);
      } else {
        insertedCategories.push(existingCategory);
      }
    }

    // Insert brands
    const brandData = [
      {
        name: "Maison Lumière",
        description: "A prestigious French perfume house known for its exquisite craftsmanship and luxurious fragrances.",
        slug: "maison-lumiere",
      },
      {
        name: "Royal Heritage",
        description: "Premium fragrances inspired by royal courts and aristocratic elegance.",
        slug: "royal-heritage",
      },
      {
        name: "Atelier Noir",
        description: "Contemporary luxury perfumes with a mysterious and sophisticated edge.",
        slug: "atelier-noir",
      },
      {
        name: "Crystale Luxe",
        description: "Ultra-premium fragrances crafted with the finest ingredients and presented in crystal bottles.",
        slug: "crystale-luxe",
      },
      {
        name: "Royal Essence",
        description: "Luxury fragrances with royal heritage and exceptional quality.",
        slug: "royal-essence",
      },
      {
        name: "Aqua Luxe",
        description: "Premium aquatic and fresh fragrances for modern lifestyles.",
        slug: "aqua-luxe",
      },
      {
        name: "Majesty",
        description: "Regal fragrances that embody power, elegance, and sophistication.",
        slug: "majesty",
      },
      {
        name: "Bloom & Co",
        description: "Specialists in delicate floral compositions and feminine fragrances.",
        slug: "bloom-co",
      },
      {
        name: "Spice Route",
        description: "Exotic fragrances inspired by ancient trading routes and spice markets.",
        slug: "spice-route",
      },
      {
        name: "Fresh Start",
        description: "Energizing and revitalizing fragrances for a fresh beginning.",
        slug: "fresh-start",
      }
    ];

    const insertedBrands = [];
    for (const brandDataItem of brandData) {
      const existingBrand = await Brand.findOne({ slug: brandDataItem.slug });
      if (!existingBrand) {
        const newBrand = new Brand(brandDataItem);
        await newBrand.save();
        insertedBrands.push(newBrand);
      } else {
        insertedBrands.push(existingBrand);
      }
    }

    // Insert products - using homepage product data
    const productData: any[] = [
      /*
      {
        name: "Midnight Essence",
        description: "A captivating blend of dark berries and exotic woods, perfect for evening wear. This sophisticated fragrance opens with blackcurrant and bergamot, revealing a heart of jasmine and rose, settling into a base of sandalwood and musk.",
        shortDescription: "Captivating evening fragrance with dark berries and exotic woods",
        price: 12500,
        originalPrice: 15000,
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands.find(b => b.slug === "royal-essence")?._id,
        categoryId: insertedCategories.find(c => c.slug === "oriental")?._id,
        slug: "midnight-essence",
        volume: "100ml",
        fragranceFamily: "Oriental Woody",
        topNotes: ["Blackcurrant", "Bergamot", "Pink Pepper"],
        middleNotes: ["Jasmine", "Rose", "Geranium"],
        baseNotes: ["Sandalwood", "Musk", "Amber"],
        longevity: "8-12 hours",
        sillage: "Heavy",
        gender: "Unisex",
        isNewArrival: false,
        isBestSeller: true,
        isFeatured: true,
        isLimitedEdition: false,
        stockQuantity: 25,
        reviewCount: 156,
        averageRating: 4.8,
        isActive: true
      },
      {
        name: "Ocean Breeze",
        description: "Fresh and invigorating marine fragrance that captures the essence of ocean waves. Opens with sea salt and citrus, flows into aquatic florals, and settles into driftwood and ambergris for a refreshing all-day wear.",
        shortDescription: "Fresh marine fragrance capturing ocean waves essence",
        price: 9500,
        originalPrice: 11000,
        imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands.find(b => b.slug === "aqua-luxe")?._id,
        categoryId: insertedCategories.find(c => c.slug === "fresh")?._id, // Changed from "fresh-citrus" to "fresh"
        slug: "ocean-breeze",
        volume: "75ml",
        fragranceFamily: "Aquatic Fresh",
        topNotes: ["Sea Salt", "Lemon", "Grapefruit"],
        middleNotes: ["Water Lily", "Freesia", "Marine Accord"],
        baseNotes: ["Driftwood", "Ambergris", "White Musk"],
        longevity: "6-8 hours",
        sillage: "Moderate",
        gender: "Unisex",
        isNewArrival: true,
        isBestSeller: true,
        isFeatured: true,
        isLimitedEdition: false,
        stockQuantity: 40,
        reviewCount: 89,
        averageRating: 4.5,
        isActive: true
      },
      {
        name: "Royal Oud",
        description: "Luxurious oud fragrance blending traditional Middle Eastern ingredients with modern sophistication. Features rare agarwood, rose petals, and precious spices, creating an opulent and memorable scent experience.",
        shortDescription: "Luxurious oud with rare agarwood and rose petals",
        price: 25000,
        originalPrice: 28000,
        imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands.find(b => b.slug === "majesty")?._id,
        categoryId: insertedCategories.find(c => c.slug === "oud")?._id,
        slug: "royal-oud",
        volume: "50ml",
        fragranceFamily: "Oriental Oud",
        topNotes: ["Agarwood", "Saffron", "Cardamom"],
        middleNotes: ["Rose Petals", "Jasmine", "Oudh"],
        baseNotes: ["Sandalwood", "Patchouli", "Amber"],
        longevity: "12+ hours",
        sillage: "Very Heavy",
        gender: "Unisex",
        isNewArrival: true,
        isBestSeller: false,
        isFeatured: true,
        isLimitedEdition: true,
        stockQuantity: 15,
        reviewCount: 234,
        averageRating: 4.9,
        isActive: true
      },
      {
        name: "Garden Bloom",
        description: "Delicate floral bouquet capturing the beauty of an English garden in spring. Features fresh peony, lily of the valley, and white tea, perfect for daytime wear with its light and airy composition.",
        shortDescription: "Delicate floral bouquet perfect for daytime wear",
        price: 8500,
        imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands.find(b => b.slug === "bloom-co")?._id,
        categoryId: insertedCategories.find(c => c.slug === "floral")?._id,
        slug: "garden-bloom",
        volume: "100ml",
        fragranceFamily: "Floral Fresh",
        topNotes: ["Peony", "Green Leaves", "Dewdrops"],
        middleNotes: ["Lily of the Valley", "White Rose", "Magnolia"],
        baseNotes: ["White Tea", "Soft Musk", "Cedar"],
        longevity: "4-6 hours",
        sillage: "Light",
        gender: "Feminine",
        isNewArrival: true,
        isBestSeller: true,
        isFeatured: true,
        isLimitedEdition: true,
        stockQuantity: 60,
        reviewCount: 67,
        averageRating: 4.3,
        isActive: true
      },
      {
        name: "Spice Market",
        description: "Warm and exotic spice blend inspired by ancient trade routes. Features cinnamon, cardamom, and black pepper with a heart of incense and vanilla, creating a mysterious and alluring fragrance.",
        shortDescription: "Warm exotic spice blend with cinnamon and cardamom",
        price: 11000,
        originalPrice: 13500,
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands.find(b => b.slug === "spice-route")?._id,
        categoryId: insertedCategories.find(c => c.slug === "spicy")?._id,
        slug: "spice-market",
        volume: "75ml",
        fragranceFamily: "Oriental Spicy",
        topNotes: ["Cinnamon", "Black Pepper", "Cardamom"],
        middleNotes: ["Incense", "Clove", "Nutmeg"],
        baseNotes: ["Vanilla", "Benzoin", "Tobacco"],
        longevity: "8-10 hours",
        sillage: "Heavy",
        gender: "Unisex",
        isNewArrival: false,
        isBestSeller: true,
        isFeatured: false,
        isLimitedEdition: false,
        stockQuantity: 30,
        reviewCount: 142,
        averageRating: 4.6,
        isActive: true
      },
      {
        name: "Citrus Burst",
        description: "Energizing citrus fragrance perfect for morning wear. Combines grapefruit, lime, and mandarin with a touch of mint and green tea, providing an uplifting and refreshing scent experience.",
        shortDescription: "Energizing citrus perfect for morning wear",
        price: 7500,
        imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands.find(b => b.slug === "fresh-start")?._id,
        categoryId: insertedCategories.find(c => c.slug === "citrus")?._id,
        slug: "citrus-burst",
        volume: "100ml",
        fragranceFamily: "Citrus Fresh",
        topNotes: ["Grapefruit", "Lime", "Mandarin"],
        middleNotes: ["Mint", "Green Tea", "Basil"],
        baseNotes: ["White Musk", "Vetiver", "Light Woods"],
        longevity: "4-5 hours",
        sillage: "Light",
        gender: "Unisex",
        isNewArrival: false,
        isBestSeller: false,
        isFeatured: false,
        isLimitedEdition: false,
        stockQuantity: 50,
        reviewCount: 45,
        averageRating: 4.2,
        isActive: true
      }
      */
    ];

    // Ensure all homepage products are in the database
    for (const prodData of productData as any[]) {
      // Validate that brandId and categoryId are valid before creating/updating
      if (!prodData.brandId) {
        console.warn(`Warning: Missing brandId for product ${prodData.name}`);
        // Try to find the brand by name as fallback
        const brandByName = insertedBrands.find(b => 
          b.name.toLowerCase() === prodData.name.split(' ')[0].toLowerCase()
        );
        if (brandByName) {
          prodData.brandId = brandByName._id;
        }
      }
      
      if (!prodData.categoryId) {
        console.warn(`Warning: Missing categoryId for product ${prodData.name}`);
        // Try to find a default category as fallback
        const defaultCategory = insertedCategories.find(c => c.slug === "oriental");
        if (defaultCategory) {
          prodData.categoryId = defaultCategory._id;
        }
      }
      
      const existingProduct = await Product.findOne({ slug: prodData.slug });
      if (!existingProduct) {
        const newProduct = new Product(prodData);
        await newProduct.save();
        console.log(`Created product: ${prodData.name}`);
      } else {
        // Update existing product with latest data
        await Product.updateOne({ slug: prodData.slug }, { $set: prodData });
        console.log(`Updated product: ${prodData.name}`);
      }
    }
  }
}

export const storage = new DatabaseStorage();
