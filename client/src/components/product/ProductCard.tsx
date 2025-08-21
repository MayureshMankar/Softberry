import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { Heart, Eye, Star } from "lucide-react";
import type { ProductWithDetails } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithDetails;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id, quantity: 1 });
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
    <Card 
      className={cn(
        "card-hover bg-white rounded-2xl shadow-xl group overflow-hidden border-0",
        className
      )}
      data-testid={`product-card-${product.id}`}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="relative h-64 bg-gradient-to-br from-warm-gray/20 to-champagne/20 overflow-hidden">
            {product.imageUrl && (
              <>
                {!isImageLoaded && (
                  <div className="absolute inset-0 bg-warm-gray/10 animate-pulse" />
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setIsImageLoaded(true)}
                  loading="lazy"
                />
              </>
            )}
            
            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-champagne transition-colors duration-300 group"
              onClick={handleWishlistClick}
              data-testid={`wishlist-button-${product.id}`}
            >
              <Heart className="h-4 w-4 text-warm-gray group-hover:text-luxury-black transition-colors duration-300" />
            </Button>

            {/* Badge */}
            {badge && (
              <Badge className={cn("absolute bottom-4 left-4 text-xs font-bold", badge.className)}>
                {badge.text}
              </Badge>
            )}
          </div>

          <CardContent className="p-6">
            <div className="space-y-3">
              {/* Brand and Product Name */}
              <div>
                {product.brand && (
                  <p className="text-champagne text-sm font-medium">{product.brand.name}</p>
                )}
                <h3 className="font-serif text-xl font-bold text-luxury-black line-clamp-2">
                  {product.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex text-champagne text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.floor(parseFloat(product.averageRating || "0"))
                          ? "fill-current"
                          : ""
                      )}
                    />
                  ))}
                </div>
                <span className="text-warm-gray text-sm ml-2">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price and Volume */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-burgundy">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                    <span className="text-warm-gray line-through ml-2">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.volume && (
                  <div className="text-champagne text-sm font-medium">
                    {product.volume}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black transition-all duration-300 font-medium"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  data-testid={`add-to-cart-button-${product.id}`}
                >
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-luxury-black hover:bg-luxury-black hover:text-cream transition-colors duration-300"
                  onClick={handleQuickView}
                  data-testid={`quick-view-button-${product.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
