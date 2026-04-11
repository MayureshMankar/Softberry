import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Gift, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Cart() {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart, isUpdating, isRemoving } = useCart();
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { toast } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString()}`;
  };

  const handleQuantityChange = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity({ id, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const shipping = totalAmount > 5000 ? 0 : 200;
  const finalTotal = totalAmount + shipping;

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: colors.background, fontFamily: 'sans-serif', minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
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
              Please sign in to view your shopping cart.
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
              data-testid="cart-signin-button"
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
      <div style={{ backgroundColor: colors.background, fontFamily: 'sans-serif', minHeight: '100vh' }}>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
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
              Discover our exquisite collection of luxury cosmetics and add them to your cart.
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
              data-testid="empty-cart-shop-button"
            >
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.background, fontFamily: 'sans-serif', minHeight: '100vh' }}>
      <Header />
      
      {/* Page Header */}
      <section style={{ backgroundColor: colors.surface, padding: '3rem 0' }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 
              className="font-serif text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Shopping Cart
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Review your selected products and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="font-serif text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Cart Items ({cartItems.length})
              </h2>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowClearConfirm(true)}
                  className="transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                  data-testid="clear-cart-button"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden" data-testid={`cart-item-${item.id}`}
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div 
                        className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: colors.surfaceSecondary }}
                      >
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 
                              className="font-serif text-lg font-bold"
                              style={{ color: colors.text.primary }}
                            >
                              <Link 
                                href={`/product/${item.product.slug}`} 
                                className="transition-colors duration-200"
                                style={{ color: colors.text.primary }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = colors.accent;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = colors.text.primary;
                                }}
                              >
                                {item.product.name}
                              </Link>
                            </h3>
                            {/* Brand information not available in current product type */}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="transition-colors duration-200"
                            style={{ color: colors.text.secondary }}
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving}
                            data-testid={`remove-item-${item.id}`}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = colors.accent;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = colors.text.secondary;
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="flex items-center border rounded-lg"
                              style={{ borderColor: colors.border }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={isUpdating || item.quantity <= 1}
                                data-testid={`decrease-quantity-${item.id}`}
                                style={{ color: colors.text.primary }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${colors.text.secondary}1a`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span 
                                className="px-4 py-2 min-w-[3rem] text-center font-medium"
                                style={{ color: colors.text.primary }}
                              >
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={isUpdating}
                                data-testid={`increase-quantity-${item.id}`}
                                style={{ color: colors.text.primary }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${colors.text.secondary}1a`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {item.product.volume && (
                              <Badge 
                                variant="outline"
                                style={{ 
                                  backgroundColor: colors.background,
                                  color: colors.text.primary,
                                  border: `1px solid ${colors.border}`
                                }}
                              >
                                {item.product.volume}
                              </Badge>
                            )}
                          </div>

                          <div className="text-right">
                            <div 
                              className="font-bold text-lg"
                              style={{ color: colors.text.primary }}
                            >
                              {formatPrice((parseFloat(item.product.price.toString()) || 0) * item.quantity)}
                            </div>
                            <div 
                              className="text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {formatPrice(item.product.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`
                }}
              >
                <CardHeader>
                  <CardTitle 
                    className="font-serif text-2xl"
                    style={{ color: colors.text.primary }}
                  >
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Subtotal</span>
                      <span 
                        className="font-medium" 
                        data-testid="subtotal-amount"
                        style={{ color: colors.text.primary }}
                      >
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span style={{ color: colors.accent }}>Free</span>
                        ) : (
                          <span style={{ color: colors.text.primary }}>
                            {formatPrice(shipping)}
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {totalAmount <= 5000 && (
                      <p 
                        className="text-xs"
                        style={{ color: colors.text.secondary }}
                      >
                        Add {formatPrice(5000 - totalAmount)} more for free shipping
                      </p>
                    )}
                  </div>

                  <Separator style={{ backgroundColor: colors.border }} />

                  <div className="flex justify-between items-center">
                    <span 
                      className="font-serif text-lg font-bold"
                      style={{ color: colors.text.primary }}
                    >
                      Total
                    </span>
                    <span 
                      className="font-bold text-xl"
                      data-testid="total-amount"
                      style={{ color: colors.text.primary }}
                    >
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <Button
                    asChild
                    className="w-full font-medium py-6"
                    data-testid="proceed-to-checkout-button"
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
                    <Link href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    data-testid="continue-shopping-button"
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
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>

                  {/* Security Features */}
                  <div 
                    className="pt-4 space-y-2 text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: colors.accent }}
                      />
                      Secure 256-bit SSL encryption
                    </div>
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: colors.accent }}
                      />
                      30-day return guarantee
                    </div>
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: colors.accent }}
                      />
                      Premium gift packaging included
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
      
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <DialogHeader>
            <DialogTitle 
              style={{ color: colors.text.primary }}
            >
              Clear Shopping Cart
            </DialogTitle>
            <DialogDescription 
              style={{ color: colors.text.secondary }}
            >
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter 
            className="gap-2 sm:gap-0"
            style={{ 
              borderColor: colors.border,
            }}
          >
            <Button
              variant="outline"
              onClick={() => setShowClearConfirm(false)}
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearCart();
                setShowClearConfirm(false);
              }}
              style={{
                backgroundColor: '#ef4444',
                color: colors.background
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
