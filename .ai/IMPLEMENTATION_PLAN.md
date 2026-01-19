# Think Marketplace - Implementation Plan

**Created:** January 18, 2026
**Target:** Complete v1 with Authentication

---

## Project Decisions Summary

| Decision | Choice |
|----------|--------|
| Infrastructure | Railway (Postgres + Object Storage + Hosting) |
| Authentication | Privy wallet |
| NFT Gating | Ethereum mainnet |
| NFT Contract | `0x11B3EfbF04F0bA505F380aC20444B6952970AdA6` |
| Non-holder UX | Browse only (Submit shows "NFT required") |
| Edit Flow | Request edits (admin approves) |
| Admin Access | Password/code protected routes |
| Frontend Updates | No major changes |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Railway Hosting                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Next.js App                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │  Pages   │  │   API    │  │   Middleware     │  │    │
│  │  │ (SSR/SSG)│  │  Routes  │  │  (Auth + NFT)    │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│           ┌────────────────┼────────────────┐               │
│           ▼                ▼                ▼               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Postgres   │  │    Object    │  │    Privy     │      │
│  │   Database   │  │   Storage    │  │   (Auth)     │      │
│  │  (Railway)   │  │  (Railway)   │  │  (External)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Ethereum RPC    │
                    │  (NFT Check)     │
                    └──────────────────┘
```

---

## Implementation Phases

### Phase 1: Infrastructure Migration
**Goal:** Move from Supabase to Railway

#### 1.1 Railway Setup
- [ ] Create Railway project
- [ ] Provision Postgres database
- [ ] Provision Object Storage bucket
- [ ] Configure environment variables

#### 1.2 Database Migration
- [ ] Adapt Supabase schema for standard Postgres (remove Supabase-specific features)
- [ ] Create migration scripts
- [ ] Set up Prisma or Drizzle ORM
- [ ] Seed database with initial data

#### 1.3 Storage Setup
- [ ] Configure Railway bucket for images
- [ ] Create upload utility functions
- [ ] Set up image optimization pipeline

**Deliverable:** Railway infrastructure ready, database seeded

---

### Phase 2: Core API Development
**Goal:** Build all necessary API routes

#### 2.1 Database Client
- [ ] Set up ORM (Prisma recommended)
- [ ] Generate types from schema
- [ ] Create database utility functions

#### 2.2 Public API Routes
```
GET  /api/listings              - Paginated listings
GET  /api/listings/[slug]       - Single listing
GET  /api/listings/search       - Full-text search
GET  /api/listings/featured     - Featured listings
GET  /api/builders/[slug]       - Builder profile
GET  /api/categories            - All categories
```

#### 2.3 Protected API Routes (NFT holders only)
```
POST /api/listings              - Submit new listing
POST /api/listings/[id]/edit-request  - Request edit
POST /api/upload                - Upload image
```

#### 2.4 Admin API Routes (password protected)
```
GET  /api/admin/pending         - Pending submissions
POST /api/admin/listings/[id]/approve  - Approve listing
POST /api/admin/listings/[id]/reject   - Reject listing
GET  /api/admin/edit-requests   - Pending edit requests
POST /api/admin/edit-requests/[id]/approve - Apply edit
POST /api/admin/edit-requests/[id]/reject  - Reject edit
```

**Deliverable:** Fully functional API layer

---

### Phase 3: Authentication & NFT Gating
**Goal:** Implement Privy auth with NFT verification

#### 3.1 Privy Integration
- [ ] Install `@privy-io/react-auth`
- [ ] Configure Privy provider in app layout
- [ ] Create auth context/hooks
- [ ] Build login/logout UI components

#### 3.2 NFT Verification
- [ ] Set up Ethereum RPC connection (Alchemy/Infura)
- [ ] Create NFT ownership check utility
- [ ] Contract: `0x11B3EfbF04F0bA505F380aC20444B6952970AdA6`
- [ ] Cache NFT status in session

#### 3.3 Protected Routes
- [ ] Create middleware for NFT-gated routes
- [ ] Update Submit page with gating UI
- [ ] Show "NFT Required" message for non-holders
- [ ] Create holder-only components

#### 3.4 Session Management
- [ ] Store user wallet + NFT status
- [ ] Link submissions to wallet address
- [ ] Create "My Submissions" view

**Deliverable:** Working auth with NFT gating

---

### Phase 4: Submission & Edit Flow
**Goal:** Complete submission and edit request workflow

#### 4.1 Enhanced Submit Form
- [ ] Connect form to POST /api/listings
- [ ] Add image upload component
- [ ] Show submission confirmation
- [ ] Email notification (optional)

#### 4.2 Builder Dashboard
- [ ] Create `/dashboard` page (NFT-gated)
- [ ] Show user's submissions with status
- [ ] "Request Edit" button on approved listings
- [ ] Edit request form modal

#### 4.3 Edit Request System
- [ ] Create edit_requests table
- [ ] Store proposed changes as JSON diff
- [ ] Link to original listing

**Deliverable:** Complete submission and edit request flow

---

### Phase 5: Admin Dashboard
**Goal:** Build admin review interface

#### 5.1 Admin Authentication
- [ ] Create `/admin` route
- [ ] Password/code protection middleware
- [ ] Simple login form

#### 5.2 Submission Review
- [ ] List pending submissions
- [ ] Preview submission details
- [ ] Approve/Reject buttons with confirmation
- [ ] Optional: rejection reason field

#### 5.3 Edit Request Review
- [ ] List pending edit requests
- [ ] Show diff view (before/after)
- [ ] Approve (apply changes) / Reject

#### 5.4 Listing Management
- [ ] List all listings with filters
- [ ] Quick actions (feature, unfeature, hide)
- [ ] Featured collections management

**Deliverable:** Functional admin dashboard

---

### Phase 6: Frontend Integration
**Goal:** Connect frontend to live backend

#### 6.1 Replace Seed Data
- [ ] Update home page to fetch from API
- [ ] Update browse page with server-side search
- [ ] Update listing detail pages
- [ ] Update builder profile pages

#### 6.2 Auth UI Updates
- [ ] Add Privy login button to header
- [ ] Show user wallet/avatar when connected
- [ ] Update Submit page gate UI
- [ ] Add Dashboard link for holders

#### 6.3 Real-time Updates (optional)
- [ ] Optimistic UI updates
- [ ] Loading states
- [ ] Error handling

**Deliverable:** Fully integrated frontend

---

### Phase 7: Deployment & Polish
**Goal:** Production-ready deployment

#### 7.1 Railway Deployment
- [ ] Configure production environment
- [ ] Set up custom domain
- [ ] SSL/TLS configuration
- [ ] Health checks

#### 7.2 Performance
- [ ] Add caching headers
- [ ] Implement ISR for listing pages
- [ ] Image optimization
- [ ] Database query optimization

#### 7.3 Monitoring
- [ ] Error tracking (Sentry recommended)
- [ ] Analytics (Plausible/Vercel Analytics)
- [ ] Uptime monitoring

#### 7.4 Final Polish
- [ ] OG images for social sharing
- [ ] Loading skeletons
- [ ] Empty states
- [ ] 404/error pages

**Deliverable:** Production deployment

---

## Database Schema Updates

### New Tables Required

```sql
-- Edit requests table
CREATE TABLE edit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  requester_wallet VARCHAR(42) NOT NULL,
  proposed_changes JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- User sessions (optional, Privy handles most)
CREATE TABLE user_profiles (
  wallet_address VARCHAR(42) PRIMARY KEY,
  display_name VARCHAR(100),
  avatar_url TEXT,
  is_nft_holder BOOLEAN DEFAULT FALSE,
  last_nft_check TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin table (simple approach)
CREATE TABLE admin_codes (
  code_hash VARCHAR(64) PRIMARY KEY,
  label VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);
```

### Schema Modifications

```sql
-- Add to listings table
ALTER TABLE listings ADD COLUMN submitter_wallet VARCHAR(42);
ALTER TABLE listings ADD COLUMN rejection_reason TEXT;

-- Add to builders table
ALTER TABLE builders ADD COLUMN wallet_address VARCHAR(42);
```

---

## Environment Variables

```env
# Railway
DATABASE_URL=postgresql://...
RAILWAY_STORAGE_BUCKET_URL=...
RAILWAY_STORAGE_ACCESS_KEY=...
RAILWAY_STORAGE_SECRET_KEY=...

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=...
PRIVY_APP_SECRET=...

# Ethereum RPC (for NFT checks)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/...

# NFT Gating
NFT_CONTRACT_ADDRESS=0x11B3EfbF04F0bA505F380aC20444B6952970AdA6

# Admin
ADMIN_SECRET_CODE=...

# App
NEXT_PUBLIC_APP_URL=https://marketplace.thinkos.ai
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@privy-io/react-auth": "^1.x",
    "prisma": "^5.x",
    "@prisma/client": "^5.x",
    "viem": "^2.x",
    "aws-sdk": "^2.x"
  }
}
```

**Notes:**
- `viem` for Ethereum RPC calls (NFT ownership check)
- `aws-sdk` for Railway S3-compatible storage
- Prisma for type-safe database queries

---

## File Structure (New/Modified)

```
src/
├── app/
│   ├── api/
│   │   ├── listings/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   ├── [slug]/route.ts       # GET (single)
│   │   │   ├── search/route.ts       # GET (search)
│   │   │   └── featured/route.ts     # GET (featured)
│   │   ├── builders/
│   │   │   └── [slug]/route.ts       # GET (profile)
│   │   ├── categories/route.ts       # GET (all)
│   │   ├── upload/route.ts           # POST (image upload)
│   │   └── admin/
│   │       ├── route.ts              # POST (login)
│   │       ├── pending/route.ts      # GET (pending)
│   │       └── listings/
│   │           └── [id]/
│   │               ├── approve/route.ts
│   │               └── reject/route.ts
│   ├── admin/
│   │   ├── page.tsx                  # Admin login
│   │   └── dashboard/
│   │       └── page.tsx              # Admin dashboard
│   ├── dashboard/
│   │   └── page.tsx                  # User dashboard (NFT-gated)
│   └── ...existing pages
├── lib/
│   ├── db/
│   │   ├── prisma.ts                 # Prisma client
│   │   └── queries.ts                # Database queries
│   ├── auth/
│   │   ├── privy.ts                  # Privy utilities
│   │   └── nft.ts                    # NFT verification
│   ├── storage/
│   │   └── railway.ts                # S3 storage utilities
│   └── ...existing
├── components/
│   ├── auth/
│   │   ├── privy-provider.tsx        # Privy context
│   │   ├── login-button.tsx          # Connect wallet
│   │   └── nft-gate.tsx              # NFT requirement wrapper
│   └── ...existing
├── middleware.ts                      # Auth + admin protection
└── prisma/
    └── schema.prisma                  # Database schema
```

---

## Task Checklist

### Immediate Next Steps

1. [ ] Set up Railway project and services
2. [ ] Install Prisma and create schema
3. [ ] Migrate seed data to Railway Postgres
4. [ ] Create basic API routes
5. [ ] Integrate Privy authentication
6. [ ] Implement NFT ownership check
7. [ ] Build admin dashboard
8. [ ] Deploy to Railway

---

## Risk Considerations

| Risk | Mitigation |
|------|------------|
| Railway storage unfamiliar | Test early, have Cloudinary as backup |
| NFT check rate limits | Cache ownership status, use reliable RPC |
| Privy integration complexity | Follow docs closely, test on testnet first |
| Admin code security | Hash codes, rate limit attempts |

---

## Success Criteria

**MVP Complete When:**
- [ ] Users can browse all listings without auth
- [ ] NFT holders can connect wallet via Privy
- [ ] NFT holders can submit new listings
- [ ] Submissions go to pending queue
- [ ] Admin can approve/reject via dashboard
- [ ] Approved listings appear on site
- [ ] Edit requests can be submitted and reviewed
- [ ] Site deployed and accessible

---

*Plan created by Claude Code on January 18, 2026*
