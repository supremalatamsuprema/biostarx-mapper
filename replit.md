# BioStar X Mapper

## Overview

BioStar X Mapper is a B2B presales web application for Suprema's BioStar X access control platform. It calculates license tiers, generates Bills of Materials (BOM), and produces technical reports for integrators and distributors. The tool supports two scenarios: new greenfield projects and migrations from BioStar 2 legacy systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in strict mode
- **Build Tool**: Vite with custom build script for production bundling
- **Styling**: Tailwind CSS with custom design tokens following enterprise SaaS dashboard patterns
- **Component Library**: Shadcn/ui components built on Radix UI primitives
- **State Management**: React useState/useMemo for local state, TanStack Query for server state
- **Typography**: Montserrat (headings) and Noto Sans (body) via Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Pattern**: RESTful routes prefixed with `/api`
- **Development**: Vite dev server with HMR for frontend, tsx for TypeScript execution
- **Production**: esbuild bundles server code, Vite builds static frontend assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's pgTable
- **Validation**: Zod schemas generated via drizzle-zod
- **Storage**: Abstracted through IStorage interface (currently MemStorage, designed for easy database swap)

### Application Structure
- **Monorepo Layout**: Client code in `client/`, server in `server/`, shared types in `shared/`
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared/
- **License Logic**: Business rules for tier calculation in `client/src/data/licenseData.ts`
- **Type Definitions**: License tiers, addons, BOM items defined in `client/src/types/license.ts`

### Design Patterns
- **Two-column dashboard layout**: 68% main form, 32% sticky BOM sidebar on desktop
- **Mobile-first responsive**: Bottom sheet for BOM on mobile devices
- **Component modularity**: Feature toggles, numeric inputs, and form sections as reusable components
- **Print-ready reports**: Modal-based report generation with print styling
- **Design compliance**: All components use rounded-md, hover-elevate utility for interactions, no custom hover states on buttons/interactive elements

## External Dependencies

### UI Components
- Radix UI primitives for accessible components (dialog, checkbox, select, tabs, etc.)
- Lucide React for iconography
- Class Variance Authority for component variants
- Embla Carousel for carousel functionality

### Data & Forms
- TanStack React Query for data fetching and caching
- React Hook Form with Zod resolvers for form validation
- date-fns for date manipulation

### Database
- PostgreSQL via Drizzle ORM (requires DATABASE_URL environment variable)
- connect-pg-simple for session storage capability

### Development Tools
- Replit-specific plugins for dev banner and cartographer
- Runtime error overlay for development debugging