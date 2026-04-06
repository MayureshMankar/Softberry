import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/contexts/ThemeContext";
import { Heart, Eye, Star } from "lucide-react";
import type { ProductWithDetails } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: ProductWithDetails;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { colors } = useTheme(); // Use standard theme colors
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString()}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Send the product slug instead of simple ID for homepage products
    // The backend will handle the conversion from slug to real product ID
    addToCart({ productId: product.slug || product.id, quantity: 1 });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view functionality
  };

  const getBadgeInfo = () => {
    if (product.isNewArrival) {
      return { text: "NEW", className: "bg-champagne text-luxury-black" };
    }
    if (product.isBestSeller) {
      return { text: "BESTSELLER", className: "bg-burgundy text-cream" };
    }
    if (product.isLimitedEdition) {
      return { text: "LIMITED", className: "bg-rose-gold text-luxury-black" };
    }
    if (product.isFeatured) {
      return { text: "EXCLUSIVE", className: "bg-champagne text-luxury-black" };
    }
    return null;
  };

  const badge = getBadgeInfo();

  return (
    <div className={cn("group relative", className)}>
      {/* Premium Product Card */}
      <Card 
        className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.borderLight,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
        data-testid={`product-card-${product.id}`}
      >
        <Link href={`/product/${product.slug}`}>
          <div className="relative">
            {/* Premium Product Image */}
            <div 
              className="relative h-48 overflow-hidden rounded-t-xl"
              style={{ backgroundColor: colors.surface }}
            >
              {product.imageUrl && (
                <>
                  {/* Loading Skeleton */}
                  {!isImageLoaded && (
                    <div className="absolute inset-0 skeleton-luxury rounded-t-3xl" />
                  )}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={cn(
                      "w-full h-full object-cover group-hover:scale-110 transition-all duration-700",
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setIsImageLoaded(true)}
                    loading="lazy"
                  />
                </>  
              )}
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to top, ${colors.background}20, transparent)`
                }}
              />
              
              {/* Premium Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 w-8 h-8 rounded-lg group/btn transition-all duration-300"
                style={{
                  backgroundColor: `${colors.background}80`,
                  borderColor: `${colors.border}30`,
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                onClick={handleWishlistClick}
                data-testid={`wishlist-button-${product.id}`}
              >
                <Heart 
                  className="h-4 w-4 transition-all duration-300" 
                  style={{ color: colors.text.secondary }}
                />
              </Button>

              {/* Premium Badge */}
              {badge && (
                <div className="absolute top-3 left-3">
                  <Badge 
                    className="px-2 py-1 rounded-lg font-medium text-xs tracking-wide uppercase"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.background
                    }}
                  >
                    {badge.text}
                  </Badge>
                </div>
              )}
              
              {/* Quick View Button - Appears on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  variant="ghost"
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.background
                  }}
                  onClick={handleQuickView}
                  data-testid={`quick-view-button-${product.id}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </Button>
              </div>
            </div>

            {/* Premium Card Content */}
            <CardContent className="p-6 space-y-4">
              {/* Brand & Product Name */}
              <div className="space-y-2">
                {product.brand && (
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: colors.accent }}
                    />
                    <p 
                      className="text-sm font-medium tracking-wide uppercase"
                      style={{ color: colors.text.secondary }}
                    >
                      {product.brand.name}
                    </p>
                  </div>
                )}
                <h3 
                  className="font-serif text-xl font-bold line-clamp-2 leading-tight"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                </h3>
              </div>

              {/* Premium Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex" style={{ color: colors.accent }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3 transition-all duration-200",
                          i < Math.floor(Number(product.averageRating || 0))
                            ? "fill-current"
                            : "opacity-30"
                        )}
                        style={{ color: colors.accent }}
                      />
                    ))}
                  </div>
                  <span 
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    ({product.reviewCount})
                  </span>
                </div>
                {product.volume && (
                  <div 
                    className="px-2 py-1 rounded border"
                    style={{
                      backgroundColor: `${colors.accent}10`,
                      borderColor: `${colors.accent}20`
                    }}
                  >
                    <span 
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {product.volume}
                    </span>
                  </div>
                )}
              </div>

              {/* Premium Pricing */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span 
                    className="font-serif text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <span 
                      className="line-through text-lg opacity-60"
                      style={{ color: colors.text.secondary }}
                    >
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                  <div 
                    className="inline-flex items-center px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: `${colors.accent}10`,
                      color: colors.text.secondary
                    }}
                  >
                    Save {Math.round((1 - Number(product.price) / Number(product.originalPrice)) * 100)}%
                  </div>
                )}
              </div>

              {/* Premium Action Button */}
              <div className="pt-2">
                <Button
                  className="w-full font-semibold py-3 rounded-lg transition-all duration-300"
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
                  data-testid={`add-to-cart-button-${product.id}`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Adding to Cart...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
      

    </div>
  );
}
