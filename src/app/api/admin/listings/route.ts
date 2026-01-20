import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth/admin'

export async function GET() {
  try {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken || !verifyAdminSession(sessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all listings with builder info
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        builder: {
          select: {
            name: true,
            slug: true,
            bio: true,
            website: true,
            twitter: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    })

    // Transform to match frontend expected format
    const transformedListings = listings.map(listing => ({
      id: listing.id,
      name: listing.name,
      slug: listing.slug,
      type: listing.type.toLowerCase(),
      short_description: listing.shortDescription,
      long_description: listing.longDescription,
      status: listing.status.toLowerCase(),
      visibility: listing.visibility,
      review_state: listing.reviewState,
      rejection_reason: listing.rejectionReason,
      tags: listing.tags,
      links: listing.links as Record<string, string>,
      submitter_wallet: listing.submitterWallet,
      created_at: listing.createdAt.toISOString(),
      updated_at: listing.updatedAt.toISOString(),
      categories: listing.categories.map(c => c.category.slug),
      builder: listing.builder ? {
        name: listing.builder.name,
        slug: listing.builder.slug,
        bio: listing.builder.bio,
        website: listing.builder.website,
        twitter: listing.builder.twitter,
      } : undefined,
    }))

    return NextResponse.json({ listings: transformedListings })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
