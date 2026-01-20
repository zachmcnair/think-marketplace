import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  FileText,
  Github,
  Clock,
  Bot,
  Wrench,
  AppWindow,
  Cpu,
  Wallet,
  Monitor,
} from "lucide-react";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchListing, fetchBuilder } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { ShareButton } from "@/components/share-button";
import { ListingEditLink } from "@/components/listing-edit-link";
import { cn, getBaseUrl } from "@/lib/utils";
import type { Listing } from "@/types";

export const dynamic = 'force-dynamic'

const typeIcons = {
  agent: Bot,
  tool: Wrench,
  app: AppWindow,
};

const typeColors = {
  agent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  tool: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  app: "text-green-500 bg-green-500/10 border-green-500/20",
};

const statusColors = {
  live: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  beta: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  concept: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const DEFAULT_ICON = "/thinkos-grey.svg";

const BASE_URL = getBaseUrl()

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const listing = await fetchListing(slug);
    const typeLabel = listing.type.charAt(0).toUpperCase() + listing.type.slice(1);

    return {
      title: `${listing.name} - ${typeLabel}`,
      description: listing.short_description,
      keywords: [listing.type, ...listing.tags, 'Think Protocol', 'AI'],
      openGraph: {
        title: `${listing.name} | Think Marketplace`,
        description: listing.short_description,
        url: `${BASE_URL}/listing/${slug}`,
        type: 'article',
        images: listing.thumbnail_url ? [
          {
            url: listing.thumbnail_url,
            width: 1200,
            height: 630,
            alt: listing.name,
          }
        ] : undefined,
        publishedTime: listing.created_at,
        modifiedTime: listing.updated_at,
        authors: listing.builder?.name ? [listing.builder.name] : undefined,
        tags: listing.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${listing.name} | Think Marketplace`,
        description: listing.short_description,
        images: listing.thumbnail_url ? [listing.thumbnail_url] : undefined,
      },
      alternates: {
        canonical: `${BASE_URL}/listing/${slug}`,
      },
    };
  } catch {
    return {
      title: "Not Found",
      description: "The requested listing could not be found.",
    };
  }
}

function ThinkFitSection({ listing }: { listing: Listing }) {
  const { think_fit } = listing;
  if (!think_fit) return null;

  const hasSoul = think_fit.soul;
  const hasMind = think_fit.mind;
  const hasBody = think_fit.body;

  if (!hasSoul && !hasMind && !hasBody) return null;

  return (
    <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg font-heading font-normal">
          <Cpu className="h-5 w-5 text-primary" aria-hidden="true" />
          Think Agent Standard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {hasSoul && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <Wallet className="h-4 w-4 text-purple-500" aria-hidden="true" />
              </div>
              <h4 className="font-medium text-foreground">Soul</h4>
              <Badge
                variant="outline"
                className={cn(
                  "ml-auto text-[10px] uppercase tracking-wider",
                  think_fit.soul?.has_wallet_auth === "yes" && "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
                  think_fit.soul?.has_wallet_auth === "planned" && "text-amber-500 border-amber-500/20 bg-amber-500/5",
                  think_fit.soul?.has_wallet_auth === "no" && "text-slate-500 border-slate-500/20 bg-slate-500/5"
                )}
              >
                {think_fit.soul?.has_wallet_auth === "yes" && "Wallet Auth"}
                {think_fit.soul?.has_wallet_auth === "planned" && "Planned"}
                {think_fit.soul?.has_wallet_auth === "no" && "No Wallet Auth"}
              </Badge>
            </div>
            {think_fit.soul?.identity_anchor && (
              <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                {think_fit.soul.identity_anchor}
              </p>
            )}
          </div>
        )}

        {hasMind && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Cpu className="h-4 w-4 text-blue-500" aria-hidden="true" />
              </div>
              <h4 className="font-medium text-foreground">Mind</h4>
              {think_fit.mind?.mind_runtime && (
                <Badge variant="outline" className="ml-auto text-[10px] uppercase tracking-wider text-blue-500 border-blue-500/20">
                  {think_fit.mind.mind_runtime}
                </Badge>
              )}
            </div>
            {think_fit.mind?.tooling && (
              <p className="text-sm text-muted-foreground leading-relaxed pl-9">
                {think_fit.mind.tooling}
              </p>
            )}
          </div>
        )}

        {hasBody && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <Monitor className="h-4 w-4 text-green-500" aria-hidden="true" />
              </div>
              <h4 className="font-medium text-foreground">Body</h4>
              {think_fit.body?.interface_type && (
                <Badge variant="outline" className="ml-auto text-[10px] uppercase tracking-wider text-green-500 border-green-500/20">
                  {think_fit.body.interface_type}
                </Badge>
              )}
            </div>
            {think_fit.body?.surfaces && think_fit.body.surfaces.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pl-9">
                {think_fit.body.surfaces.map((surface) => (
                  <Badge
                    key={surface}
                    variant="secondary"
                    className="text-[10px] font-medium bg-muted/50 border border-border/50"
                  >
                    {surface}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let listing: Listing;
  let moreFromBuilder: Listing[] = [];

  try {
    listing = await fetchListing(slug) as unknown as Listing;
  } catch {
    notFound();
  }

  const TypeIcon = typeIcons[listing.type];

  // Fetch more from the same builder
  if (listing.builder?.slug) {
    try {
      const builderData = await fetchBuilder(listing.builder.slug);
      moreFromBuilder = ((builderData.listings || []) as unknown as Listing[]).filter(
        (l) => l.id !== listing.id
      );
    } catch {
      // Ignore errors fetching more listings
    }
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: listing.name,
    description: listing.short_description,
    url: `${BASE_URL}/listing/${listing.slug}`,
    applicationCategory: listing.type === 'agent' ? 'AI Agent' : listing.type === 'tool' ? 'Developer Tool' : 'Web Application',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: listing.builder ? {
      '@type': 'Organization',
      name: listing.builder.name,
      url: `${BASE_URL}/builder/${listing.builder.slug}`,
    } : undefined,
    datePublished: listing.created_at,
    dateModified: listing.updated_at,
    image: listing.thumbnail_url || listing.icon_url,
    keywords: listing.tags.join(', '),
  };

  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative">
        {/* Background Grid */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <BackgroundGrid className="opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back link */}
          <div className="mb-10">
            <Link
              href="/browse"
              className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="mr-2 p-1.5 rounded-full bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </div>
              Back to Directory
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-3 items-start">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Hero Header */}
              <div className="flex flex-col sm:flex-row items-start gap-8">
                {/* Icon with refined styling */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-card border border-border/50 shadow-2xl p-4">
                    <Image
                      src={listing.icon_url || DEFAULT_ICON}
                      alt=""
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className={cn("capitalize px-3 py-1 text-xs font-medium", typeColors[listing.type])}>
                      <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
                      {listing.type}
                    </Badge>
                    <Badge variant="outline" className={cn("capitalize px-3 py-1 text-xs font-medium", statusColors[listing.status])}>
                      {listing.status}
                    </Badge>
                    {listing.visibility === "featured" && (
                      <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 text-xs px-3 py-1">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <h1 className="font-heading text-4xl sm:text-5xl font-normal text-foreground leading-tight">
                    {listing.name}
                  </h1>

                  <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    {listing.short_description}
                  </p>

                  {listing.builder && (
                    <div className="pt-2">
                       <Link
                        href={`/builder/${listing.builder.slug}`}
                        className="inline-flex items-center gap-3 p-1 pr-4 rounded-full bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all group"
                      >
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {listing.builder.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Builder</span>
                           <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{listing.builder.name}</span>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {listing.links.website && (
                  <Button size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all" asChild>
                    <a href={listing.links.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                      <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                    </a>
                  </Button>
                )}
                {listing.links.demo && (
                  <Button size="lg" variant="secondary" className="rounded-xl px-8 hover:bg-muted transition-all" asChild>
                    <a href={listing.links.demo} target="_blank" rel="noopener noreferrer">
                      Try Demo
                      <ExternalLink className="ml-2 h-3 w-3 opacity-50" />
                    </a>
                  </Button>
                )}
                <ListingEditLink slug={listing.slug} />
                <div className="flex gap-2">
                  {listing.links.docs && (
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/50" asChild title="Documentation">
                      <a href={listing.links.docs} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  {listing.links.repo && (
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/50" asChild title="Source Code">
                      <a href={listing.links.repo} target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  <ShareButton 
                    title={listing.name} 
                    text={listing.short_description} 
                  />
                </div>
              </div>

              {/* Main Preview / Screenshot if exists, else nice placeholder */}
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 bg-card shadow-2xl">
                 {listing.thumbnail_url ? (
                   <Image src={listing.thumbnail_url} alt={listing.name} fill className="object-cover" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-background">
                      <TypeIcon className="w-32 h-32 text-muted-foreground/10" />
                   </div>
                 )}
              </div>

              {/* Description Section */}
              {listing.long_description && (
                <div className="space-y-6">
                  <h2 className="font-heading text-2xl font-normal text-foreground">Overview</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {listing.long_description}
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {listing.tags.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-normal text-foreground">Focus Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/browse?search=${encodeURIComponent(tag)}`}
                        className="transition-transform hover:scale-105"
                      >
                        <Badge
                          variant="secondary"
                          className="px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 hover:border-primary/30 transition-all text-sm font-normal"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Sticky Area */}
            <aside className="space-y-8 lg:sticky lg:top-24">
              {/* Think Fit Standard Card */}
              <ThinkFitSection listing={listing} />

              {/* Technical Details Card */}
              <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/20">
                   <CardTitle className="text-lg font-heading font-normal">Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Launched</span>
                    </div>
                    <span className="font-medium text-foreground">
                      {new Date(listing.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Monitor className="h-4 w-4" />
                      <span>Platform</span>
                    </div>
                    <span className="font-medium text-foreground capitalize">{listing.type}</span>
                  </div>
                  {listing.updated_at !== listing.created_at && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Last Update</span>
                      <span className="font-medium text-foreground">
                        {new Date(listing.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Builder Profile Card */}
              {listing.builder && (
                <Card className="rounded-2xl border-border/50 bg-primary/5 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-xl">
                          <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                            {listing.builder.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Architect</p>
                          <p className="text-lg font-medium text-foreground leading-tight">{listing.builder.name}</p>
                        </div>
                      </div>
                      <Button variant="secondary" className="w-full rounded-xl bg-background hover:bg-muted" asChild>
                        <Link href={`/builder/${listing.builder.slug}`}>
                          View Builder Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>

          {/* Related / More from Builder Section */}
          {moreFromBuilder.length > 0 && (
            <div className="mt-24 pt-16 border-t border-border/50">
              <div className="flex items-center justify-between mb-10">
                <h2 className="font-heading text-3xl font-normal text-foreground">
                  More by {listing.builder?.name}
                </h2>
                <Link
                  href={`/builder/${listing.builder?.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  See all projects →
                </Link>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {moreFromBuilder.slice(0, 3).map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
