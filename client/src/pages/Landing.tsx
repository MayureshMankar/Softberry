import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { Play, Shield, Truck, UserCheck, Gift, Star, Gem, Crown } from "lucide-react";

export default function Landing() {
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
                  Exclusive Collection 2024
                </p>
                <h2 className="font-serif text-6xl lg:text-7xl font-bold leading-tight">
                  Decode Your
                  <span className="text-champagne block">Luxury</span>
                </h2>
                <p className="text-xl text-warm-gray max-w-lg leading-relaxed">
                  Discover our curated collection of premium fragrances from the world's most prestigious perfume houses. Each scent tells a story of elegance and sophistication.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  size="lg"
                  className="luxury-border group bg-transparent hover:bg-champagne border-0"
                  data-testid="explore-collection-button"
                >
                  <Link href="/products">
                    <div className="px-8 py-4 rounded-lg group-hover:bg-champagne transition-colors duration-300">
                      <span className="text-champagne group-hover:text-luxury-black font-medium">
                        Explore Collection
                      </span>
                    </div>
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-champagne text-champagne hover:bg-champagne hover:text-luxury-black transition-all duration-300"
                  data-testid="watch-story-button"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Story
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
                <div data-testid="stat-customers">
                  <p className="text-2xl font-bold text-champagne">10K+</p>
                  <p className="text-warm-gray text-sm">Happy Customers</p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              {/* Main Product Image */}
              <div className="floating-element">
                <img 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                  alt="Luxury perfume bottle" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  loading="eager"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border border-champagne/30 rounded-full flex items-center justify-center floating-element animate-[float_6s_ease-in-out_infinite_-2s]">
                <Star className="text-champagne text-lg" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center floating-element animate-[float_6s_ease-in-out_infinite_-4s]">
                <Gem className="text-champagne" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cream animate-bounce">
          <div className="w-1 h-8 bg-champagne/50 rounded-full" />
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
            <Card className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg group border-0">
              <div className="h-64 bg-gradient-to-br from-warm-gray/20 to-champagne/20 relative overflow-hidden">
                <img 
                  src="https://pixabay.com/get/g605f009d3ed93b04c84518d5972790f8827c8e2d805a8248c4cc28e4a1074ebe2e815645fc2598d82779f766683385df0229ce7be3e4a8e43358b6e5e0912137_1280.jpg" 
                  alt="Floral fragrances collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-luxury-black/30 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Floral Elegance</h3>
                  <p className="text-cream/90 text-sm">25 Fragrances</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-warm-gray leading-relaxed mb-4">
                  Delicate blooms and romantic florals that capture the essence of sophisticated femininity and timeless elegance.
                </p>
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-champagne hover:text-burgundy transition-colors duration-300 font-medium flex items-center group p-0"
                >
                  <Link href="/products?category=floral-elegance">
                    Discover Collection 
                    <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg group border-0">
              <div className="h-64 bg-gradient-to-br from-warm-gray/20 to-burgundy/20 relative overflow-hidden">
                <img 
                  src="https://pixabay.com/get/gc4ddb7b14ee07dbed38edc3561a5b9bec59a8dc55ce171a696d5d74eabf55c3c902779c24a6fa180f6a21ab03f162c7e3fa937fb46d2b070ab81cd3144815028_1280.jpg" 
                  alt="Woody fragrances collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-luxury-black/30 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Woody Sophistication</h3>
                  <p className="text-cream/90 text-sm">18 Fragrances</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-warm-gray leading-relaxed mb-4">
                  Rich, warm woods and amber notes that exude confidence and create an aura of mysterious sophistication.
                </p>
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-champagne hover:text-burgundy transition-colors duration-300 font-medium flex items-center group p-0"
                >
                  <Link href="/products?category=woody-sophistication">
                    Discover Collection 
                    <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</div>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg group border-0">
              <div className="h-64 bg-gradient-to-br from-champagne/20 to-rose-gold/20 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Fresh fragrances collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-luxury-black/30 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Fresh & Citrus</h3>
                  <p className="text-cream/90 text-sm">22 Fragrances</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-warm-gray leading-relaxed mb-4">
                  Invigorating citrus and fresh aquatic notes that energize the senses and provide a burst of vitality.
                </p>
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-champagne hover:text-burgundy transition-colors duration-300 font-medium flex items-center group p-0"
                >
                  <Link href="/products?category=fresh-citrus">
                    Discover Collection 
                    <div className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
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

      {/* Newsletter */}
      <section className="py-20 luxury-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: "radial-gradient(circle at 30% 40%, #D4AF37 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="font-serif text-5xl font-bold text-cream mb-6">Join the Royal Circle</h2>
              <p className="text-warm-gray text-lg">Be the first to discover new arrivals, exclusive collections, and receive personalized fragrance recommendations from our experts.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-champagne/20">
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" data-testid="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-6 py-4 rounded-lg bg-white/20 border border-champagne/30 text-cream placeholder-warm-gray focus:outline-none focus:border-champagne focus:bg-white/30 transition-all duration-300" 
                  required
                  data-testid="newsletter-email-input"
                />
                <Button 
                  type="submit"
                  className="luxury-border group bg-transparent hover:bg-champagne border-0"
                  data-testid="newsletter-subscribe-button"
                >
                  <div className="px-8 py-4 rounded-lg group-hover:bg-champagne transition-colors duration-300">
                    <span className="text-champagne group-hover:text-luxury-black font-medium">Subscribe</span>
                  </div>
                </Button>
              </form>
              
              <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-champagne/20 flex-wrap">
                <div className="flex items-center gap-2">
                  <Crown className="text-champagne h-4 w-4" />
                  <span className="text-cream text-sm">Exclusive Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gem className="text-champagne h-4 w-4" />
                  <span className="text-cream text-sm">VIP Previews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-champagne h-4 w-4" />
                  <span className="text-cream text-sm">Special Offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
