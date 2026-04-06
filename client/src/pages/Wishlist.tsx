import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

export default function Wishlist() {
  const { colors } = useTheme();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]); // In a real app, this would come from a context or API

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    toast({
      title: "Removed from wishlist",
      description: "Product has been removed from your wishlist",
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Mock wishlist items - in a real app, these would come from an API
  const mockWishlistItems = [
    {
      id: "1",
      name: "Royal Oud",
      price: 299,
      originalPrice: 399,
      image: "/placeholder-perfume-1.jpg",
      brand: "Soft Berry",
      category: "Oud",
    },
    {
      id: "2",
      name: "Midnight Rose",
      price: 199,
      originalPrice: 249,
      image: "/placeholder-perfume-2.jpg",
      brand: "Soft Berry",
      category: "Floral",
    },
    {
      id: "3",
      name: "Ocean Breeze",
      price: 179,
      originalPrice: 219,
      image: "/placeholder-perfume-3.jpg",
      brand: "Soft Berry",
      category: "Fresh",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold" style={{ color: colors.text.primary }}>
            Your Wishlist
          </h1>
          <p className="text-lg" style={{ color: colors.text.tertiary }}>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 mb-4" style={{ color: colors.text.tertiary }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Your wishlist is empty
            </h2>
            <p className="text-lg mb-6" style={{ color: colors.text.tertiary }}>
              Start adding products you love to your wishlist
            </p>
            <Button asChild style={{ backgroundColor: colors.accent, color: colors.background }}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWishlistItems.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden group"
                style={{ 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    style={{ backgroundColor: `${colors.background}CC` }}
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <X className="h-4 w-4" style={{ color: colors.text.primary }} />
                  </Button>
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.category}
                    </div>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: colors.text.primary }}>
                        {item.name}
                      </h3>
                      <p className="text-sm" style={{ color: colors.text.tertiary }}>
                        {item.brand}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg" style={{ color: colors.text.primary }}>
                      ₹{item.price}
                    </span>
                    <span className="text-sm line-through" style={{ color: colors.text.tertiary }}>
                      ₹{item.originalPrice}
                    </span>
                    <span className="text-sm font-medium" style={{ color: colors.accent }}>
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    style={{ backgroundColor: colors.accent, color: colors.background }}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
