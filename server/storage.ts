import {
  users,
  products,
  categories,
  brands,
  cartItems,
  orders,
  orderItems,
  wishlist,
  type User,
  type UpsertUser,
  type Product,
  type ProductWithDetails,
  type CartItem,
  type CartItemWithProduct,
  type Order,
  type OrderItem,
  type Category,
  type Brand,
  type Wishlist,
  type InsertCartItem,
  type InsertOrder,
  type InsertOrderItem,
  type InsertWishlist,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
  } = {}): Promise<ProductWithDetails[]> {
    let query = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        images: products.images,
        brandId: products.brandId,
        categoryId: products.categoryId,
        slug: products.slug,
        volume: products.volume,
        fragranceFamily: products.fragranceFamily,
        topNotes: products.topNotes,
        middleNotes: products.middleNotes,
        baseNotes: products.baseNotes,
        longevity: products.longevity,
        sillage: products.sillage,
        gender: products.gender,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isNewArrival: products.isNewArrival,
        isBestSeller: products.isBestSeller,
        isLimitedEdition: products.isLimitedEdition,
        stockQuantity: products.stockQuantity,
        reviewCount: products.reviewCount,
        averageRating: products.averageRating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          description: brands.description,
          logoUrl: brands.logoUrl,
          slug: brands.slug,
          createdAt: brands.createdAt,
        },
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          imageUrl: categories.imageUrl,
          slug: categories.slug,
          createdAt: categories.createdAt,
        },
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true));

    // Apply filters
    const conditions = [eq(products.isActive, true)];
    
    if (filters.category) {
      conditions.push(eq(categories.slug, filters.category));
    }
    if (filters.brand) {
      conditions.push(eq(brands.slug, filters.brand));
    }
    if (filters.search) {
      conditions.push(ilike(products.name, `%${filters.search}%`));
    }
    if (filters.minPrice !== undefined) {
      conditions.push(sql`${products.price}::numeric >= ${filters.minPrice}`);
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(sql`${products.price}::numeric <= ${filters.maxPrice}`);
    }
    if (filters.gender) {
      conditions.push(eq(products.gender, filters.gender));
    }
    if (filters.fragranceFamily) {
      conditions.push(eq(products.fragranceFamily, filters.fragranceFamily));
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? desc : asc;
      switch (filters.sortBy) {
        case 'price':
          query = query.orderBy(sortOrder(products.price));
          break;
        case 'name':
          query = query.orderBy(sortOrder(products.name));
          break;
        case 'rating':
          query = query.orderBy(sortOrder(products.averageRating));
          break;
        case 'newest':
          query = query.orderBy(desc(products.createdAt));
          break;
      }
    } else {
      query = query.orderBy(desc(products.createdAt));
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const results = await query;
    
    return results.map(result => ({
      ...result,
      brand: result.brand?.id ? result.brand : undefined,
      category: result.category?.id ? result.category : undefined,
    }));
  }

  async getProduct(id: string): Promise<ProductWithDetails | undefined> {
    const [result] = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        images: products.images,
        brandId: products.brandId,
        categoryId: products.categoryId,
        slug: products.slug,
        volume: products.volume,
        fragranceFamily: products.fragranceFamily,
        topNotes: products.topNotes,
        middleNotes: products.middleNotes,
        baseNotes: products.baseNotes,
        longevity: products.longevity,
        sillage: products.sillage,
        gender: products.gender,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isNewArrival: products.isNewArrival,
        isBestSeller: products.isBestSeller,
        isLimitedEdition: products.isLimitedEdition,
        stockQuantity: products.stockQuantity,
        reviewCount: products.reviewCount,
        averageRating: products.averageRating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          description: brands.description,
          logoUrl: brands.logoUrl,
          slug: brands.slug,
          createdAt: brands.createdAt,
        },
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          imageUrl: categories.imageUrl,
          slug: categories.slug,
          createdAt: categories.createdAt,
        },
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.id, id), eq(products.isActive, true)));

    if (!result) return undefined;

    return {
      ...result,
      brand: result.brand?.id ? result.brand : undefined,
      category: result.category?.id ? result.category : undefined,
    };
  }

  async getProductBySlug(slug: string): Promise<ProductWithDetails | undefined> {
    const [result] = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        images: products.images,
        brandId: products.brandId,
        categoryId: products.categoryId,
        slug: products.slug,
        volume: products.volume,
        fragranceFamily: products.fragranceFamily,
        topNotes: products.topNotes,
        middleNotes: products.middleNotes,
        baseNotes: products.baseNotes,
        longevity: products.longevity,
        sillage: products.sillage,
        gender: products.gender,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isNewArrival: products.isNewArrival,
        isBestSeller: products.isBestSeller,
        isLimitedEdition: products.isLimitedEdition,
        stockQuantity: products.stockQuantity,
        reviewCount: products.reviewCount,
        averageRating: products.averageRating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          description: brands.description,
          logoUrl: brands.logoUrl,
          slug: brands.slug,
          createdAt: brands.createdAt,
        },
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          imageUrl: categories.imageUrl,
          slug: categories.slug,
          createdAt: categories.createdAt,
        },
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)));

    if (!result) return undefined;

    return {
      ...result,
      brand: result.brand?.id ? result.brand : undefined,
      category: result.category?.id ? result.category : undefined,
    };
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithDetails[]> {
    return this.getProducts({ limit, sortBy: 'newest' });
  }

  async getNewArrivals(limit = 8): Promise<ProductWithDetails[]> {
    const results = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        images: products.images,
        brandId: products.brandId,
        categoryId: products.categoryId,
        slug: products.slug,
        volume: products.volume,
        fragranceFamily: products.fragranceFamily,
        topNotes: products.topNotes,
        middleNotes: products.middleNotes,
        baseNotes: products.baseNotes,
        longevity: products.longevity,
        sillage: products.sillage,
        gender: products.gender,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isNewArrival: products.isNewArrival,
        isBestSeller: products.isBestSeller,
        isLimitedEdition: products.isLimitedEdition,
        stockQuantity: products.stockQuantity,
        reviewCount: products.reviewCount,
        averageRating: products.averageRating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          description: brands.description,
          logoUrl: brands.logoUrl,
          slug: brands.slug,
          createdAt: brands.createdAt,
        },
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          imageUrl: categories.imageUrl,
          slug: categories.slug,
          createdAt: categories.createdAt,
        },
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isNewArrival, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return results.map(result => ({
      ...result,
      brand: result.brand?.id ? result.brand : undefined,
      category: result.category?.id ? result.category : undefined,
    }));
  }

  async getBestSellers(limit = 8): Promise<ProductWithDetails[]> {
    const results = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        images: products.images,
        brandId: products.brandId,
        categoryId: products.categoryId,
        slug: products.slug,
        volume: products.volume,
        fragranceFamily: products.fragranceFamily,
        topNotes: products.topNotes,
        middleNotes: products.middleNotes,
        baseNotes: products.baseNotes,
        longevity: products.longevity,
        sillage: products.sillage,
        gender: products.gender,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        isNewArrival: products.isNewArrival,
        isBestSeller: products.isBestSeller,
        isLimitedEdition: products.isLimitedEdition,
        stockQuantity: products.stockQuantity,
        reviewCount: products.reviewCount,
        averageRating: products.averageRating,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        brand: {
          id: brands.id,
          name: brands.name,
          description: brands.description,
          logoUrl: brands.logoUrl,
          slug: brands.slug,
          createdAt: brands.createdAt,
        },
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          imageUrl: categories.imageUrl,
          slug: categories.slug,
          createdAt: categories.createdAt,
        },
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isActive, true), eq(products.isBestSeller, true)))
      .orderBy(desc(products.reviewCount))
      .limit(limit);

    return results.map(result => ({
      ...result,
      brand: result.brand?.id ? result.brand : undefined,
      category: result.category?.id ? result.category : undefined,
    }));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands).orderBy(asc(brands.name));
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.slug, slug));
    return brand;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const results = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          shortDescription: products.shortDescription,
          price: products.price,
          originalPrice: products.originalPrice,
          imageUrl: products.imageUrl,
          images: products.images,
          brandId: products.brandId,
          categoryId: products.categoryId,
          slug: products.slug,
          volume: products.volume,
          fragranceFamily: products.fragranceFamily,
          topNotes: products.topNotes,
          middleNotes: products.middleNotes,
          baseNotes: products.baseNotes,
          longevity: products.longevity,
          sillage: products.sillage,
          gender: products.gender,
          isActive: products.isActive,
          isFeatured: products.isFeatured,
          isNewArrival: products.isNewArrival,
          isBestSeller: products.isBestSeller,
          isLimitedEdition: products.isLimitedEdition,
          stockQuantity: products.stockQuantity,
          reviewCount: products.reviewCount,
          averageRating: products.averageRating,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId))
      .orderBy(desc(cartItems.createdAt));

    return results;
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId)
        )
      );

    if (existingItem) {
      // Update quantity if item exists
      const [updatedItem] = await db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + cartItem.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Insert new item
    const [newItem] = await db.insert(cartItems).values(cartItem).returning();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Wishlist operations
  async getWishlist(userId: string): Promise<Wishlist[]> {
    return await db
      .select()
      .from(wishlist)
      .where(eq(wishlist.userId, userId))
      .orderBy(desc(wishlist.createdAt));
  }

  async addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist> {
    const [newItem] = await db.insert(wishlist).values(wishlistItem).returning();
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await db
      .delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
  }

  // Seed data
  async seedData(): Promise<void> {
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
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(categoryData)
      .onConflictDoNothing()
      .returning();

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
    ];

    const insertedBrands = await db
      .insert(brands)
      .values(brandData)
      .onConflictDoNothing()
      .returning();

    // Insert products
    const productData = [
      {
        name: "Midnight Essence",
        description: "A captivating blend of jasmine, sandalwood, and vanilla that embodies the mystery of midnight. This sophisticated fragrance opens with fresh bergamot and evolves into a heart of exotic jasmine and rose, finally settling into a warm base of sandalwood, vanilla, and amber.",
        shortDescription: "A captivating blend of jasmine, sandalwood, and vanilla",
        price: "12500.00",
        originalPrice: "15000.00",
        imageUrl: "https://pixabay.com/get/gfe916978d83020a615003d67d7c63fbbe87e1791c185dd34f8b11fa14dc69e104461f102f31f4f13028a46d26c4e33d17c5244aabc05a13f1c29ceafde22ccac_1280.jpg",
        brandId: insertedBrands[0]?.id,
        categoryId: insertedCategories[0]?.id,
        slug: "midnight-essence",
        volume: "50ml",
        fragranceFamily: "Floral",
        topNotes: ["Bergamot", "Pink Pepper", "Mandarin"],
        middleNotes: ["Jasmine", "Rose", "Lily of the Valley"],
        baseNotes: ["Sandalwood", "Vanilla", "Amber"],
        longevity: "Long Lasting",
        sillage: "Moderate",
        gender: "Women",
        isNewArrival: true,
        stockQuantity: 25,
        reviewCount: 24,
        averageRating: "4.80",
      },
      {
        name: "Golden Opulence",
        description: "An opulent fragrance that captures the essence of luxury with its rich blend of oud, saffron, and gold accord. This masterpiece opens with precious saffron and continues with heart notes of Bulgarian rose and oud, completing with a base of pure gold accord and precious woods.",
        shortDescription: "An opulent fragrance with oud, saffron, and gold accord",
        price: "18750.00",
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands[1]?.id,
        categoryId: insertedCategories[1]?.id,
        slug: "golden-opulence",
        volume: "75ml",
        fragranceFamily: "Oriental",
        topNotes: ["Saffron", "Pink Pepper", "Bergamot"],
        middleNotes: ["Bulgarian Rose", "Oud", "Patchouli"],
        baseNotes: ["Gold Accord", "Sandalwood", "Amber"],
        longevity: "Very Long Lasting",
        sillage: "Strong",
        gender: "Unisex",
        isBestSeller: true,
        stockQuantity: 15,
        reviewCount: 38,
        averageRating: "4.90",
      },
      {
        name: "Velvet Mystique",
        description: "A mysterious and alluring fragrance that combines dark berries, velvet accord, and smoky incense. This enigmatic scent opens with dark berries and continues with a heart of velvet petals and iris, finishing with a base of smoky incense and dark woods.",
        shortDescription: "Mysterious blend of dark berries, velvet accord, and smoky incense",
        price: "22000.00",
        originalPrice: "25000.00",
        imageUrl: "https://pixabay.com/get/g5b0ebde55f5a651bd37018bdf2c742868b5272d3fa8d8da952bf07f3f8f20d073de525054b51b251e1a03a269b77a014cc294708d624937ccf814e64cadbc28d_1280.jpg",
        brandId: insertedBrands[2]?.id,
        categoryId: insertedCategories[1]?.id,
        slug: "velvet-mystique",
        volume: "100ml",
        fragranceFamily: "Oriental",
        topNotes: ["Dark Berries", "Black Pepper", "Cardamom"],
        middleNotes: ["Velvet Petals", "Iris", "Violet"],
        baseNotes: ["Smoky Incense", "Dark Woods", "Musk"],
        longevity: "Long Lasting",
        sillage: "Moderate",
        gender: "Unisex",
        isLimitedEdition: true,
        stockQuantity: 8,
        reviewCount: 16,
        averageRating: "4.70",
      },
      {
        name: "Diamond Aura",
        description: "The pinnacle of luxury fragrance artistry, featuring rare white diamonds extract, precious crystals accord, and the finest white florals. This exclusive creation opens with sparkling citrus and diamond dust, evolving into pure white florals, and finishing with crystal accord and precious woods.",
        shortDescription: "Luxury fragrance with white diamonds extract and crystal accord",
        price: "28500.00",
        imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        brandId: insertedBrands[3]?.id,
        categoryId: insertedCategories[0]?.id,
        slug: "diamond-aura",
        volume: "50ml",
        fragranceFamily: "Floral",
        topNotes: ["Diamond Dust", "Sparkling Citrus", "White Tea"],
        middleNotes: ["White Rose", "Peony", "Magnolia"],
        baseNotes: ["Crystal Accord", "White Woods", "Cashmere"],
        longevity: "Very Long Lasting",
        sillage: "Strong",
        gender: "Women",
        isFeatured: true,
        stockQuantity: 5,
        reviewCount: 42,
        averageRating: "5.00",
      },
    ];

    await db
      .insert(products)
      .values(productData)
      .onConflictDoNothing();
  }
}

export const storage = new DatabaseStorage();
