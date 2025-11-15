# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Happy Here is a Gatsby-based web application for discovering establishments with happy hour specials. The app displays establishments in real-time sorted order based on current happy hour status, with filtering capabilities by amenities (wine, beer, cocktails, food, coffee, patio, etc.).

## Key Commands

```bash
# Development
pnpm dev                 # Start Gatsby development server

# Build & Production
pnpm build              # Build production site
pnpm clean              # Clean Gatsby cache and public directory

# Testing
pnpm test               # Run vitest tests
```

## Architecture

### Data Source
- Content is sourced from Sanity CMS (headless CMS)
- Environment variables required: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN`
- In development mode, draft content is visible and watchMode is enabled
- Test establishment (ID: `b95f53fc-ae57-4605-b4b6-6ceb785a1756`) is filtered out in production

### Core Features

**Real-time Happy Hour Tracking:**
- `parseHours.js` contains the business logic for parsing and validating time strings
- `sortEstablishments.js` sorts establishments by:
  1. Currently in happy hour (sorted by end time, soonest ending first)
  2. Not in happy hour (sorted by next happy hour start time)
- `EstablishmentTile` component updates every 30 seconds to reflect current happy hour status
- Time-related utilities: `getTodayTime.js`, `getNextStartTime.js`, `formatMilitaryTime.js`

**Filtering System:**
- FilterBar component manages filter state using React hooks
- Filters cascade: establishments must match ALL active filters
- Filter categories:
  - `whatWeHaveHere`: wine, beer, cocktails, food, coffee, naDrinks
  - `theSpaceIsLike`: indoor, patio, barSeating, dogFriendly, smallGroups, bigGroups, reservationsRec, staffPick

### Component Structure

- `Layout.jsx` - Main wrapper with navigation, styling, and footer
- `EstablishmentTile.jsx` - Complex component displaying establishment details with GraphQL fragment
- `FilterBar.jsx` - Checkbox-based filter UI
- `Header.jsx`, `Nav.jsx`, `Footer.jsx` - Navigation and structural components
- Utility components: `IconButton.jsx`, `AmmenityPill.jsx`, `Checkbox.jsx`, `NoResults.jsx`

### Styling

- Uses Emotion CSS-in-JS (`@emotion/react`)
- Theme configuration in `src/styles/theme.js` with:
  - Responsive breakpoints: smallMobile (400px), mobile (700px), tablet (900px), smallDesktop (1100px)
  - Color palette with named colors (oceanBlue, lemonYellow, lightGrout, etc.)
  - Typography styles using Lato (display) and Playfair Display (fancy/serif)
  - CSS custom properties for elevation shadows

### Pages

- `index.jsx` - Home page with establishment grid and filtering
- `about.jsx`, `journal.jsx`, `lists.jsx`, `establishment.jsx` - Additional pages (some are placeholders)

## Development Notes

- No templates or gatsby-node.js - pages are static
- Icons from `lucide-react` for UI elements
- Sanity images handled via `gatsby-plugin-sanity-image`
- Google Analytics tracking via `gatsby-plugin-gtag`
