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
        "bg-black border border-[#DCD7CE]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#DCD7CE]/40 group",
        className
      )}
      data-testid={`category-card-${category.slug}`}
    >
      <Link href={`/products?category=${category.slug}`}>
        <div className="h-48 bg-black relative overflow-hidden rounded-t-xl">
          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={`${category.name} collection`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-serif text-xl font-bold text-[#FAF9F6] mb-1">
              {category.name}
            </h3>
            {category.productCount !== undefined && (
              <p className="text-[#DCD7CE] text-sm">
                {category.productCount} Products
              </p>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-[#DCD7CE] leading-relaxed mb-4">
            {category.description}
          </p>
          <Button 
            variant="ghost"
            className="text-[#DCD7CE] hover:text-[#FAF9F6] transition-colors duration-300 font-medium flex items-center group p-0"
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
