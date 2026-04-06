import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";
import { Gift, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GiftCards() {
  const { colors } = useTheme();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

  const giftCardAmounts = [500, 1000, 2000, 5000];

  const handlePurchase = () => {
    if (!amount || !recipientName || !recipientEmail || !senderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPurchasing(false);
      toast({
        title: "Gift Card Purchased!",
        description: `A ₹${amount} gift card has been sent to ${recipientEmail}`,
      });
      
      // Reset form
      setAmount("");
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
      setSenderName("");
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Gift Cards
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            Share the gift of luxury beauty with a Soft Berry Gift Card
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gift Card Preview */}
          <div>
            <Card 
              className="overflow-hidden"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-r from-amber-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-serif text-2xl" style={{ color: colors.text.primary }}>
                  Soft Berry Gift Card
                </CardTitle>
                <CardDescription style={{ color: colors.text.tertiary }}>
                  Perfect for any occasion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-xl p-8 text-center mb-6"
                  style={{ backgroundColor: `${colors.accent}20` }}
                >
                  <div className="text-3xl font-serif font-bold mb-2" style={{ color: colors.text.primary }}>
                    ₹{amount || "XXXX"}
                  </div>
                  <div className="text-sm" style={{ color: colors.text.tertiary }}>
                    Gift Card Value
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                      How it works
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Choose any amount between ₹500 - ₹10,000",
                        "Delivered instantly via email",
                        "No expiration date",
                        "Can be used for any product on our site"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                          <span style={{ color: colors.text.tertiary }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                      Perfect for
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Birthdays", "Anniversaries", "Holidays", "Thank You", "Just Because"].map((occasion, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: `${colors.accent}20`,
                            color: colors.accent
                          }}
                        >
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Purchase Form */}
          <div>
            <Card 
              className="overflow-hidden"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <CardHeader>
                <CardTitle style={{ color: colors.text.primary }}>
                  Customize Your Gift Card
                </CardTitle>
                <CardDescription style={{ color: colors.text.tertiary }}>
                  Create a personalized gift card for your loved ones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label style={{ color: colors.text.primary }}>Amount</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {giftCardAmounts.map((price) => (
                      <Button
                        key={price}
                        variant={amount === price.toString() ? "default" : "outline"}
                        onClick={() => setAmount(price.toString())}
                        style={{
                          backgroundColor: amount === price.toString() ? colors.accent : "transparent",
                          color: amount === price.toString() ? colors.background : colors.text.primary,
                          borderColor: colors.border
                        }}
                      >
                        ₹{price}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Label style={{ color: colors.text.primary }}>Or enter custom amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount (₹500 - ₹10,000)"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="500"
                      max="10000"
                      className="mt-1"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                        color: colors.text.primary
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label style={{ color: colors.text.primary }}>Recipient Information</Label>
                  <div className="space-y-3 mt-2">
                    <Input
                      placeholder="Recipient's Name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                        color: colors.text.primary
                      }}
                    />
                    <Input
                      type="email"
                      placeholder="Recipient's Email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.surface,
                        color: colors.text.primary
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label style={{ color: colors.text.primary }}>Your Message (Optional)</Label>
                  <Textarea
                    placeholder="Add a personal message..."
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    className="mt-1"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                      color: colors.text.primary
                    }}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label style={{ color: colors.text.primary }}>Your Name</Label>
                  <Input
                    placeholder="Your Name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="mt-1"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                      color: colors.text.primary
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ backgroundColor: colors.accent, color: colors.background }}
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? "Processing..." : `Purchase Gift Card - ₹${amount || 0}`}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10` }}>
              <h3 className="font-semibold mb-2" style={{ color: colors.text.primary }}>
                Gift Card Terms
              </h3>
              <ul className="text-sm space-y-1" style={{ color: colors.text.tertiary }}>
                <li>• Gift cards are delivered via email and can be redeemed online</li>
                <li>• No expiration date or fees</li>
                <li>• Can be used for any product on our website</li>
                <li>• Not redeemable for cash</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
