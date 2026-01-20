import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {
      reviewState: 'approved',
      visibility: { in: ['featured', 'public'] },
    }

    if (type && ['app', 'tool', 'agent'].includes(type)) {
      where.type = type
    }

    if (status && ['live', 'beta', 'concept'].includes(status)) {
      where.status = status
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      }
    }

    // Get listings with builder and categories
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          builder: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [
          { visibility: 'asc' }, // featured first
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ])

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

    return NextResponse.json({
      listings: transformedListings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
