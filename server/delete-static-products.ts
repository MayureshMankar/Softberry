import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../shared/schema.js';
import { connectToDatabase } from './db.js';

// Load environment variables
dotenv.config();

async function deleteStaticProducts() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // List of static product names to delete
    const staticProductNames = [
      "Midnight Essence",
      "Ocean Breeze",
      "Royal Oud",
      "Garden Bloom",
      "Spice Market",
      "Citrus Burst"
    ];
    
    console.log('Deleting static products...');
    
    // Delete each static product by name
    for (const productName of staticProductNames) {
      const result = await Product.deleteOne({ name: productName });
      if (result.deletedCount > 0) {
        console.log(`Deleted product: ${productName}`);
      } else {
        console.log(`Product not found: ${productName}`);
      }
    }
    
    // Also delete by slugs to be thorough
    const staticProductSlugs = [
      "midnight-essence",
      "ocean-breeze",
      "royal-oud",
      "garden-bloom",
      "spice-market",
      "citrus-burst"
    ];
    
    for (const productSlug of staticProductSlugs) {
      const result = await Product.deleteOne({ slug: productSlug });
      if (result.deletedCount > 0) {
        console.log(`Deleted product with slug: ${productSlug}`);
      }
    }
    
    console.log('Static product deletion completed!');
    
    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error deleting static products:', error);
    process.exit(1);
  }
}

// Run the delete function
deleteStaticProducts();