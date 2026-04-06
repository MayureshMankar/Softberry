import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { X, Star, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

// Mock data for comparison - in a real app, this would come from context or API
const mockProducts = [
  {
    id: "1",
    name: "Hydrating Face Cream",
    brand: "Soft Berry",
    price: 1299,
    originalPrice: 1599,
    imageUrl: "https://images.unsplash.com/photo-1585238342028-78d387f4a707?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    volume: "50ml",
    gender: "Unisex",
    fragranceFamily: "Moisturizers",
    longevity: "24h hydration",
    sillage: "N/A",
    topNotes: ["Hyaluronic Acid", "Vitamin E"],
    middleNotes: ["Niacinamide", "Ceramides"],
    baseNotes: ["Paraben-Free", "Fragrance-Free"],
  },
  {
    id: "2",
    name: "Vitamin C Brightening Serum",
    brand: "Soft Berry",
    price: 1499,
    originalPrice: 1799,
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a41552231658?w=400&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    volume: "30ml",
    gender: "Unisex",
    fragranceFamily: "Serums",
    longevity: "Visible results in 2-4 weeks",
    sillage: "N/A",
    topNotes: ["Vitamin C (Ascorbic Acid)", "Ferulic Acid"],
    middleNotes: ["Hyaluronic Acid", "Peptides"],
    baseNotes: ["Silicone-Free", "Paraben-Free"],
  },
  {
    id: "3",
    name: "Satin Finish Lipstick",
    brand: "Soft Berry",
    price: 799,
    originalPrice: 999,
    imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 67,
    volume: "4.2g",
    gender: "Unisex",
    fragranceFamily: "Makeup",
    longevity: "4-6 hours",
    sillage: "N/A",
    topNotes: ["Shea Butter"],
    middleNotes: ["Jojoba Oil"],
    baseNotes: ["Cruelty-Free"],
  }
];

export default function CompareProducts() {
  const { colors } = useTheme();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [products] = useState(mockProducts);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // In a real app, you would pass the actual product ID
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const removeProduct = (productId: string) => {
    // In a real app, this would update the comparison context
    toast({
      title: "Product Removed",
      description: "Product removed from comparison.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: colors.text.primary }}>Compare Products</h1>
            <p style={{ color: colors.text.secondary }}>Compare up to 4 products side by side</p>
          </div>

          {products.length === 0 ? (
            <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>No products to compare</h3>
                <p className="mb-6" style={{ color: colors.text.secondary }}>Add products to compare their features and prices</p>
                <Button asChild style={{ backgroundColor: colors.accent, color: colors.background }}>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left align-top" style={{ backgroundColor: colors.surface, borderBottom: `2px solid ${colors.border}` }}>
                      <div className="min-w-[200px]">
                        <h3 className="font-serif text-lg font-bold mb-4" style={{ color: colors.text.primary }}>Product</h3>
                      </div>
                    </th>
                    {products.map((product) => (
                      <th 
                        key={product.id} 
                        className="p-4 text-center align-top relative"
                        style={{ backgroundColor: colors.surface, borderBottom: `2px solid ${colors.border}` }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 rounded-full"
                          style={{ backgroundColor: `${colors.background}CC` }}
                          onClick={() => removeProduct(product.id)}
                        >
                          <X className="h-4 w-4" style={{ color: colors.text.primary }} />
                        </Button>
                        <div className="min-w-[250px]">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-32 h-32 object-cover mx-auto rounded-lg mb-4"
                          />
                          <h4 className="font-bold text-lg mb-1" style={{ color: colors.text.primary }}>{product.name}</h4>
                          <p className="text-sm mb-2" style={{ color: colors.text.secondary }}>{product.brand}</p>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <div className="flex" style={{ color: colors.accent }}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating)
                                      ? "fill-current"
                                      : ""
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold" style={{ color: colors.text.primary }}>
                              {product.rating}
                            </span>
                            <span className="text-sm" style={{ color: colors.text.secondary }}>
                              ({product.reviewCount})
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="font-bold text-lg" style={{ color: colors.text.primary }}>
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm line-through" style={{ color: colors.text.secondary }}>
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Button
                            className="w-full"
                            style={{ backgroundColor: colors.accent, color: colors.background }}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Volume</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.background, borderLeft: `1px solid ${colors.border}` }}>
                        <p style={{ color: colors.text.primary }}>{product.volume}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Gender</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.surface, borderLeft: `1px solid ${colors.border}` }}>
                        <p style={{ color: colors.text.primary }}>{product.gender}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Category</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.background, borderLeft: `1px solid ${colors.border}` }}>
                        <p style={{ color: colors.text.primary }}>{product.fragranceFamily}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Longevity</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.surface, borderLeft: `1px solid ${colors.border}` }}>
                        <p style={{ color: colors.text.primary }}>{product.longevity}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Sillage</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.background, borderLeft: `1px solid ${colors.border}` }}>
                        <p style={{ color: colors.text.primary }}>{product.sillage}</p>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Key Ingredients</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.surface, borderLeft: `1px solid ${colors.border}` }}>
                        <div className="flex flex-wrap justify-center gap-1">
                          {product.topNotes.map((note, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: colors.background,
                                color: colors.text.primary,
                                border: `1px solid ${colors.border}`
                              }}
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.background, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Skin Benefits</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.background, borderLeft: `1px solid ${colors.border}` }}>
                        <div className="flex flex-wrap justify-center gap-1">
                          {product.middleNotes.map((note, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: colors.background,
                                color: colors.text.primary,
                                border: `1px solid ${colors.border}`
                              }}
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 align-top border-r" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Free From</h4>
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center" style={{ backgroundColor: colors.surface, borderLeft: `1px solid ${colors.border}` }}>
                        <div className="flex flex-wrap justify-center gap-1">
                          {product.baseNotes.map((note, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: colors.background,
                                color: colors.text.primary,
                                border: `1px solid ${colors.border}`
                              }}
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
