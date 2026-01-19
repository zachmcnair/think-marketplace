import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Twitter, Github } from "lucide-react";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListingCard } from "@/components/listing-card";
import { fetchBuilder } from "@/lib/api";
import type { Builder, Listing } from "@/types";

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://marketplace.thinkagents.ai'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const builder = await fetchBuilder(slug);
    const description = builder.bio || `View AI agents, tools, and apps from ${builder.name} on Think Marketplace`;

    return {
      title: `${builder.name} - Builder Profile`,
      description,
      openGraph: {
        title: `${builder.name} | Think Marketplace Builder`,
        description,
        url: `${BASE_URL}/builder/${slug}`,
        type: 'profile',
        images: builder.avatar_url ? [
          {
            url: builder.avatar_url,
            width: 400,
            height: 400,
            alt: builder.name,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary',
        title: `${builder.name} | Think Marketplace`,
        description,
        images: builder.avatar_url ? [builder.avatar_url] : undefined,
      },
      alternates: {
        canonical: `${BASE_URL}/builder/${slug}`,
      },
    };
  } catch {
    return {
      title: "Builder Not Found",
      description: "The requested builder profile could not be found.",
    };
  }
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let builder: Builder & { listings?: Listing[] };

  try {
    builder = await fetchBuilder(slug) as Builder & { listings?: Listing[] };
  } catch {
    notFound();
  }

  const listings = (builder.listings || []) as unknown as Listing[];

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: builder.name,
    description: builder.bio,
    url: `${BASE_URL}/builder/${builder.slug}`,
    image: builder.avatar_url,
    sameAs: [
      builder.website,
      builder.twitter ? `https://twitter.com/${builder.twitter}` : null,
      builder.github ? `https://github.com/${builder.github}` : null,
    ].filter(Boolean),
  };

  return (
    <Layout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Browse
          </Link>
        </div>

        {/* Builder header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary/10 text-primary font-body text-3xl font-semibold">
                {builder.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="font-body text-3xl font-semibold text-foreground mb-3">
                {builder.name}
              </h1>

              {builder.bio && (
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  {builder.bio}
                </p>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {builder.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={builder.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                      Website
                    </a>
                  </Button>
                )}
                {builder.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://twitter.com/${builder.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="mr-2 h-4 w-4" aria-hidden="true" />
                      @{builder.twitter}
                    </a>
                  </Button>
                )}
                {builder.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://github.com/${builder.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                      {builder.github}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div>
          <h2 className="font-body text-2xl font-semibold text-foreground mb-6">
            Listings
            <span className="ml-2 text-lg text-muted-foreground font-normal">
              ({listings.length})
            </span>
          </h2>

          {listings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">
                No listings from this builder yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
