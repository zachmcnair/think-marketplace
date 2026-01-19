import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
        builder: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Only return approved public/featured listings
    if (listing.reviewState !== 'approved' || listing.visibility === 'unlisted') {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Transform to match frontend expected format
    const transformedListing = {
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
    }

    return NextResponse.json(transformedListing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    )
  }
}
