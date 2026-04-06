import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import type { Request, Response, NextFunction } from 'express';
import type { User } from './storage';
import { validateEnv } from './utils/env';

const env = validateEnv();

// JWT secret
const JWT_SECRET = env.SESSION_SECRET; // Reuse session secret for JWT or add dedicated JWT_SECRET to env.ts
const JWT_EXPIRES_IN = '7d';

// Password requirements
const MIN_PASSWORD_LENGTH = 6;

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Validate password requirements
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Extract token from request
export function extractTokenFromRequest(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return token;
  }
  
  // Check cookie (if using cookies for sessions)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
}

// Authentication middleware
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Get user from database by ID
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}

// Optional authentication middleware (allows guest access)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractTokenFromRequest(req);
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await storage.getUser(decoded.userId);
        if (user) {
          (req as any).user = user;
        }
      }
    }
    
    // Continue regardless of auth status
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    // Continue without authentication
    next();
  }
}

// Get current user or guest user
export function getCurrentUser(req: Request): User | null {
  return (req as any).user || null;
}

// Get user ID (authenticated user or guest)
export function getUserId(req: Request): string {
  const user = getCurrentUser(req);
  return user?._id?.toString() || 'guest-user';
}

// Register new user
export async function registerUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<{ success: boolean; user?: User; token?: string; errors?: string[] }> {
  try {
    const { email, firstName, lastName, password } = userData;
    
    // Validate input
    const errors: string[] = [];
    
    if (!email || !validateEmail(email)) {
      errors.push('Valid email is required');
    }
    
    if (!firstName?.trim()) {
      errors.push('First name is required');
    }
    
    if (!lastName?.trim()) {
      errors.push('Last name is required');
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }
    
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return { success: false, errors: ['User with this email already exists'] };
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const newUser = await storage.upsertUser({
      email: email.toLowerCase().trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: hashedPassword,
    });
    
    // Generate token
    const token = generateToken(newUser._id.toString());
    
    // Remove password from response
    const userResponse = { ...newUser, password: undefined };
    
    return {
      success: true,
      user: userResponse as User,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, errors: ['Registration failed. Please try again.'] };
  }
}

// Login user
export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: User; token?: string; errors?: string[] }> {
  try {
    const { email, password } = credentials;
    
    // Validate input
    if (!email || !password) {
      return { success: false, errors: ['Email and password are required'] };
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email.toLowerCase().trim());
    if (!user || !user.password) {
      return { success: false, errors: ['Invalid email or password'] };
    }
    
    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return { success: false, errors: ['Invalid email or password'] };
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    // Remove password from response
    const userResponse = { ...user, password: undefined };
    
    return {
      success: true,
      user: userResponse as User,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, errors: ['Login failed. Please try again.'] };
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updateData: {
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<{ success: boolean; user?: User; errors?: string[] }> {
  try {
    const errors: string[] = [];
    
    // Validate input
    if (updateData.email && !validateEmail(updateData.email)) {
      errors.push('Valid email is required');
    }
    
    if (updateData.firstName !== undefined && !updateData.firstName.trim()) {
      errors.push('First name cannot be empty');
    }
    
    if (updateData.lastName !== undefined && !updateData.lastName.trim()) {
      errors.push('Last name cannot be empty');
    }
    
    if (errors.length > 0) {
      return { success: false, errors };
    }
    
    // Get current user
    const currentUser = await storage.getUser(userId);
    if (!currentUser) {
      return { success: false, errors: ['User not found'] };
    }
    
    // If email is being updated, check if it's already taken
    if (updateData.email && updateData.email.toLowerCase() !== currentUser.email?.toLowerCase()) {
      const existingUser = await storage.getUserByEmail(updateData.email.toLowerCase());
      if (existingUser) {
        return { success: false, errors: ['Email is already taken'] };
      }
    }
    
    // Update user
    const updatedUser = await storage.upsertUser({
      ...currentUser,
      ...updateData,
      email: updateData.email?.toLowerCase().trim() || currentUser.email,
      firstName: updateData.firstName?.trim() || currentUser.firstName,
      lastName: updateData.lastName?.trim() || currentUser.lastName,
    });
    
    // Remove password from response
    const userResponse = { ...updatedUser, password: undefined };
    
    return {
      success: true,
      user: userResponse as User
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, errors: ['Profile update failed. Please try again.'] };
  }
}

// Change password
export async function changePassword(userId: string, passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; errors?: string[] }> {
  try {
    const { currentPassword, newPassword } = passwordData;
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return { success: false, errors: passwordValidation.errors };
    }
    
    // Get current user
    const user = await storage.getUser(userId);
    if (!user || !user.password) {
      return { success: false, errors: ['User not found'] };
    }
    
    // Verify current password
    const isValidCurrentPassword = await comparePassword(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return { success: false, errors: ['Current password is incorrect'] };
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    
    // Update password
    await storage.upsertUser({
      ...user,
      password: hashedNewPassword,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, errors: ['Password change failed. Please try again.'] };
  }
}