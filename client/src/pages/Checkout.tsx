import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck, 
  CheckCircle,
  Package,
  User,
  Phone,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated, token } = useAuth();
  const { colors } = useTheme();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(1);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isRazorpayConfigured, setIsRazorpayConfigured] = useState(true); // Default to true to show option until we check

  // Check if Razorpay is configured
  useEffect(() => {
    const checkRazorpayConfig = async () => {
      try {
        const response = await fetch("/api/razorpay/config");
        if (response.ok) {
          const data = await response.json();
          setIsRazorpayConfigured(data.configured);
        }
      } catch (error) {
        console.error("Error checking Razorpay configuration:", error);
        // If there's an error checking, assume it's not configured
        setIsRazorpayConfigured(false);
      }
    };

    checkRazorpayConfig();
  }, []);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    notes: ""
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: "cod" // Default to Cash on Delivery
  });

  // Razorpay payment details
  const [razorpayDetails, setRazorpayDetails] = useState({
    name: "",
    email: "",
    contact: ""
  });

  // Loading state for order placement
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Calculate order summary
  const shippingCost = totalAmount > 5000 ? 0 : 200;
  const discount = 0; // No discount applied in this flow
  const finalTotal = totalAmount + shippingCost - discount;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: string) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (section === "shipping") {
      setShippingInfo(prev => ({
        ...prev,
        [name]: value
      }));
      
      // If sameAsShipping is checked, update billing info too
      if (sameAsShipping && name !== "notes") {
        setBillingInfo(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (section === "billing") {
      setBillingInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlaceOrder = async () => {
    // Validate form data
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || 
        !shippingInfo.zipCode || !shippingInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping information",
        variant: "destructive"
      });
      return;
    }

    if (!sameAsShipping) {
      if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email || 
          !billingInfo.address || !billingInfo.city || !billingInfo.state || 
          !billingInfo.zipCode || !billingInfo.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required billing information",
          variant: "destructive"
        });
        return;
      }
    }

    // Validate payment method specific information
    if (paymentInfo.paymentMethod === "razorpay") {
      if (!razorpayDetails.name || !razorpayDetails.email || !razorpayDetails.contact) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required payment information",
          variant: "destructive"
        });
        return;
      }
    }

    // Set loading state
    setIsPlacingOrder(true);

    try {
      // For Razorpay, create order first and then process payment
      if (paymentInfo.paymentMethod === "razorpay") {
        // Create Razorpay order
        const response = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finalTotal,
            currency: "INR",
            receipt: `order_${Date.now()}`
          }),
        });

        const orderData = await response.json();

        if (!response.ok) {
          if (response.status === 503 && orderData.error === "RAZORPAY_NOT_CONFIGURED") {
            throw new Error("Razorpay payment method is not configured. Please choose another payment method or contact the store administrator.");
          }
          throw new Error(orderData.message || "Failed to create Razorpay order");
        }

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = async () => {
          // Initialize Razorpay
          const options = {
            key: "rzp_test_XXXXXXXXXXXXXX", // Replace with your actual Razorpay test key
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Soft Berry Skincare",
            description: "Order Payment",
            order_id: orderData.id,
            handler: async function (response: any) {
              // Payment successful, now create the order in our system
              await createOrderInSystem(response);
            },
            prefill: {
              name: razorpayDetails.name,
              email: razorpayDetails.email,
              contact: razorpayDetails.contact
            },
            theme: {
              color: colors.accent
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);

        // Clean up
        script.onerror = () => {
          setIsPlacingOrder(false);
          toast({
            title: "Error",
            description: "Failed to load Razorpay. Please try again.",
            variant: "destructive"
          });
        };
      } else {
        // For other payment methods, proceed as before
        await createOrderInSystem();
      }
    } catch (error: any) {
      console.error("Order placement error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setIsPlacingOrder(false);
    }
  };

  const createOrderInSystem = async (razorpayResponse?: any) => {
    try {
      // Create order
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          cartItems,
          totalAmount: finalTotal,
          shippingAddress: shippingInfo,
          billingAddress: sameAsShipping ? shippingInfo : billingInfo,
          paymentMethod: paymentInfo.paymentMethod,
          paymentDetails: razorpayResponse || {} // Include Razorpay response if available
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart after successful order
        clearCart();
        
        toast({
          title: "Order Placed Successfully!",
          description: "Thank you for your purchase. Your order confirmation with tracking information has been sent to your email.",
        });
        
        // Redirect to order confirmation page
        setLocation("/order-confirmation");
      } else {
        toast({
          title: "Order Failed",
          description: data.message || "Failed to place order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
            <h1 
              className="font-serif text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Sign In Required
            </h1>
            <p 
              className="mb-8"
              style={{ color: colors.text.secondary }}
            >
              Please sign in to proceed with checkout.
            </p>
            <Button
              onClick={() => window.location.href = '/login'}
              className="transition-all duration-300"
              style={{
                backgroundColor: colors.accent,
                color: colors.background
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Package className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
            <h1 
              className="font-serif text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Your Cart is Empty
            </h1>
            <p 
              className="mb-8"
              style={{ color: colors.text.secondary }}
            >
              Add some items to your cart before checking out.
            </p>
            <Button
              asChild
              className="transition-all duration-300"
              style={{
                backgroundColor: colors.accent,
                color: colors.background
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent;
              }}
            >
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Page Header */}
      <section style={{ backgroundColor: colors.surface, padding: '3rem 0' }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 
              className="font-serif text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Checkout
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Complete your purchase securely
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div 
              className="absolute top-4 left-0 right-0 h-0.5 -z-10"
              style={{ backgroundColor: colors.border }}
            />
            
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 1 ? 'text-white' : ''
                }`}
                style={{ 
                  backgroundColor: activeStep >= 1 ? colors.accent : colors.surface,
                  border: `2px solid ${activeStep >= 1 ? colors.accent : colors.border}`
                }}
              >
                {activeStep > 1 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-bold">1</span>
                )}
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: activeStep >= 1 ? colors.text.primary : colors.text.secondary }}
              >
                Shipping
              </span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 2 ? 'text-white' : ''
                }`}
                style={{ 
                  backgroundColor: activeStep >= 2 ? colors.accent : colors.surface,
                  border: `2px solid ${activeStep >= 2 ? colors.accent : colors.border}`
                }}
              >
                {activeStep > 2 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-bold">2</span>
                )}
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: activeStep >= 2 ? colors.text.primary : colors.text.secondary }}
              >
                Payment
              </span>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 3 ? 'text-white' : ''
                }`}
                style={{ 
                  backgroundColor: activeStep >= 3 ? colors.accent : colors.surface,
                  border: `2px solid ${activeStep >= 3 ? colors.accent : colors.border}`
                }}
              >
                {activeStep > 3 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="font-bold">3</span>
                )}
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: activeStep >= 3 ? colors.text.primary : colors.text.secondary }}
              >
                Review
              </span>
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  activeStep >= 4 ? 'text-white' : ''
                }`}
                style={{ 
                  backgroundColor: activeStep >= 4 ? colors.accent : colors.surface,
                  border: `2px solid ${activeStep >= 4 ? colors.accent : colors.border}`
                }}
              >
                <span className="font-bold">4</span>
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: activeStep >= 4 ? colors.text.primary : colors.text.secondary }}
              >
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeStep === 1 && (
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <MapPin className="w-5 h-5" style={{ color: colors.accent }} />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" style={{ color: colors.text.primary }}>First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" style={{ color: colors.text.primary }}>Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" style={{ color: colors.text.primary }}>Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" style={{ color: colors.text.primary }}>Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" style={{ color: colors.text.primary }}>Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      rows={3}
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" style={{ color: colors.text.primary }}>City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" style={{ color: colors.text.primary }}>State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" style={{ color: colors.text.primary }}>ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.text.primary,
                          borderColor: colors.border
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country" style={{ color: colors.text.primary }}>Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" style={{ color: colors.text.primary }}>Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={shippingInfo.notes}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      placeholder="Special instructions for delivery..."
                      rows={3}
                      style={{ 
                        backgroundColor: colors.background,
                        color: colors.text.primary,
                        borderColor: colors.border
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      id="sameAsShipping"
                      name="sameAsShipping"
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      style={{ 
                        accentColor: colors.accent,
                        borderColor: colors.border
                      }}
                    />
                    <Label htmlFor="sameAsShipping" style={{ color: colors.text.primary }}>
                      Billing address same as shipping address
                    </Label>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      asChild
                      variant="outline"
                      style={{
                        borderColor: colors.border,
                        color: colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.text.primary;
                      }}
                    >
                      <Link href="/cart">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Link>
                    </Button>
                    <Button
                      onClick={() => setActiveStep(2)}
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.background
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accentHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                      }}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeStep === 2 && (
              <div className="space-y-6">
                {!sameAsShipping && (
                  <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                        <User className="w-5 h-5" style={{ color: colors.accent }} />
                        Billing Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingFirstName" style={{ color: colors.text.primary }}>First Name *</Label>
                          <Input
                            id="billingFirstName"
                            name="firstName"
                            value={billingInfo.firstName}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingLastName" style={{ color: colors.text.primary }}>Last Name *</Label>
                          <Input
                            id="billingLastName"
                            name="lastName"
                            value={billingInfo.lastName}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingEmail" style={{ color: colors.text.primary }}>Email Address *</Label>
                          <Input
                            id="billingEmail"
                            name="email"
                            type="email"
                            value={billingInfo.email}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingPhone" style={{ color: colors.text.primary }}>Phone Number *</Label>
                          <Input
                            id="billingPhone"
                            name="phone"
                            value={billingInfo.phone}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress" style={{ color: colors.text.primary }}>Address *</Label>
                        <Textarea
                          id="billingAddress"
                          name="address"
                          value={billingInfo.address}
                          onChange={(e) => handleInputChange(e, "billing")}
                          rows={3}
                          style={{ 
                            backgroundColor: colors.background,
                            color: colors.text.primary,
                            borderColor: colors.border
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity" style={{ color: colors.text.primary }}>City *</Label>
                          <Input
                            id="billingCity"
                            name="city"
                            value={billingInfo.city}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingState" style={{ color: colors.text.primary }}>State *</Label>
                          <Input
                            id="billingState"
                            name="state"
                            value={billingInfo.state}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingZipCode" style={{ color: colors.text.primary }}>ZIP Code *</Label>
                          <Input
                            id="billingZipCode"
                            name="zipCode"
                            value={billingInfo.zipCode}
                            onChange={(e) => handleInputChange(e, "billing")}
                            style={{ 
                              backgroundColor: colors.background,
                              color: colors.text.primary,
                              borderColor: colors.border
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingCountry" style={{ color: colors.text.primary }}>Country</Label>
                        <Input
                          id="billingCountry"
                          name="country"
                          value={billingInfo.country}
                          onChange={(e) => handleInputChange(e, "billing")}
                          style={{ 
                            backgroundColor: colors.background,
                            color: colors.text.primary,
                            borderColor: colors.border
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                      <CreditCard className="w-5 h-5" style={{ color: colors.accent }} />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Payment Method Selection - COD and Razorpay */}
                    <div className="space-y-2">
                      <Label style={{ color: colors.text.primary }}>Payment Method *</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          type="button"
                          variant={paymentInfo.paymentMethod === "cod" ? "default" : "outline"}
                          onClick={() => setPaymentInfo({ paymentMethod: "cod" })}
                          style={{
                            backgroundColor: paymentInfo.paymentMethod === "cod" ? colors.accent : 'transparent',
                            color: paymentInfo.paymentMethod === "cod" ? colors.background : colors.text.primary,
                            borderColor: paymentInfo.paymentMethod === "cod" ? colors.accent : colors.border
                          }}
                          onMouseEnter={(e) => {
                            if (paymentInfo.paymentMethod !== "cod") {
                              e.currentTarget.style.backgroundColor = colors.accent;
                              e.currentTarget.style.color = colors.background;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (paymentInfo.paymentMethod !== "cod") {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = colors.text.primary;
                            }
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.8-12.8H11.2v6.4h1.6V9.2zm-4 0H7.2v6.4h1.6V9.2zm8 0h-1.6v6.4h1.6V9.2z"/>
                          </svg>
                          Cash on Delivery
                        </Button>
                        
                        {/* Razorpay option - only show if configured */}
                        {isRazorpayConfigured && (
                          <Button
                            type="button"
                            variant={paymentInfo.paymentMethod === "razorpay" ? "default" : "outline"}
                            onClick={() => setPaymentInfo({ paymentMethod: "razorpay" })}
                            style={{
                              backgroundColor: paymentInfo.paymentMethod === "razorpay" ? colors.accent : 'transparent',
                              color: paymentInfo.paymentMethod === "razorpay" ? colors.background : colors.text.primary,
                              borderColor: paymentInfo.paymentMethod === "razorpay" ? colors.accent : colors.border
                            }}
                            onMouseEnter={(e) => {
                              if (paymentInfo.paymentMethod !== "razorpay") {
                                e.currentTarget.style.backgroundColor = colors.accent;
                                e.currentTarget.style.color = colors.background;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (paymentInfo.paymentMethod !== "razorpay") {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = colors.text.primary;
                              }
                            }}
                          >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.8-12.8H11.2v6.4h1.6V9.2zm-4 0H7.2v6.4h1.6V9.2zm8 0h-1.6v6.4h1.6V9.2z"/>
                            </svg>
                            Pay with Razorpay
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Specific Information */}
                    {paymentInfo.paymentMethod === "cod" && (
                      <div className="bg-blue-50 p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                        <p style={{ color: colors.text.primary }}>
                          You have selected Cash on Delivery. You will pay when your order is delivered.
                        </p>
                      </div>
                    )}
                    
                    {paymentInfo.paymentMethod === "razorpay" && isRazorpayConfigured && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
                          <p style={{ color: colors.text.primary }}>
                            You will be redirected to Razorpay to complete your payment securely.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="razorpayName" style={{ color: colors.text.primary }}>Full Name *</Label>
                            <Input
                              id="razorpayName"
                              value={razorpayDetails.name}
                              onChange={(e) => setRazorpayDetails({...razorpayDetails, name: e.target.value})}
                              placeholder="Enter your full name"
                              style={{ 
                                backgroundColor: colors.background,
                                color: colors.text.primary,
                                borderColor: colors.border
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="razorpayEmail" style={{ color: colors.text.primary }}>Email Address *</Label>
                            <Input
                              id="razorpayEmail"
                              type="email"
                              value={razorpayDetails.email}
                              onChange={(e) => setRazorpayDetails({...razorpayDetails, email: e.target.value})}
                              placeholder="Enter your email"
                              style={{ 
                                backgroundColor: colors.background,
                                color: colors.text.primary,
                                borderColor: colors.border
                              }}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="razorpayContact" style={{ color: colors.text.primary }}>Phone Number *</Label>
                            <Input
                              id="razorpayContact"
                              value={razorpayDetails.contact}
                              onChange={(e) => setRazorpayDetails({...razorpayDetails, contact: e.target.value})}
                              placeholder="Enter your phone number"
                              style={{ 
                                backgroundColor: colors.background,
                                color: colors.text.primary,
                                borderColor: colors.border
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setActiveStep(1)}
                        style={{
                          borderColor: colors.border,
                          color: colors.text.primary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.accent;
                          e.currentTarget.style.color = colors.background;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.text.primary;
                        }}
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        onClick={() => setActiveStep(3)}
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.background
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.accentHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.accent;
                        }}
                      >
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeStep === 3 && (
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <CheckCircle className="w-5 h-5" style={{ color: colors.accent }} />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                      Shipping Information
                    </h3>
                    <div className="space-y-2" style={{ color: colors.text.secondary }}>
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                      {shippingInfo.notes && (
                        <div className="pt-2">
                          <p className="font-medium">Order Notes:</p>
                          <p>{shippingInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator style={{ backgroundColor: colors.border }} />
                  
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-4" style={{ color: colors.text.primary }}>
                      Payment Method
                    </h3>
                    <div className="flex items-center gap-3" style={{ color: colors.text.secondary }}>
                      <CreditCard className="w-5 h-5" />
                      <span>Cash on Delivery</span>
                    </div>
                  </div>
                  
                  <Separator style={{ backgroundColor: colors.border }} />
                  
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(2)}
                      style={{
                        borderColor: colors.border,
                        color: colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.text.primary;
                      }}
                    >
                      Back to Payment
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.background
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accentHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                      }}
                    >
                      {isPlacingOrder ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : "Place Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeStep === 4 && (
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <CheckCircle className="w-5 h-5" style={{ color: colors.accent }} />
                    Order Confirmed!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.accent}20` }}>
                    <CheckCircle className="w-8 h-8" style={{ color: colors.accent }} />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold" style={{ color: colors.text.primary }}>
                    Thank You for Your Purchase!
                  </h3>
                  
                  <p style={{ color: colors.text.secondary }}>
                    Your order has been placed successfully. A confirmation email with tracking information has been sent to {shippingInfo.email}.
                  </p>
                  
                  <div className="bg-[#F8F7F4] dark:bg-[#111111] rounded-lg p-4 text-left">
                    <h4 className="font-bold mb-2" style={{ color: colors.text.primary }}>Order Summary</h4>
                    <div className="space-y-1" style={{ color: colors.text.secondary }}>
                      <p>Order Number: <span className="font-medium" style={{ color: colors.text.primary }}>#ORD-{Date.now().toString().slice(-6)}</span></p>
                      <p>Tracking Number: <span className="font-medium" style={{ color: colors.text.primary }}>TRK-{Date.now().toString().slice(-8)}</span></p>
                      <p>Estimated Delivery: <span className="font-medium" style={{ color: colors.text.primary }}>3-5 business days</span></p>
                      <p className="mt-2">
                        <a 
                          href="/track-order" 
                          className="text-sm font-medium"
                          style={{ color: colors.accent }}
                        >
                          Track your order here →
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                      asChild
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.background
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accentHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                      }}
                    >
                      <Link href="/profile">
                        View Order Details
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      style={{
                        borderColor: colors.border,
                        color: colors.text.primary,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.background;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.text.primary;
                      }}
                    >
                      <Link href="/products">
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl" style={{ color: colors.text.primary }}>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              style={{ backgroundColor: colors.surfaceSecondary }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="font-medium line-clamp-2"
                            style={{ color: colors.text.primary }}
                          >
                            {item.product.name}
                          </h3>
                          <div className="flex justify-between items-center mt-1">
                            <p style={{ color: colors.text.secondary }}>
                              Qty: {item.quantity}
                            </p>
                            <p 
                              className="font-medium"
                              style={{ color: colors.text.primary }}
                            >
                              {formatPrice(parseFloat(item.product.price.toString()) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator style={{ backgroundColor: colors.border }} />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Subtotal</span>
                      <span style={{ color: colors.text.primary }}>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Shipping</span>
                      <span style={{ color: colors.text.primary }}>
                        {shippingCost === 0 ? (
                          <span style={{ color: colors.accent }}>Free</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between" style={{ color: colors.accent }}>
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator style={{ backgroundColor: colors.border }} />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span style={{ color: colors.text.primary }}>Total</span>
                    <span style={{ color: colors.text.primary }}>{formatPrice(finalTotal)}</span>
                  </div>
                  
                  <div className="pt-4 space-y-2 text-xs" style={{ color: colors.text.secondary }}>
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" style={{ color: colors.accent }} />
                      Secure 256-bit SSL encryption
                    </div>
                    <div className="flex items-center">
                      <Truck className="mr-2 h-4 w-4" style={{ color: colors.accent }} />
                      Free shipping on orders over ₹5,000
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {activeStep < 4 && (
                <div className="mt-6 text-center text-sm" style={{ color: colors.text.secondary }}>
                  <p>Need help? Contact our support team</p>
                  <p className="mt-1">softberryskincare@gmail.com | +91 98765 43210</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}
