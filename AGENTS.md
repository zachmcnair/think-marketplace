# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains Next.js App Router pages and API routes (see `src/app/api/` for server endpoints).
- `src/components/` holds UI, layout, and shared React components.
- `src/lib/` contains auth, data, storage, and utility modules.
- `prisma/` defines the database schema and seed script.
- `public/` holds static assets.

## Build, Test, and Development Commands
- `npm run dev` starts the local Next.js dev server.
- `npm run build` creates the production build.
- `npm run start` runs the production server after a build.
- `npm run lint` runs ESLint across the codebase.
- `npx tsc --noEmit` runs TypeScript type checking.
- `npm run db:generate` generates the Prisma client.
- `npm run db:push` pushes the Prisma schema to the database.
- `npm run db:seed` seeds the database from `prisma/seed.ts`.
- `npm run db:studio` opens Prisma Studio.

## Coding Style & Naming Conventions
- TypeScript and React with the Next.js App Router.
- Tailwind CSS v4 for styling; keep class order consistent with existing files.
- Match existing file naming: components are typically kebab-case (for example `listing-card.tsx`), React component names use PascalCase, hooks use `useX`.
- Use ESLint as the source of truth; keep formatting consistent with nearby files.

## Testing Guidelines
- No automated test runner is configured in `package.json`.
- Rely on `npm run lint` and `npx tsc --noEmit` before PRs.
- If you add tests, document the command and conventions in this file.

## Commit & Pull Request Guidelines
- Recent commits use short, sentence-style messages without a conventional prefix (for example "Mobile Optimizations").
- Keep commits focused and descriptive.
- PRs should describe changes, list relevant commands run, and include screenshots for UI changes.

## Configuration & Environment
- Copy `.env.example` to `.env.local` and populate required variables (database, S3, Privy).
- See `README.md` for detailed environment and database setup steps.
