"use client";

import Link from "next/link";
import Image from "next/image";
import { Bot, Wrench, AppWindow } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

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

// Default icon for listings without a custom icon
const DEFAULT_ICON = "/thinkos-grey.svg";

// Placeholder gradient for listings without a thumbnail
const PLACEHOLDER_GRADIENT = "bg-gradient-to-br from-primary/10 via-background to-accent/5";

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  const TypeIcon = typeIcons[listing.type];
  const iconSrc = listing.icon_url || DEFAULT_ICON;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Common card content logic
  const CardContent = () => (
    <div className="h-full flex flex-col">
      {/* Header / Thumbnail Area */}
      <div className="relative mb-4">
        {featured ? (
          <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg", !listing.thumbnail_url && PLACEHOLDER_GRADIENT)}>
            {listing.thumbnail_url ? (
              <Image
                src={listing.thumbnail_url}
                alt={`${listing.name} preview`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <TypeIcon className="w-16 h-16 text-muted-foreground/50" />
               </div>
            )}
            {/* Overlay Gradient for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-muted/50 p-2 ring-1 ring-border/50 transition-all group-hover:ring-primary/30 group-hover:bg-primary/5">
              <Image
                src={iconSrc}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <Badge variant="outline" className={cn("ml-auto capitalize backdrop-blur-sm", typeColors[listing.type])}>
              <TypeIcon className="mr-1 h-3 w-3" />
              {listing.type}
            </Badge>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {featured && (
           <div className="flex items-center gap-2 mb-2">
             <div className="relative h-6 w-6 overflow-hidden rounded-md">
              <Image src={iconSrc} alt="" fill className="object-contain"/>
             </div>
             <span className="text-xs text-muted-foreground">{listing.builder?.name || "Unknown Builder"}</span>
           </div>
        )}

        <h3 className="font-heading text-xl font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {listing.name}
        </h3>
        
        {!featured && listing.builder && (
           <p className="text-xs text-muted-foreground mb-2">by {listing.builder.name}</p>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
          {listing.short_description}
        </p>
      </div>
      
      {/* Footer / Badges (if not featured, already showed type at top) */}
      {featured && (
         <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className={cn("capitalize backdrop-blur-sm", typeColors[listing.type])}>
              <TypeIcon className="mr-1 h-3 w-3" />
              {listing.type}
            </Badge>
         </div>
      )}
    </div>
  );

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group relative block h-full rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Effect Layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(88, 190, 215, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Border Glow Layer */}
      <motion.div
         className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
         style={{
            background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(88, 190, 215, 0.4),
              transparent 40%
            )
          `,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px", // The border width
         }}
      />

      <div className="relative h-full p-5 z-10">
        <CardContent />
      </div>
    </Link>
  );
}

// Compact variant for grid displays or small areas
export function ListingCardCompact({ listing }: { listing: Listing }) {
  const iconSrc = listing.icon_url || DEFAULT_ICON;

  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="group block rounded-lg border border-border/50 bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-200"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Icon */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted/50 p-1.5">
          <Image
            src={iconSrc}
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-xs text-muted-foreground/80">{listing.type}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
