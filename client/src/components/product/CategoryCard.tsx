import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Category } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    name: string;
    description: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
  };
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Card 
      className={cn(
        "card-hover bg-white rounded-2xl overflow-hidden shadow-lg group border-0",
        className
      )}
      data-testid={`category-card-${category.slug}`}
    >
      <Link href={`/products?category=${category.slug}`}>
        <div className="h-64 bg-gradient-to-br from-warm-gray/20 to-champagne/20 relative overflow-hidden">
          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={`${category.name} fragrances collection`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-luxury-black/30 transition-colors duration-300" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              {category.name}
            </h3>
            {category.productCount !== undefined && (
              <p className="text-cream/90 text-sm">
                {category.productCount} Fragrances
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-warm-gray leading-relaxed mb-4">
            {category.description}
          </p>
          <Button 
            variant="ghost"
            className="text-champagne hover:text-burgundy transition-colors duration-300 font-medium flex items-center group p-0"
            data-testid={`category-link-${category.slug}`}
          >
            Discover Collection 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </Link>
    </Card>
  );
}
