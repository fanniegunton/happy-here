# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Happy Here is an Astro-based web application for discovering establishments with happy hour specials. The app displays establishments in real-time sorted order based on current happy hour status, with filtering capabilities by amenities (wine, beer, cocktails, food, coffee, patio, etc.).

## Key Commands

```bash
# Development
pnpm dev                 # Start Astro development server

# Build & Production
pnpm build              # Build production site
pnpm clean              # Clean Astro build output and cache

# Testing
pnpm test               # Run vitest tests
```

## Architecture

### Data Source
- Content is sourced from Sanity CMS (headless CMS)
- Environment variables required: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN`
- In development mode, draft content is visible (`perspective: 'previewDrafts'`)
- Test establishment (ID: `b95f53fc-ae57-4605-b4b6-6ceb785a1756`) is filtered out in production

### Core Features

**Real-time Happy Hour Tracking:**
- `parseHours.ts` contains the business logic for parsing and validating time strings
- `sortEstablishments.ts` sorts establishments by:
  1. Currently in happy hour (sorted by end time, soonest ending first)
  2. Not in happy hour (sorted by next happy hour start time)
- `EstablishmentTile` component updates every 30 seconds to reflect current happy hour status
- Time-related utilities: `getTodayTime.ts`, `getNextStartTime.ts`, `formatMilitaryTime.ts`

**Filtering System:**
- FilterBar component manages filter state using React hooks
- Filters cascade: establishments must match ALL active filters
- Filter categories:
  - `whatWeHaveHere`: wine, beer, cocktails, food, coffee, naDrinks
  - `theSpaceIsLike`: indoor, patio, barSeating, dogFriendly, smallGroups, bigGroups, reservationsRec, staffPick

### Component Structure

Components are split between two directories:
- `src/components/astro/` — Astro components (e.g., `Layout.astro`)
- `src/components/react/` — React components (all `.tsx`)

Key components:
- `Layout.astro` - Main wrapper with navigation, styling, and footer
- `EstablishmentTile.tsx` - Establishment card with happy hour status
- `FilterBar.tsx` - Checkbox-based filter UI
- `Header.tsx`, `Nav.tsx`, `Footer.tsx` - Navigation and structural components
- Utility components: `IconButton.tsx`, `AmmenityPill.tsx`, `ExternalLink.tsx`, `NoResults.tsx`
- `SanityImage.tsx` - Image component using `@sanity/image-url`

### Styling

- Uses Emotion CSS-in-JS (`@emotion/react`)
- Theme configuration in `src/styles/theme.ts` with:
  - Responsive breakpoints: smallMobile (400px), mobile (700px), tablet (900px), smallDesktop (1100px)
  - Color palette with named colors (oceanBlue, lemonYellow, lightGrout, etc.)
  - Typography styles using Lato (display) and Playfair Display (fancy/serif)
  - CSS custom properties for elevation shadows\
CSS and styling in this codebase are intentional and carefully considered. When migrating or refactoring:
  - Preserve existing CSS values exactly (spacing, breakpoints, colors, etc.)
  - Do not "modernize" or "simplify" CSS patterns unless explicitly asked
  - If a style seems redundant or outdated, ask before changing it
  - When converting between CSS syntaxes (e.g., object style to template literals), the output values must match the input exactly 

  ### STYLE-CRITICAL: Do not modify CSS values without explicit approval

### Pages

Pages are Astro files in `src/pages/`:
- `index.astro` - Home page with establishment grid and filtering
- `about.astro`, `journal.astro`, `lists.astro` - Additional pages (some are placeholders)
- `establishment/[slug].astro` - Dynamic establishment detail page

## Development Notes

- Static assets go in `static/` (Astro's `publicDir` is configured to `static/`)
- Icons from `lucide-react` for UI elements
- Sanity images handled via `@sanity/image-url`
- Google Analytics tracking via `@astrojs/partytown`
