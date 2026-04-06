import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { useTheme } from "@/contexts/ThemeContext";
import { Play, Shield, Truck, UserCheck, Gift, Star, Gem, Crown } from "lucide-react";

export default function Landing() {
  const { colors } = useTheme();
  
  return (
    <div className="font-sans" style={{ backgroundColor: colors.background }}>
      <Header />
      
      {/* Cinematic Hero Section */}
      <section 
        className="relative min-h-screen overflow-hidden flex items-center"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 50%, ${colors.background} 100%)`
        }}
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Particles */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0 animate-[float_20s_ease-in-out_infinite]" 
              style={{
                backgroundImage: "radial-gradient(circle at 20% 80%, #D4AF37 1px, transparent 1px)",
                backgroundSize: "120px 120px"
              }}
            />
            <div 
              className="absolute inset-0 animate-[float_25s_ease-in-out_infinite_reverse]" 
              style={{
                backgroundImage: "radial-gradient(circle at 80% 20%, #E8B4A0 1px, transparent 1px)",
                backgroundSize: "80px 80px"
              }}
            />
          </div>
          
          {/* Gradient Overlays */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.background}95 0%, ${colors.surface}90 50%, ${colors.background}95 100%)`
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, transparent 0%, ${colors.accent}05 50%, ${colors.accent}10 100%)`
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-luxury mx-auto">
            {/* Cinematic Left Content */}
            <div className="space-y-10">
              {/* Premium Badge */}
              <div 
                className="inline-flex items-center px-6 py-3 rounded-full border mb-6"
                style={{
                  backgroundColor: `${colors.surface}80`,
                  borderColor: `${colors.accent}30`,
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-3 animate-pulse"
                  style={{ backgroundColor: colors.accent }}
                />
                <span 
                  className="font-medium tracking-wider uppercase text-sm font-display"
                  style={{ color: colors.accent }}
                >
                  Exclusive Collection 2024
                </span>
              </div>
              
              {/* Hero Headline */}
              <div className="space-y-6">
                <h1 
                  className="font-serif text-6xl lg:text-8xl xl:text-9xl font-bold leading-[0.9]"
                  style={{ color: colors.text.primary }}
                >
                  <span className="block overflow-hidden">
                    <span className="block animate-[slide-up_1s_ease-out_0.3s_both]">Decode</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span 
                      className="block animate-[slide-up_1s_ease-out_0.6s_both]"
                      style={{ color: colors.accent }}
                    >
                      Your
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span 
                      className="block animate-[slide-up_1s_ease-out_0.9s_both]"
                      style={{ color: colors.accent }}
                    >
                      Luxury
                    </span>
                  </span>
                </h1>
                
                <div className="overflow-hidden">
                  <p 
                    className="text-xl lg:text-2xl max-w-2xl leading-relaxed font-light animate-[slide-up_1s_ease-out_1.2s_both]"
                    style={{ color: colors.text.secondary }}
                  >
                    Discover our curated collection of premium beauty and skincare from the world's most prestigious brands. 
                    <span 
                      className="font-medium"
                      style={{ color: colors.accent }}
                    >
                      Each product delivers results
                    </span> with elegance and sophistication.
                  </p>
                </div>
              </div>
              
              {/* Premium CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 animate-[fade-in_1s_ease-out_1.5s_both]">
                <Button 
                  asChild
                  size="lg"
                  className="group relative overflow-hidden px-10 py-6 rounded-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.background,
                    boxShadow: `0 4px 20px ${colors.accent}40`
                  }}
                  data-testid="explore-collection-button"
                >
                  <Link href="/products">
                    <span className="relative z-10 flex items-center text-lg">
                      Explore Collection
                      <div className="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</div>
                    </span>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        backgroundColor: colors.accent,
                        opacity: 0.8
                      }}
                    />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="group relative px-10 py-6 rounded-2xl font-semibold text-lg transition-all duration-500 hover:scale-105 backdrop-blur-xl"
                  style={{
                    backgroundColor: `${colors.surface}80`,
                    borderColor: `${colors.accent}60`,
                    color: colors.text.primary,
                    borderWidth: '2px'
                  }}
                  data-testid="watch-story-button"
                >
                  <div className="flex items-center relative z-10">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors duration-300"
                      style={{
                        backgroundColor: `${colors.accent}20`
                      }}
                    >
                      <Play className="h-4 w-4 ml-0.5" style={{ color: colors.text.primary }} />
                    </div>
                    Watch Our Story
                  </div>
                </Button>
              </div>

              {/* Luxury Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 animate-[fade-in_1s_ease-out_1.8s_both]">
                <div className="text-center group" data-testid="stat-brands">
                  <div className="relative">
                    <p 
                      className="font-display text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: colors.accent }}
                    >
                      50<span className="text-2xl">+</span>
                    </p>
                    <div 
                      className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{
                        backgroundColor: `${colors.accent}10`
                      }}
                    />
                  </div>
                  <p 
                    className="text-sm font-medium tracking-wide uppercase"
                    style={{ color: colors.text.secondary }}
                  >
                    Premium Brands
                  </p>
                </div>
                <div className="text-center group" data-testid="stat-fragrances">
                  <div className="relative">
                    <p 
                      className="font-display text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: colors.accent }}
                    >
                      200<span className="text-2xl">+</span>
                    </p>
                    <div 
                      className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{
                        backgroundColor: `${colors.accent}10`
                      }}
                    />
                  </div>
                  <p 
                    className="text-sm font-medium tracking-wide uppercase"
                    style={{ color: colors.text.secondary }}
                  >
                    Beauty Products
                  </p>
                </div>
                <div className="text-center group" data-testid="stat-customers">
                  <div className="relative">
                    <p 
                      className="font-display text-4xl lg:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: colors.accent }}
                    >
                      10K<span className="text-2xl">+</span>
                    </p>
                    <div 
                      className="absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{
                        backgroundColor: `${colors.accent}10`
                      }}
                    />
                  </div>
                  <p 
                    className="text-sm font-medium tracking-wide uppercase"
                    style={{ color: colors.text.secondary }}
                  >
                    Loyal Clients
                  </p>
                </div>
              </div>
            </div>

            {/* Cinematic Right Visual */}
            <div className="relative lg:h-[90vh] flex items-center justify-center">
              {/* Main Product Showcase */}
              <div className="relative group animate-[fade-in_1.5s_ease-out_0.6s_both]">
                {/* Premium Product Image */}
                <div 
                  className="relative overflow-hidden rounded-3xl group-hover:transition-all duration-700"
                  style={{
                    backgroundColor: colors.surface,
                    boxShadow: `0 20px 40px ${colors.borderLight}`
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                    alt="Luxury cosmetic product" 
                    className="w-full max-w-lg mx-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-700 floating-element"
                    loading="eager"
                  />
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(to top, ${colors.background}20, transparent)`
                    }}
                  />
                </div>
                
                {/* Floating Luxury Elements */}
                <div 
                  className="absolute -top-8 -right-8 w-24 h-24 flex items-center justify-center floating-element animate-[float_8s_ease-in-out_infinite_-2s] hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: `${colors.surface}80`,
                    backdropFilter: 'blur(16px)',
                    borderRadius: '50%'
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}40 0%, ${colors.accent} 100%)`
                    }}
                  >
                    <Star className="text-xl" style={{ color: colors.background }} />
                  </div>
                </div>
                
                <div 
                  className="absolute -bottom-6 -left-6 w-20 h-20 flex items-center justify-center floating-element animate-[float_10s_ease-in-out_infinite_-5s] hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: `${colors.surface}80`,
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px'
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}40 100%)`
                    }}
                  >
                    <Gem className="text-lg" style={{ color: colors.background }} />
                  </div>
                </div>
                
                <div 
                  className="absolute top-1/2 -left-12 w-16 h-16 flex items-center justify-center floating-element animate-[float_12s_ease-in-out_infinite_-8s] hover:scale-110 transition-transform duration-300"
                  style={{
                    border: `2px solid ${colors.accent}60`,
                    borderRadius: '50%'
                  }}
                >
                  <Crown className="text-lg" style={{ color: colors.accent }} />
                </div>
                
                {/* Luxury Glow Effect */}
                <div 
                  className="absolute inset-0 -m-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 50%, ${colors.accent}20 100%)`
                  }}
                />
              </div>
              
              {/* Premium Features Indicators */}
              <div className="absolute bottom-8 left-0 right-0 animate-[slide-up_1s_ease-out_2.1s_both]">
                <div className="flex justify-center space-x-8">
                  <div 
                    className="px-4 py-3 rounded-xl group hover:transition-all duration-300"
                    style={{
                      backgroundColor: `${colors.surface}80`,
                      borderColor: `${colors.accent}30`,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" style={{ color: colors.accent }} />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Authentic
                      </span>
                    </div>
                  </div>
                  <div 
                    className="px-4 py-3 rounded-xl group hover:transition-all duration-300"
                    style={{
                      backgroundColor: `${colors.surface}80`,
                      borderColor: `${colors.accent}30`,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" style={{ color: colors.accent }} />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.text.secondary }}
                      >
                        Fast Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Luxury Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-[fade-in_1s_ease-out_2.5s_both]">
          <div className="flex flex-col items-center group cursor-pointer">
            <p 
              className="text-xs uppercase tracking-wider mb-2 font-medium"
              style={{ color: colors.text.secondary }}
            >
              Scroll to Explore
            </p>
            <div 
              className="w-0.5 h-12 rounded-full group-hover:scale-y-125 transition-transform duration-300"
              style={{
                background: `linear-gradient(to bottom, ${colors.accent}, transparent)`
              }}
            />
            <div 
              className="w-2 h-2 rounded-full mt-2 animate-bounce"
              style={{ backgroundColor: colors.accent }}
            />
          </div>
        </div>
      </section>

      {/* Premium Featured Categories */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{ backgroundColor: colors.surface }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: colors.accent }}
          />
          <div 
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{ 
              backgroundColor: colors.accent,
              animationDelay: '2s'
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          {/* Premium Section Header */}
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <div 
              className="inline-flex items-center px-6 py-3 rounded-full border mb-8"
              style={{
                backgroundColor: `${colors.surface}80`,
                borderColor: `${colors.accent}30`,
                backdropFilter: 'blur(16px)'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full mr-3 animate-pulse"
                style={{ backgroundColor: colors.accent }}
              />
              <span 
                className="font-medium tracking-wider uppercase text-sm font-display"
                style={{ color: colors.accent }}
              >
                Beauty Categories
              </span>
            </div>
            
            <h2 
              className="font-serif text-5xl lg:text-7xl font-bold mb-8 leading-tight"
              style={{ color: colors.text.primary }}
            >
              Discover Your 
              <span 
                className="relative"
                style={{ color: colors.accent }}
              >
                <span className="relative z-10">Signature</span>
                <div 
                  className="absolute inset-0 transform -skew-x-12 rounded-lg"
                  style={{ backgroundColor: `${colors.accent}20` }}
                />
              </span>
              <br />Beauty Routine
            </h2>
            <p 
              className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
              style={{ color: colors.text.secondary }}
            >
              Explore our carefully curated categories, each representing a distinct journey through 
              <span 
                className="font-medium"
                style={{ color: colors.accent }}
              >
                the world of luxury beauty
              </span>.
            </p>
          </div>

          {/* Premium Category Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {/* Floral Elegance Card */}
            <Card 
              className="group rounded-3xl overflow-hidden transition-all duration-700 hover:-translate-y-2"
              style={{
                backgroundColor: colors.background,
                boxShadow: `0 10px 30px ${colors.borderLight}`,
                border: `none`
              }}
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://pixabay.com/get/g605f009d3ed93b04c84518d5972790f8827c8e2d805a8248c4cc28e4a1074ebe2e815645fc2598d82779f766683385df0229ce7be3e4a8e43358b6e5e0912137_1280.jpg" 
                  alt="Skincare hydration collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Gradient Overlays */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${colors.background}90 0%, ${colors.background}40 40%, transparent 100%)`
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 50%, ${colors.accent}10 100%)`
                  }}
                />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <div 
                    className="px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: `${colors.surface}80`,
                      borderColor: `${colors.text.primary}30`,
                      backdropFilter: 'blur(16px)'
                    }}
                  >
                    <span 
                      className="text-sm font-medium tracking-wide"
                      style={{ color: colors.text.primary }}
                    >
                      25 Products
                    </span>
                  </div>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 
                    className="font-serif text-3xl font-bold mb-3 group-hover:transition-colors duration-300"
                    style={{ color: colors.text.primary }}
                  >
                    Hydration Essentials
                  </h3>
                  <div 
                    className="h-0.5 rounded-full group-hover:w-24 transition-all duration-500"
                    style={{
                      backgroundColor: colors.accent,
                      width: '4rem'
                    }}
                  />
                </div>
              </div>
              
              <CardContent className="p-8">
                <p 
                  className="leading-relaxed mb-6 text-lg"
                  style={{ color: colors.text.secondary }}
                >
                  Delicate blooms and romantic florals that capture the essence of 
                  <span 
                    className="font-medium"
                    style={{ color: colors.accent }}
                  >
                    sophisticated femininity
                  </span> and timeless elegance.
                </p>
                <Button 
                  asChild
                  variant="ghost" 
                  className="group/btn transition-all duration-300 font-semibold p-0 h-auto rounded-xl px-6 py-3"
                  style={{ color: colors.accent }}
                >
                  <Link href="/products?category=moisturizers">
                    <span className="flex items-center">
                      Discover Collection
                      <div className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300">→</div>
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Woody Sophistication Card */}
            <Card 
              className="group rounded-3xl overflow-hidden transition-all duration-700 hover:-translate-y-2"
              style={{
                backgroundColor: colors.background,
                boxShadow: `0 10px 30px ${colors.borderLight}`,
                border: `none`
              }}
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://pixabay.com/get/gc4ddb7b14ee07dbed38edc3561a5b9bec59a8dc55ce171a696d5d74eabf55c3c902779c24a6fa180f6a21ab03f162c7e3fa937fb46d2b070ab81cd3144815028_1280.jpg" 
                    alt="Skincare essentials collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Gradient Overlays */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${colors.background}90 0%, ${colors.background}40 40%, transparent 100%)`
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 50%, ${colors.accent}10 100%)`
                  }}
                />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <div 
                    className="px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: `${colors.surface}80`,
                      borderColor: `${colors.text.primary}30`,
                      backdropFilter: 'blur(16px)'
                    }}
                  >
                    <span 
                      className="text-sm font-medium tracking-wide"
                      style={{ color: colors.text.primary }}
                    >
                      18 Products
                    </span>
                  </div>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 
                    className="font-serif text-3xl font-bold mb-3 group-hover:transition-colors duration-300"
                    style={{ color: colors.text.primary }}
                  >
                    Radiance Serums
                  </h3>
                  <div 
                    className="h-0.5 rounded-full group-hover:w-24 transition-all duration-500"
                    style={{
                      backgroundColor: colors.accent,
                      width: '4rem'
                    }}
                  />
                </div>
              </div>
              
              <CardContent className="p-8">
                <p 
                  className="leading-relaxed mb-6 text-lg"
                  style={{ color: colors.text.secondary }}
                >
                  Rich, warm woods and amber notes that exude 
                  <span 
                    className="font-medium"
                    style={{ color: colors.accent }}
                  >
                    confidence
                  </span> and create an aura of mysterious sophistication.
                </p>
                <Button 
                  asChild
                  variant="ghost" 
                  className="group/btn transition-all duration-300 font-semibold p-0 h-auto rounded-xl px-6 py-3"
                  style={{ color: colors.accent }}
                >
                  <Link href="/products?category=serums">
                    <span className="flex items-center">
                      Discover Collection
                      <div className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300">→</div>
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Fresh & Citrus Card */}
            <Card 
              className="group rounded-3xl overflow-hidden transition-all duration-700 hover:-translate-y-2 md:col-span-2 xl:col-span-1"
              style={{
                backgroundColor: colors.background,
                boxShadow: `0 10px 30px ${colors.borderLight}`,
                border: `none`
              }}
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt="Makeup collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Gradient Overlays */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${colors.background}90 0%, ${colors.background}40 40%, transparent 100%)`
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 50%, ${colors.accent}10 100%)`
                  }}
                />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6">
                  <div 
                    className="px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: `${colors.surface}80`,
                      borderColor: `${colors.text.primary}30`,
                      backdropFilter: 'blur(16px)'
                    }}
                  >
                    <span 
                      className="text-sm font-medium tracking-wide"
                      style={{ color: colors.text.primary }}
                    >
                      22 Products
                    </span>
                  </div>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 
                    className="font-serif text-3xl font-bold mb-3 group-hover:transition-colors duration-300"
                    style={{ color: colors.text.primary }}
                  >
                    Makeup Staples
                  </h3>
                  <div 
                    className="h-0.5 rounded-full group-hover:w-24 transition-all duration-500"
                    style={{
                      backgroundColor: colors.accent,
                      width: '4rem'
                    }}
                  />
                </div>
              </div>
              
              <CardContent className="p-8">
                <p 
                  className="leading-relaxed mb-6 text-lg"
                  style={{ color: colors.text.secondary }}
                >
                  Invigorating citrus and fresh aquatic notes that 
                  <span 
                    className="font-medium"
                    style={{ color: colors.accent }}
                  >
                    energize the senses
                  </span> and provide a burst of vitality.
                </p>
                <Button 
                  asChild
                  variant="ghost" 
                  className="group/btn transition-all duration-300 font-semibold p-0 h-auto rounded-xl px-6 py-3"
                  style={{ color: colors.accent }}
                >
                  <Link href="/products?category=makeup">
                    <span className="flex items-center">
                      Discover Collection
                      <div className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300">→</div>
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Luxury Features */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{ backgroundColor: `${colors.surface}5` }}
      >
        <div className="container mx-auto px-6 lg:px-8 relative">
          {/* Elegant Section Header */}
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <h2 
              className="font-serif text-5xl lg:text-6xl font-bold mb-8"
              style={{ color: colors.text.primary }}
            >
              The <span style={{ color: colors.accent }}>Soft Berry</span> 
              <br />Experience
            </h2>
            <div 
              className="h-1 rounded-full mx-auto mb-6"
              style={{
                background: `linear-gradient(to right, ${colors.accent}, ${colors.accent})`,
                width: '6rem'
              }}
            />
            <p 
              className="text-xl lg:text-2xl font-light leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              What sets us apart in the world of 
              <span 
                className="font-medium"
                style={{ color: colors.accent }}
              >
                luxury skincare and beauty
              </span>
            </p>
          </div>

          {/* Premium Features Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
            {/* Authenticity Feature */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  <div 
                    className="rounded-3xl group-hover:scale-110 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}40 0%, ${colors.accent} 100%)`,
                      boxShadow: `0 10px 20px ${colors.borderLight}`
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colors.background }}
                  >
                    <Shield 
                      className="text-3xl group-hover:scale-110 transition-transform duration-300" 
                      style={{ color: colors.accent }}
                    />
                  </div>
                </div>
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: `${colors.accent}20` }}
                />
              </div>
              <h3 
                className="font-serif text-2xl font-bold mb-4 group-hover:transition-colors duration-300"
                style={{ color: colors.text.primary }}
              >
                Authenticity Guaranteed
              </h3>
              <p 
                className="leading-relaxed text-lg"
                style={{ color: colors.text.secondary }}
              >
                Every product is sourced directly from authorized distributors with 
                <span 
                  className="font-medium"
                  style={{ color: colors.accent }}
                >
                  certificates of authenticity
                </span>.
              </p>
            </div>

            {/* Express Delivery Feature */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  <div 
                    className="rounded-3xl group-hover:scale-110 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}40 100%)`,
                      boxShadow: `0 10px 20px ${colors.borderLight}`
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colors.background }}
                  >
                    <Truck 
                      className="text-3xl group-hover:scale-110 transition-transform duration-300" 
                      style={{ color: colors.accent }}
                    />
                  </div>
                </div>
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: `${colors.accent}20` }}
                />
              </div>
              <h3 
                className="font-serif text-2xl font-bold mb-4 group-hover:transition-colors duration-300"
                style={{ color: colors.text.primary }}
              >
                Express Delivery
              </h3>
              <p 
                className="leading-relaxed text-lg"
                style={{ color: colors.text.secondary }}
              >
                Premium packaging with 
                <span 
                  className="font-medium"
                  style={{ color: colors.accent }}
                >
                  same-day delivery
                </span> in metro cities and express shipping nationwide.
              </p>
            </div>

            {/* Expert Consultation Feature */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  <div 
                    className="rounded-3xl group-hover:scale-110 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}40 0%, ${colors.accent} 100%)`,
                      boxShadow: `0 10px 20px ${colors.borderLight}`
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colors.background }}
                  >
                    <UserCheck 
                      className="text-3xl group-hover:scale-110 transition-transform duration-300" 
                      style={{ color: colors.accent }}
                    />
                  </div>
                </div>
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: `${colors.accent}20` }}
                />
              </div>
              <h3 
                className="font-serif text-2xl font-bold mb-4 group-hover:transition-colors duration-300"
                style={{ color: colors.text.primary }}
              >
                Expert Consultation
              </h3>
              <p 
                className="leading-relaxed text-lg"
                style={{ color: colors.text.secondary }}
              >
                Personal beauty consultations with 
                <span 
                  className="font-medium"
                  style={{ color: colors.accent }}
                >
                  certified beauty experts
                </span> to find your perfect routine.
              </p>
            </div>

            {/* Luxury Packaging Feature */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto relative">
                  <div 
                    className="rounded-3xl group-hover:scale-110 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}40 100%)`,
                      boxShadow: `0 10px 20px ${colors.borderLight}`
                    }}
                  />
                  <div 
                    className="absolute inset-2 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: colors.background }}
                  >
                    <Gift 
                      className="text-3xl group-hover:scale-110 transition-transform duration-300" 
                      style={{ color: colors.accent }}
                    />
                  </div>
                </div>
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: `${colors.accent}20` }}
                />
              </div>
              <h3 
                className="font-serif text-2xl font-bold mb-4 group-hover:transition-colors duration-300"
                style={{ color: colors.text.primary }}
              >
                Luxury Packaging
              </h3>
              <p 
                className="leading-relaxed text-lg"
                style={{ color: colors.text.secondary }}
              >
                Each purchase comes in 
                <span 
                  className="font-medium"
                  style={{ color: colors.accent }}
                >
                  elegant gift packaging
                </span>, perfect for special occasions or personal indulgence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Newsletter */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.surface} 50%, ${colors.background} 100%)`
        }}
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: colors.accent }}
            />
            <div 
              className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ 
                backgroundColor: colors.accent,
                animationDelay: '3s'
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse"
              style={{ 
                backgroundColor: colors.text.primary,
                animationDelay: '1.5s'
              }}
            />
          </div>
          
          {/* Animated Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 25% 60%, ${colors.accent} 1px, transparent 1px)`,
                backgroundSize: '100px 100px',
                animation: 'float 30s linear infinite'
              }}
            />
          </div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium Header */}
            <div className="mb-12">
              <div 
                className="inline-flex items-center px-8 py-4 rounded-full border mb-8"
                style={{
                  backgroundColor: `${colors.surface}80`,
                  borderColor: `${colors.accent}30`,
                  backdropFilter: 'blur(16px)'
                }}
              >
                <Crown className="h-5 w-5 mr-3" style={{ color: colors.accent }} />
                <span 
                  className="font-medium tracking-wider uppercase text-sm font-display"
                  style={{ color: colors.accent }}
                >
                  Exclusive Membership
                </span>
              </div>
              
              <h2 
                className="font-serif text-5xl lg:text-7xl font-bold mb-8 leading-tight"
                style={{ color: colors.text.primary }}
              >
                Join the 
                <span 
                  className="relative"
                  style={{ color: colors.accent }}
                >
                  <span className="relative z-10">Royal</span>
                  <div 
                    className="absolute inset-0 transform skew-x-12 rounded-lg"
                    style={{ backgroundColor: `${colors.accent}20` }}
                  />
                </span>
                <br />Circle
              </h2>
              <p 
                className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
                style={{ color: colors.text.secondary }}
              >
                Be the first to discover new arrivals, exclusive collections, and receive 
                <span 
                  className="font-medium"
                  style={{ color: colors.accent }}
                >
                  personalized beauty recommendations
                </span> from our experts.
              </p>
            </div>

            {/* Premium Newsletter Form */}
            <div className="relative max-w-3xl mx-auto">
              <div 
                className="rounded-3xl p-8 lg:p-12 border luxury-shadow"
                style={{
                  backgroundColor: `${colors.surface}80`,
                  borderColor: `${colors.accent}20`,
                  backdropFilter: 'blur(16px)'
                }}
              >
                <form className="space-y-8" data-testid="newsletter-form">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="w-full px-8 py-6 rounded-2xl text-lg focus:outline-none transition-all duration-300"
                        style={{
                          backgroundColor: `${colors.surface}80`,
                          borderColor: `${colors.accent}30`,
                          color: colors.text.primary,
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                        required
                        data-testid="newsletter-email-input"
                      />
                    </div>
                    <Button 
                      type="submit"
                      size="lg"
                      className="group relative overflow-hidden px-12 py-6 rounded-2xl transition-all duration-500 hover:scale-105"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.background,
                        boxShadow: `0 4px 20px ${colors.accent}40`
                      }}
                      data-testid="newsletter-subscribe-button"
                    >
                      <span className="relative z-10 flex items-center text-lg">
                        Subscribe Now
                        <div className="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</div>
                      </span>
                    </Button>
                  </div>
                  
                  {/* Premium Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: `${colors.accent}20` }}>
                    <div className="flex items-center justify-center group">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${colors.accent}20` }}
                      >
                        <Crown className="h-5 w-5" style={{ color: colors.accent }} />
                      </div>
                      <span 
                        className="font-medium group-hover:transition-colors duration-300"
                        style={{ color: colors.text.primary }}
                      >
                        Exclusive Access
                      </span>
                    </div>
                    <div className="flex items-center justify-center group">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${colors.accent}20` }}
                      >
                        <Gem className="h-5 w-5" style={{ color: colors.accent }} />
                      </div>
                      <span 
                        className="font-medium group-hover:transition-colors duration-300"
                        style={{ color: colors.text.primary }}
                      >
                        VIP Previews
                      </span>
                    </div>
                    <div className="flex items-center justify-center group">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${colors.accent}20` }}
                      >
                        <Star className="h-5 w-5" style={{ color: colors.accent }} />
                      </div>
                      <span 
                        className="font-medium group-hover:transition-colors duration-300"
                        style={{ color: colors.text.primary }}
                      >
                        Special Offers
                      </span>
                    </div>
                  </div>
                </form>
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
