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
import { MapPin, Plus, Edit3, Trash2 } from "lucide-react";
import { Link } from "wouter";

// Mock address data - in a real app, this would come from an API
const mockAddresses = [
  {
    id: "1",
    type: "home",
    name: "John Doe",
    address: "123 Luxury Avenue",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    country: "India",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "John Doe",
    address: "456 Business District",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400002",
    country: "India",
    phone: "+91 98765 43210",
    isDefault: false,
  }
];

export default function AddressBook() {
  const { colors } = useTheme();
  const [addresses] = useState(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "home",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      type: "home",
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      phone: "",
    });
  };

  const handleEdit = (address: any) => {
    setEditingId(address.id);
    setIsAdding(false);
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
    });
  };

  const handleDelete = (id: string) => {
    // In a real app, this would make an API call
    console.log("Deleting address:", id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    console.log("Saving address:", formData);
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: colors.text.primary }}>Address Book</h1>
            <p style={{ color: colors.text.secondary }}>Manage your shipping and billing addresses</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card style={{ backgroundColor: colors.surface, borderColor: `${colors.border}33` }}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="font-serif flex items-center" style={{ color: colors.text.primary }}>
                      <MapPin className="h-5 w-5 mr-2" />
                      Saved Addresses
                    </CardTitle>
                    <Button 
                      onClick={handleAddNew}
                      style={{ backgroundColor: colors.accent, color: colors.background }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>No addresses saved</h3>
                      <p className="mb-4" style={{ color: colors.text.secondary }}>Add your first address to get started</p>
                      <Button 
                        onClick={handleAddNew}
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                      >
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className="border rounded-lg p-4"
                          style={{ borderColor: `${colors.border}33` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold" style={{ color: colors.text.primary }}>
                                  {address.name}
                                </h4>
                                {address.isDefault && (
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
                              <span 
                                className="px-2 py-1 rounded-full text-xs"
                                style={{ 
                                  backgroundColor: colors.background,
                                  color: colors.text.primary,
                                  border: `1px solid ${colors.border}`
                                }}
                              >
                                {address.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(address)}
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
                                onClick={() => handleDelete(address.id)}
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
                          
                          <div className="text-sm" style={{ color: colors.text.secondary }}>
                            <p>{address.address}</p>
                            <p>{address.city}, {address.state} {address.zipCode}</p>
                            <p>{address.country}</p>
                            <p className="mt-1" style={{ color: colors.text.primary }}>{address.phone}</p>
                          </div>
                          
                          {!address.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3"
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
                  <CardTitle className="font-serif" style={{ color: colors.text.primary }}>
                    {isAdding ? "Add New Address" : editingId ? "Edit Address" : "Address Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAdding || editingId ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="type" style={{ color: colors.text.primary }}>Address Type</Label>
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
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="name" style={{ color: colors.text.primary }}>Full Name</Label>
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
                        <Label htmlFor="address" style={{ color: colors.text.primary }}>Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          style={{ 
                            borderColor: `${colors.border}33`, 
                            color: colors.text.primary,
                            backgroundColor: colors.surface
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" style={{ color: colors.text.primary }}>City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            style={{ 
                              borderColor: `${colors.border}33`, 
                              color: colors.text.primary,
                              backgroundColor: colors.surface
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="state" style={{ color: colors.text.primary }}>State</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleChange("state", e.target.value)}
                            style={{ 
                              borderColor: `${colors.border}33`, 
                              color: colors.text.primary,
                              backgroundColor: colors.surface
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode" style={{ color: colors.text.primary }}>ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleChange("zipCode", e.target.value)}
                            style={{ 
                              borderColor: `${colors.border}33`, 
                              color: colors.text.primary,
                              backgroundColor: colors.surface
                            }}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="country" style={{ color: colors.text.primary }}>Country</Label>
                          <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
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
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" style={{ color: colors.text.primary }}>Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
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
                          Save Address
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
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-16 w-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                        {addresses.length > 0 ? "Select an address to edit" : "No addresses saved"}
                      </h3>
                      <p className="mb-4" style={{ color: colors.text.secondary }}>
                        {addresses.length > 0 
                          ? "Choose an address from the list to view or edit details" 
                          : "Add your first address to get started"}
                      </p>
                      {addresses.length === 0 && (
                        <Button 
                          onClick={handleAddNew}
                          style={{ backgroundColor: colors.accent, color: colors.background }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentHover}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                        >
                          Add Address
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