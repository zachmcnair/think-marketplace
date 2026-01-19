"use client";

import { cn } from "@/lib/utils";
import { ListingCard } from "@/components/listing-card";
import { BentoGrid } from "@/components/ui/bento-grid";
import type { Listing } from "@/types";

export function FeaturedGrid({ listings }: { listings: Listing[] }) {
  // Take up to 5 featured items
  const displayListings = listings.slice(0, 5);

  return (
    <BentoGrid className="md:grid-cols-6 auto-rows-auto">
      {displayListings.map((listing, i) => (
        <div
          key={listing.id}
          className={cn(
            "h-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px]",
            i === 0 ? "md:col-span-4 md:row-span-2" : "md:col-span-2 md:row-span-1"
          )}
        >
          <ListingCard listing={listing} featured={true} />
        </div>
      ))}
    </BentoGrid>
  );
}