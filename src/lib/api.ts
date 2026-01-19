/**
 * API Client for Think Marketplace
 * Fetches data from the API routes
 */

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || ''

export interface Listing {
  id: string
  name: string
  slug: string
  type: 'app' | 'tool' | 'agent'
  short_description: string
  long_description?: string
  status: 'live' | 'beta' | 'concept'
  tags: string[]
  icon_url?: string
  thumbnail_url?: string
  builder_id?: string
  visibility: 'featured' | 'public' | 'unlisted'
  review_state: 'pending' | 'approved' | 'rejected'
  links: Record<string, string>
  media: Array<{ id: string; url: string; alt: string; type: string; order: number }>
  think_fit: Record<string, unknown>
  created_at: string
  updated_at: string
  categories: string[]
  builder?: Builder
}

export interface Builder {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  website?: string
  twitter?: string
  github?: string
  discord?: string
  created_at: string
  updated_at: string
  listings?: Listing[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}

export interface PaginatedResponse<T> {
  listings: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Fetch all listings with optional filters
 */
export async function fetchListings(params?: {
  type?: string
  status?: string
  category?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<Listing>> {
  const searchParams = new URLSearchParams()

  if (params?.type) searchParams.set('type', params.type)
  if (params?.status) searchParams.set('status', params.status)
  if (params?.category) searchParams.set('category', params.category)
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())

  const res = await fetch(`${API_BASE}/api/listings?${searchParams}`, {
    next: { revalidate: 60 }, // Cache for 1 minute
  })

  if (!res.ok) {
    throw new Error('Failed to fetch listings')
  }

  return res.json()
}

/**
 * Fetch featured listings
 */
export async function fetchFeaturedListings(): Promise<{ listings: Listing[] }> {
  const res = await fetch(`${API_BASE}/api/listings/featured`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch featured listings')
  }

  return res.json()
}

/**
 * Fetch single listing by slug
 */
export async function fetchListing(slug: string): Promise<Listing> {
  const res = await fetch(`${API_BASE}/api/listings/${slug}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Listing not found')
    }
    throw new Error('Failed to fetch listing')
  }

  return res.json()
}

/**
 * Search listings
 */
export async function searchListings(params: {
  q: string
  type?: string
  status?: string
  page?: number
  limit?: number
}): Promise<PaginatedResponse<Listing>> {
  const searchParams = new URLSearchParams()

  searchParams.set('q', params.q)
  if (params.type) searchParams.set('type', params.type)
  if (params.status) searchParams.set('status', params.status)
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())

  const res = await fetch(`${API_BASE}/api/listings/search?${searchParams}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error('Failed to search listings')
  }

  return res.json()
}

/**
 * Fetch builder by slug
 */
export async function fetchBuilder(slug: string): Promise<Builder> {
  const res = await fetch(`${API_BASE}/api/builders/${slug}`, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Builder not found')
    }
    throw new Error('Failed to fetch builder')
  }

  return res.json()
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<{ categories: Category[] }> {
  const res = await fetch(`${API_BASE}/api/categories`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  })

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  return res.json()
}
