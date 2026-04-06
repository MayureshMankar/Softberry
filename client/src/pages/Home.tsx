import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryCard } from "@/components/product/CategoryCard";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Crown, 
  Shield, 
  Truck, 
  UserCheck, 
  Gift,
  TrendingUp,
  Sparkles
} from "lucide-react";

// Import homepage data for fallback
import { 
  homepageCategories,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  formatPrice,
  type HomepageProduct
} from "@/data/homepage-products";

interface Product {
  _id: { toString: () => string };
  name: string;
  price: number;
  imageUrl?: string;
  brand?: { name: string };
  category?: { name: string };
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  averageRating?: number;
  reviewCount?: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

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

export default function Home() {
  const { user } = useAuth();
  const { colors } = useTheme(); // Use standard theme colors
  
  // Fetch products from API
  const { data: apiProducts = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Use API products if available, otherwise fallback to static data
  const products = isLoading || error ? [] : apiProducts;

  // Get homepage data from API or fallback to static data
  const featuredProducts = isLoading || error || products.length === 0
    ? [] // We'll handle fallback in the rendering
    : products
        .filter((p: any) => p.isFeatured && p.isActive)
        .slice(0, 8)
        .map((p: any) => ({ ...p, _id: { toString: () => p._id } }));
        
  const newArrivals = isLoading || error || products.length === 0
    ? [] // We'll handle fallback in the rendering
    : products
        .filter((p: any) => p.isNewArrival && p.isActive)
        .slice(0, 8)
        .map((p: any) => ({ ...p, _id: { toString: () => p._id } }));
        
  const bestSellers = isLoading || error || products.length === 0
    ? [] // We'll handle fallback in the rendering
    : products
        .filter((p: any) => p.isBestSeller && p.isActive)
        .slice(0, 8)
        .map((p: any) => ({ ...p, _id: { toString: () => p._id } }));
  
  // Fallback data when API is not available
  const fallbackFeaturedProducts = featuredProducts.length === 0 
    ? getFeaturedProducts().map(convertProduct)
    : [];
    
  const fallbackNewArrivals = newArrivals.length === 0 
    ? getNewArrivals().map(convertProduct)
    : [];
    
  const fallbackBestSellers = bestSellers.length === 0 
    ? getBestSellers().map(convertProduct)
    : [];
  
  // Convert categories for CategoryCard component
  const categories = homepageCategories.map(cat => ({
    ...cat,
    _id: { toString: () => cat.id },
    description: cat.description,
    imageUrl: cat.imageUrl,
    createdAt: new Date(),
  }));
  
  const firstName = (user as any)?.firstName || 'Guest';
  
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-start relative overflow-hidden pt-40 lg:pt-30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/uploads/bg.png"
            alt="Luxury Beauty Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layered overlay for better integration */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to bottom, ${colors.background}80 0%, ${colors.background}00 15%, ${colors.background}00 70%, ${colors.background}FF 100%)`
          }} />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, ${colors.background}B3 20%, ${colors.background}00 100%)`
          }} />
          <div className="absolute inset-0 opacity-5" style={{
            background: `radial-gradient(circle at center, transparent 0%, ${colors.background} 100%)`
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-left space-y-8 -mt-16 lg:-mt-24">
            {/* Minimal Branding */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="font-serif text-lg lg:text-xl italic font-light tracking-widest opacity-80" style={{ color: colors.text.tertiary }}>
                  the art of elegance
                </span>
                <h1 className="font-serif text-6xl lg:text-8xl font-bold tracking-tight" style={{ color: colors.text.primary, textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  Softberry
                </h1>
              </div>
              <div className="space-y-4">
                <p className="text-xl lg:text-2xl max-w-xl leading-relaxed font-light" style={{ color: colors.text.secondary }}>
                  Luxury beauty and skincare curated for your unique journey. 
                </p>
                <div className="space-y-4">
                  <p className="text-base lg:text-lg max-w-lg leading-relaxed opacity-70" style={{ color: colors.text.secondary }}>
                    Discover our exclusive range of premium formulas, designed to nurture your skin and enhance your natural radiance with every application. Our commitment to quality ensures that each product is a masterpiece of science and nature.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2 opacity-60">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent }} />
                    <span className="text-xs uppercase tracking-widest" style={{ color: colors.text.secondary }}>Natural Ingredients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent }} />
                    <span className="text-xs uppercase tracking-widest" style={{ color: colors.text.secondary }}>Cruelty Free</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent }} />
                    <span className="text-xs uppercase tracking-widest" style={{ color: colors.text.secondary }}>Expertly Crafted</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-start items-start">
              <Button 
                asChild
                size="lg"
                className="font-medium px-12 py-7 rounded-full transition-all duration-500 text-lg group overflow-hidden relative"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                  boxShadow: `0 10px 30px -5px ${colors.accent}4D`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 15px 40px -5px ${colors.accent}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 10px 30px -5px ${colors.accent}4D`;
                }}
              >
                <Link href="/products">
                  <span className="relative z-10 flex items-center">
                    Explore Collection
                    <ShoppingBag className="ml-3 h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50 z-10">
          <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: colors.text.secondary }}>Scroll</span>
          <div className="w-px h-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full animate-scroll-line" style={{ 
              background: `linear-gradient(to bottom, transparent, ${colors.accent}, transparent)` 
            }} />
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      {(featuredProducts.length > 0 || fallbackFeaturedProducts.length > 0) && (
        <section className="py-32 border-t" style={{ backgroundColor: colors.background, borderColor: colors.borderLight }}>
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full border mb-6" style={{
                borderColor: `${colors.border}4D`,
                backgroundColor: `${colors.surface}66`
              }}>
                <Star className="w-4 h-4 mr-3 animate-pulse" style={{ color: colors.text.accent }} />
                <span className="font-medium tracking-wider uppercase text-sm" style={{ color: colors.text.accent }}>
                  Editor's Choice
                </span>
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                <span style={{ color: colors.text.primary }}>Featured</span>
                <span style={{ color: colors.text.accent }}> Collection</span>
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
                Curated selection of our most beloved cosmetics
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(featuredProducts.length > 0 ? featuredProducts : fallbackFeaturedProducts).map((product: any) => (
                <ProductCard key={product._id.toString()} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                asChild
                variant="outline"
                className="px-8 py-4 rounded-xl transition-all duration-300"
                style={{
                  borderColor: colors.text.tertiary,
                  color: colors.text.tertiary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.text.tertiary;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.text.tertiary;
                }}
              >
                <Link href="/products?isFeatured=true">
                  <Crown className="mr-2 h-5 w-5" />
                  View All Featured
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* New Arrivals Section */}
      {(newArrivals.length > 0 || fallbackNewArrivals.length > 0) && (
        <section className="py-24" style={{ backgroundColor: colors.surface }}>
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full border mb-6" style={{
                borderColor: `${colors.border}4D`,
                backgroundColor: `${colors.background}66`
              }}>
                <Sparkles className="w-4 h-4 mr-3 animate-pulse" style={{ color: colors.text.accent }} />
                <span className="font-medium tracking-wider uppercase text-sm" style={{ color: colors.text.accent }}>
                  Fresh In
                </span>
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                <span style={{ color: colors.text.primary }}>New</span>
                <span style={{ color: colors.text.accent }}> Arrivals</span>
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
                Discover our latest additions to the collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(newArrivals.length > 0 ? newArrivals : fallbackNewArrivals).map((product: any) => (
                <ProductCard key={product._id.toString()} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                asChild
                variant="outline"
                className="px-8 py-4 rounded-xl transition-all duration-300"
                style={{
                  borderColor: colors.text.tertiary,
                  color: colors.text.tertiary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.text.tertiary;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.text.tertiary;
                }}
              >
                <Link href="/products?isNewArrival=true">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View All New Arrivals
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Best Sellers Section */}
      {(bestSellers.length > 0 || fallbackBestSellers.length > 0) && (
        <section className="py-24" style={{ backgroundColor: colors.background }}>
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 rounded-full border mb-6" style={{
                borderColor: `${colors.border}4D`,
                backgroundColor: `${colors.surface}66`
              }}>
                <Star className="w-4 h-4 mr-3 animate-pulse" style={{ color: colors.text.accent }} />
                <span className="font-medium tracking-wider uppercase text-sm" style={{ color: colors.text.accent }}>
                  Customer Favorites
                </span>
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
                <span style={{ color: colors.text.primary }}>Best</span>
                <span style={{ color: colors.text.accent }}> Sellers</span>
              </h2>
              <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
                Most loved products by our discerning customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(bestSellers.length > 0 ? bestSellers : fallbackBestSellers).map((product: any) => (
                <ProductCard key={product._id.toString()} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button 
                asChild
                variant="outline"
                className="px-8 py-4 rounded-xl transition-all duration-300"
                style={{
                  borderColor: colors.text.tertiary,
                  color: colors.text.tertiary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.text.tertiary;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.text.tertiary;
                }}
              >
                <Link href="/products?isBestSeller=true">
                  <Star className="mr-2 h-5 w-5" />
                  View All Best Sellers
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Categories Section */}
      <section className="py-24" style={{ backgroundColor: colors.surface }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              <span style={{ color: colors.text.primary }}>Explore by</span>
              <span style={{ color: colors.text.accent }}> Category</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
              Find the perfect product for every occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${colors.accent}20` }}>
                  <Shield className="w-8 h-8" style={{ color: colors.accent }} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>Authentic Guarantee</h3>
                <p style={{ color: colors.text.secondary }}>
                  All our products are 100% authentic and sourced directly from the brands.
                </p>
              </CardContent>
            </Card>
            
            <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${colors.accent}20` }}>
                  <Truck className="w-8 h-8" style={{ color: colors.accent }} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>Free Shipping</h3>
                <p style={{ color: colors.text.secondary }}>
                  Complimentary shipping on all orders over ₹5,000. Express delivery available.
                </p>
              </CardContent>
            </Card>
            
            <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${colors.accent}20` }}>
                  <UserCheck className="w-8 h-8" style={{ color: colors.accent }} />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>Personal Concierge</h3>
                <p style={{ color: colors.text.secondary }}>
                  Our beauty experts are available to help you build your perfect routine.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
    </div>
  );
}
