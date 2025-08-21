# Overview

This is a luxury fragrance e-commerce platform called "Royals" built with a modern full-stack architecture. The application allows users to browse, search, and purchase premium perfumes from prestigious brands. It features a sophisticated UI with luxury-themed design, comprehensive product catalog management, shopping cart functionality, and secure authentication through Replit's OAuth system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing with conditional rendering based on authentication state
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom luxury color scheme (champagne, rose-gold, burgundy) and typography using Playfair Display serif font
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API with organized route handlers for products, cart, orders, and authentication
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload support with Vite integration for seamless development experience

## Authentication & Authorization
- **Provider**: Replit OAuth integration using OpenID Connect protocol
- **Session Management**: Express sessions with PostgreSQL session store for persistence
- **Security**: HTTP-only cookies with secure flags for production environments
- **User Flow**: Automatic redirection to authentication for protected routes and resources

## Data Storage
- **Primary Database**: PostgreSQL with Neon serverless deployment for scalability
- **ORM**: Drizzle ORM with type-safe schema definitions and query builder
- **Schema Design**: Normalized relational structure with separate tables for users, products, categories, brands, cart items, orders, and wishlists
- **Migrations**: Drizzle Kit for database schema migrations and version control

## Business Logic Layer
- **Storage Interface**: Abstracted storage layer implementing IStorage interface for clean separation of concerns
- **Product Management**: Advanced filtering, searching, and sorting capabilities with pagination support
- **Shopping Cart**: Session-based cart management with quantity updates and total calculations
- **Order Processing**: Complete order workflow from cart to order confirmation

## External Dependencies
- **Database Hosting**: Neon PostgreSQL serverless database for automatic scaling
- **Authentication**: Replit OAuth service for secure user authentication
- **UI Components**: Radix UI primitives for accessible component foundation
- **Icons**: Lucide React for consistent iconography throughout the application
- **Development Tools**: Replit-specific plugins for development environment integration