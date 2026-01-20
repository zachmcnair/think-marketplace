import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ListingCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card p-5 h-full flex flex-col space-y-4",
      featured ? "min-h-[300px]" : ""
    )}>
      {featured ? (
        <Skeleton className="aspect-video w-full rounded-lg" />
      ) : (
        <div className="flex items-start justify-between">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      )}
      
      <div className="space-y-2 flex-1">
        {featured && (
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-4 w-24" />
          </div>
        )}
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {featured && (
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      )}
    </div>
  );
}
