import { useRoute, Link } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Shield, 
  Truck, 
  RotateCcw, 
  ChevronLeft,
  Plus,
  Minus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import homepage data
import { 
  homepageProducts,
  type HomepageProduct
} from "@/data/homepage-products";

// Convert homepage product to component expected format
const convertProduct = (product: HomepageProduct) => ({
  ...product,
  _id: { toString: () => product.id },
  brandId: undefined,
  categoryId: undefined,
  brand: { 
    name: product.brand, 
    _id: { toString: () => '1' }, 
    description: '', 
    slug: product.brand.toLowerCase().replace(/\s+/g, '-'), 
    createdAt: new Date() 
  },
  category: { 
    name: product.category, 
    _id: { toString: () => '1' }, 
    description: '', 
    slug: product.category.toLowerCase().replace(/\s+/g, '-'), 
    createdAt: new Date() 
  },
  createdAt: new Date(),
  updatedAt: new Date(),
} as any);

// Convert database product to component expected format
const convertDatabaseProduct = (product: any) => ({
  ...product,
  id: product._id?.toString() || product.id,
  _id: { toString: () => product._id?.toString() || product.id },
  brand: product.brand || { 
    name: product.brand, 
    _id: { toString: () => '1' }, 
    description: '', 
    slug: (product.brand || '').toLowerCase().replace(/\s+/g, '-'), 
    createdAt: new Date() 
  },
  category: product.category || { 
    name: product.category, 
    _id: { toString: () => '1' }, 
    description: '', 
    slug: (product.category || '').toLowerCase().replace(/\s+/g, '-'), 
    createdAt: new Date() 
  },
  createdAt: product.createdAt || new Date(),
  updatedAt: product.updatedAt || new Date(),
} as any);

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  // Fetch product from API
  const { data: apiProduct, isLoading: isApiLoading, error: apiError } = useQuery({
    queryKey: ["product", params?.slug],
    queryFn: async () => {
      if (!params?.slug) return null;
      const response = await fetch(`/api/products/slug/${params.slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch product");
      }
      return response.json();
    },
    enabled: !!params?.slug,
  });

  // Find product by slug - first check API, then fallback to static data
  const product = useMemo(() => {
    if (!params?.slug) return null;
    
    // If we have API data, use it
    if (apiProduct !== undefined) {
      return apiProduct ? convertDatabaseProduct(apiProduct) : null;
    }
    
    // If there was an API error (like 404), fallback to static data
    if (apiError) {
      const foundProduct = homepageProducts.find(p => p.slug === params.slug);
      return foundProduct ? convertProduct(foundProduct) : null;
    }
    
    // While API is loading, we don't show anything yet
    return null;
  }, [params?.slug, apiProduct, apiError]);

  // Find related products from the same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    
    // For API products, use API to get related products
    if (apiProduct) {
      // We'll implement this later if needed
      return [];
    }
    
    // For static products, use static data
    const related = homepageProducts
      .filter(p => p.category === product.category.name && p.id !== product.id && p.isActive)
      .slice(0, 4)
      .map(convertProduct);
    return related;
  }, [product, apiProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }
    
    // Always send the product slug for homepage products
    // The backend will handle the conversion from slug to real product ID
    addToCart({ productId: product.slug, quantity });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return;
    }

    toast({
      title: "Added to Wishlist",
      description: "This feature will be available soon",
    });
  };

  const formatPrice = (price: string | number) => {
    return `₹${parseFloat(price.toString()).toLocaleString()}`;
  };

  const getBadgeInfo = () => {
    if (!product) return null;
    
    if (product.isNewArrival) {
      return { text: "NEW ARRIVAL", isSpecial: true };
    }
    if (product.isBestSeller) {
      return { text: "BESTSELLER", isSpecial: true };
    }
    if (product.isLimitedEdition) {
      return { text: "LIMITED EDITION", isSpecial: true };
    }
    if (product.isFeatured) {
      return { text: "EXCLUSIVE", isSpecial: false };
    }
    return null;
  };

  const badge = getBadgeInfo();
  const productImages = [product?.imageUrl].filter(Boolean);

  if (isApiLoading) {
    return (
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 
            className="font-serif text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Loading Product...
          </h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 
            className="font-serif text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Product Not Found
          </h1>
          <p 
            className="mb-8"
            style={{ color: colors.text.secondary }}
          >
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            asChild 
            className="transition-all duration-300"
            style={{
              backgroundColor: colors.accent,
              color: colors.background
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.accentHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent;
            }}
          >
            <Link href="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Breadcrumb */}
      <div style={{ backgroundColor: colors.surface, padding: '1rem 0' }}>
        <div className="container mx-auto px-4">
          <nav 
            className="flex items-center space-x-2 text-sm"
            style={{ color: colors.text.secondary }}
          >
            <Link 
              href="/" 
              className="transition-colors duration-200 hover:underline"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.secondary;
              }}
            >
              Home
            </Link>
            <span>›</span>
            <Link 
              href="/products" 
              className="transition-colors duration-200 hover:underline"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.secondary;
              }}
            >
              Products
            </Link>
            <span>›</span>
            {product.category && (
              <>
                <Link 
                  href={`/products?category=${product.category.slug}`} 
                  className="transition-colors duration-200 hover:underline"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                >
                  {product.category.name}
                </Link>
                <span>›</span>
              </>
            )}
            <span 
              className="font-medium"
              style={{ color: colors.text.primary }}
            >
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Three Column Layout - Adjusted proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-5 w-full">
            <div className="md:sticky top-4 space-y-4">
              {/* Main Product Image */}
              <div 
                className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: colors.surface, aspectRatio: '1/1' }}
              >
                {productImages.length > 0 && (
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
                {badge && (
                  <Badge 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full font-bold text-xs"
                    style={{ 
                      backgroundColor: badge.isSpecial ? colors.accent : colors.surfaceSecondary,
                      color: badge.isSpecial ? colors.background : colors.text.primary,
                      border: `1px solid ${badge.isSpecial ? colors.accent : colors.border}`
                    }}
                  >
                    {badge.text}
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      className={`aspect-square rounded-lg overflow-hidden border-2`}
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: selectedImage === index ? colors.accent : `${colors.border}33`,
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Middle Column - Product Details (reduced Product Features size) */}
          <div className="lg:col-span-4 w-full">
            <div className="space-y-6 h-full flex flex-col">
              {/* Brand and product title */}
              <div>
                {product.brand && (
                  <p className="text-lg font-bold tracking-widest uppercase mb-1" style={{ color: colors.accent }}>{product.brand.name}</p>
                )}
                <h1 className="font-serif text-3xl font-bold leading-tight" style={{ color: colors.text.primary }}>{product.name}</h1>
              </div>
              
              {/* Rating and review information */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="flex" style={{ color: colors.accent }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(parseFloat((product.averageRating || "0").toString()))
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-base font-bold" style={{ color: colors.text.primary }}>
                    {product.averageRating || "0.0"}
                  </span>
                </div>
                <span className="text-base" style={{ color: colors.text.secondary }}>
                  ({product.reviewCount || 0} reviews)
                </span>
                {product.volume && (
                  <Badge 
                    className="px-3 py-1 rounded-full text-base"
                    style={{ 
                      backgroundColor: colors.surface,
                      color: colors.text.primary,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {product.volume}
                  </Badge>
                )}
              </div>
              
              {/* Pricing display */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-serif" style={{ color: colors.text.primary }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && parseFloat(product.originalPrice.toString()) > parseFloat(product.price.toString()) && (
                    <span className="text-xl line-through" style={{ color: colors.text.secondary }}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Short description */}
              {product.shortDescription && (
                <p className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
                  {product.shortDescription}
                </p>
              )}
              
              {/* Quantity selector and action buttons - push to bottom */}
              <div className="flex flex-wrap items-center gap-3 pt-2 mt-auto">
                <div className="flex items-center gap-2">
                  <label className="text-base font-medium" style={{ color: colors.text.primary }}>Qty:</label>
                  <div className="flex items-center border rounded-full" style={{ borderColor: `${colors.border}4d` }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      style={{ 
                        color: colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.text.secondary}1a`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 min-w-[2rem] text-center font-bold text-base" style={{ color: colors.text.primary }}>
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      style={{ 
                        color: colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.text.secondary}1a`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="font-bold py-2 px-4 rounded-full text-base"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.background
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accentHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                    }}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="py-2 px-4 rounded-full text-base"
                    style={{
                      borderColor: colors.border,
                      color: colors.text.primary,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                      e.currentTarget.style.color = colors.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.text.primary;
                    }}
                    onClick={handleWishlist}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Product Features - Reduced size */}
              <div className="p-3 rounded-xl" style={{ backgroundColor: colors.surface }}>
                <h3 className="font-bold mb-2 text-sm" style={{ color: colors.text.primary }}>Product Features</h3>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <Shield className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
                    <p className="text-xs font-bold" style={{ color: colors.text.primary }}>Authentic</p>
                  </div>
                  <div className="text-center p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <Truck className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
                    <p className="text-xs font-bold" style={{ color: colors.text.primary }}>Free Shipping</p>
                  </div>
                  <div className="text-center p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <RotateCcw className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
                    <p className="text-xs font-bold" style={{ color: colors.text.primary }}>Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Additional Information (increased to 3/12) */}
          <div className="lg:col-span-3 w-full mt-6 lg:mt-0">
            <div className="space-y-6 min-w-0 h-full flex flex-col">
              {/* Tab Navigation */}
              <div className="flex gap-4 border-b" style={{ borderColor: `${colors.border}33` }}>
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-2 text-base font-bold relative`}
                  style={{
                    color: activeTab === "description" ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  Description
                  {activeTab === "description" && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`pb-2 text-base font-bold relative`}
                  style={{
                    color: activeTab === "notes" ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  Key Ingredients
                  {activeTab === "notes" && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 text-base font-bold relative`}
                  style={{
                    color: activeTab === "details" ? colors.text.primary : colors.text.secondary,
                  }}
                >
                  Details
                  {activeTab === "details" && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />
                  )}
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="p-4 rounded-2xl flex-grow flex flex-col" style={{ backgroundColor: colors.surface }}>
                {activeTab === "description" && (
                  <div className="flex-grow">
                    <h3 className="font-bold mb-3 text-base" style={{ color: colors.text.primary }}>Product Description</h3>
                    <p className="text-base leading-relaxed" style={{ color: colors.text.secondary }}>
                      {product.description || "No detailed description available for this product."}
                    </p>
                  </div>
                )}
            
                {activeTab === "notes" && (
                  <div className="flex-grow">
                    <h3 className="font-bold mb-3 text-base" style={{ color: colors.text.primary }}>Key Ingredients</h3>
                    <div className="space-y-3">
                      {product.topNotes && product.topNotes.length > 0 && (
                        <div>
                          <p className="text-sm font-bold mb-2" style={{ color: colors.text.primary }}>Key Ingredients</p>
                          <div className="flex flex-wrap gap-1">
                            {product.topNotes.map((note: string, index: number) => (
                              <Badge 
                                key={index} 
                                className="px-2 py-1 rounded-full text-sm"
                                style={{ 
                                  backgroundColor: colors.background,
                                  color: colors.text.primary,
                                  border: `1px solid ${colors.border}`
                                }}
                              >
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {product.middleNotes && product.middleNotes.length > 0 && (
                        <div>
                          <p className="text-sm font-bold mb-2" style={{ color: colors.text.primary }}>Skin Benefits</p>
                          <div className="flex flex-wrap gap-1">
                            {product.middleNotes.map((note: string, index: number) => (
                              <Badge 
                                key={index} 
                                className="px-2 py-1 rounded-full text-sm"
                                style={{ 
                                  backgroundColor: colors.background,
                                  color: colors.text.primary,
                                  border: `1px solid ${colors.border}`
                                }}
                              >
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {product.baseNotes && product.baseNotes.length > 0 && (
                        <div>
                          <p className="text-sm font-bold mb-2" style={{ color: colors.text.primary }}>Free From</p>
                          <div className="flex flex-wrap gap-1">
                            {product.baseNotes.map((note: string, index: number) => (
                              <Badge 
                                key={index} 
                                className="px-2 py-1 rounded-full text-sm"
                                style={{ 
                                  backgroundColor: colors.background,
                                  color: colors.text.primary,
                                  border: `1px solid ${colors.border}`
                                }}
                              >
                                {note}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Adding a fallback content if no notes are available */}
                      {(!product.topNotes || product.topNotes.length === 0) && 
                       (!product.middleNotes || product.middleNotes.length === 0) && 
                       (!product.baseNotes || product.baseNotes.length === 0) && (
                        <p className="text-base" style={{ color: colors.text.secondary }}>
                          No ingredient details available for this product.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === "details" && (
                  <div className="flex-grow">
                    <h3 className="font-bold mb-3 text-base" style={{ color: colors.text.primary }}>Product Details</h3>
                    <div className="space-y-2 text-base">
                      {product.fragranceFamily && (
                        <div className="flex justify-between pb-1" style={{ borderBottom: `1px solid ${colors.border}33` }}>
                          <span style={{ color: colors.text.secondary }}>Category:</span>
                          <span className="font-bold" style={{ color: colors.text.primary }}>{product.fragranceFamily}</span>
                        </div>
                      )}
                      {product.gender && (
                        <div className="flex justify-between pb-1" style={{ borderBottom: `1px solid ${colors.border}33` }}>
                          <span style={{ color: colors.text.secondary }}>Gender:</span>
                          <span className="font-bold" style={{ color: colors.text.primary }}>{product.gender}</span>
                        </div>
                      )}
                      {product.volume && (
                        <div className="flex justify-between pb-1" style={{ borderBottom: `1px solid ${colors.border}33` }}>
                          <span style={{ color: colors.text.secondary }}>Volume:</span>
                          <span className="font-bold" style={{ color: colors.text.primary }}>{product.volume}</span>
                        </div>
                      )}
                      {product.longevity && (
                        <div className="flex justify-between pb-1" style={{ borderBottom: `1px solid ${colors.border}33` }}>
                          <span style={{ color: colors.text.secondary }}>Longevity:</span>
                          <span className="font-bold" style={{ color: colors.text.primary }}>{product.longevity}</span>
                        </div>
                      )}
                      {product.sillage && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.text.secondary }}>Sillage:</span>
                          <span className="font-bold" style={{ color: colors.text.primary }}>{product.sillage}</span>
                        </div>
                      )}
                      {/* Adding a fallback content if no details are available */}
                      {!product.fragranceFamily && !product.gender && !product.volume && !product.longevity && !product.sillage && (
                        <p className="text-base" style={{ color: colors.text.secondary }}>
                          No additional details available for this product.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-6">
              <h2 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>You Might Also Like</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="related-products">
              {relatedProducts.map((relatedProduct: any) => (
                <div key={relatedProduct.id} className="scale-90">
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}
