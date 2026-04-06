import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Crown, 
  Shield, 
  Award, 
  Heart, 
  Users, 
  Globe, 
  Gem, 
  Star 
} from "lucide-react";

export default function About() {
  const { colors } = useTheme();
  
  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.accent} 1px, transparent 1px)`,
              backgroundSize: "50px 50px"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-6xl font-bold mb-6">
              <span style={{ color: colors.text.primary }}>About</span> <span style={{ color: colors.text.accent }}>Soft Berry Skincare</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: colors.text.tertiary }}>
              Discover the story behind India's premier destination for luxury cosmetics. 
              We're passionate about bringing you the world's finest beauty and skincare.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: colors.text.primary }}>Our Story</h2>
              <div className="space-y-6 leading-relaxed" style={{ color: colors.text.tertiary }}>
                <p>
                  Founded in 2020, Soft Berry Skincare began as a passion project to make luxury cosmetics accessible 
                  to discerning customers who appreciate the art of beauty. What started as a 
                  small collection has grown into one of India's most trusted destinations for authentic 
                  luxury beauty and skincare.
                </p>
                <p>
                  We believe beauty is personal—an expression of individuality and confidence. Every product we curate tells 
                  a story of craftsmanship, innovation, and results you can see and feel.
                </p>
                <p>
                  Our team of beauty experts explores the world to discover the finest formulas, 
                  working directly with authorized distributors to ensure every product meets our 
                  strict standards of authenticity and quality.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1594736797933-d0301ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Luxury cosmetic collection" 
                className="w-full rounded-2xl shadow-2xl"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full flex items-center justify-center" style={{
                backgroundColor: `${colors.accent}33`
              }}>
                <Crown className="text-2xl" style={{ color: colors.text.accent }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: colors.text.primary }}>Our Values</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
              The principles that guide everything we do at Soft Berry Skincare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="rounded-2xl shadow-lg text-center p-8 group hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Shield className="text-xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>Authenticity</h3>
              <p className="leading-relaxed" style={{ color: colors.text.tertiary }}>
                Every product is sourced directly from authorized distributors with certificates of authenticity.
              </p>
            </Card>

            <Card className="rounded-2xl shadow-lg text-center p-8 group hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Award className="text-xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>Excellence</h3>
              <p className="leading-relaxed" style={{ color: colors.text.tertiary }}>
                We curate only the finest cosmetics from the world's most prestigious brands.
              </p>
            </Card>

            <Card className="rounded-2xl shadow-lg text-center p-8 group hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Heart className="text-xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>Passion</h3>
              <p className="leading-relaxed" style={{ color: colors.text.tertiary }}>
                Our love for beauty drives us to provide exceptional service and expertise.
              </p>
            </Card>

            <Card className="rounded-2xl shadow-lg text-center p-8 group hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Users className="text-xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>Community</h3>
              <p className="leading-relaxed" style={{ color: colors.text.tertiary }}>
                Building lasting relationships with customers who share our appreciation for luxury.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Globe className="text-2xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-3xl font-bold mb-2" style={{ color: colors.text.accent }}>50+</h3>
              <p className="font-medium" style={{ color: colors.text.primary }}>Premium Brands</p>
              <p className="text-sm mt-1" style={{ color: colors.text.tertiary }}>From around the world</p>
            </div>

            <div className="group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Gem className="text-2xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-3xl font-bold mb-2" style={{ color: colors.text.accent }}>200+</h3>
              <p className="font-medium" style={{ color: colors.text.primary }}>Unique Products</p>
              <p className="text-sm mt-1" style={{ color: colors.text.tertiary }}>Carefully curated collection</p>
            </div>

            <div className="group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Users className="text-2xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-3xl font-bold mb-2" style={{ color: colors.text.accent }}>10K+</h3>
              <p className="font-medium" style={{ color: colors.text.primary }}>Happy Customers</p>
              <p className="text-sm mt-1" style={{ color: colors.text.tertiary }}>Across India</p>
            </div>

            <div className="group">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{
                backgroundColor: colors.accent
              }}>
                <Star className="text-2xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-3xl font-bold mb-2" style={{ color: colors.text.accent }}>4.9</h3>
              <p className="font-medium" style={{ color: colors.text.primary }}>Customer Rating</p>
              <p className="text-sm mt-1" style={{ color: colors.text.tertiary }}>Based on 2,500+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: colors.background }}>
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, ${colors.accent} 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: colors.text.primary }}>Ready to Elevate Your Skincare Routine?</h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.text.tertiary }}>
              Explore our curated collection of luxury cosmetics and find the perfect products that tell your story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="font-medium px-8 py-4 rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background
                }}
                data-testid="shop-now-button"
              >
                <Link href="/products">
                  Shop Now
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="transition-all duration-300 px-8 py-4 rounded-lg"
                style={{
                  borderColor: colors.accent,
                  color: colors.accent
                }}
                data-testid="contact-us-button"
              >
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
