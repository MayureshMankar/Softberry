import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "group relative rounded-xl transition-all duration-500 hover:scale-110",
        sizeClasses[size],
        theme === 'light' 
          ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200/50 hover:border-amber-300" 
          : "text-blue-300 hover:text-blue-200 hover:bg-blue-950/30 border border-blue-800/30 hover:border-blue-700/50",
        className
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      data-testid="theme-toggle"
    >
      {/* Background gradient effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        theme === 'light' 
          ? "bg-gradient-to-br from-amber-100 to-orange-100" 
          : "bg-gradient-to-br from-blue-950/40 to-indigo-950/40"
      )} />
      
      {/* Icon container with rotation effect */}
      <div className="relative flex items-center justify-center">
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500 transform",
          theme === 'light' 
            ? "opacity-100 rotate-0 scale-100" 
            : "opacity-0 rotate-180 scale-75"
        )}>
          <Sun className={cn(iconSizes[size], "drop-shadow-sm")} />
        </div>
        
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500 transform",
          theme === 'dark' 
            ? "opacity-100 rotate-0 scale-100" 
            : "opacity-0 -rotate-180 scale-75"
        )}>
          <Moon className={cn(iconSizes[size], "drop-shadow-sm")} />
        </div>
      </div>
      
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md",
        theme === 'light' 
          ? "bg-amber-400" 
          : "bg-blue-400"
      )} />
    </Button>
  );
};

export default ThemeToggle;