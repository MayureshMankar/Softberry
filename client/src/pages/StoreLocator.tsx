import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { MapPin, Phone, Clock, Search } from "lucide-react";

export default function StoreLocator() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock store data
  const stores = [
    {
      id: 1,
      name: "Soft Berry Skincare Flagship Store",
      address: "123 Luxury Avenue, Mumbai, Maharashtra 400001",
      phone: "+91 98765 43210",
      hours: "Mon-Sat: 10AM-9PM, Sun: 11AM-7PM",
      lat: 19.0760,
      lng: 72.8777
    },
    {
      id: 2,
      name: "Soft Berry Skincare Juhu Store",
      address: "456 Beach Road, Juhu, Mumbai, Maharashtra 400049",
      phone: "+91 98765 43211",
      hours: "Mon-Sun: 10AM-10PM",
      lat: 19.0974,
      lng: 72.8258
    },
    {
      id: 3,
      name: "Soft Berry Skincare Delhi Store",
      address: "789 Fashion Street, Connaught Place, New Delhi 110001",
      phone: "+91 98765 43212",
      hours: "Mon-Sun: 11AM-9PM",
      lat: 28.6304,
      lng: 77.2177
    },
    {
      id: 4,
      name: "Soft Berry Skincare Bangalore Store",
      address: "101 MG Road, Bangalore, Karnataka 560001",
      phone: "+91 98765 43213",
      hours: "Mon-Sun: 10AM-10PM",
      lat: 12.9716,
      lng: 77.5946
    },
    {
      id: 5,
      name: "Soft Berry Skincare Chennai Store",
      address: "202 Marina Beach Road, Chennai, Tamil Nadu 600001",
      phone: "+91 98765 43214",
      hours: "Mon-Sun: 10AM-9PM",
      lat: 13.0827,
      lng: 80.2707
    },
    {
      id: 6,
      name: "Soft Berry Skincare Kolkata Store",
      address: "303 Park Street, Kolkata, West Bengal 700016",
      phone: "+91 98765 43215",
      hours: "Mon-Sun: 11AM-8PM",
      lat: 22.5726,
      lng: 88.3639
    }
  ];

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Store Locator
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            Find the nearest Soft Berry Skincare store to experience our luxury cosmetics in person
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              style={{ color: colors.text.tertiary }}
            />
            <Input
              type="text"
              placeholder="Search by city, address, or store name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.text.primary
              }}
            />
          </div>
        </div>

        {/* Store Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div 
              key={store.id}
              className="rounded-xl overflow-hidden border"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')" }}
              />
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                  {store.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                    <p style={{ color: colors.text.tertiary }}>{store.address}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
                    <p style={{ color: colors.text.tertiary }}>{store.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 flex-shrink-0" style={{ color: colors.accent }} />
                    <p style={{ color: colors.text.tertiary }}>{store.hours}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.text.primary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent;
                    e.currentTarget.style.color = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.text.primary;
                  }}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <div 
            className="rounded-xl overflow-hidden h-96 flex items-center justify-center"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.border 
            }}
          >
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4" style={{ color: colors.text.tertiary }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                Interactive Store Map
              </h3>
              <p className="mb-4" style={{ color: colors.text.tertiary }}>
                In a real implementation, this would show an interactive map with all store locations
              </p>
              <Button style={{ backgroundColor: colors.accent, color: colors.background }}>
                View Full Map
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.accent}20` }}>
              <MapPin className="h-8 w-8" style={{ color: colors.accent }} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Find Your Nearest Store
            </h3>
            <p style={{ color: colors.text.tertiary }}>
              Locate the closest Soft Berry Skincare store to experience our premium cosmetics in person
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.accent}20` }}>
              <Clock className="h-8 w-8" style={{ color: colors.accent }} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Store Hours
            </h3>
            <p style={{ color: colors.text.tertiary }}>
              Most stores are open daily with extended hours on weekends for your convenience
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.accent}20` }}>
              <Phone className="h-8 w-8" style={{ color: colors.accent }} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Contact Stores
            </h3>
            <p style={{ color: colors.text.tertiary }}>
              Call ahead to check product availability or book a personalized beauty consultation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
