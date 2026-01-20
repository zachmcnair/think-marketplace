"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";

interface ListingEditLinkProps {
  slug: string;
}

export function ListingEditLink({ slug }: ListingEditLinkProps) {
  const { getAccessToken, user, authenticated } = usePrivy();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function checkOwnership() {
      if (!authenticated || !user?.wallet?.address) {
        setCanEdit(false);
        return;
      }

      try {
        const token = await getAccessToken();
        if (!token) {
          if (isActive) {
            setCanEdit(false);
          }
          return;
        }
        const res = await fetch(
          `/api/listings/${slug}/edit?walletAddress=${encodeURIComponent(
            user.wallet.address
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isActive) {
          setCanEdit(res.ok);
        }
      } catch {
        if (isActive) {
          setCanEdit(false);
        }
      }
    }

    checkOwnership();

    return () => {
      isActive = false;
    };
  }, [authenticated, getAccessToken, slug, user?.wallet?.address]);

  if (!canEdit) {
    return null;
  }

  return (
    <Button variant="outline" size="lg" className="rounded-xl px-6" asChild>
      <Link href={`/edit/${slug}`}>
        <Pencil className="mr-2 h-4 w-4" />
        Edit Listing
      </Link>
    </Button>
  );
}
