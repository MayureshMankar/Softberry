import { Link } from "wouter";
import { Crown, Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-luxury-black text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center">
                <Crown className="text-luxury-black text-xl" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-champagne">Royals</h3>
            </div>
            <p className="text-warm-gray leading-relaxed">
              Decoding luxury through exceptional fragrances. Your premier destination for authentic luxury perfumes from the world's most prestigious houses.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-champagne/20 rounded-full flex items-center justify-center hover:bg-champagne hover:text-luxury-black transition-colors duration-300"
                data-testid="instagram-link"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-champagne/20 rounded-full flex items-center justify-center hover:bg-champagne hover:text-luxury-black transition-colors duration-300"
                data-testid="facebook-link"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-champagne/20 rounded-full flex items-center justify-center hover:bg-champagne hover:text-luxury-black transition-colors duration-300"
                data-testid="youtube-link"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-champagne/20 rounded-full flex items-center justify-center hover:bg-champagne hover:text-luxury-black transition-colors duration-300"
                data-testid="twitter-link"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl font-bold text-champagne mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products?isNewArrival=true" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?isBestSeller=true" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/store-locator" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-xl font-bold text-champagne mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl font-bold text-champagne mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-champagne mt-1 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-warm-gray">123 Luxury Avenue</p>
                  <p className="text-warm-gray">Mumbai, Maharashtra 400001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-champagne h-4 w-4 flex-shrink-0" />
                <p className="text-warm-gray">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-champagne h-4 w-4 flex-shrink-0" />
                <p className="text-warm-gray">hello@royalsfragrances.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-champagne h-4 w-4 flex-shrink-0" />
                <p className="text-warm-gray">Mon-Sat: 10AM-8PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-champagne/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-warm-gray text-sm">
              © 2024 Royals Fragrances. All rights reserved. | Decoding Luxury Since 2020
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-warm-gray hover:text-champagne transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
