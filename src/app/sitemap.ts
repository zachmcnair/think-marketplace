import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://marketplace.thinkagents.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Dynamic listing pages
  let listingPages: MetadataRoute.Sitemap = []
  let builderPages: MetadataRoute.Sitemap = []

  try {
    // Fetch approved listings
    const listings = await prisma.listing.findMany({
      where: {
        reviewState: 'approved',
        visibility: { in: ['featured', 'public'] },
      },
      select: {
        slug: true,
        updatedAt: true,
        visibility: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    listingPages = listings.map((listing) => ({
      url: `${BASE_URL}/listing/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: listing.visibility === 'featured' ? 0.9 : 0.8,
    }))

    // Fetch builders with listings
    const builders = await prisma.builder.findMany({
      where: {
        listings: {
          some: {
            reviewState: 'approved',
            visibility: { in: ['featured', 'public'] },
          },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    builderPages = builders.map((builder) => ({
      url: `${BASE_URL}/builder/${builder.slug}`,
      lastModified: builder.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if database is unavailable
  }

  return [...staticPages, ...listingPages, ...builderPages]
}
