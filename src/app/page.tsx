import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/listing-card";
import { ListingCardSkeleton } from "@/components/listing-card-skeleton";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { FeaturedGridSkeleton } from "@/components/featured-grid-skeleton";
import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FadeIn } from "@/components/ui/fade-in";
import { fetchFeaturedListings, fetchListings, fetchCategories } from "@/lib/api";
import type { Listing } from "@/types";

export const dynamic = 'force-dynamic'

import { getBaseUrl } from "@/lib/utils";

const BASE_URL = getBaseUrl();

// JSON-LD structured data for the home page
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Think Marketplace',
  description: 'Discover apps, tools, and agents built on the Think protocol. A curated showcase of AI you own.',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/browse?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Think Protocol',
    url: 'https://thinkagents.ai',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/think-brainfist-light-mode.svg`,
    },
    sameAs: [
      'https://x.com/thinkagents',
      'https://github.com/think-labs',
    ],
  },
};

async function FeaturedSection() {
  const data = await fetchFeaturedListings();
  const featuredListings = data.listings as unknown as Listing[];

  if (featuredListings.length === 0) return null;

  return (
    <FadeIn>
      <section className="border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/20 skew-y-1 transform origin-top-left -z-10 h-full" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-3xl font-normal text-foreground">
              Featured Projects
            </h2>
            <Link
              href="/browse?visibility=featured"
              className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              View all featured
            </Link>
          </div>
          <FeaturedGrid listings={featuredListings} />
        </div>
      </section>
    </FadeIn>
  );
}

async function CategorySection() {
  const [agentData, toolData, appData] = await Promise.all([
    fetchListings({ type: 'agent' }),
    fetchListings({ type: 'tool' }),
    fetchListings({ type: 'app' }),
  ]);

  const categoryCounts = {
    agents: agentData.listings.length,
    tools: toolData.listings.length,
    apps: appData.listings.length
  };

  return (
    <FadeIn>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-normal text-foreground mb-10">
            Browse by Type
          </h2>
          <CategoryGrid counts={categoryCounts} />
        </div>
      </section>
    </FadeIn>
  );
}

async function NotableSection() {
  const data = await fetchListings({ limit: 6 });
  const allListings = data.listings as unknown as Listing[];

  return (
    <FadeIn>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-heading text-3xl font-normal text-foreground">
              New & Notable
            </h2>
            <Link
              href="/browse?sort=newest"
              className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allListings.slice(0, 6).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

async function CategoriesListSection() {
  const data = await fetchCategories();
  const categories = data.categories;

  return (
    <FadeIn>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-normal text-foreground mb-10">
            Browse by Category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/browse?category=${category.slug}`}
                className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <span className="text-lg" aria-hidden="true">
                    {category.icon === "zap" && "⚡"}
                    {category.icon === "image" && "🎨"}
                    {category.icon === "trending-up" && "📈"}
                    {category.icon === "code" && "💻"}
                    {category.icon === "users" && "👥"}
                    {category.icon === "bar-chart" && "📊"}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}

export default function HomePage() {
  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Section */}
      <Suspense fallback={
        <section className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <FeaturedGridSkeleton />
          </div>
        </section>
      }>
        <FeaturedSection />
      </Suspense>

      {/* Category Type Cards */}
      <Suspense fallback={
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="h-48 bg-muted animate-pulse rounded-xl" />
              <div className="h-48 bg-muted animate-pulse rounded-xl" />
              <div className="h-48 bg-muted animate-pulse rounded-xl" />
            </div>
          </div>
        </section>
      }>
        <CategorySection />
      </Suspense>

      {/* What is User-Owned AI? */}
      <FadeIn>
        <section className="border-b border-border bg-muted/30 relative">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl mb-8">
                What is User-Owned AI?
              </h2>
              <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed">
                <p className="mb-6">
                  Most AI today is rented. You use it through someone else&apos;s
                  servers, your data feeds their models, and you have no say in how
                  it works or changes.
                </p>
                <p className="mb-6">
                  <strong className="text-foreground font-semibold">User-owned AI is different.</strong>{" "}
                  Built on the{" "}
                  <a
                    href="https://docs.thinkagents.ai/whitepaper/think-agent-standard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Think Agent Standard
                  </a>
                  , these agents have verifiable identity, portable memory, and
                  interfaces you control. You own the AI, not the other way around.
                </p>
                <p>
                  Every project in this directory is built on these principles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* New & Notable */}
      <Suspense fallback={
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      }>
        <NotableSection />
      </Suspense>

      {/* Categories List */}
      <Suspense fallback={
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}
            </div>
          </div>
        </section>
      }>
        <CategoriesListSection />
      </Suspense>

      {/* CTA Section */}
      <FadeIn>
        <section className="bg-gradient-to-br from-primary/5 via-transparent to-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 relative">
            <div className="text-center">
              <h2 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl mb-6">
                Building on Think?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Submit your project to the Think Marketplace. Get discovered by
                users and builders in the Think ecosystem.
              </p>
              <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Link href="/submit">
                  Submit Your Listing
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeIn>
    </Layout>
  );
}