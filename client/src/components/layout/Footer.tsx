import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Crown, Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  const { colors } = useTheme();
  
  return (
    <footer style={{ backgroundColor: colors.background, color: colors.text.primary }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                <Crown className="text-xl" style={{ color: colors.background }} />
              </div>
              <h3 className="font-serif text-2xl font-bold" style={{ color: colors.text.accent }}>Soft Berry Skincare</h3>
            </div>
            <p className="leading-relaxed" style={{ color: colors.text.tertiary }}>
              Naturally radiant skincare and beauty. Your trusted destination for authentic, high‑quality cosmetics and self‑care essentials.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{
                  backgroundColor: `${colors.accent}33`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.color = colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.accent}33`;
                  e.currentTarget.style.color = colors.text.primary;
                }}
                data-testid="instagram-link"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#DCD7CE]/20 rounded-full flex items-center justify-center hover:bg-[#DCD7CE] hover:text-black transition-colors duration-300"
                data-testid="facebook-link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#DCD7CE]/20 rounded-full flex items-center justify-center hover:bg-[#DCD7CE] hover:text-black transition-colors duration-300"
                data-testid="youtube-link"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#DCD7CE]/20 rounded-full flex items-center justify-center hover:bg-[#DCD7CE] hover:text-black transition-colors duration-300"
                data-testid="twitter-link"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6" style={{ color: colors.text.accent }}>Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="transition-colors duration-300" style={{ color: colors.text.tertiary }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.text.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.tertiary; }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products?isNewArrival=true" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?isBestSeller=true" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6" style={{ color: colors.text.accent }}>Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl font-bold mb-6" style={{ color: colors.text.accent }}>Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" style={{ color: colors.text.accent }} />
                <div>
                  <p className="text-[#ACA69A]">123 Luxury Avenue</p>
                  <p className="text-[#ACA69A]">Mumbai, Maharashtra 400001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-[#DCD7CE] h-4 w-4 flex-shrink-0" />
                <p className="text-[#ACA69A]">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-[#DCD7CE] h-4 w-4 flex-shrink-0" />
                <p className="text-[#ACA69A]">softberryskincare@gmail.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-[#DCD7CE] h-4 w-4 flex-shrink-0" />
                <p className="text-[#ACA69A]">Mon-Sat: 10AM-8PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#DCD7CE]/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#ACA69A] text-sm">
              © 2026 Soft Berry Skincare. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-[#ACA69A] hover:text-[#DCD7CE] transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
