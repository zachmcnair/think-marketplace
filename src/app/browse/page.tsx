"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
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
import { ListingCardSkeleton } from "@/components/listing-card-skeleton";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { cn } from "@/lib/utils";
import type { Listing, ListingType, ListingStatus, Category } from "@/types";

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
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [listingsRes, categoriesRes] = await Promise.all([
          fetch('/api/listings?limit=100'),
          fetch('/api/categories'),
        ]);

        const listingsData = await listingsRes.json();
        const categoriesData = await categoriesRes.json();

        setAllListings(listingsData.listings || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
        l.categories.some((c) => c === selectedCategory)
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

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-normal text-foreground mb-3">
          Explore the Directory
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover the agents, tools, and apps shaping the user-owned AI ecosystem.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-10 space-y-4">
        {/* Search bar */}
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-base rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm focus:ring-primary/20 transition-all shadow-sm"
            aria-label="Search listings"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full hover:bg-muted"
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
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50 backdrop-blur-sm">
            {typeFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.value}
                  variant={selectedType === filter.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedType(filter.value)}
                  className={cn(
                    "gap-1.5 rounded-xl h-9 px-4 transition-all",
                    selectedType === filter.value ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {filter.label}
                </Button>
              );
            })}
          </div>

          <div className="h-8 w-px bg-border/50 mx-2" aria-hidden="true" />

          {/* Status filter */}
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ListingStatus | "all")}>
            <SelectTrigger className="w-[140px] rounded-xl border-border/50 bg-card/50 h-11" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value} className="rounded-lg">
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category filter */}
          <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[180px] rounded-xl border-border/50 bg-card/50 h-11" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug} className="rounded-lg">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-card/50 h-11" aria-label="Sort listings">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Sort:</span>
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
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
              className="text-muted-foreground hover:text-foreground h-11 px-4 rounded-xl"
            >
              Clear
              <X className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Mobile filters */}
        <div className="flex lg:hidden items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 rounded-xl h-12 border-border/50 bg-card/50 backdrop-blur-sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary border-none">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[2rem] border-t-primary/20">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-heading text-2xl">Refine Search</SheetTitle>
              </SheetHeader>
              <div className="space-y-8 overflow-y-auto pb-8">
                {/* Type */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Project Type
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {typeFilters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <Button
                          key={filter.value}
                          variant={selectedType === filter.value ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType(filter.value)}
                          className={cn(
                            "gap-2 rounded-xl h-12 justify-start px-4",
                            selectedType === filter.value && "bg-primary/10 text-primary border-primary/20"
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {filter.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Development Status
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {statusFilters.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedStatus === filter.value ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(filter.value)}
                        className={cn(
                          "rounded-xl h-12",
                          selectedStatus === filter.value && "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </p>
                  <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/30">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug} className="rounded-lg">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="w-full h-12 rounded-xl text-muted-foreground"
                  >
                    Clear all filters
                  </Button>
                )}
                
                <Button className="w-full h-14 rounded-xl text-lg font-medium shadow-lg shadow-primary/20" onClick={() => {}}>
                  Show {filteredListings.length} Results
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px] rounded-xl h-12 border-border/50 bg-card/50 backdrop-blur-sm" aria-label="Sort listings">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Showing <span className="text-foreground">{filteredListings.length}</span> project{filteredListings.length !== 1 ? "s" : ""}
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
        <div className="text-center py-24 bg-card/30 rounded-3xl border border-dashed border-border">
          <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-muted/50">
            <Search className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
          </div>
          <h3 className="font-heading text-2xl font-medium text-foreground mb-2">
            No projects matched your criteria
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Try adjusting your search query or removing filters to find what you&apos;re
            looking for.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="rounded-xl px-8 h-12">
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </>
  );
}

function BrowseLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Layout>
      <section className="relative min-h-screen">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <BackgroundGrid className="opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] opacity-50" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Suspense fallback={<BrowseLoading />}>
            <BrowseContent />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}