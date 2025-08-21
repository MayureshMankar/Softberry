import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      className={`fixed bottom-8 right-8 w-14 h-14 bg-champagne text-luxury-black hover:bg-rose-gold transition-all duration-300 rounded-full shadow-lg z-40 ${
        isVisible ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={scrollToTop}
      data-testid="back-to-top-button"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
