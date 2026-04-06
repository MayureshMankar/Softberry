import { HomepageProduct } from "@/data/homepage-products";

// Function to sync product data with the homepage-products.ts file
export const syncWithHomepageProducts = async (productData: HomepageProduct): Promise<boolean> => {
  try {
    const response = await fetch("/api/admin/sync-homepage-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Client-Admin-Secret"
      },
      body: JSON.stringify({ product: productData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sync with homepage products");
    }

    const result = await response.json();
    console.log(result.message);
    return true;
  } catch (error) {
    console.error("Failed to sync with homepage-products.ts:", error);
    return false;
  }
};

// Helper function to convert database product to homepage product format
export const convertToHomepageProduct = (product: any): HomepageProduct => {
  // Ensure we have valid data for required fields
  const name = product.name || "Untitled Product";
  const brand = (typeof product.brand === 'object' ? (product.brand?.name || "Unknown Brand") : (product.brand || "Unknown Brand"));
  const category = (typeof product.category === 'object' ? (product.category?.name || "Unknown Category") : (product.category || "Unknown Category"));
  const slug = product.slug || name.toLowerCase().replace(/\s+/g, '-');
  
  // Handle optional fields - convert empty strings to undefined
  const imageUrl = product.imageUrl || undefined;
  const description = product.description || "";
  const shortDescription = product.shortDescription || "";
  const volume = product.volume || "";
  const fragranceFamily = product.fragranceFamily || "";
  const longevity = product.longevity || "";
  const sillage = product.sillage || "";
  const gender = product.gender || "Unisex";
  
  return {
    id: product._id || product.id || Math.random().toString(36).substring(2, 9),
    name: name,
    description: description,
    shortDescription: shortDescription,
    price: product.price || 0,
    originalPrice: product.originalPrice,
    imageUrl: imageUrl,
    brand: brand,
    category: category,
    slug: slug,
    volume: volume,
    fragranceFamily: fragranceFamily,
    topNotes: Array.isArray(product.topNotes) ? product.topNotes : [],
    middleNotes: Array.isArray(product.middleNotes) ? product.middleNotes : [],
    baseNotes: Array.isArray(product.baseNotes) ? product.baseNotes : [],
    longevity: longevity,
    sillage: sillage,
    gender: gender,
    isActive: product.isActive !== undefined ? product.isActive : true,
    isFeatured: product.isFeatured || false,
    isNewArrival: product.isNewArrival || false,
    isBestSeller: product.isBestSeller || false,
    isLimitedEdition: product.isLimitedEdition || false,
    stockQuantity: product.stockQuantity || 0,
    reviewCount: product.reviewCount || 0,
    averageRating: product.averageRating || 0,
  };
};