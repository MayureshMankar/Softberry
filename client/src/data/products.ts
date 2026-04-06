// ========================================
// HOMEPAGE PRODUCTS DATA
// ========================================
// Edit this file to change products displayed on homepage
// You can modify existing products, add new ones, or change images

export interface ProductData {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  brand: string;
  category: string;
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
  // Theme-aware styling
  themeStyles?: ProductThemeStyles;
}

// Theme-aware styling interfaces for products
export interface ProductThemeStyles {
  light: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    accentColor?: string;
    hoverColor?: string;
    shadowColor?: string;
    cardBackground?: string;
    priceColor?: string;
  };
  dark: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    accentColor?: string;
    hoverColor?: string;
    shadowColor?: string;
    cardBackground?: string;
    priceColor?: string;
  };
}

// Default theme styles for all products
export const defaultProductThemeStyles: ProductThemeStyles = {
  light: {
    backgroundColor: '#FFFFFF',
    textColor: '#2C2C2C',
    borderColor: '#E8E3DA',
    accentColor: '#8B7355',
    hoverColor: '#6B5A45',
    shadowColor: 'rgba(139, 115, 85, 0.1)',
    cardBackground: '#F8F7F4',
    priceColor: '#8B7355'
  },
  dark: {
    backgroundColor: '#000000',
    textColor: '#FAF9F6',
    borderColor: '#DCD7CE',
    accentColor: '#DCD7CE',
    hoverColor: '#ACA69A',
    shadowColor: 'rgba(220, 215, 206, 0.1)',
    cardBackground: '#111111',
    priceColor: '#DCD7CE'
  }
};

// Premium theme styles for featured products
export const premiumProductThemeStyles: ProductThemeStyles = {
  light: {
    backgroundColor: '#FFF8F0',
    textColor: '#2C2C2C',
    borderColor: '#D4A574',
    accentColor: '#D4A574',
    hoverColor: '#B8935E',
    shadowColor: 'rgba(212, 165, 116, 0.2)',
    cardBackground: '#FFF8F0',
    priceColor: '#D4A574'
  },
  dark: {
    backgroundColor: '#1A1611',
    textColor: '#FAF9F6',
    borderColor: '#F4E4C1',
    accentColor: '#F4E4C1',
    hoverColor: '#E6D3A3',
    shadowColor: 'rgba(244, 228, 193, 0.2)',
    cardBackground: '#1A1611',
    priceColor: '#F4E4C1'
  }
};

// ========================================
// EDIT PRODUCTS BELOW
// ========================================

export const homepageProducts: ProductData[] = [
  {
    id: "1",
    name: "Radiant Glow Foundation",
    description: "A lightweight, buildable foundation that provides flawless coverage while nourishing your skin with hyaluronic acid and vitamin E. This long-lasting formula blends seamlessly for a natural, radiant finish that lasts all day.",
    shortDescription: "Flawless coverage with hyaluronic acid and vitamin E",
    price: 2499,
    originalPrice: 2999,
    imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "radiant-glow-foundation",
    volume: "30ml",
    fragranceFamily: "Makeup",
    topNotes: ["Hyaluronic Acid", "Vitamin E", "SPF 15"],
    middleNotes: ["Buildable Coverage", "Natural Finish", "Oil-Free"],
    baseNotes: ["Paraben-Free", "Non-Comedogenic", "Dermatologist Tested"],
    longevity: "12-Hour Wear",
    sillage: "N/A",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 45,
    reviewCount: 32,
    averageRating: 4.7,
  },
  {
    id: "2",
    name: "Velvet Matte Lipstick",
    description: "An ultra-pigmented matte lipstick that delivers rich, vibrant color in one swipe. Infused with shea butter and jojoba oil for comfortable wear that doesn't dry out your lips. Available in 12 universally flattering shades.",
    shortDescription: "Ultra-pigmented matte lipstick with shea butter",
    price: 899,
    originalPrice: 1199,
    imageUrl: "https://images.unsplash.com/photo-1585238342028-78d387f4a707?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "velvet-matte-lipstick",
    volume: "3.5g",
    fragranceFamily: "Makeup",
    topNotes: ["Shea Butter", "Jojoba Oil", "Vitamin E"],
    middleNotes: ["High Pigment", "Matte Finish", "Long-Lasting"],
    baseNotes: ["Cruelty-Free", "Vegan", "Gluten-Free"],
    longevity: "6-8 Hours",
    sillage: "N/A",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 60,
    reviewCount: 58,
    averageRating: 4.8,
  },
  {
    id: "3",
    name: "Hydrating Face Serum",
    description: "A powerful hydrating serum packed with 10% hyaluronic acid, niacinamide, and peptides to plump, brighten, and rejuvenate your skin. Lightweight formula absorbs quickly and works beautifully under makeup.",
    shortDescription: "10% hyaluronic acid serum for deep hydration",
    price: 1699,
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a41552231658?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    brand: "Soft Berry",
    category: "Skincare",
    slug: "hydrating-face-serum",
    volume: "30ml",
    fragranceFamily: "Skincare",
    topNotes: ["10% Hyaluronic Acid", "Niacinamide", "Peptides"],
    middleNotes: ["Deep Hydration", "Skin Plumping", "Brightening"],
    baseNotes: ["Fragrance-Free", "Paraben-Free", "Suitable for All Skin Types"],
    longevity: "Visible results in 2-4 weeks",
    sillage: "N/A",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    stockQuantity: 35,
    reviewCount: 24,
    averageRating: 4.6,
  },
  {
    id: "4",
    name: "Volumizing Mascara",
    description: "A clump-free volumizing mascara that lifts, lengthens, and defines your lashes for a dramatic yet natural look. The precision brush coats every lash from root to tip for maximum impact.",
    shortDescription: "Clump-free mascara for dramatic volume and length",
    price: 799,
    originalPrice: 999,
    imageUrl: "https://pixabay.com/get/g0c4c5c8e2c8f5e5b8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7_1280.jpg",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "volumizing-mascara",
    volume: "8ml",
    fragranceFamily: "Makeup",
    topNotes: ["Protein-Enriched", "Vitamin B5", "Panthenol"],
    middleNotes: ["Volumizing", "Lengthening", "Smudge-Proof"],
    baseNotes: ["Ophthalmologist Tested", "Contact Lens Safe", "Easy Removal"],
    longevity: "16-Hour Wear",
    sillage: "N/A",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 50,
    reviewCount: 41,
    averageRating: 4.7,
  },
  {
    id: "5",
    name: "Glow Highlighter Palette",
    description: "A luxurious 4-pan highlighter palette with buildable, light-reflecting powders that give you the perfect glow. From subtle daytime shimmer to intense evening glam, these silky formulas blend effortlessly.",
    shortDescription: "4-pan highlighter palette for customizable glow",
    price: 1499,
    imageUrl: "https://pixabay.com/get/g2b4d5c8e2c8f5e5b8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7c7e8f8c4c0e1f1e1c7_1280.jpg",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "glow-highlighter-palette",
    volume: "12g",
    fragranceFamily: "Makeup",
    topNotes: ["Light-Reflecting Pearls", "Silica", "Mica"],
    middleNotes: ["Buildable Coverage", "Buttery Texture", "Blendable"],
    baseNotes: ["Talc-Free", "Cruelty-Free", "Dermatologist Tested"],
    longevity: "8-Hour Wear",
    sillage: "N/A",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    isLimitedEdition: true,
    stockQuantity: 28,
    reviewCount: 19,
    averageRating: 4.8,
  },
  {
    id: "6",
    name: "Nourishing Night Cream",
    description: "A rich, restorative night cream that works while you sleep to repair, hydrate, and rejuvenate your skin. Formulated with retinol, peptides, and ceramides for visibly younger-looking skin by morning.",
    shortDescription: "Restorative night cream with retinol and peptides",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0d4dbf91d9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    brand: "Soft Berry",
    category: "Skincare",
    slug: "nourishing-night-cream",
    volume: "50ml",
    fragranceFamily: "Skincare",
    topNotes: ["Retinol", "Peptides", "Ceramides"],
    middleNotes: ["Deep Hydration", "Skin Repair", "Anti-Aging"],
    baseNotes: ["Fragrance-Free", "Paraben-Free", "Non-Comedogenic"],
    longevity: "Overnight Repair",
    sillage: "N/A",
    gender: "Unisex",
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    stockQuantity: 40,
    reviewCount: 16,
    averageRating: 4.5,
  },

  // ========================================
  // ADD NEW PRODUCTS BELOW
  // ========================================
  // Copy the structure above to add new products
  // Make sure to:
  // 1. Use a unique ID
  // 2. Create a unique slug (lowercase, no spaces, use hyphens)
  // 3. Add a valid image URL
  // 4. Set appropriate price and stock quantity
  
  /* TEMPLATE FOR NEW PRODUCT:
  {
    id: "7", // Change this to next number
    name: "Your Product Name",
    description: "Full detailed description of your product...",
    shortDescription: "Brief description",
    price: 10000, // Price in rupees
    originalPrice: 12000, // Optional - only if there's a discount
    imageUrl: "https://your-image-url.com/image.jpg",
    brand: "Brand Name",
    category: "Category Name", // Use: "Floral Elegance", "Woody Sophistication", or "Fresh & Citrus"
    slug: "your-product-name", // lowercase with hyphens
    volume: "50ml",
    fragranceFamily: "Floral", // Floral, Woody, Fresh, Oriental, etc.
    topNotes: ["Note 1", "Note 2", "Note 3"],
    middleNotes: ["Note 1", "Note 2", "Note 3"],
    baseNotes: ["Note 1", "Note 2", "Note 3"],
    longevity: "Long Lasting", // Light, Moderate, Long Lasting, Very Long Lasting
    sillage: "Moderate", // Light, Moderate, Heavy
    gender: "Unisex", // Men, Women, Unisex
    isActive: true,
    isFeatured: false, // Set to true to feature on homepage
    isNewArrival: false, // Set to true for new arrival badge
    isBestSeller: false, // Set to true for bestseller badge
    isLimitedEdition: false, // Set to true for limited edition badge
    stockQuantity: 25,
    reviewCount: 0,
    averageRating: 0,
  },
  */
];

// ========================================
// CATEGORIES DATA
// ========================================

export const categories = [
  {
    id: "1",
    name: "Makeup",
    description: "High-quality cosmetics for face, eyes, and lips to create stunning looks for every occasion.",
    slug: "makeup",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  },
  { 
    id: "2",
    name: "Skincare",
    description: "Nourishing and effective skincare products to hydrate, protect, and rejuvenate your skin.",
    slug: "skincare",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0c62c17fbb0?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Eye Products", 
    description: "Specialized treatments and cosmetics for brighter, healthier-looking eyes and lashes.",
    slug: "eye-products",
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
  },
];

// ========================================
// BRANDS DATA  
// ========================================

export const brands = [
  {
    id: "1",
    name: "Soft Berry",
    description: "Premium cosmetics brand known for high-quality, cruelty-free makeup and skincare products.",
    slug: "soft-berry",
  },
  {
    id: "2", 
    name: "Glow Naturals",
    description: "Clean beauty brand focused on natural ingredients and sustainable packaging.",
    slug: "glow-naturals",
  },
  {
    id: "3",
    name: "Luxe Beauty", 
    description: "Luxury cosmetics with professional-grade formulas for flawless results.",
    slug: "luxe-beauty",
  },
  {
    id: "4",
    name: "Pure Skin Co.",
    description: "Dermatologist-recommended skincare brand for all skin types and concerns.",
    slug: "pure-skin-co",
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

// Get featured products for homepage
export const getFeaturedProducts = () => {
  return homepageProducts.filter(product => product.isFeatured && product.isActive);
};

// Get new arrivals
export const getNewArrivals = () => {
  return homepageProducts.filter(product => product.isNewArrival && product.isActive);
};

// Get best sellers
export const getBestSellers = () => {
  return homepageProducts.filter(product => product.isBestSeller && product.isActive);
};

// Get products by category
export const getProductsByCategory = (categorySlug: string) => {
  return homepageProducts.filter(product => 
    product.category.toLowerCase().replace(/\s+/g, '-') === categorySlug && product.isActive
  );
};

// Get product by slug
export const getProductBySlug = (slug: string) => {
  return homepageProducts.find(product => product.slug === slug);
};

// Format price
export const formatPrice = (price: number) => {
  return `₹${price.toLocaleString()}`;
};

// ========================================
// THEME-AWARE HELPER FUNCTIONS
// ========================================

// Get theme-specific styles for a product
export const getProductThemeStyles = (product: ProductData, theme: 'light' | 'dark') => {
  return product.themeStyles?.[theme] || defaultProductThemeStyles[theme];
};

// Get products with theme-aware styling applied
export const getProductsWithThemeStyles = (products: ProductData[], theme: 'light' | 'dark') => {
  return products.map(product => ({
    ...product,
    currentThemeStyles: getProductThemeStyles(product, theme)
  }));
};

// Theme-aware featured products
export const getFeaturedProductsWithTheme = (theme: 'light' | 'dark') => {
  const featured = getFeaturedProducts();
  return getProductsWithThemeStyles(featured, theme);
};

// Theme-aware new arrivals
export const getNewArrivalsWithTheme = (theme: 'light' | 'dark') => {
  const newArrivals = getNewArrivals();
  return getProductsWithThemeStyles(newArrivals, theme);
};

// Theme-aware best sellers
export const getBestSellersWithTheme = (theme: 'light' | 'dark') => {
  const bestSellers = getBestSellers();
  return getProductsWithThemeStyles(bestSellers, theme);
};

// Generate theme-aware CSS properties object for products
export const getProductThemeAwareStyles = (product: ProductData, theme: 'light' | 'dark') => {
  const styles = getProductThemeStyles(product, theme);
  return {
    backgroundColor: styles.cardBackground,
    color: styles.textColor,
    borderColor: styles.borderColor,
    '--accent-color': styles.accentColor,
    '--hover-color': styles.hoverColor,
    '--shadow-color': styles.shadowColor,
    '--price-color': styles.priceColor
  } as React.CSSProperties;
};

// Get theme color for specific product styling
export const getProductThemeColor = (product: ProductData, colorKey: keyof ProductThemeStyles['light'], theme: 'light' | 'dark') => {
  const styles = getProductThemeStyles(product, theme);
  return styles[colorKey];
};

// Generate product card box shadow based on theme and product type
export const getProductBoxShadow = (product: ProductData, theme: 'light' | 'dark', intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const styles = getProductThemeStyles(product, theme);
  const intensityMap = {
    light: '0 2px 8px',
    medium: '0 4px 16px',
    heavy: '0 8px 32px'
  };
  return `${intensityMap[intensity]} ${styles.shadowColor}`;
};

// Get product badge colors based on theme
export const getProductBadgeColors = (badgeType: 'featured' | 'new' | 'bestseller' | 'limited', theme: 'light' | 'dark') => {
  const badgeStyles = {
    featured: {
      light: { background: '#8B7355', color: '#FFFFFF' },
      dark: { background: '#DCD7CE', color: '#000000' }
    },
    new: {
      light: { background: '#22C55E', color: '#FFFFFF' },
      dark: { background: '#16A34A', color: '#FFFFFF' }
    },
    bestseller: {
      light: { background: '#F59E0B', color: '#FFFFFF' },
      dark: { background: '#D97706', color: '#FFFFFF' }
    },
    limited: {
      light: { background: '#DC2626', color: '#FFFFFF' },
      dark: { background: '#B91C1C', color: '#FFFFFF' }
    }
  };
  
  return badgeStyles[badgeType][theme];
};