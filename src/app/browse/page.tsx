"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Bot, Wrench, AppWindow, SlidersHorizontal } from "lucide-react";

import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListingCard } from "@/components/listing-card";
import { getAllListingsWithBuilders, categories } from "@/lib/data/seed";
import { cn } from "@/lib/utils";
import type { ListingType, ListingStatus } from "@/types";

const typeFilters: { value: ListingType | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All Types", icon: SlidersHorizontal },
  { value: "agent", label: "Agents", icon: Bot },
  { value: "tool", label: "Tools", icon: Wrench },
  { value: "app", label: "Apps", icon: AppWindow },
];

const statusFilters: { value: ListingStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "live", label: "Live" },
  { value: "beta", label: "Beta" },
  { value: "concept", label: "Concept" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

function BrowseContent() {
  const searchParams = useSearchParams();
  
  // Initialize from URL params
  const initialType = (searchParams.get("type") as ListingType) || "all";
  const initialStatus = (searchParams.get("status") as ListingStatus) || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<ListingType | "all">(initialType);
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus | "all">(initialStatus);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest");

  const allListings = getAllListingsWithBuilders().filter(
    (l) => l.review_state === "approved"
  );

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = [...allListings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.short_description.toLowerCase().includes(query) ||
          l.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedType !== "all") {
      result = result.filter((l) => l.type === selectedType);
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter((l) => l.status === selectedStatus);
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((l) =>
        l.categories.some(
          (c) =>
            c === selectedCategory ||
            categories.find((cat) => cat.slug === selectedCategory)?.id === c
        )
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [allListings, searchQuery, selectedType, selectedStatus, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedCategory("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== "all" ||
    selectedStatus !== "all" ||
    selectedCategory;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-body text-3xl font-semibold text-foreground mb-2">
          Browse Directory
        </h1>
        <p className="text-muted-foreground">
          Explore apps, tools, and agents built on Think
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Search listings"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Desktop filters */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Type filter chips */}
          <div className="flex items-center gap-2">
            {typeFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.value}
                  variant={selectedType === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(filter.value)}
                  className={cn(
                    "gap-1.5",
                    selectedType === filter.value && "shadow-sm"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {filter.label}
                </Button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-border" aria-hidden="true" />

          {/* Status filter */}
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ListingStatus | "all")}>
            <SelectTrigger className="w-[140px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category filter */}
          <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]" aria-label="Sort listings">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              Clear all
              <X className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Mobile filters */}
        <div className="flex lg:hidden items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Type */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeFilters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <Button
                          key={filter.value}
                          variant={
                            selectedType === filter.value ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedType(filter.value)}
                          className="gap-1.5"
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {filter.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={
                          selectedStatus === filter.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedStatus(filter.value)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Category
                  </p>
                  <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Sort by
                  </p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]" aria-label="Sort listings">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredListings.length} listing
          {filteredListings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Results grid */}
      {filteredListings.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
            <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="font-body text-lg font-semibold text-foreground mb-2">
            No listings found
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function BrowseLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-muted animate-pulse rounded" />
        <div className="h-5 w-64 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="h-10 w-full bg-muted animate-pulse rounded mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Layout>
      <Suspense fallback={<BrowseLoading />}>
        <BrowseContent />
      </Suspense>
    </Layout>
  );
}
