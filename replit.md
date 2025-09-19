# Freakfest 2025 - Music Festival Landing Page

## Overview

Freakfest 2025 is a high-converting music festival landing page built to sell tickets and collect email subscriptions for a 4-day festival event (October 16-19, 2025) at Cartersville Country Winery in Timmonsville, SC. The application follows a music festival aesthetic with electric green accents, dark backgrounds, and modern typography to create an engaging user experience optimized for ticket sales and sponsor attraction.

The site features a single-page application architecture with multiple sections including hero, lineup, schedule, tickets, venue information, gallery, and FAQ. It includes mobile-first responsive design, accessibility features, and SEO optimization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system based on music festival aesthetics
- **Component Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **State Management**: React Query (@tanstack/react-query) for server state and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for consistent type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Development**: Hot module replacement and error overlay for development experience

### Design System
- **Typography**: Orbitron (display font) and Inter (body text) from Google Fonts
- **Color Palette**: Electric green primary (#00FF00), deep purple background (#270 40% 15%), rich black (#000 8%)
- **Layout**: 12-column responsive grid with Tailwind spacing units
- **Components**: Dark theme with glass morphism effects, hover states, and electric green accents

### Data Architecture
- **Mock Data**: Currently uses mock data for lineup, schedule, FAQ, and artist information
- **Planned Integration**: Google Drive asset integration for branding materials and media
- **Email Collection**: Form handling with toast notifications (requires SendGrid integration)
- **Ticket Sales**: External integration with BigCartel e-commerce platform

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection and management
- **@sendgrid/mail**: Email service for notifications and marketing campaigns
- **drizzle-orm** and **drizzle-kit**: Database ORM and migration tools
- **@radix-ui/**: Comprehensive set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Server state management and caching

### Development Tools
- **Vite**: Build tool with React plugin and runtime error overlay
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **@replit/vite-plugin-cartographer**: Development environment integration

### External Services
- **BigCartel**: E-commerce platform for ticket sales (https://freakfest.bigcartel.com)
- **Google Drive**: Asset storage for branding materials, images, and sponsor deck
- **Google Fonts**: Typography hosting for Orbitron and Inter font families
- **Neon Database**: Serverless PostgreSQL hosting
- **SendGrid**: Email service provider for transactional and marketing emails

### Planned Integrations
- Google Drive API for dynamic asset loading
- SendGrid API for email capture and marketing automation
- Social media APIs for Instagram feed integration
- Analytics and tracking services for conversion optimization