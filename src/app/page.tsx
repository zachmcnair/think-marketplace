import Link from "next/link";
import { ArrowRight, Bot, Wrench, AppWindow } from "lucide-react";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ListingCard } from "@/components/listing-card";
import { FeaturedCarousel } from "@/components/featured-carousel";
import {
  getFeaturedListings,
  getListingsByType,
  getAllListingsWithBuilders,
  categories,
} from "@/lib/data/seed";

export default function HomePage() {
  const featuredListings = getFeaturedListings();
  const agents = getListingsByType("agent");
  const tools = getListingsByType("tool");
  const apps = getListingsByType("app");
  const allListings = getAllListingsWithBuilders().filter(
    (l) => l.review_state === "approved"
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background decoration */}
        <div
          className="absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance font-normal">
              Discover What&apos;s Being Built on{" "}
              <span className="text-primary">Think</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Agents, tools, and apps from builders creating AI you actually
              own. Your AI, your data, your rules.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/browse">
                  Browse the Directory
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/submit">Submit Your Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carousel Section */}
      {featuredListings.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-body text-2xl font-semibold text-foreground">
                Featured
              </h2>
              <Link
                href="/browse?visibility=featured"
                className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                View all featured
              </Link>
            </div>
            <FeaturedCarousel listings={featuredListings} />
          </div>
        </section>
      )}

      {/* Category Type Cards */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-8">
            Browse by Type
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Agents */}
            <Link
              href="/browse?type=agent"
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-purple-500/50 dark:hover:border-purple-400/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <Bot className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-body text-lg font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        Agents
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {agents.length} listings
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Autonomous AI with Soul, Mind, and Body. The core of the
                    Think Agent Standard.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Tools */}
            <Link
              href="/browse?type=tool"
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-blue-500/50 dark:hover:border-blue-400/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Wrench className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-body text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Tools
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tools.length} listings
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Modules that agents use to get things done. Calculate,
                    fetch, send, and more.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Apps */}
            <Link
              href="/browse?type=app"
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-green-500/50 dark:hover:border-green-400/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <AppWindow className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-body text-lg font-semibold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        Apps
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {apps.length} listings
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full applications built on Think. Productivity tools,
                    creative suites, and more.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* What is User-Owned AI? */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl mb-6">
              What is User-Owned AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Most AI today is rented. You use it through someone else&apos;s
              servers, your data feeds their models, and you have no say in how
              it works or changes.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              <strong className="text-foreground">User-owned AI is different.</strong>{" "}
              Built on the{" "}
              <a
                href="https://docs.thinkagents.ai/whitepaper/think-agent-standard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Think Agent Standard
              </a>
              , these agents have verifiable identity, portable memory, and
              interfaces you control. You own the AI, not the other way around.
            </p>
            <p className="text-muted-foreground">
              Every project in this directory is built on these principles.
            </p>
          </div>
        </div>
      </section>

      {/* New & Notable */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-body text-2xl font-semibold text-foreground">
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

      {/* Categories */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-8">
            Browse by Category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
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

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl mb-6">
              Building on Think?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Submit your project to the Think Marketplace. Get discovered by
              users and builders in the Think ecosystem.
            </p>
            <Button size="lg" asChild>
              <Link href="/submit">
                Submit Your Listing
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
