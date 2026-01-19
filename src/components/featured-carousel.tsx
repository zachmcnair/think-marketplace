"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Bot, Wrench, AppWindow, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

const typeIcons = {
  agent: Bot,
  tool: Wrench,
  app: AppWindow,
};

const typeColors = {
  agent: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  tool: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  app: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const DEFAULT_ICON = "/thinkos-grey.svg";

interface FeaturedCarouselProps {
  listings: Listing[];
}

export function FeaturedCarousel({ listings }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Measure image height for arrow positioning
  useEffect(() => {
    const updateHeight = () => {
      if (imageRef.current) {
        setImageHeight(imageRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  if (listings.length === 0) return null;

  return (
    <div className="relative">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {listings.map((listing, index) => {
            const TypeIcon = typeIcons[listing.type];
            const iconSrc = listing.icon_url || DEFAULT_ICON;

            return (
              <div
                key={listing.id}
                className="flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
              >
                <Link
                  href={`/listing/${listing.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl h-full"
                >
                  <div className="flex flex-col h-full">
                    {/* Image - separate, above */}
                    <div 
                      ref={index === 0 ? imageRef : undefined}
                      className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-md border border-border/50 mb-4"
                    >
                      {listing.thumbnail_url ? (
                        <Image
                          src={listing.thumbnail_url}
                          alt={`${listing.name} preview`}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-85"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/60 transition-opacity duration-300 group-hover:opacity-85">
                          <Image
                            src={iconSrc}
                            alt=""
                            width={80}
                            height={80}
                            className="h-16 w-16 object-contain opacity-30"
                          />
                        </div>
                      )}
                      {/* Logo floating on bottom right */}
                      <div
                        className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-xl bg-card/95 backdrop-blur border border-border shadow-lg"
                        aria-hidden="true"
                      >
                        <Image
                          src={iconSrc}
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                    </div>

                    {/* Content - below image */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-body text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {listing.name}
                          </h3>
                          {listing.builder && (
                            <p className="text-xs text-muted-foreground">
                              {listing.builder.name}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn("gap-1 shrink-0 text-xs", typeColors[listing.type])}
                        >
                          <TypeIcon className="h-3 w-3" aria-hidden="true" />
                          {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {listing.short_description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows - centered with the image area */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute z-20 rounded-full bg-background shadow-lg border-border -translate-y-1/2",
          "left-2 sm:-left-4 h-10 w-10 sm:h-9 sm:w-9",
          !canScrollPrev && "opacity-50 cursor-not-allowed"
        )}
        style={{ top: imageHeight ? `${imageHeight / 2}px` : '80px' }}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute z-20 rounded-full bg-background shadow-lg border-border -translate-y-1/2",
          "right-2 sm:-right-4 h-10 w-10 sm:h-9 sm:w-9",
          !canScrollNext && "opacity-50 cursor-not-allowed"
        )}
        style={{ top: imageHeight ? `${imageHeight / 2}px` : '80px' }}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1 mt-6">
        {listings.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="relative p-2 group"
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all duration-300",
                selectedIndex === index
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/20 w-2 group-hover:bg-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
