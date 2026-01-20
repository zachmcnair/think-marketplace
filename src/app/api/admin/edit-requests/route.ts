import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth/admin'

export async function GET() {
  const isAdmin = await isAdminAuthenticated()

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    const editRequests = await prisma.editRequest.findMany({
      where: {
        status: 'pending',
      },
      include: {
        listing: {
          include: {
            builder: true,
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const transformed = editRequests.map((editRequest) => ({
      id: editRequest.id,
      status: editRequest.status,
      requester_wallet: editRequest.requesterWallet,
      proposed_changes: editRequest.proposedChanges,
      created_at: editRequest.createdAt.toISOString(),
      listing: {
        id: editRequest.listing.id,
        name: editRequest.listing.name,
        slug: editRequest.listing.slug,
        type: editRequest.listing.type.toLowerCase(),
        short_description: editRequest.listing.shortDescription,
        long_description: editRequest.listing.longDescription,
        status: editRequest.listing.status.toLowerCase(),
        visibility: editRequest.listing.visibility,
        review_state: editRequest.listing.reviewState,
        tags: editRequest.listing.tags,
        links: editRequest.listing.links,
        submitter_wallet: editRequest.listing.submitterWallet,
        created_at: editRequest.listing.createdAt.toISOString(),
        updated_at: editRequest.listing.updatedAt.toISOString(),
        categories: editRequest.listing.categories.map((lc) => lc.category.slug),
        builder: editRequest.listing.builder
          ? {
              id: editRequest.listing.builder.id,
              name: editRequest.listing.builder.name,
              slug: editRequest.listing.builder.slug,
              bio: editRequest.listing.builder.bio,
              website: editRequest.listing.builder.website,
              twitter: editRequest.listing.builder.twitter,
            }
          : undefined,
      },
    }))

    return NextResponse.json({ edit_requests: transformed })
  } catch (error) {
    console.error('Error fetching edit requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch edit requests' },
      { status: 500 }
    )
  }
}
