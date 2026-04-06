import mongoose, { Schema, Document, Types } from 'mongoose';
import { z } from 'zod';

// Interface definitions
export interface IUser extends Document {
  _id: Types.ObjectId;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  password?: string;
  isAdmin: boolean; // Add isAdmin flag
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  createdAt: Date;
}

export interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  logoUrl?: string;
  slug: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  images?: string[];
  brandId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  slug: string;
  volume?: string;
  fragranceFamily?: string;
  topNotes?: string[];
  middleNotes?: string[];
  baseNotes?: string[];
  longevity?: string;
  sillage?: string;
  gender?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  stockQuantity: number;
  reviewCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  status: string;
  totalAmount: number;
  shippingAddress?: any;
  billingAddress?: any;
  paymentMethod?: string;
  paymentStatus: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface IWishlist extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
}

// Mongoose Schemas
export const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  password: { type: String, select: false },
  isAdmin: { type: Boolean, default: false }, // Default to false for security
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

export const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, maxlength: 255 },
  description: String,
  imageUrl: String,
  slug: { type: String, required: true, unique: true, maxlength: 255 },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true, maxlength: 255 },
  description: String,
  logoUrl: String,
  slug: { type: String, required: true, unique: true, maxlength: 255 },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, maxlength: 255 },
  description: String,
  shortDescription: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  imageUrl: String,
  images: [String],
  brandId: { type: Schema.Types.ObjectId, ref: 'Brand' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  slug: { type: String, required: true, unique: true, maxlength: 255 },
  volume: String,
  fragranceFamily: String,
  topNotes: [String],
  middleNotes: [String],
  baseNotes: [String],
  longevity: String,
  sillage: String,
  gender: String,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isLimitedEdition: { type: Boolean, default: false },
  stockQuantity: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const CartItemSchema = new Schema<ICartItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
}, {
  timestamps: true,
});

export const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, default: 'pending' },
  totalAmount: { type: Number, required: true },
  shippingAddress: Schema.Types.Mixed,
  billingAddress: Schema.Types.Mixed,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'pending' },
  trackingNumber: String,
}, {
  timestamps: true,
});

export const OrderItemSchema = new Schema<IOrderItem>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export const WishlistSchema = new Schema<IWishlist>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Brand = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const CartItem = mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', CartItemSchema);
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const OrderItem = mongoose.models.OrderItem || mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);
export const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

// Zod validation schemas
export const insertUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  password: z.string().min(6).optional(),
});

export const insertProductSchema = z.object({
  name: z.string().max(255),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  slug: z.string().max(255),
  volume: z.string().optional(),
  fragranceFamily: z.string().optional(),
  topNotes: z.array(z.string()).optional(),
  middleNotes: z.array(z.string()).optional(),
  baseNotes: z.array(z.string()).optional(),
  longevity: z.string().optional(),
  sillage: z.string().optional(),
  gender: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isLimitedEdition: z.boolean().default(false),
  stockQuantity: z.number().default(0),
  reviewCount: z.number().default(0),
  averageRating: z.number().default(0),
});

export const insertCartItemSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().positive().default(1),
});

export const insertOrderSchema = z.object({
  userId: z.string(),
  status: z.string().default('pending'),
  totalAmount: z.number().positive(),
  shippingAddress: z.any().optional(),
  billingAddress: z.any().optional(),
  paymentMethod: z.enum(['cod', 'credit-card', 'paypal', 'razorpay']).optional(),
  paymentStatus: z.string().default('pending'),
  trackingNumber: z.string().optional(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

export const insertWishlistSchema = z.object({
  userId: z.string(),
  productId: z.string(),
});

export const updateUserSchema = insertUserSchema.partial();
export const updateProductSchema = insertProductSchema.partial();
export const updateOrderSchema = insertOrderSchema.partial();

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type ProductWithDetails = IProduct & {
  brand?: IBrand;
  category?: ICategory;
};
export type CartItemWithProduct = ICartItem & {
  id: string; // String version of _id for frontend consumption
  product: IProduct;
};
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
