# BioStar X Mapper - Design Guidelines

## Design Approach: Enterprise SaaS Dashboard

**Selected Approach:** Design System (Carbon Design-inspired) with custom brand identity
**Rationale:** This is a utility-focused B2B technical tool requiring precision, trust, and efficiency. The interface prioritizes data clarity and professional credibility over visual flair.

---

## Core Brand Identity

### Typography
- **Headings:** Montserrat (700, 800, 900 weights) - Bold, technical, authoritative
- **Body Text:** Noto Sans (400, 500, 600, 700 weights) - Excellent readability for data-heavy interfaces
- **Hierarchy:**
  - H1: Montserrat 900, 2.5rem (40px)
  - H2: Montserrat 800, 1.875rem (30px)
  - H3: Montserrat 700, 1.5rem (24px)
  - Body: Noto Sans 400, 0.875rem (14px)
  - Labels: Noto Sans 700, 0.5625rem (9px), uppercase, letter-spacing: 0.1em

### Color Palette (Brand-Specified)
- **Primary Red:** #A12944 (Suprema brand color) - CTAs, active states, critical indicators
- **Secondary Blue:** #0047FF (BioStar X brand) - Accents, links, secondary actions
- **Gradient:** `linear-gradient(135deg, #00C2FF 0%, #0047FF 50%, #FF00E5 100%)` - Hero elements, premium features
- **Neutrals:** Gray-50 through Gray-900 for backgrounds, borders, text
- **Semantic:** Green for success states, amber for warnings

### Spacing System
Primary units: Tailwind `2, 4, 6, 8, 12, 16, 20, 24` for internal spacing
Section padding: `py-12` (mobile), `py-16 lg:py-20` (desktop)
Component gaps: `gap-4` standard, `gap-6` for major sections

---

## Layout Architecture

### Desktop Structure (≥1024px)
**Two-Column Dashboard Layout:**
- **Main Column:** 68% width, scrollable form content
- **Sticky Sidebar:** 32% width, fixed BOM summary (top: 1.5rem, height: calc(100vh - 3rem))
- Container: `max-w-7xl mx-auto px-6`

### Mobile/Tablet (< 1024px)
- Single column stack
- BOM Summary becomes bottom sheet or collapsible accordion
- Form sections maintain full width

### Landing Page (Scenario Selection)
- Centered content, `max-w-3xl`
- Two large card buttons for "Greenfield" vs "Migration" scenarios
- Minimal navigation, logo only

---

## Component Library

### Glass Cards
- Background: `rgba(255, 255, 255, 0.8)` with backdrop blur
- Backdrop blur: `12px`
- Border: `1px solid rgba(255, 255, 255, 0.3)`
- Border radius: `rounded-md` (following global design guidelines)
- Shadow: Soft, elevated

### Buttons
- Use standard Shadcn Button component with built-in variants
- Use `rounded-full` for pill-shaped buttons via className
- Rely on built-in hover/active states from Button component
- Do not apply custom padding, height, or hover styles

### Numeric Inputs
- **Label:** 9px, uppercase, bold, gray-400, tracking-widest, positioned above
- **Input Field:** Border-bottom only (2px), transparent background
- **Focus State:** Border color changes to Suprema Red, scale(1.02) animation
- **Typography:** Bold, 18px (1.125rem)

### Feature Toggles
- Checkbox-based cards with border treatment
- Use `hover-elevate` utility class for hover states
- Active Primary: `border-suprema-red`, `bg-red-50/20`
- Active Secondary: `border-foreground`, `bg-muted/50`
- Label: 10px, uppercase, tracking-wider, bold

### File Upload Fields
- Container: White background with subtle border, rounded-md
- Custom file button styling: Dark background, rounded-full, 9px text
- Success indicator: Green checkmark with truncated filename

### Scrollbars
- Width: 5px
- Track: Transparent
- Thumb: Gray-200, rounded-full

---

## Section Specifications

### Header
- Height: `h-16`
- Sticky positioning
- Logo (left), scenario indicator (center), reset button (right)
- Background: White with subtle shadow

### Main Form Sections
Each section wrapped in glass card with:
- Padding: `p-6 lg:p-8`
- Margin bottom: `mb-6`
- Sections: Project Metadata, Migration Validation (conditional), Capacity Inputs, Feature Toggles
- Progressive disclosure for migration-specific fields

### BOM Sidebar
- Sticky card showing real-time calculation
- Header: Tier badge with gradient background
- List: Part numbers with quantities, monospaced font for SKUs
- Footer: Total count, disclaimer text
- Custom scrollbar for overflow

### Modal (Report & Disclaimer)
- Overlay: `backdrop-blur-sm bg-black/50`
- Modal container: `max-w-4xl`, white background, rounded-md
- Print-friendly styling with `.no-print` class

---

## Animations & Transitions

### Page Load
- Fade-in animation: 0.4s ease-out, `translateY(10px)` to 0
- Stagger sections by 100ms delay

### Interactions
- Input focus: Scale 1.02, 200ms
- Button hover: Use built-in Button component hover states (no custom hover effects)
- Toggle activation: Use `hover-elevate` utility class
- NO distracting micro-animations or scroll triggers

### State Changes
- BOM updates: Smooth number count-up (optional subtle effect)
- Tier badge: Color transition when tier changes

---

## Responsive Breakpoints
- **Mobile:** < 768px (single column, stacked inputs)
- **Tablet:** 768px - 1023px (maintain single column, wider cards)
- **Desktop:** ≥ 1024px (two-column layout activates)
- **Large Desktop:** ≥ 1280px (max-width containers center)

---

## Accessibility
- WCAG AA contrast ratios maintained
- Form labels explicitly connected to inputs
- Focus indicators: 2px solid outline offset 2px
- Keyboard navigation fully supported
- Screen reader text for icon-only buttons

---

## Images
**No hero images required.** This is a pure utility application focused on forms and data entry. Visual identity relies on:
- Brand colors and gradients
- Glass morphism effects
- Clean typography
- Suprema logo (SVG, positioned top-left, ~120px width)