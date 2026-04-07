import fs from "fs";
import path from "path";
import { storage } from "./storage.js";

// Simple function to import static data
export async function simpleImportStaticData() {
  try {
    console.log("Starting simple static data import");
    
    // Path to homepage-products.ts file
    const homepageProductsPath = path.join(process.cwd(), 'client', 'src', 'data', 'homepage-products.ts');
    console.log("Homepage products file path:", homepageProductsPath);
    
    // Check if file exists
    if (!fs.existsSync(homepageProductsPath)) {
      console.error("Homepage products file not found at:", homepageProductsPath);
      throw new Error("Homepage products file not found");
    }
    
    // Read the current file content
    let fileContent = fs.readFileSync(homepageProductsPath, 'utf8');
    console.log("File read successfully, content length:", fileContent.length);
    
    // Extract only the homepageProducts array section
    const arrayStart = fileContent.indexOf('export const homepageProducts: HomepageProduct[] = [');
    if (arrayStart === -1) {
      throw new Error("Could not find homepageProducts array in file");
    }
    
    const arrayEnd = fileContent.indexOf('];', arrayStart);
    if (arrayEnd === -1) {
      throw new Error("Could not find end of homepageProducts array");
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
        let brandId: string | undefined = undefined;
        let categoryId: string | undefined = undefined;
        
        if (staticProduct.brand) {
          // Try to find brand by name first (case-insensitive)
          const brands = await storage.getBrands();
          const matchedBrand = brands.find(b => 
            b.name.toLowerCase() === staticProduct.brand.toLowerCase() || 
            b.slug === staticProduct.brand.toLowerCase().replace(/\s+/g, '-')
          );
          
          if (matchedBrand) {
            brandId = matchedBrand._id.toString();
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
            categoryId = matchedCategory._id.toString();
            console.log(`Found category: ${matchedCategory.name} (${categoryId})`);
          } else {
            console.log(`Category not found: ${staticProduct.category}`);
          }
        }
        
        // Prepare product data with proper brandId and categoryId
        const productData: any = {
          ...staticProduct
        };
        
        // Only add brandId and categoryId if they were found
        if (brandId !== undefined) {
          productData.brandId = brandId;
        }
        
        if (categoryId !== undefined) {
          productData.categoryId = categoryId;
        }
        
        // Remove brand and category fields as we're using brandId and categoryId
        delete productData.brand;
        delete productData.category;
        
        console.log("Product data before processing:", {
          name: staticProduct.name,
          brand: staticProduct.brand,
          category: staticProduct.category,
          brandId,
          categoryId
        });
        
        console.log("Product data after processing:", productData);
        
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
    return result;
  } catch (error: any) {
    console.error('Import static data error:', error);
    throw error;
  }
}