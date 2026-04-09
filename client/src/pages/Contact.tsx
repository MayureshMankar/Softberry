import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";

import { MapPin, Phone, Mail, Clock, Send, MessageCircle, HelpCircle, Crown } from "lucide-react";

export default function Contact() {
  const { colors } = useTheme();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  return (
    <div style={{ backgroundColor: colors.background, fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: colors.background }}>
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
              <span style={{ color: colors.text.primary }}>Get In</span> <span style={{ color: colors.text.accent }}>Touch</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: colors.text.tertiary }}>
              Have questions about our cosmetics or need personalized recommendations? 
              Our beauty experts are here to help you build your perfect routine.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: colors.text.primary }}>Contact Information</h2>
                <p className="text-lg leading-relaxed mb-8" style={{ color: colors.text.tertiary }}>
                  Reach out to us through any of the following channels. We're committed to providing 
                  exceptional customer service and personalized beauty expertise.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300" style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight
                }}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{
                      backgroundColor: colors.accent
                    }}>
                      <MapPin className="text-lg" style={{ color: colors.background }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Visit Our Store</h3>
                      <p style={{ color: colors.text.tertiary }}>B/18A Hind Saurashtra Estate</p>
                      <p style={{ color: colors.text.tertiary }}>Andheri (E), Mumbai 400059</p>
                      <p style={{ color: colors.text.tertiary }}>India</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300" style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight
                }}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{
                      backgroundColor: colors.accent
                    }}>
                      <Phone className="text-lg" style={{ color: colors.background }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Call Us</h3>
                      <p style={{ color: colors.text.tertiary }}>+91 99207 71494</p>
                      <p className="text-sm" style={{ color: colors.text.tertiary }}>For wholesale and dealer inquiries, please contact us directly</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300" style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight
                }}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{
                      backgroundColor: colors.accent
                    }}>
                      <Mail className="text-lg" style={{ color: colors.background }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Email Us</h3>
                      <p style={{ color: colors.text.tertiary }}>softberryskincare@gmail.com</p>
                      <p className="text-sm" style={{ color: colors.text.tertiary }}>We'll respond within 24 hours</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300" style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight
                }}>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{
                      backgroundColor: colors.accent
                    }}>
                      <Clock className="text-lg" style={{ color: colors.background }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Store Hours</h3>
                      <div className="space-y-1">
                        <p style={{ color: colors.text.tertiary }}>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                        <p style={{ color: colors.text.tertiary }}>Sunday: 11:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="rounded-2xl shadow-xl" style={{
                backgroundColor: colors.surface,
                borderColor: colors.borderLight
              }}>
                <CardHeader className="p-8 pb-6">
                  <CardTitle className="font-serif text-2xl flex items-center gap-3" style={{ color: colors.text.primary }}>
                    <Send style={{ color: colors.text.accent }} />
                    Send us a Message
                  </CardTitle>
                  <p style={{ color: colors.text.tertiary }}>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                          First Name *
                        </label>
                        <Input 
                          type="text" 
                          placeholder="Your first name" 
                          required 
                          className="focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.text.primary,
                            borderColor: `${colors.border}4D`
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                          Last Name *
                        </label>
                        <Input 
                          type="text" 
                          placeholder="Your last name" 
                          required 
                          className="focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.text.primary,
                            borderColor: `${colors.border}4D`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                        Email Address *
                      </label>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        required 
                        className="focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: `${colors.border}4D`
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                        Phone Number
                      </label>
                      <Input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        className="focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: `${colors.border}4D`
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                        Subject *
                      </label>
                      <Input 
                        type="text" 
                        placeholder="What can we help you with?" 
                        required 
                        className="focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: `${colors.border}4D`
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                        Message *
                      </label>
                      <textarea 
                        placeholder="Tell us more about how we can help you..."
                        rows={5}
                        required 
                        className="w-full px-3 py-2 border focus:outline-none focus:ring-2 rounded-md resize-none"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: `${colors.border}4D`
                        }}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full font-medium py-3 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.background
                      }}
                      data-testid="submit-contact-form"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: colors.text.primary }}>Frequently Asked Questions</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
              Find quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: `${colors.accent}33`
                }}>
                  <HelpCircle className="text-lg" style={{ color: colors.text.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Are your products authentic?</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text.tertiary }}>
                    Yes, all our products are 100% authentic and sourced directly from authorized 
                    distributors. We provide certificates of authenticity with every purchase.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: `${colors.accent}33`
                }}>
                  <HelpCircle className="text-lg" style={{ color: colors.text.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Do you offer free shipping?</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text.tertiary }}>
                    We offer free shipping on orders above ₹3,000. For orders below this amount, 
                    standard shipping charges apply based on your location.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: `${colors.accent}33`
                }}>
                  <HelpCircle className="text-lg" style={{ color: colors.text.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Can I return or exchange products?</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text.tertiary }}>
                    We accept returns within 30 days of purchase for unopened products. 
                    Exchanges are available for defective items within 7 days of delivery.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300" style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderLight
            }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: `${colors.accent}33`
                }}>
                  <HelpCircle className="text-lg" style={{ color: colors.text.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Do you provide beauty consultations?</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text.tertiary }}>
                    Yes! Our beauty experts are available for personalized consultations. 
                    Contact us to schedule a session and build your perfect routine.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Chat CTA */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: colors.background }}>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{
              backgroundColor: `${colors.accent}33`
            }}>
              <MessageCircle className="text-2xl" style={{ color: colors.text.accent }} />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>Need Immediate Assistance?</h2>
            <p className="mb-8 leading-relaxed" style={{ color: colors.text.tertiary }}>
              Our customer support team is available during business hours to help you with any questions 
              about our products, orders, or beauty recommendations.
            </p>
            <Button 
              className="font-medium px-8 py-3 rounded-lg transition-colors duration-300"
              style={{
                backgroundColor: colors.accent,
                color: colors.background
              }}
              data-testid="live-chat-button"
            >
              Start Live Chat
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
