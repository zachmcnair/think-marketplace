/**
 * Think Marketplace Type Definitions
 * ==================================
 * Core types for listings, builders, and the Think Fit framework.
 */

// Listing type taxonomy based on Think Agent Standard
export type ListingType = "app" | "tool" | "agent";

// Listing status
export type ListingStatus = "live" | "beta" | "concept";

// Visibility levels
export type ListingVisibility = "featured" | "public" | "unlisted";

// Review states for moderation
export type ReviewState = "pending" | "approved" | "rejected";

// Think Fit - Soul component
export interface ThinkFitSoul {
  has_wallet_auth: "yes" | "no" | "planned";
  identity_anchor?: string; // Description of identity mechanism
}

// Think Fit - Mind component
export type MindRuntime = "local" | "server" | "hybrid";

export interface ThinkFitMind {
  mind_runtime: MindRuntime;
  tooling?: string; // What tools it calls/provides
}

// Think Fit - Body component
export type InterfaceType = "web" | "desktop" | "extension" | "api" | "mobile";

export interface ThinkFitBody {
  interface_type: InterfaceType;
  surfaces?: string[]; // Where it lives (e.g., ["browser", "discord", "telegram"])
}

// Complete Think Fit structure
export interface ThinkFit {
  soul?: ThinkFitSoul;
  mind?: ThinkFitMind;
  body?: ThinkFitBody;
}

// Listing links
export interface ListingLinks {
  website?: string;
  demo?: string;
  docs?: string;
  repo?: string;
  waitlist?: string;
}

// Media item
export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
  order: number;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

// Builder / Studio profile
export interface Builder {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  twitter?: string;
  github?: string;
  discord?: string;
  created_at: string;
  updated_at: string;
}

// Core Listing type
export interface Listing {
  id: string;
  name: string;
  slug: string;
  type: ListingType;
  short_description: string; // Max 140 chars
  long_description?: string;
  status: ListingStatus;
  categories: string[]; // Category IDs
  tags: string[];
  links: ListingLinks;
  media: MediaItem[];
  icon_url?: string;
  thumbnail_url?: string; // Cover image for featured cards
  builder_id: string;
  builder?: Builder; // Populated on fetch
  think_fit?: ThinkFit;
  visibility: ListingVisibility;
  review_state: ReviewState;
  created_at: string;
  updated_at: string;
}

// Listing form data (for submissions)
export interface ListingFormData {
  name: string;
  type: ListingType;
  short_description: string;
  long_description?: string;
  status: ListingStatus;
  categories: string[];
  tags: string[];
  links: ListingLinks;
  think_fit?: ThinkFit;
  icon_url?: string;
  media_urls?: string[];
}

// Search/filter params
export interface ListingFilters {
  type?: ListingType | ListingType[];
  status?: ListingStatus | ListingStatus[];
  categories?: string[];
  search?: string;
  builder_id?: string;
  visibility?: ListingVisibility;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Featured collection for homepage
export interface FeaturedCollection {
  id: string;
  title: string;
  description?: string;
  listings: Listing[];
  order: number;
}
