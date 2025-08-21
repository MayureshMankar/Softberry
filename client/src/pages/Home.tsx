import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryCard } from "@/components/product/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Shield, Truck, UserCheck, Gift, Star, Gem, Crown } from "lucide-react";
import type { ProductWithDetails, Category } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts = [], isLoading: loadingProducts } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Map categories to include product counts (mock data for display)
  const categoriesWithCounts = categories.map((cat, index) => ({
    ...cat,
    productCount: [25, 18, 22][index] || 15
  }));

  return (
    <div className="bg-cream font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen luxury-gradient overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="text-cream space-y-8">
              <div className="space-y-4">
                <p className="text-champagne font-medium tracking-wider uppercase text-sm">
                  Welcome to Royals
                </p>
                <h2 className="font-serif text-6xl lg:text-7xl font-bold leading-tight">
                  Your Luxury
                  <span className="text-champagne block">Awaits</span>
                </h2>
                <p className="text-xl text-warm-gray max-w-lg leading-relaxed">
                  Welcome to your personalized fragrance journey. Discover curated recommendations, track your favorites, and enjoy exclusive member benefits in our world of luxury scents.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="luxury-border group bg-transparent hover:bg-champagne border-0"
                  data-testid="shop-now-button"
                >
                  <Link href="/products">
                    <div className="px-8 py-4 rounded-lg group-hover:bg-champagne transition-colors duration-300">
                      <span className="text-champagne group-hover:text-luxury-black font-medium">
                        Shop Now
                      </span>
                    </div>
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-champagne text-champagne hover:bg-champagne hover:text-luxury-black transition-all duration-300"
                  data-testid="view-wishlist-button"
                >
                  <Link href="/wishlist">
                    My Wishlist
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div data-testid="stat-brands">
                  <p className="text-2xl font-bold text-champagne">50+</p>
                  <p className="text-warm-gray text-sm">Premium Brands</p>
                </div>
                <div data-testid="stat-fragrances">
                  <p className="text-2xl font-bold text-champagne">200+</p>
                  <p className="text-warm-gray text-sm">Unique Fragrances</p>
                </div>
                <div data-testid="stat-exclusive">
                  <p className="text-2xl font-bold text-champagne">VIP</p>
                  <p className="text-warm-gray text-sm">Member Benefits</p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              {/* Main Product Image */}
              <div className="floating-element">
                <img 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                  alt="Luxury perfume collection" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  loading="eager"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border border-champagne/30 rounded-full flex items-center justify-center floating-element animate-[float_6s_ease-in-out_infinite_-2s]">
                <Star className="text-champagne text-lg" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center floating-element animate-[float_6s_ease-in-out_infinite_-4s]">
                <Crown className="text-champagne" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-champagne font-medium tracking-wider uppercase text-sm mb-4">Categories</p>
            <h2 className="font-serif text-5xl font-bold text-luxury-black mb-6">Fragrance Families</h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">
              Explore our carefully curated categories, each representing a distinct olfactory journey through the world of luxury fragrances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingCategories ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="rounded-2xl overflow-hidden shadow-lg border-0">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              categoriesWithCounts.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black to-burgundy/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-champagne font-medium tracking-wider uppercase text-sm mb-4">Curated Selection</p>
            <h2 className="font-serif text-5xl font-bold text-cream mb-6">Featured Fragrances</h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">Handpicked by our perfume experts, these exceptional fragrances represent the pinnacle of luxury and craftsmanship.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingProducts ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="bg-white rounded-2xl shadow-xl border-0">
                  <Skeleton className="h-64 w-full rounded-t-2xl" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              asChild
              className="luxury-border group bg-transparent hover:bg-champagne border-0"
              data-testid="view-all-button"
            >
              <Link href="/products">
                <div className="px-8 py-4 rounded-lg group-hover:bg-champagne transition-colors duration-300">
                  <span className="text-champagne group-hover:text-luxury-black font-medium">View All Fragrances</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Luxury Features */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl font-bold text-luxury-black mb-6">The Royals Experience</h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">What sets us apart in the world of luxury fragrances</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-luxury-black text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold text-luxury-black mb-4">Authenticity Guaranteed</h3>
              <p className="text-warm-gray leading-relaxed">Every fragrance is sourced directly from authorized distributors with certificates of authenticity.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="text-luxury-black text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold text-luxury-black mb-4">Express Delivery</h3>
              <p className="text-warm-gray leading-relaxed">Premium packaging with same-day delivery in metro cities and express shipping nationwide.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCheck className="text-luxury-black text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold text-luxury-black mb-4">Expert Consultation</h3>
              <p className="text-warm-gray leading-relaxed">Personal fragrance consultations with certified perfume experts to find your signature scent.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gift className="text-luxury-black text-2xl" />
              </div>
              <h3 className="font-serif text-xl font-bold text-luxury-black mb-4">Luxury Packaging</h3>
              <p className="text-warm-gray leading-relaxed">Each purchase comes in elegant gift packaging, perfect for special occasions or personal indulgence.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
