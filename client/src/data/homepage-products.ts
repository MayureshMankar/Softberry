// Homepage Products Data File
// This file contains all the products displayed on the homepage
// You can easily edit product information, add new products, and manage images here

export interface HomepageProduct {
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
  volume: string;
  fragranceFamily: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  longevity: string;
  sillage: string;
  gender: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  stockQuantity: number;
  reviewCount: number;
  averageRating: number;
  // Theme-aware styling
  themeStyles?: ThemeStyles;
}

export interface HomepageCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  // Theme-aware styling
  themeStyles?: ThemeStyles;
}

export interface HomepageBrand {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  // Theme-aware styling
  themeStyles?: ThemeStyles;
}
// Theme-aware styling interfaces
export interface ThemeStyles {
  light: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    accentColor?: string;
    hoverColor?: string;
    shadowColor?: string;
  };
  dark: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    accentColor?: string;
    hoverColor?: string;
    shadowColor?: string;
  };
}

// Default theme styles for products and categories
export const defaultThemeStyles: ThemeStyles = {
  light: {
    backgroundColor: '#FFFFFF',
    textColor: '#2C2C2C',
    borderColor: '#E8E3DA',
    accentColor: '#8B7355',
    hoverColor: '#6B5A45',
    shadowColor: 'rgba(139, 115, 85, 0.1)'
  },
  dark: {
    backgroundColor: '#000000',
    textColor: '#FAF9F6',
    borderColor: '#DCD7CE',
    accentColor: '#DCD7CE',
    hoverColor: '#ACA69A',
    shadowColor: 'rgba(220, 215, 206, 0.1)'
  }
};

// Special theme styles for featured products
export const featuredProductThemeStyles: ThemeStyles = {
  light: {
    backgroundColor: '#F8F7F4',
    textColor: '#2C2C2C',
    borderColor: '#8B7355',
    accentColor: '#8B7355',
    hoverColor: '#6B5A45',
    shadowColor: 'rgba(139, 115, 85, 0.15)'
  },
  dark: {
    backgroundColor: '#111111',
    textColor: '#FAF9F6',
    borderColor: '#DCD7CE',
    accentColor: '#DCD7CE',
    hoverColor: '#ACA69A',
    shadowColor: 'rgba(220, 215, 206, 0.15)'
  }
};

// Special theme styles for limited edition products
export const limitedEditionThemeStyles: ThemeStyles = {
  light: {
    backgroundColor: '#FFF8F0',
    textColor: '#2C2C2C',
    borderColor: '#D4A574',
    accentColor: '#D4A574',
    hoverColor: '#B8935E',
    shadowColor: 'rgba(212, 165, 116, 0.2)'
  },
  dark: {
    backgroundColor: '#1A1611',
    textColor: '#FAF9F6',
    borderColor: '#F4E4C1',
    accentColor: '#F4E4C1',
    hoverColor: '#E6D3A3',
    shadowColor: 'rgba(244, 228, 193, 0.2)'
  }
};

// ===== HOMEPAGE PRODUCTS =====
// Edit these products to change what appears on the homepage
export const homepageProducts: HomepageProduct[] = [
  {
    id: "68c8307af3d8d1e801ffa7ce",
    name: "Radiant Glow Foundation",
    description: "A lightweight, buildable foundation that provides flawless coverage while nourishing your skin with hyaluronic acid and vitamin E. This long-lasting formula blends seamlessly for a natural, radiant finish that lasts all day.",
    shortDescription: "Flawless coverage with hyaluronic acid and vitamin E",
    price: 2499,
    originalPrice: 2999,
    imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=400&h=400",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "radiant-glow-foundation",
    volume: "30ml",
    fragranceFamily: "Makeup",
    topNotes: [
    "Hyaluronic Acid",
    "Vitamin E",
    "SPF 15"
  ],
    middleNotes: [
    "Buildable Coverage",
    "Natural Finish",
    "Oil-Free"
  ],
    baseNotes: [
    "Paraben-Free",
    "Non-Comedogenic",
    "Dermatologist Tested"
  ],
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
    averageRating: 4.7
  },
  {
    id: "68c87f35e05b92bca485de3e",
    name: "Velvet Matte Lipstick",
    description: "An ultra-pigmented matte lipstick that delivers rich, vibrant color in one swipe. Infused with shea butter and jojoba oil for comfortable wear that doesn't dry out your lips. Available in 12 universally flattering shades.",
    shortDescription: "Ultra-pigmented matte lipstick with shea butter",
    price: 899,
    originalPrice: 1199,
    imageUrl: "https://images.unsplash.com/photo-1585238342028-78d387f4a707?auto=format&fit=crop&w=400&h=400",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "velvet-matte-lipstick",
    volume: "3.5g",
    fragranceFamily: "Makeup",
    topNotes: [
    "Shea Butter",
    "Jojoba Oil",
    "Vitamin E"
  ],
    middleNotes: [
    "High Pigment",
    "Matte Finish",
    "Long-Lasting"
  ],
    baseNotes: [
    "Cruelty-Free",
    "Vegan",
    "Gluten-Free"
  ],
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
    averageRating: 4.8
  },
  {
    id: "68cb2a100e58e7f7635b3863",
    name: "Hydrating Face Serum",
    description: "A powerful hydrating serum packed with 10% hyaluronic acid, niacinamide, and peptides to plump, brighten, and rejuvenate your skin. Lightweight formula absorbs quickly and works beautifully under makeup.",
    shortDescription: "10% hyaluronic acid serum for deep hydration",
    price: 1699,
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a41552231658?auto=format&fit=crop&w=400&h=400",
    brand: "Soft Berry",
    category: "Skincare",
    slug: "hydrating-face-serum",
    volume: "30ml",
    fragranceFamily: "Skincare",
    topNotes: [
    "10% Hyaluronic Acid",
    "Niacinamide",
    "Peptides"
  ],
    middleNotes: [
    "Deep Hydration",
    "Skin Plumping",
    "Brightening"
  ],
    baseNotes: [
    "Fragrance-Free",
    "Paraben-Free",
    "Suitable for All Skin Types"
  ],
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
    averageRating: 4.6
  },
  {
    id: "68cb2a100e58e7f7635b3864",
    name: "Volumizing Mascara",
    description: "A clump-free volumizing mascara that lifts, lengthens, and defines your lashes for a dramatic yet natural look. The precision brush coats every lash from root to tip for maximum impact.",
    shortDescription: "Clump-free mascara for dramatic volume and length",
    price: 799,
    originalPrice: 999,
    imageUrl: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=400&h=400",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "volumizing-mascara",
    volume: "8ml",
    fragranceFamily: "Makeup",
    topNotes: [
    "Protein-Enriched",
    "Vitamin B5",
    "Panthenol"
  ],
    middleNotes: [
    "Volumizing",
    "Lengthening",
    "Smudge-Proof"
  ],
    baseNotes: [
    "Ophthalmologist Tested",
    "Contact Lens Safe",
    "Easy Removal"
  ],
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
    averageRating: 4.7
  },
  {
    id: "68cb2a100e58e7f7635b3865",
    name: "Glow Highlighter Palette",
    description: "A luxurious 4-pan highlighter palette with buildable, light-reflecting powders that give you the perfect glow. From subtle daytime shimmer to intense evening glam, these silky formulas blend effortlessly.",
    shortDescription: "4-pan highlighter palette for customizable glow",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&h=400",
    brand: "Soft Berry",
    category: "Makeup",
    slug: "glow-highlighter-palette",
    volume: "12g",
    fragranceFamily: "Makeup",
    topNotes: [
    "Light-Reflecting Pearls",
    "Silica",
    "Mica"
  ],
    middleNotes: [
    "Buildable Coverage",
    "Buttery Texture",
    "Blendable"
  ],
    baseNotes: [
    "Talc-Free",
    "Cruelty-Free",
    "Dermatologist Tested"
  ],
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
    averageRating: 4.8
  },
  {
    id: "68cb2a100e58e7f7635b3866",
    name: "Nourishing Night Cream",
    description: "A rich, restorative night cream that works while you sleep to repair, hydrate, and rejuvenate your skin. Formulated with retinol, peptides, and ceramides for visibly younger-looking skin by morning.",
    shortDescription: "Restorative night cream with retinol and peptides",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4ee3313?auto=format&fit=crop&w=400&h=400",
    brand: "Glow Naturals",
    category: "Skincare",
    slug: "nourishing-night-cream",
    volume: "50ml",
    fragranceFamily: "Skincare",
    topNotes: [
    "Retinol",
    "Peptides",
    "Ceramides"
  ],
    middleNotes: [
    "Deep Hydration",
    "Skin Repair",
    "Anti-Aging"
  ],
    baseNotes: [
    "Fragrance-Free",
    "Paraben-Free",
    "Non-Comedogenic"
  ],
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
    averageRating: 4.5
  },
  {
    id: "69d3a1f238051bb17db999ac",
    name: "Shea Butter Moisturizer",
    description: "Formulated for deep hydration, Softberry Shea Butter Moisturizer nourishes and softens dry skin. This paraben-free formula absorbs easily, leaving your skin feeling smooth and revitalized without a greasy residue.",
    shortDescription: "A deep-nourishing moisturizer enriched with shea butter to soften and hydrate dry skin.",
    price: 499,
    originalPrice: 600,
    imageUrl: "/uploads/image-1775477294764-820975036.png",
    brand: "Unknown Brand",
    category: "Unknown Category",
    slug: "softberry-shea-butter-moisturizer",
    volume: "200 ml",
    fragranceFamily: "Cream / Lotion",
    topNotes: [
    "Shea Butter (Beurre de karité)",
    "Corn Oil",
    "Glycerin"
  ],
    middleNotes: [
    "Nourishes deeply",
    "Softens dry skin",
    "Paraben-free",
    "Hydrating"
  ],
    baseNotes: [
    "Paraben-Free",
    "Cruelty-Free",
    "Dermatologically Tested"
  ],
    longevity: "Up to 24 hours",
    sillage: "Rich / High Intensity",
    gender: "Unisex",
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: true,
    stockQuantity: 5,
    reviewCount: 0,
    averageRating: 0
  },
  {
    id: "69d3a9bc38051bb17db999be",
    name: "Coffee Face and Body Scrub",
    description: "Revitalize your skin with Softberry Coffee Face and Body Scrub. Formulated with real coffee powder (Poudre de café), this paraben-free exfoliator is rich in antioxidants. It works to gently remove dead skin cells, reduce the appearance of dullness (teint terne), and leave both face and body feeling refreshed and smooth",
    shortDescription: "An antioxidant-rich exfoliating scrub that reduces dullness for a brighter complexion",
    price: 500,
    originalPrice: 596,
    imageUrl: "/uploads/image-1775479225452-169117213.png",
    brand: "Unknown Brand",
    category: "Unknown Category",
    slug: "softberry-coffee-face-and-body-scrub",
    volume: "200 gm",
    fragranceFamily: "Scrub / Exfoliator",
    topNotes: [
    "Coffee Powder (Poudre de café)",
    "Glycerin",
    "Walnut Shell (assumed for exfoliation)",
    "Caffeine"
  ],
    middleNotes: [
    "Rich in antioxidants",
    "Reduces dullness",
    "Gently exfoliates",
    "Paraben-free",
    "Smoothens skin"
  ],
    baseNotes: [
    "Paraben-Free",
    "Cruelty-Free",
    "Dermatologically Tested"
  ],
    longevity: "Rinse-off product (Immediate effect)",
    sillage: "Moderate / Effective Exfoliation",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    stockQuantity: 5,
    reviewCount: 0,
    averageRating: 0
  },
  {
    id: "69d3ab5638051bb17db999ca",
    name: "Rose Honey Milk Moisturizer",
    description: "Experience natural radiance with Softberry Rose Honey Milk Moisturizer. Enriched with Rose Water (Eau de rose) to tone and refresh, Honey (Miel) to lock in moisture, and Milk Proteins (Protéines de lait) to deeply nourish and soften. This paraben-free formula provides a soothing hydration experience for a smooth, healthy glow.",
    shortDescription: "A hydrating blend of rose, honey, and milk proteins to tone and nourish the skin naturally.",
    price: 500,
    originalPrice: 599,
    imageUrl: "/uploads/image-1775481642363-740590904.png",
    brand: "Unknown Brand",
    category: "Unknown Category",
    slug: "softberry-rose-honey-milk-moisturizer",
    volume: "200 gm",
    fragranceFamily: "Cream / Moisturizer",
    topNotes: [
    "Rose Water (Eau de rose)",
    "Honey (Miel)",
    "Milk Proteins (Protéines de lait)",
    "Glycerin",
    "Aqua"
  ],
    middleNotes: [
    "Tones and refreshes naturally",
    "Hydrates and retains moisture",
    "Nourishes and softens skin",
    "Paraben-free",
    "Soothing floral scent"
  ],
    baseNotes: [
    "Paraben-Free",
    "Natural Extracts",
    "Dermatologically Tested"
  ],
    longevity: "Up to 12-24 hours hydration",
    sillage: "Lightweight / Daily Hydration",
    gender: "Unisex",
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 8,
    reviewCount: 0,
    averageRating: 0
  },
  {
    id: "69d3ac4438051bb17db999ce",
    name: "Red Wine Face and Body Scrub",
    description: "Indulge in the rejuvenating power of Softberry Red Wine Face and Body Scrub. Enriched with Red Grape Extract (Extrait de raisin rouge), this scrub is naturally rich in antioxidants that help fight skin dullness and signs of aging. The formula is free from parabens and sulfates, providing a gentle yet effective exfoliation for a smooth, radiant complexion",
    shortDescription: "An antioxidant-rich exfoliating scrub enriched with red grape extract to revitalize and glow",
    price: 500,
    originalPrice: 597,
    imageUrl: "/uploads/image-1775481344581-235406894.png",
    brand: "Unknown Brand",
    category: "Unknown Category",
    slug: "softberry-red-wine-face-and-body-scrub",
    volume: "200 gm",
    fragranceFamily: "Scrub / Exfoliator",
    topNotes: [
    "Red Grape Extract (Extrait de raisin rouge)",
    "Antioxidants",
    "Glycerin",
    "Walnut Shell Granules"
  ],
    middleNotes: [
    "Enriched with red grape extract",
    "Rich in antioxidants",
    "Sans parabènes (Paraben-free)",
    "Sans sulfates (Sulfate-free)",
    "Revitalizes skin"
  ],
    baseNotes: [
    "Paraben-Free",
    "Sulfate-Free",
    "Cruelty-Free"
  ],
    longevity: "Rinse-off product",
    sillage: "Moderate Exfoliation",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 5,
    reviewCount: 0,
    averageRating: 0
  },
  {
    id: "69d3ad5d38051bb17db999d2",
    name: "Strawberry Face Wash",
    description: "Refresh your daily routine with Softberry Strawberry Face Wash. Infused with Strawberry Extract (Extrait de fraise), this gentle cleanser provides a revitalizing freshness and helps achieve a natural glow (éclat naturel). Designed to clean without stripping moisture, it leaves your skin feeling vibrant and smooth",
    shortDescription: "A revitalizing face wash with strawberry extract for a natural glow and long-lasting freshness",
    price: 500,
    originalPrice: 598,
    imageUrl: "/uploads/image-1775481080154-323262904.png",
    brand: "Unknown Brand",
    category: "Unknown Category",
    slug: "softberry-strawberry-face-wash",
    volume: "200 ml",
    fragranceFamily: "Face Wash / Cleanser",
    topNotes: [
    "Strawberry Extract (Extrait de fraise)",
    "Glycerin",
    "Aqua",
    "Vitamin C"
  ],
    middleNotes: [
    "Natural glow (éclat naturel)",
    "Revitalizing freshness",
    "Gently cleanses",
    "Paraben-free (Sans parabènes)",
    "Antioxidant-rich"
  ],
    baseNotes: [
    "Paraben-Free",
    "Cruelty-Free",
    "Dermatologically Tested"
  ],
    longevity: "Daily use (Morning & Evening)",
    sillage: "Gentle / Deep Cleansing",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 5,
    reviewCount: 0,
    averageRating: 0
  },
  {
    id: "69d3adf438051bb17db999d5",
    name: "Orange Face Wash",
    description: "Brighten your skin naturally with Softberry Orange Face Wash. Infused with orange powder (poudre d'orange), this cleanser provides a natural citrus glow (éclat d'agrumes naturel) while deeply cleaning impurities. Its refreshing formula helps revitalize tired skin, leaving it feeling fresh and energized.",
    shortDescription: "A brightening face wash infused with orange powder for a natural citrus glow",
    price: 500,
    originalPrice: 595,
    imageUrl: "/uploads/image-1775480305334-264044693.png",
    brand: "Unknown Brand",
    category: "Unknown Category",
    slug: "softberry-orange-face-wash",
    volume: "200 ml",
    fragranceFamily: "Face Wash / Cleanser",
    topNotes: [
    "Orange Powder (Poudre d'orange)",
    "Vitamin C",
    "Glycerin",
    "Aqua"
  ],
    middleNotes: [
    "Natural citrus glow",
    "Deep cleansing",
    "Brightens skin tone",
    "Refreshing citrus scent",
    "Revitalizing"
  ],
    baseNotes: [
    "Paraben-Free",
    "Dermatologically Tested",
    "Natural Extracts"
  ],
    longevity: "Rinse-off (Daily use)",
    sillage: "Gentle / Brightening",
    gender: "Unisex",
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isLimitedEdition: false,
    stockQuantity: 3,
    reviewCount: 0,
    averageRating: 0
  }
];

// ===== HOMEPAGE CATEGORIES =====
export const homepageCategories: HomepageCategory[] = [
  {
    id: "1",
    name: "Makeup",
    description: "High-quality cosmetics for face, eyes, and lips to create stunning looks for every occasion",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    slug: "makeup",
    themeStyles: {
      light: {
        backgroundColor: '#FFF5F8',
        textColor: '#2C2C2C',
        borderColor: '#E8A8C8',
        accentColor: '#D896B7',
        hoverColor: '#C085A6',
        shadowColor: 'rgba(216, 150, 183, 0.15)'
      },
      dark: {
        backgroundColor: '#1A1117',
        textColor: '#FAF9F6',
        borderColor: '#F8BBD9',
        accentColor: '#F8BBD9',
        hoverColor: '#F48FB1',
        shadowColor: 'rgba(248, 187, 217, 0.15)'
      }
    }
  },
  {
    id: "2",
    name: "Skincare",
    description: "Nourishing and effective skincare products to hydrate, protect, and rejuvenate your skin",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0c62c17fbb0?w=400&h=300&fit=crop",
    slug: "skincare",
    themeStyles: {
      light: {
        backgroundColor: '#FFF8F0',
        textColor: '#2C2C2C',
        borderColor: '#D4A574',
        accentColor: '#C49A6A',
        hoverColor: '#B8935E',
        shadowColor: 'rgba(196, 154, 106, 0.15)'
      },
      dark: {
        backgroundColor: '#1A1611',
        textColor: '#FAF9F6',
        borderColor: '#F4E4C1',
        accentColor: '#F4E4C1',
        hoverColor: '#E6D3A3',
        shadowColor: 'rgba(244, 228, 193, 0.15)'
      }
    }
  },
  {
    id: "3",
    name: "Eye Products",
    description: "Specialized treatments and cosmetics for brighter, healthier-looking eyes and lashes",
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
    slug: "eye-products",
    themeStyles: {
      light: {
        backgroundColor: '#F0F8FF',
        textColor: '#2C2C2C',
        borderColor: '#7CB9E8',
        accentColor: '#6DADE3',
        hoverColor: '#5B9BD5',
        shadowColor: 'rgba(109, 173, 227, 0.15)'
      },
      dark: {
        backgroundColor: '#0A1419',
        textColor: '#FAF9F6',
        borderColor: '#B3E5FC',
        accentColor: '#B3E5FC',
        hoverColor: '#81D4FA',
        shadowColor: 'rgba(179, 229, 252, 0.15)'
      }
    }
  },
  {
    id: "4",
    name: "Lip Care",
    description: "Moisturizing and protective lip products for soft, smooth, and beautiful lips",
    imageUrl: "https://images.unsplash.com/photo-1585238342028-78d387f4a707?w=400&h=300&fit=crop",
    slug: "lip-care",
    themeStyles: {
      light: {
        backgroundColor: '#F8F5F0',
        textColor: '#2C2C2C',
        borderColor: '#8B6F47',
        accentColor: '#795A3A',
        hoverColor: '#6B4E33',
        shadowColor: 'rgba(121, 90, 58, 0.15)'
      },
      dark: {
        backgroundColor: '#1A1815',
        textColor: '#FAF9F6',
        borderColor: '#D4B896',
        accentColor: '#D4B896',
        hoverColor: '#C7A982',
        shadowColor: 'rgba(212, 184, 150, 0.15)'
      }
    }
  },
  {
    id: "5",
    name: "Body Care",
    description: "Nourishing body lotions, scrubs, and hand care essentials for complete self-care",
    imageUrl: "https://images.unsplash.com/photo-1557800634-7bf3c7305596?w=400&h=300&fit=crop",
    slug: "body-care",
    themeStyles: {
      light: {
        backgroundColor: '#FFFACD',
        textColor: '#2C2C2C',
        borderColor: '#FFD700',
        accentColor: '#F4C430',
        hoverColor: '#E6B800',
        shadowColor: 'rgba(244, 196, 48, 0.15)'
      },
      dark: {
        backgroundColor: '#1A1A0D',
        textColor: '#FAF9F6',
        borderColor: '#FFF176',
        accentColor: '#FFF176',
        hoverColor: '#FFEB3B',
        shadowColor: 'rgba(255, 241, 118, 0.15)'
      }
    }
  },
  {
    id: "6",
    name: "Sunscreen",
    description: "Broad-spectrum SPF for daily protection and healthy, radiant skin",
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
    slug: "sunscreen",
    themeStyles: {
      light: {
        backgroundColor: '#F5F2E8',
        textColor: '#2C2C2C',
        borderColor: '#A0834A',
        accentColor: '#8B7355',
        hoverColor: '#766244',
        shadowColor: 'rgba(139, 115, 85, 0.2)'
      },
      dark: {
        backgroundColor: '#1C1A16',
        textColor: '#FAF9F6',
        borderColor: '#DCD7CE',
        accentColor: '#DCD7CE',
        hoverColor: '#ACA69A',
        shadowColor: 'rgba(220, 215, 206, 0.2)'
      }
    }
  }
];

// ===== HELPER FUNCTIONS =====
// Use these functions to get specific product lists

export const getFeaturedProducts = (): HomepageProduct[] => {
  return homepageProducts.filter(product => product.isFeatured && product.isActive);
};

export const getNewArrivals = (): HomepageProduct[] => {
  return homepageProducts.filter(product => product.isNewArrival && product.isActive);
};

export const getBestSellers = (): HomepageProduct[] => {
  return homepageProducts.filter(product => product.isBestSeller && product.isActive);
};

export const getLimitedEditions = (): HomepageProduct[] => {
  return homepageProducts.filter(product => product.isLimitedEdition && product.isActive);
};

export const getProductsByCategory = (category: string): HomepageProduct[] => {
  return homepageProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase() && product.isActive
  );
};

export const getProductsByBrand = (brand: string): HomepageProduct[] => {
  return homepageProducts.filter(product => 
    product.brand.toLowerCase() === brand.toLowerCase() && product.isActive
  );
};

// Price formatting helper
export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString()}`;
};

// Product search helper
export const searchProducts = (query: string): HomepageProduct[] => {
  const lowercaseQuery = query.toLowerCase();
  return homepageProducts.filter(product =>
    product.isActive && (
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.fragranceFamily.toLowerCase().includes(lowercaseQuery)
    )
  );
};

// ===== THEME-AWARE HELPER FUNCTIONS =====

// Get theme-specific styles for a product
export const getProductThemeStyles = (product: HomepageProduct, theme: 'light' | 'dark') => {
  return product.themeStyles?.[theme] || defaultThemeStyles[theme];
};

// Get theme-specific styles for a category
export const getCategoryThemeStyles = (category: HomepageCategory, theme: 'light' | 'dark') => {
  return category.themeStyles?.[theme] || defaultThemeStyles[theme];
};

// Get products with theme-aware styling applied
export const getProductsWithThemeStyles = (products: HomepageProduct[], theme: 'light' | 'dark') => {
  return products.map(product => ({
    ...product,
    currentThemeStyles: getProductThemeStyles(product, theme)
  }));
};

// Get categories with theme-aware styling applied
export const getCategoriesWithThemeStyles = (categories: HomepageCategory[], theme: 'light' | 'dark') => {
  return categories.map(category => ({
    ...category,
    currentThemeStyles: getCategoryThemeStyles(category, theme)
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

// Theme-aware limited editions
export const getLimitedEditionsWithTheme = (theme: 'light' | 'dark') => {
  const limitedEditions = getLimitedEditions();
  return getProductsWithThemeStyles(limitedEditions, theme);
};

// Theme-aware categories
export const getCategoriesWithTheme = (theme: 'light' | 'dark') => {
  return getCategoriesWithThemeStyles(homepageCategories, theme);
};

// Generate theme-aware CSS properties object
export const getThemeAwareStyles = (themeStyles: any, theme: 'light' | 'dark') => {
  const styles = themeStyles?.[theme] || defaultThemeStyles[theme];
  return {
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    borderColor: styles.borderColor,
    '--accent-color': styles.accentColor,
    '--hover-color': styles.hoverColor,
    '--shadow-color': styles.shadowColor
  } as React.CSSProperties;
};

// Color utility functions for theme-aware components
export const getThemeColor = (colorKey: keyof ThemeStyles['light'], theme: 'light' | 'dark', customStyles?: ThemeStyles) => {
  const styles = customStyles?.[theme] || defaultThemeStyles[theme];
  return styles[colorKey];
};

// Generate box shadow based on theme
export const getThemeBoxShadow = (theme: 'light' | 'dark', intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const shadowColor = defaultThemeStyles[theme].shadowColor;
  const intensityMap = {
    light: '0 2px 8px',
    medium: '0 4px 16px',
    heavy: '0 8px 32px'
  };
  return `${intensityMap[intensity]} ${shadowColor}`;
};

// Generate gradient backgrounds based on theme
export const getThemeGradient = (theme: 'light' | 'dark', direction: string = 'to bottom right') => {
  const styles = defaultThemeStyles[theme];
  if (theme === 'light') {
    return `linear-gradient(${direction}, ${styles.backgroundColor}, ${styles.backgroundColor}F0, ${styles.accentColor}1A)`;
  } else {
    return `linear-gradient(${direction}, ${styles.backgroundColor}, ${styles.backgroundColor}F0, ${styles.accentColor}1A)`;
  }
};
