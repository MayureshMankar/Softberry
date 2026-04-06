import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Bell, Mail, ShoppingCart, Package, Tag, Settings, Check, X } from "lucide-react";
import { Link } from "wouter";

// Mock notification settings - in a real app, this would come from an API
const mockNotificationSettings = [
  {
    id: "order_updates",
    title: "Order Updates",
    description: "Get notified about your order status, shipping updates, and delivery",
    email: true,
    push: true,
    sms: true,
  },
  {
    id: "promotions",
    title: "Promotions & Offers",
    description: "Receive notifications about special offers, discounts, and sales",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "new_arrivals",
    title: "New Arrivals",
    description: "Get notified when new products are added to our collection",
    email: false,
    push: true,
    sms: false,
  },
  {
    id: "wishlist",
    title: "Wishlist Updates",
    description: "Receive alerts when items in your wishlist go on sale or are back in stock",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "account_activity",
    title: "Account Activity",
    description: "Get security alerts for account logins and password changes",
    email: true,
    push: true,
    sms: true,
  }
];

export default function Notifications() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState(mockNotificationSettings);

  const toggleSetting = (settingId: string, type: "email" | "push" | "sms") => {
    setSettings(prev => prev.map(setting => {
      if (setting.id === settingId) {
        return {
          ...setting,
          [type]: !setting[type]
        };
      }
      return setting;
    }));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "order_updates":
        return <Package className="h-5 w-5" />;
      case "promotions":
        return <Tag className="h-5 w-5" />;
      case "new_arrivals":
        return <ShoppingCart className="h-5 w-5" />;
      case "wishlist":
        return <Bell className="h-5 w-5" />;
      case "account_activity":
        return <Settings className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: colors.text.primary }}>Notification Preferences</h1>
            <p style={{ color: colors.text.secondary }}>Manage how you want to be notified about your account activity and updates</p>
          </div>

          <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
            <CardHeader>
              <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Notification Channels */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4" style={{ borderBottom: `1px solid ${colors.border}33` }}>
                  <div></div>
                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <Mail className="h-6 w-6 mb-2" style={{ color: colors.text.primary }} />
                      <span className="font-medium" style={{ color: colors.text.primary }}>Email</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <Bell className="h-6 w-6 mb-2" style={{ color: colors.text.primary }} />
                      <span className="font-medium" style={{ color: colors.text.primary }}>Push</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg mb-2" style={{ color: colors.text.primary }}>📱</span>
                      <span className="font-medium" style={{ color: colors.text.primary }}>SMS</span>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                {settings.map((setting) => (
                  <div 
                    key={setting.id} 
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4"
                    style={{ borderBottom: `1px solid ${colors.border}33` }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: `${colors.accent}20` }}
                      >
                        {getIcon(setting.id)}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: colors.text.primary }}>{setting.title}</h3>
                        <p className="text-sm" style={{ color: colors.text.secondary }}>{setting.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <Button
                        variant={setting.email ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSetting(setting.id, "email")}
                        style={{ 
                          backgroundColor: setting.email ? colors.accent : 'transparent',
                          color: setting.email ? colors.background : colors.text.primary,
                          borderColor: setting.email ? colors.accent : `${colors.border}33`
                        }}
                        onMouseEnter={(e) => {
                          if (setting.email) {
                            e.currentTarget.style.backgroundColor = colors.accentHover;
                          } else {
                            e.currentTarget.style.backgroundColor = `${colors.accent}10`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (setting.email) {
                            e.currentTarget.style.backgroundColor = colors.accent;
                          } else {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {setting.email ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <Button
                        variant={setting.push ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSetting(setting.id, "push")}
                        style={{ 
                          backgroundColor: setting.push ? colors.accent : 'transparent',
                          color: setting.push ? colors.background : colors.text.primary,
                          borderColor: setting.push ? colors.accent : `${colors.border}33`
                        }}
                        onMouseEnter={(e) => {
                          if (setting.push) {
                            e.currentTarget.style.backgroundColor = colors.accentHover;
                          } else {
                            e.currentTarget.style.backgroundColor = `${colors.accent}10`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (setting.push) {
                            e.currentTarget.style.backgroundColor = colors.accent;
                          } else {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {setting.push ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <Button
                        variant={setting.sms ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSetting(setting.id, "sms")}
                        style={{ 
                          backgroundColor: setting.sms ? colors.accent : 'transparent',
                          color: setting.sms ? colors.background : colors.text.primary,
                          borderColor: setting.sms ? colors.accent : `${colors.border}33`
                        }}
                        onMouseEnter={(e) => {
                          if (setting.sms) {
                            e.currentTarget.style.backgroundColor = colors.accentHover;
                          } else {
                            e.currentTarget.style.backgroundColor = `${colors.accent}10`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (setting.sms) {
                            e.currentTarget.style.backgroundColor = colors.accent;
                          } else {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {setting.sms ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Save Button */}
                <div className="pt-4 flex justify-end">
                  <Button 
                    style={{ backgroundColor: colors.accent, color: colors.background }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification History */}
          <div className="mt-8">
            <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
              <CardHeader>
                <CardTitle className="font-serif" style={{ color: colors.text.primary }}>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1"
                      style={{ backgroundColor: `${colors.accent}20` }}
                    >
                      <Package className="h-4 w-4" style={{ color: colors.accent }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Order Shipped</h4>
                      <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>Your order #ORD-789456 has been shipped and is on its way.</p>
                      <p className="text-xs" style={{ color: colors.text.tertiary }}>2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1"
                      style={{ backgroundColor: `${colors.accent}20` }}
                    >
                      <Tag className="h-4 w-4" style={{ color: colors.accent }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Special Offer</h4>
                      <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>Get 20% off on all vitamin C serums this weekend only!</p>
                      <p className="text-xs" style={{ color: colors.text.tertiary }}>1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1"
                      style={{ backgroundColor: `${colors.accent}20` }}
                    >
                      <Bell className="h-4 w-4" style={{ color: colors.accent }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold" style={{ color: colors.text.primary }}>Wishlist Item on Sale</h4>
                      <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>Midnight Essence from your wishlist is now 30% off.</p>
                      <p className="text-xs" style={{ color: colors.text.tertiary }}>3 days ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: `${colors.text.primary}33`, 
                      color: colors.text.primary,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    View All Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
