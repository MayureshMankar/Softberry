import { useTheme } from "@/contexts/ThemeContext";
import { Ruler, Info } from "lucide-react";

export default function SizeGuide() {
  const { colors } = useTheme();

  const perfumeSizes = [
    {
      id: 1,
      size: "15 ml",
      description: "Sample size, perfect for trying new products",
      dimensions: "3cm x 3cm x 3cm",
      weight: "50g"
    },
    {
      id: 2,
      size: "30 ml",
      description: "Travel size, ideal for short trips",
      dimensions: "5cm x 5cm x 5cm",
      weight: "100g"
    },
    {
      id: 3,
      size: "50 ml",
      description: "Regular size, perfect for daily use",
      dimensions: "7cm x 7cm x 7cm",
      weight: "150g"
    },
    {
      id: 4,
      size: "100 ml",
      description: "Large size, great value for regular users",
      dimensions: "10cm x 10cm x 10cm",
      weight: "250g"
    }
  ];

  const giftSetSizes = [
    {
      id: 1,
      setName: "Discovery Set",
      items: "5 x 15ml bottles",
      description: "Perfect introduction to our collection"
    },
    {
      id: 2,
      setName: "Gift Box",
      items: "3 x 50ml bottles",
      description: "Elegantly packaged for gifting"
    },
    {
      id: 3,
      setName: "Collector's Set",
      items: "5 x 100ml bottles",
      description: "Complete collection in premium packaging"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Size Guide
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.tertiary }}>
            Find the perfect size for your needs with our comprehensive size guide
          </p>
        </div>

        {/* Product Sizes */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center" style={{ color: colors.text.primary }}>
            Individual Product Sizes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perfumeSizes.map((size) => (
              <div 
                key={size.id}
                className="rounded-xl p-6 border text-center"
                style={{ 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }}
              >
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.accent}20` }}>
                  <Ruler className="h-8 w-8" style={{ color: colors.accent }} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                  {size.size}
                </h3>
                <p className="mb-4" style={{ color: colors.text.tertiary }}>
                  {size.description}
                </p>
                <div className="text-sm space-y-1">
                  <p style={{ color: colors.text.tertiary }}>
                    <span className="font-medium">Dimensions:</span> {size.dimensions}
                  </p>
                  <p style={{ color: colors.text.tertiary }}>
                    <span className="font-medium">Weight:</span> {size.weight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gift Sets */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center" style={{ color: colors.text.primary }}>
            Gift Sets
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {giftSetSizes.map((set) => (
              <div 
                key={set.id}
                className="rounded-xl p-6 border"
                style={{ 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }}
              >
                <h3 className="font-serif text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                  {set.setName}
                </h3>
                <div className="mb-3" style={{ color: colors.accent }}>
                  {set.items}
                </div>
                <p className="mb-4" style={{ color: colors.text.tertiary }}>
                  {set.description}
                </p>
                <div 
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: `${colors.accent}10` }}
                >
                  <Info className="h-5 w-5 mx-auto mb-2" style={{ color: colors.accent }} />
                  <p className="text-sm" style={{ color: colors.text.tertiary }}>
                    All gift sets come in premium packaging with a luxury box
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Choose */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center" style={{ color: colors.text.primary }}>
            How to Choose the Right Size
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="rounded-xl p-6 border"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <div className="text-4xl font-serif font-bold mb-4" style={{ color: colors.accent }}>1</div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text.primary }}>
                For Trying New Products
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                Start with our 15ml samples or Discovery Set to explore different products before committing to a full size.
              </p>
            </div>
            
            <div 
              className="rounded-xl p-6 border"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <div className="text-4xl font-serif font-bold mb-4" style={{ color: colors.accent }}>2</div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text.primary }}>
                For Daily Use
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                Choose 50ml or 100ml sizes for products you use regularly. Larger sizes offer better value.
              </p>
            </div>
            
            <div 
              className="rounded-xl p-6 border"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border 
              }}
            >
              <div className="text-4xl font-serif font-bold mb-4" style={{ color: colors.accent }}>3</div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text.primary }}>
                For Gifting
              </h3>
              <p style={{ color: colors.text.tertiary }}>
                Our gift sets come beautifully packaged and offer a selection of popular products in perfect sizes.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div 
          className="rounded-xl p-8 mb-16"
          style={{ backgroundColor: `${colors.accent}10` }}
        >
          <h2 className="font-serif text-2xl font-bold mb-4 text-center" style={{ color: colors.text.primary }}>
            Important Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: colors.text.primary }}>
                Longevity & Performance
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Product effectiveness is consistent regardless of package size</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Larger bottles offer better value per ml</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>All bottles feature the same premium spray mechanism</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: colors.text.primary }}>
                Storage & Care
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Store in a cool, dry place away from direct sunlight</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Keep bottles upright to prevent leakage</span>
                </li>
                <li className="flex items-start" style={{ color: colors.text.tertiary }}>
                  <span className="mr-2">•</span>
                  <span>Shelf life: 3-5 years when stored properly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Need Help Choosing a Size?
          </h2>
          <p className="text-lg mb-6" style={{ color: colors.text.tertiary }}>
            Our beauty experts are here to help you find the perfect size for your needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/contact" 
              className="px-6 py-3 rounded-lg font-medium"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.background
              }}
            >
              Contact Our Experts
            </a>
            <a 
              href="/products" 
              className="px-6 py-3 rounded-lg font-medium border"
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
              Browse All Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
