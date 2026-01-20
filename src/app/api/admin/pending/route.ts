import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth/admin'

export async function GET() {
  // Verify admin authentication
  const isAdmin = await isAdminAuthenticated()

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    const pendingListings = await prisma.listing.findMany({
      where: {
        reviewState: 'pending',
      },
      include: {
        builder: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Transform to frontend format
    const listings = pendingListings.map(listing => ({
      id: listing.id,
      name: listing.name,
      slug: listing.slug,
      type: listing.type.toLowerCase(),
      short_description: listing.shortDescription,
      long_description: listing.longDescription,
      status: listing.status.toLowerCase(),
      visibility: listing.visibility,
      review_state: listing.reviewState,
      tags: listing.tags,
      icon_url: listing.iconUrl,
      thumbnail_url: listing.thumbnailUrl,
      links: listing.links,
      think_fit: listing.thinkFit,
      submitter_wallet: listing.submitterWallet,
      created_at: listing.createdAt.toISOString(),
      updated_at: listing.updatedAt.toISOString(),
      categories: listing.categories.map(lc => lc.category.slug),
      builder: listing.builder ? {
        id: listing.builder.id,
        name: listing.builder.name,
        slug: listing.builder.slug,
        bio: listing.builder.bio,
        website: listing.builder.website,
      } : undefined,
    }))

    return NextResponse.json({ listings })
  } catch (error) {
    console.error('Error fetching pending listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending listings' },
      { status: 500 }
    )
  }
}
