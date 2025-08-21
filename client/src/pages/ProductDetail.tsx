import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { ProductCard } from "@/components/product/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { ProductWithDetails } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const { addToCart, isAddingToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery<ProductWithDetails>({
    queryKey: ["/api/products/slug", params?.slug],
    enabled: !!params?.slug,
  });

  const { data: relatedProducts = [] } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products", { category: product?.category?.slug, limit: 4 }],
    enabled: !!product?.category?.slug,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    addToCart({ productId: product.id, quantity });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    toast({
      title: "Added to Wishlist",
      description: "This feature will be available soon",
    });
  };

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  const getBadgeInfo = () => {
    if (!product) return null;
    
    if (product.isNewArrival) {
      return { text: "NEW ARRIVAL", className: "bg-champagne text-luxury-black" };
    }
    if (product.isBestSeller) {
      return { text: "BESTSELLER", className: "bg-burgundy text-cream" };
    }
    if (product.isLimitedEdition) {
      return { text: "LIMITED EDITION", className: "bg-rose-gold text-luxury-black" };
    }
    if (product.isFeatured) {
      return { text: "EXCLUSIVE", className: "bg-champagne text-luxury-black" };
    }
    return null;
  };

  const badge = getBadgeInfo();
  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : product?.imageUrl 
    ? [product.imageUrl] 
    : [];

  if (isLoading) {
    return (
      <div className="bg-cream font-sans min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-cream font-sans min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-serif text-4xl font-bold text-luxury-black mb-4">Product Not Found</h1>
          <p className="text-warm-gray mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild data-testid="back-to-products-button">
            <Link href="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const filteredRelatedProducts = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-cream font-sans min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-warm-gray/10 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-warm-gray">
            <Link href="/" className="hover:text-champagne transition-colors">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-champagne transition-colors">Products</Link>
            <span>›</span>
            {product.category && (
              <>
                <Link href={`/products?category=${product.category.slug}`} className="hover:text-champagne transition-colors">
                  {product.category.name}
                </Link>
                <span>›</span>
              </>
            )}
            <span className="text-luxury-black font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-warm-gray/5 rounded-2xl overflow-hidden">
              {productImages.length > 0 && (
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              )}
              {badge && (
                <Badge className={`absolute top-4 left-4 ${badge.className}`}>
                  {badge.text}
                </Badge>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square bg-warm-gray/5 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-champagne' : 'border-transparent hover:border-warm-gray'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    data-testid={`product-image-${index}`}
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

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-champagne font-medium text-lg mb-2">{product.brand.name}</p>
              )}
              <h1 className="font-serif text-4xl font-bold text-luxury-black mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-champagne">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(parseFloat(product.averageRating || "0"))
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-warm-gray text-sm ml-2">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
                {product.volume && (
                  <Badge variant="outline" className="text-champagne border-champagne">
                    {product.volume}
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-burgundy">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                  <span className="text-xl text-warm-gray line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-warm-gray leading-relaxed mb-6">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-luxury-black">Quantity:</label>
                <div className="flex items-center border border-warm-gray/30 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="decrease-quantity-button"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="increase-quantity-button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black font-medium"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  data-testid="add-to-cart-button"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-cream"
                  onClick={handleWishlist}
                  data-testid="add-to-wishlist-button"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <Card className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-champagne mx-auto mb-2" />
                  <p className="text-xs font-medium text-luxury-black">Authentic</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 text-champagne mx-auto mb-2" />
                  <p className="text-xs font-medium text-luxury-black">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-champagne mx-auto mb-2" />
                  <p className="text-xs font-medium text-luxury-black">Easy Returns</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description" data-testid="description-tab">Description</TabsTrigger>
              <TabsTrigger value="notes" data-testid="notes-tab">Fragrance Notes</TabsTrigger>
              <TabsTrigger value="details" data-testid="details-tab">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-warm-gray leading-relaxed">
                      {product.description || "No detailed description available for this product."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {product.topNotes && product.topNotes.length > 0 && (
                      <div>
                        <h4 className="font-serif text-lg font-bold text-luxury-black mb-3">Top Notes</h4>
                        <div className="space-y-2">
                          {product.topNotes.map((note, index) => (
                            <Badge key={index} variant="outline" className="mr-2">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.middleNotes && product.middleNotes.length > 0 && (
                      <div>
                        <h4 className="font-serif text-lg font-bold text-luxury-black mb-3">Middle Notes</h4>
                        <div className="space-y-2">
                          {product.middleNotes.map((note, index) => (
                            <Badge key={index} variant="outline" className="mr-2">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {product.baseNotes && product.baseNotes.length > 0 && (
                      <div>
                        <h4 className="font-serif text-lg font-bold text-luxury-black mb-3">Base Notes</h4>
                        <div className="space-y-2">
                          {product.baseNotes.map((note, index) => (
                            <Badge key={index} variant="outline" className="mr-2">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-luxury-black mb-4">Product Details</h4>
                      <dl className="space-y-3">
                        {product.fragranceFamily && (
                          <div>
                            <dt className="text-sm font-medium text-warm-gray">Fragrance Family</dt>
                            <dd className="text-luxury-black">{product.fragranceFamily}</dd>
                          </div>
                        )}
                        {product.gender && (
                          <div>
                            <dt className="text-sm font-medium text-warm-gray">Gender</dt>
                            <dd className="text-luxury-black">{product.gender}</dd>
                          </div>
                        )}
                        {product.volume && (
                          <div>
                            <dt className="text-sm font-medium text-warm-gray">Volume</dt>
                            <dd className="text-luxury-black">{product.volume}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                    
                    <div>
                      <h4 className="font-serif text-lg font-bold text-luxury-black mb-4">Performance</h4>
                      <dl className="space-y-3">
                        {product.longevity && (
                          <div>
                            <dt className="text-sm font-medium text-warm-gray">Longevity</dt>
                            <dd className="text-luxury-black">{product.longevity}</dd>
                          </div>
                        )}
                        {product.sillage && (
                          <div>
                            <dt className="text-sm font-medium text-warm-gray">Sillage</dt>
                            <dd className="text-luxury-black">{product.sillage}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold text-luxury-black mb-4">You Might Also Like</h2>
              <p className="text-warm-gray">Discover similar fragrances from our collection</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="related-products">
              {filteredRelatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
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
