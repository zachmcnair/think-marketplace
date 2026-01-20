"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { NftGate } from "@/components/auth/nft-gate";
import { ListingForm } from "@/components/listing-form";

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
          Submitting listings is exclusive to Think NFT holders. Connect your
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

export default function SubmitPage() {
  return (
    <Layout>
      <NftGate fallback={<NftRequiredMessage />}>
        <ListingForm mode="create" />
      </NftGate>
    </Layout>
  );
}
