import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        reviewState: 'approved',
        visibility: 'featured',
      },
      include: {
        builder: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to match frontend expected format
    const transformedListings = listings.map(listing => ({
      id: listing.id,
      name: listing.name,
      slug: listing.slug,
      type: listing.type,
      short_description: listing.shortDescription,
      long_description: listing.longDescription,
      status: listing.status,
      tags: listing.tags,
      icon_url: listing.iconUrl,
      thumbnail_url: listing.thumbnailUrl,
      builder_id: listing.builderId,
      visibility: listing.visibility,
      review_state: listing.reviewState,
      links: listing.links,
      media: listing.media,
      think_fit: listing.thinkFit,
      created_at: listing.createdAt.toISOString(),
      updated_at: listing.updatedAt.toISOString(),
      categories: listing.categories.map(lc => lc.category.slug),
      builder: listing.builder ? {
        id: listing.builder.id,
        name: listing.builder.name,
        slug: listing.builder.slug,
        bio: listing.builder.bio,
        avatar_url: listing.builder.avatarUrl,
        website: listing.builder.website,
        twitter: listing.builder.twitter,
        github: listing.builder.github,
        discord: listing.builder.discord,
        created_at: listing.builder.createdAt.toISOString(),
        updated_at: listing.builder.updatedAt.toISOString(),
      } : undefined,
    }))

    return NextResponse.json({ listings: transformedListings })
  } catch (error) {
    console.error('Error fetching featured listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured listings' },
      { status: 500 }
    )
  }
}
