"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock, AlertTriangle, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NftGate } from "@/components/auth/nft-gate";
import { ListingForm } from "@/components/listing-form";

interface EditableListing {
  id: string;
  name: string;
  type: "app" | "tool" | "agent";
  short_description: string;
  long_description?: string;
  status: "live" | "beta" | "concept";
  tags: string[];
  links: Record<string, string>;
  categories: string[];
}

function NftRequiredMessage() {
  const { login, authenticated } = usePrivy();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Lock
            className="h-8 w-8 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        </div>
        <h1 className="font-body text-3xl font-semibold text-foreground mb-4">
          NFT Required
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Editing listings is exclusive to Think NFT holders. Connect your
          wallet to verify your NFT ownership.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!authenticated ? (
            <Button onClick={login}>Connect Wallet</Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/browse">Browse Directory</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a
              href="https://opensea.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get NFT
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditListingPage() {
  const params = useParams<{ slug: string }>();
  const { getAccessToken, user } = usePrivy();
  const [listing, setListing] = useState<EditableListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadListing() {
      if (!params?.slug || !user?.wallet?.address) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = await getAccessToken();
        if (!token) {
          throw new Error("Authentication required.");
        }
        const res = await fetch(
          `/api/listings/${params.slug}/edit?walletAddress=${encodeURIComponent(
            user.wallet.address
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Unable to load listing.");
        }

        const data = await res.json();
        if (isActive) {
          setListing(data.listing);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Unable to load listing.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      isActive = false;
    };
  }, [getAccessToken, params?.slug, user?.wallet?.address]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading listing details...
        </p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Unable to load listing
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {error || "This listing may not exist or you do not have access."}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/browse">Back to Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ListingForm
      mode="edit"
      listingSlug={params.slug}
      initialData={{
        name: listing.name,
        type: listing.type,
        short_description: listing.short_description,
        long_description: listing.long_description || "",
        status: listing.status,
        category: listing.categories[0] || "",
        tags: listing.tags.join(", "),
        website: listing.links?.website || "",
        demo: listing.links?.demo || "",
        docs: listing.links?.docs || "",
        repo: listing.links?.repo || "",
      }}
    />
  );
}

export default function EditPage() {
  return (
    <Layout>
      <NftGate fallback={<NftRequiredMessage />}>
        <EditListingPage />
      </NftGate>
    </Layout>
  );
}
