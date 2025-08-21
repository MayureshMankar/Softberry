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
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Gift, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart, isUpdating, isRemoving } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

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

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true);
      toast({
        title: "Promo Code Applied!",
        description: "You saved 10% on your order",
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "Please check your code and try again",
        variant: "destructive",
      });
    }
  };

  const discount = promoApplied ? totalAmount * 0.1 : 0;
  const shipping = totalAmount > 5000 ? 0 : 200;
  const finalTotal = totalAmount - discount + shipping;

  if (!isAuthenticated) {
    return (
      <div className="bg-cream font-sans min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-warm-gray mx-auto mb-4" />
            <h1 className="font-serif text-4xl font-bold text-luxury-black mb-4">Sign In Required</h1>
            <p className="text-warm-gray mb-8">Please sign in to view your shopping cart.</p>
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black"
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
      <div className="bg-cream font-sans min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 text-warm-gray mx-auto mb-4" />
            <h1 className="font-serif text-4xl font-bold text-luxury-black mb-4">Your Cart is Empty</h1>
            <p className="text-warm-gray mb-8">
              Discover our exquisite collection of luxury fragrances and add them to your cart.
            </p>
            <Button
              asChild
              className="bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black"
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
    <div className="bg-cream font-sans min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-luxury-black text-cream py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">Shopping Cart</h1>
            <p className="text-warm-gray">
              Review your selected fragrances and proceed to checkout
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-luxury-black">
                Cart Items ({cartItems.length})
              </h2>
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-warm-gray hover:text-red-500"
                  data-testid="clear-cart-button"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden" data-testid={`cart-item-${item.id}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-warm-gray/10 rounded-lg overflow-hidden flex-shrink-0">
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
                            <h3 className="font-serif text-lg font-bold text-luxury-black">
                              <Link href={`/product/${item.product.slug}`} className="hover:text-champagne transition-colors">
                                {item.product.name}
                              </Link>
                            </h3>
                            {item.product.brand && (
                              <p className="text-sm text-champagne">{item.product.brand.name}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-warm-gray hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving}
                            data-testid={`remove-item-${item.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={isUpdating || item.quantity <= 1}
                                data-testid={`decrease-quantity-${item.id}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                disabled={isUpdating}
                                data-testid={`increase-quantity-${item.id}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {item.product.volume && (
                              <Badge variant="outline">{item.product.volume}</Badge>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-lg text-burgundy">
                              {formatPrice(parseFloat(item.product.price) * item.quantity)}
                            </div>
                            <div className="text-sm text-warm-gray">
                              {formatPrice(item.product.price)} each
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
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-luxury-black">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        data-testid="promo-code-input"
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={promoApplied}
                        data-testid="apply-promo-button"
                      >
                        {promoApplied ? <Percent className="h-4 w-4" /> : "Apply"}
                      </Button>
                    </div>
                    {promoApplied && (
                      <div className="flex items-center text-sm text-green-600">
                        <Gift className="mr-1 h-3 w-3" />
                        WELCOME10 applied - 10% off!
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Order Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Subtotal</span>
                      <span className="font-medium" data-testid="subtotal-amount">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    
                    {totalAmount <= 5000 && (
                      <p className="text-xs text-warm-gray">
                        Add {formatPrice(5000 - totalAmount)} more for free shipping
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg font-bold text-luxury-black">Total</span>
                    <span className="font-bold text-xl text-burgundy" data-testid="total-amount">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-luxury-black text-cream hover:bg-champagne hover:text-luxury-black font-medium py-6"
                    data-testid="proceed-to-checkout-button"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-cream"
                    data-testid="continue-shopping-button"
                  >
                    <Link href="/products">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>

                  {/* Security Features */}
                  <div className="pt-4 space-y-2 text-xs text-warm-gray">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Secure 256-bit SSL encryption
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      30-day return guarantee
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
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
    </div>
  );
}
