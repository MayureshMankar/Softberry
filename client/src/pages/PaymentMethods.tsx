import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/common/BackToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { CreditCard, Plus, Edit3, Trash2, Lock } from "lucide-react";
import { Link } from "wouter";

// Mock payment methods data - in a real app, this would come from an API
const mockPaymentMethods = [
  {
    id: "1",
    type: "credit",
    name: "John Doe",
    number: "**** **** **** 1234",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "debit",
    name: "John Doe",
    number: "**** **** **** 5678",
    expiry: "06/24",
    isDefault: false,
  }
];

export default function PaymentMethods() {
  const { colors } = useTheme();
  const [paymentMethods] = useState(mockPaymentMethods);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "credit",
    name: "",
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      type: "credit",
      name: "",
      number: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
  };

  const handleEdit = (method: any) => {
    setEditingId(method.id);
    setIsAdding(false);
    // Parse expiry date
    const [month, year] = method.expiry.split("/");
    setFormData({
      type: method.type,
      name: method.name,
      number: method.number.replace(/\*/g, ""),
      expiryMonth: month,
      expiryYear: year,
      cvv: "",
    });
  };

  const handleDelete = (id: string) => {
    // In a real app, this would make an API call
    console.log("Deleting payment method:", id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log("Saving payment method:", formData);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (number: string) => {
    // Format as **** **** **** 1234
    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length >= 4) {
      return `**** **** **** ${cleanNumber.slice(-4)}`;
    }
    return cleanNumber;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: colors.text.primary }}>Payment Methods</h1>
            <p style={{ color: colors.text.secondary }}>Manage your saved payment methods</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Saved Payment Methods
                    </CardTitle>
                    <Button 
                      onClick={handleAddNew}
                      style={{ backgroundColor: colors.accent, color: colors.background }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Card
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>No payment methods saved</h3>
                      <p className="mb-4" style={{ color: colors.text.secondary }}>Add your first payment method to get started</p>
                      <Button 
                        onClick={handleAddNew}
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                      >
                        Add Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div 
                          key={method.id} 
                          className="border rounded-lg p-4"
                          style={{ borderColor: `${colors.border}33` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-12 h-8 rounded flex items-center justify-center"
                                style={{ backgroundColor: colors.surfaceSecondary }}
                              >
                                <CreditCard className="h-4 w-4" style={{ color: colors.text.primary }} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold" style={{ color: colors.text.primary }}>
                                    {method.name}
                                  </h4>
                                  {method.isDefault && (
                                    <span 
                                      className="px-2 py-1 rounded-full text-xs font-bold"
                                      style={{ 
                                        backgroundColor: colors.accent,
                                        color: colors.background
                                      }}
                                    >
                                      DEFAULT
                                    </span>
                                  )}
                                </div>
                                <p style={{ color: colors.text.secondary }}>{method.number}</p>
                                <p className="text-sm" style={{ color: colors.text.secondary }}>Expires {method.expiry}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(method)}
                                style={{ 
                                  borderColor: `${colors.text.primary}33`, 
                                  color: colors.text.primary,
                                  backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(method.id)}
                                style={{ 
                                  borderColor: `${colors.text.primary}33`, 
                                  color: colors.text.primary,
                                  backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#ff000010';
                                  e.currentTarget.style.borderColor = '#ff000030';
                                  e.currentTarget.style.color = '#ff5555';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.borderColor = `${colors.text.primary}33`;
                                  e.currentTarget.style.color = colors.text.primary;
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {!method.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              style={{ 
                                borderColor: `${colors.text.primary}33`, 
                                color: colors.text.primary,
                                backgroundColor: 'transparent'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              Set as Default
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                    <Lock className="h-5 w-5 mr-2" />
                    {isAdding ? "Add New Card" : editingId ? "Edit Card" : "Card Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAdding || editingId ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="type" style={{ color: colors.text.primary }}>Card Type</Label>
                        <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                          <SelectTrigger 
                            style={{
                              backgroundColor: colors.background,
                              borderColor: `${colors.border}33`,
                              color: colors.text.primary
                            }}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent 
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: `${colors.border}20`
                            }}
                          >
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="debit">Debit Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="name" style={{ color: colors.text.primary }}>Cardholder Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          style={{ 
                            borderColor: `${colors.border}33`, 
                            color: colors.text.primary,
                            backgroundColor: colors.surface
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="number" style={{ color: colors.text.primary }}>Card Number</Label>
                        <Input
                          id="number"
                          value={formData.number}
                          onChange={(e) => handleChange("number", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          style={{ 
                            borderColor: `${colors.border}33`, 
                            color: colors.text.primary,
                            backgroundColor: colors.surface
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth" style={{ color: colors.text.primary }}>Expiry Month</Label>
                          <Select value={formData.expiryMonth} onValueChange={(value) => handleChange("expiryMonth", value)}>
                            <SelectTrigger 
                              style={{
                                backgroundColor: colors.background,
                                borderColor: `${colors.border}33`,
                                color: colors.text.primary
                              }}
                            >
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent 
                              style={{
                                backgroundColor: colors.surface,
                                borderColor: `${colors.border}20`
                              }}
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, "0");
                                return (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="expiryYear" style={{ color: colors.text.primary }}>Expiry Year</Label>
                          <Select value={formData.expiryYear} onValueChange={(value) => handleChange("expiryYear", value)}>
                            <SelectTrigger 
                              style={{
                                backgroundColor: colors.background,
                                borderColor: `${colors.border}33`,
                                color: colors.text.primary
                              }}
                            >
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent 
                              style={{
                                backgroundColor: colors.surface,
                                borderColor: `${colors.border}20`
                              }}
                            >
                              {Array.from({ length: 15 }, (_, i) => {
                                const year = (new Date().getFullYear() + i - 2000).toString().padStart(2, "0");
                                return (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cvv" style={{ color: colors.text.primary }}>CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleChange("cvv", e.target.value)}
                          placeholder="123"
                          style={{ 
                            borderColor: `${colors.border}33`, 
                            color: colors.text.primary,
                            backgroundColor: colors.surface
                          }}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          type="submit"
                          style={{ backgroundColor: colors.accent, color: colors.background }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                        >
                          Save Card
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          style={{ 
                            borderColor: `${colors.text.primary}33`, 
                            color: colors.text.primary,
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          Cancel
                        </Button>
                      </div>
                      
                      <div className="pt-4 text-sm" style={{ color: colors.text.secondary }}>
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4" />
                          <span>Secure payment processing</span>
                        </div>
                        <p>Your card details are encrypted and securely stored. We never store your CVV.</p>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                        {paymentMethods.length > 0 ? "Select a card to edit" : "No payment methods saved"}
                      </h3>
                      <p className="mb-4" style={{ color: colors.text.secondary }}>
                        {paymentMethods.length > 0 
                          ? "Choose a payment method from the list to view or edit details" 
                          : "Add your first payment method to get started"}
                      </p>
                      {paymentMethods.length === 0 && (
                        <Button 
                          onClick={handleAddNew}
                          style={{ backgroundColor: colors.accent, color: colors.background }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                        >
                          Add Payment Method
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}