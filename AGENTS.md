# Repository Guidelines

## Project Structure & Module Organization
`src/pages` contains Gatsby route components, while reusable UI lives in `src/components` and shared styling tokens stay under `src/styles`. Business logic and API helpers sit in `src/lib` (unit tests often co-located such as `src/lib/parseHours.test.js`). Global state reducers live in `src/reducers`, and static assets (icons, data seeds, fonts) are under `src/assets` and `src/images`. Gatsby builds to `public/`, so avoid editing that directory directly; use `gatsby-config.js` for plugin or environment configuration.

## Build, Test, and Development Commands
- `yarn dev`: starts `gatsby develop` with hot reload at `http://localhost:8000`.
- `yarn build`: generates the production bundle in `public/` and validates GraphQL queries.
- `yarn clean`: removes the Gatsby cache when build artifacts get stale.
- `yarn test`: runs the Vitest suite (currently covers `src/lib` helpers); add `--watch` while iterating locally.

## Coding Style & Naming Conventions
Follow the existing two-space indent, trailing commas, and double-quote imports you see in `src/pages/index.jsx`. Keep React components in PascalCase (`EstablishmentTile`) and hooks/utilities in camelCase. ESLint (Standard + React + Hooks) and Prettier are installed; before pushing, run `npx eslint src --ext .js,.jsx` and `npx prettier "src/**/*.{js,jsx}" --check`. Co-locate component-specific styles with the component, and keep cross-cutting theme tokens in `src/styles/theme.js`.

## Testing Guidelines
Use Vitest for unit coverage and prefer colocated `*.test.js` files near the source they exercise. Test names should read like behavior statements (e.g., `it("parses closing times")`). Mock network or Sanity queries with lightweight fixtures; avoid hitting live services. Aim for at least smoke coverage on new helpers and any logic added to reducers.

## Commit & Pull Request Guidelines
Commits in this repo are short, imperative sentences (e.g., “Adjust overall margin on desktop-scale page sizes”). Keep scope tight, reference issues in the body when relevant, and include screenshots or GIFs when UI shifts. PRs should describe the change, list testing performed (`yarn dev`, `yarn test`), call out any new env vars, and link to tracking issues. Request review from another contributor before merging.

## Security & Configuration Tips
Load secrets through `.env.*` files consumed by `dotenv` and `gatsby-plugin-env-variables`; never commit keys. When touching analytics (`gatsby-plugin-gtag`/`gatsby-plugin-google-analytics`), confirm IDs via environment variables rather than literals.
