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
- **Business Logic**: Pure utility functions in `client/src/lib/calc.ts` for BOM calculation and CSV export
- **License Data**: Tier definitions and addon constants in `client/src/data/licenseData.ts`
- **Type Definitions**: License tiers, addons, BOM items defined in `client/src/types/license.ts`
- **Migration Logic**: Official Suprema BioStar 2 → BioStar X promotion mapping (MIGRATION_MAPPING in licenseData.ts)
  - **AC Migration**: Starter→N/A, Basic→Essential, Standard→Advanced+AAC, Advanced→Advanced+AAC+SVM+DIR, Professional→Enterprise+AAC+SVM+DIR, Enterprise→Elite+AAC+SVM+DIR
  - **T&A Migration**: Starter→N/A, Standard→TNA_STD(FOC), Advanced→TNA_ENT(FOC), Professional→TNA_ENT(FOC)
  - **Visitor**: FOC when bs2VisitorLicense=true, requires Advanced+ tier (warning shown if base tier < Advanced)
  - **Not eligible for FOC**: Video, Remote Access/Cloud (info notes shown)
  - **Policy**: BS2 licenses must be disabled after migration; only equivalent licenses provided
  - **Auto-locking**: Features auto-checked based on migration mapping (AAC features for Standard+, SVM/DIR for Advanced+)

### Design Patterns
- **Two-column dashboard layout**: 68% main form, 32% sticky BOM sidebar on desktop
- **Mobile-first responsive**: Bottom sheet for BOM on mobile devices
- **Component modularity**: Feature toggles, numeric inputs, and form sections as reusable components
- **Print-ready reports**: Modal-based report generation with print styling
- **Design compliance**: All components use rounded-md, hover-elevate utility for interactions, no custom hover states on buttons/interactive elements
- **Dark/Light mode**: ThemeToggle component with localStorage persistence ('biostarx-theme') and system preference detection
- **Draft persistence**: Auto-save project data to localStorage ('biostarx-draft') to prevent data loss on reload
- **CSV Export**: BOM can be exported as CSV with project metadata headers from both sidebar and report modal
- **Tier change animation**: Visual pulse effect when recommended license tier changes
- **Multi-language support (i18n)**: Full translation support for Spanish, English, and Brazilian Portuguese
  - **Implementation**: React Context API with I18nProvider and useI18n hook (`client/src/lib/i18n.tsx`)
  - **Language selector**: Globe icon dropdown in header (LanguageSelector component)
  - **Translation keys**: Organized by namespace (projectMeta.*, migration.*, capacity.*, features.*, devices.*, mobile.*, clientType.*, advancedFeature.*, bom.*, validation.*, disclaimer.*, email.*)
  - **Persistence**: Language preference saved to localStorage key 'biostarx-language'
  - **Date formatting**: Respects selected language (es-ES, en-US, pt-BR)
- **Email functionality**: Send BOM calculations via email
  - **Component**: EmailDialog (`client/src/components/EmailDialog.tsx`)
  - **Features**: Primary recipient, CC list, optional copy to Suprema LATAM (latam@supremainc.com), notes field
  - **Privacy consent**: Required acceptance of Suprema privacy policy before sending
  - **Backend**: `/api/send-email` endpoint with Gmail SMTP via nodemailer
  - **Security**: Rate limiting (10 emails per 15 minutes), Zod schema validation, HTML escaping for all user content
  - **Localization**: Email content translated based on selected language (es/en/pt)
  - **Required secrets**: GMAIL_USER, GMAIL_APP_PASSWORD

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

### Email
- nodemailer for SMTP email sending via Gmail
- express-rate-limit for API rate limiting

### Database
- PostgreSQL via Drizzle ORM (requires DATABASE_URL environment variable)
- connect-pg-simple for session storage capability

### Development Tools
- Replit-specific plugins for dev banner and cartographer
- Runtime error overlay for development debugging