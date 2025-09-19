# Freakfest 2025 Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from music festival sites like Coachella, Electric Daisy Carnival, and Ultra Music Festival, emphasizing high visual impact and emotional engagement for ticket conversion.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Electric Green: `120 100% 50%` (neon accent)
- Deep Purple: `270 40% 15%` (primary dark background)
- Rich Black: `0 0% 8%` (secondary background)

**Supporting Colors:**
- White: `0 0% 100%` (text on dark)
- Gray: `0 0% 60%` (secondary text)
- Warning Orange: `30 100% 60%` (urgency elements)

### B. Typography
**Primary Font**: Orbitron (Google Fonts) - futuristic, electronic music aesthetic
**Secondary Font**: Inter (Google Fonts) - clean readability for body text
**Hierarchy**: 
- Hero titles: 4xl-6xl, bold weight
- Section headers: 2xl-3xl, medium weight  
- Body text: base-lg, regular weight

### C. Layout System
**Spacing Units**: Tailwind units of 4, 8, 16, 24 (p-4, m-8, gap-16, py-24)
**Grid System**: 12-column responsive grid with breakpoints at sm, md, lg, xl
**Containers**: max-w-7xl centered with px-4 horizontal padding

### D. Component Library

**Navigation**: Fixed header with glass morphism effect, electric green logo, hamburger menu on mobile

**Hero Section**: Full viewport height with video background, centered logo, countdown timer, primary CTA button

**Cards**: Dark backgrounds with subtle green borders, hover effects with glow, rounded corners (rounded-lg)

**Buttons**: 
- Primary: Electric green background, black text, rounded-full
- Secondary: Outline variant with blurred background when over images
- CTA: Large padding (px-8 py-4), uppercase text

**Forms**: Dark inputs with green focus states, floating labels, validation messaging

**Modals**: Full-screen overlay on mobile, centered card on desktop, backdrop blur

### E. Visual Treatment

**Gradients**: Radial gradients from electric green to deep purple for accent areas, subtle linear gradients for card backgrounds

**Effects**: Glass morphism for navigation, subtle glow effects on interactive elements, particle animations sparingly used

**Images**: High contrast festival photography, artist headshots in circular frames, venue photos with overlay text

## Images
- **Hero Background**: Large festival crowd video/image with electric lighting
- **Artist Cards**: Square headshots for lineup grid
- **Venue Gallery**: 4-6 venue photos showcasing stages and atmosphere
- **Sponsor Logos**: White/transparent logos on dark backgrounds

## Accessibility
- WCAG 2.1 AA compliance with 4.5:1 contrast ratios
- Keyboard navigation for all interactive elements
- Screen reader optimized with proper ARIA labels
- Focus indicators with electric green outline

## Performance Priorities
- Critical CSS inlined for above-fold content
- Lazy loading for images below fold
- Optimized font loading with font-display: swap
- Minimal JavaScript bundle with code splitting