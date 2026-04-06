import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '@shared/schema';
import { hashPassword } from './auth';
import { connectToDatabase } from './db';

// Load environment variables
dotenv.config();

async function seedAdminUser() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword('admin123');
    
    // Create admin user
    const adminUser = new User({
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'Admin',
      password: hashedPassword,
      isAdmin: true,
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');
    
    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdminUser();