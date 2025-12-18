# Repository Guidelines

## Project Structure & Module Organization

The storefront is a Next.js App Router project rooted in `src`. Routing, layouts, and server components live under `src/app`, while reusable UI primitives sit in `src/ui` and shared logic in `src/lib` and `src/hooks`. Checkout-specific flows stay isolated in `src/checkout` so they can evolve independently. GraphQL documents and generated helpers are in `src/gql` and `src/graphql`. Unit-level utilities live in `__tests__`, Playwright scenarios hang off `playwright.config.ts`, and static assets (images, fonts, SEO artifacts) belong to `public/`.

## Build, Test, and Development Commands

- `pnpm run generate` hydrates typed GraphQL artifacts after any schema or query change.
- `pnpm dev` launches the Next.js dev server with hot reload at `http://localhost:3000`.
- `pnpm build` and `pnpm start` produce and serve the optimized production bundle.
- `pnpm lint` runs Next.js + ESLint with autofix; use it before sending a PR.
- `pnpm test` executes the Playwright suite defined in `playwright.config.ts`; add `--headed` locally when debugging.

## Coding Style & Naming Conventions

TypeScript is mandatory across `src`, with modules exporting typed functions or React components using PascalCase names (e.g., `ProductCard`). Follow React hooks conventions (`useXyz`) and colocate styles or helpers with their feature folder. Formatting is enforced by ESLint + Prettier + `prettier-plugin-tailwindcss`, so rely on `pnpm lint` or your editor integration instead of manual tweaks. Prefer 2-space indentation, descriptive prop names, and Tailwind utility ordering as produced by Prettier.

## UI Framework Migration

We are migrating away from Tailwind CSS and rebuilding the component library with `react-bootstrap`. Treat the Bootstrap 5 template in `/Users/jocke/Desktop/NiceShop` as the visual and structural reference when creating or updating UI. All new Next.js components must rely on `react-bootstrap` primitives instead of Tailwind utility classes so the codebase steadily aligns with the upcoming Bootstrap-first design system.

## Testing Guidelines

Smoke and integration tests use Playwright; group specs by route or feature and suffix them with `.spec.ts`. Unit helpers can sit in `__tests__` and mirror the source tree. Keep tests deterministic by seeding data via Saleor fixtures or mocking network calls. Aim to cover cart, checkout, and payment regressions before merging. Run `pnpm test --project chromium` for a fast pre-push check, and capture screenshots or traces via `--trace on` when chasing flaky results.

## Commit & Pull Request Guidelines

Follow the existing history: short, imperative subjects with optional scope and the PR number, e.g., `Improve cart hydrator (#1234)`. Each commit should represent a reviewable unit that keeps the app buildable. Pull requests need a summary, testing notes, linked Saleor issues (if any), and screenshots or recordings for UI-affecting work. Re-run `pnpm run generate`, `pnpm lint`, and `pnpm test` before opening the PR so CI mirrors your local state.

## Security & Configuration Notes

Store secrets in `.env` (see `.env.example`), at minimum defining `NEXT_PUBLIC_SALEOR_API_URL` and `NEXT_PUBLIC_STOREFRONT_URL`. Never commit `.env*` files or downloaded certificates. When working with payment integrations (Adyen/Stripe), rely on sandbox keys and verify that customer data logging is disabled. Rotate tokens immediately if they appear in issue attachments or logs.
