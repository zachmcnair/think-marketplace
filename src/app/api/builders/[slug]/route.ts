import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const builder = await prisma.builder.findUnique({
      where: { slug },
      include: {
        listings: {
          where: {
            reviewState: 'approved',
            visibility: { in: ['featured', 'public'] },
          },
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      )
    }

    // Transform to match frontend expected format
    const transformedBuilder = {
      id: builder.id,
      name: builder.name,
      slug: builder.slug,
      bio: builder.bio,
      avatar_url: builder.avatarUrl,
      website: builder.website,
      twitter: builder.twitter,
      github: builder.github,
      discord: builder.discord,
      created_at: builder.createdAt.toISOString(),
      updated_at: builder.updatedAt.toISOString(),
      listings: builder.listings.map(listing => ({
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
        type: listing.type,
        short_description: listing.shortDescription,
        status: listing.status,
        tags: listing.tags,
        icon_url: listing.iconUrl,
        thumbnail_url: listing.thumbnailUrl,
        visibility: listing.visibility,
        categories: listing.categories.map(lc => lc.category.slug),
        created_at: listing.createdAt.toISOString(),
        updated_at: listing.updatedAt.toISOString(),
      })),
    }

    return NextResponse.json(transformedBuilder)
  } catch (error) {
    console.error('Error fetching builder:', error)
    return NextResponse.json(
      { error: 'Failed to fetch builder' },
      { status: 500 }
    )
  }
}
