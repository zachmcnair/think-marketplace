import { ListingCardSkeleton } from "./listing-card-skeleton";
import { cn } from "@/lib/utils";

export function FeaturedGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-auto">
      <div className="md:col-span-4 md:row-span-2 h-full min-h-[300px]">
        <ListingCardSkeleton featured={true} />
      </div>
      <div className="md:col-span-2 md:row-span-1 h-full min-h-[300px]">
        <ListingCardSkeleton featured={true} />
      </div>
      <div className="md:col-span-2 md:row-span-1 h-full min-h-[300px]">
        <ListingCardSkeleton featured={true} />
      </div>
      <div className="md:col-span-2 md:row-span-1 h-full min-h-[300px]">
        <ListingCardSkeleton featured={true} />
      </div>
      <div className="md:col-span-2 md:row-span-1 h-full min-h-[300px]">
        <ListingCardSkeleton featured={true} />
      </div>
    </div>
  );
}
