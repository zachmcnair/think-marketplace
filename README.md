# Think Marketplace

A curated showcase of apps, tools, and agents built on the [Think Protocol](https://thinkagents.ai). Discover AI you own.

![Think Marketplace](https://img.shields.io/badge/Think-Marketplace-58bed7)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── listings/      # Listings CRUD
│   │   ├── builders/      # Builder profiles
│   │   ├── categories/    # Categories
│   │   ├── submit/        # Listing submission
│   │   ├── upload/        # File uploads (S3)
│   │   └── admin/         # Admin dashboard API
│   ├── page.tsx           # Home page
│   ├── browse/            # Browse directory
│   ├── listing/[slug]/    # Listing detail pages
│   ├── builder/[slug]/    # Builder profile pages
│   ├── submit/            # Submit listing form
│   ├── admin/             # Admin dashboard
│   └── about/             # About page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, footer, layout
│   ├── listing-card.tsx   # Listing card component
│   └── theme-*.tsx        # Theme provider & toggle
├── lib/
│   ├── api.ts             # API client utilities
│   ├── auth/              # Authentication (Privy + NFT gating)
│   ├── data/seed.ts       # Demo seed data
│   ├── db/                # Prisma database client
│   ├── storage/           # S3 file storage
│   └── utils.ts           # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
└── types/
    └── index.ts           # TypeScript type definitions
```

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Fonts**: Goudy Bookletter 1911 (headings) + Inter (body)
- **Database**: [PostgreSQL](https://www.postgresql.org/) on [Railway](https://railway.app/) via [Prisma](https://prisma.io/)
- **Storage**: S3-compatible bucket on [Railway](https://railway.app/)
- **Auth**: [Privy](https://privy.io/) (wallet authentication + NFT gating)
- **Hosting**: [Railway](https://railway.app/) / [Vercel](https://vercel.com/)

## 🎨 Design System

### Colors

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| Background | `#FEFCF5` (warm cream) | `#0D0D0D` → `#0A0D21` (gradient) |
| Foreground | `#0D0D0D` | `#FEFCF5` |
| Primary (CTA) | `#58bed7` | `#58bed7` |

### Accessibility

- WCAG 2.1 AA compliant contrast ratios
- Keyboard navigation support
- Skip-to-content link
- Focus states on all interactive elements
- Semantic HTML structure
- ARIA labels where appropriate

## 🗃 Database Setup

1. Create a PostgreSQL database on [Railway](https://railway.app/)
2. Set `DATABASE_URL` in your environment variables
3. Run migrations:
   ```bash
   npm run db:push
   npm run db:generate
   ```
4. (Optional) Seed the database:
   ```bash
   npm run db:seed
   ```

### Environment Variables

```bash
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://..."

# S3 Storage (Railway or compatible)
S3_ENDPOINT="https://..."
S3_BUCKET="think-marketplace"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_REGION="auto"

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="..."

# NFT Gating
NFT_CONTRACT_ADDRESS="0x..."
NFT_CHAIN_ID="1"

# Admin
ADMIN_SECRET_CODE="..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📝 Listing Types

| Type | Description |
|------|-------------|
| **Agent** | Autonomous AI with Soul, Mind, and Body (Think Agent Standard) |
| **Tool** | Deterministic module — same input always produces same output |
| **App** | Complete application built on Think |

## 🤝 Contributing

This is a **contributor-only showcase**. To be featured:

1. **Build**: FE component, API route, schema, or integration
2. **UX**: Flows, wireframes, UI kit, or layout system
3. **Content**: Listing template, taxonomy, or Think framing copy
4. **Ops**: Documentation, contributor onboarding, or QA checklist

### Development

```bash
# Run development server
npm run dev

# Type checking
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build

# Database commands
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio
```

## 📅 Roadmap

### v1 (Jan 31, 2026)
- [x] Home page with featured listings
- [x] Browse with search & filters
- [x] Listing detail pages
- [x] Builder profiles
- [x] Submit listing form
- [x] Dark/light theme
- [x] PostgreSQL database (Railway + Prisma)
- [x] S3 file storage (Railway)
- [x] Privy wallet authentication
- [x] NFT gating for submissions
- [x] Admin dashboard

### v2 (Future)
- [ ] x402 payments on ApeChain
- [ ] ThinkOS app store integration
- [ ] Ratings & reviews
- [ ] Builder dashboards

## 📄 License

MIT © [Think Protocol](https://thinkagents.ai)

---

**Built with 🧠 by the Think community**
