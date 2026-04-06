import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  border: string;
  borderLight: string;
  accent: string;
  accentHover: string;
  gradient: {
    primary: string;
    secondary: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F7F4',
  surfaceSecondary: '#F0EDE6',
  surfaceTertiary: '#E8E3DA',
  text: {
    primary: '#2C2C2C',
    secondary: '#4A4A4A',
    tertiary: '#6B6B6B',
    accent: '#8B7355',
  },
  border: '#DCD7CE',
  borderLight: '#E8E3DA',
  accent: '#8B7355',
  accentHover: '#6B5A45',
  gradient: {
    primary: 'linear-gradient(135deg, #F8F7F4 0%, #E8E3DA 100%)',
    secondary: 'linear-gradient(135deg, #8B7355 0%, #6B5A45 100%)',
  },
};

const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#111111',
  surfaceSecondary: '#1A1A1A',
  surfaceTertiary: '#222222',
  text: {
    primary: '#FAF9F6',
    secondary: '#DCD7CE',
    tertiary: '#ACA69A',
    accent: '#DCD7CE',
  },
  border: '#333333',
  borderLight: 'rgba(220, 215, 206, 0.2)',
  accent: '#DCD7CE',
  accentHover: '#FFFFFF',
  gradient: {
    primary: 'linear-gradient(135deg, #111111 0%, #000000 100%)',
    secondary: 'linear-gradient(135deg, #DCD7CE 0%, #FFFFFF 100%)',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('royals-theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    }
    // Default to light theme
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('royals-theme', newTheme);
      return newTheme;
    });
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  // Apply theme to document root for global CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('theme-light', 'theme-dark');
    
    // Add current theme class
    root.classList.add(`theme-${theme}`);
    
    // Set CSS custom properties for dynamic theming
    root.style.setProperty('--bg-primary', colors.background);
    root.style.setProperty('--bg-surface', colors.surface);
    root.style.setProperty('--bg-surface-secondary', colors.surfaceSecondary);
    root.style.setProperty('--bg-surface-tertiary', colors.surfaceTertiary);
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-tertiary', colors.text.tertiary);
    root.style.setProperty('--text-accent', colors.text.accent);
    root.style.setProperty('--border-primary', colors.border);
    root.style.setProperty('--border-light', colors.borderLight);
    root.style.setProperty('--accent-primary', colors.accent);
    root.style.setProperty('--accent-hover', colors.accentHover);
  }, [theme, colors]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};