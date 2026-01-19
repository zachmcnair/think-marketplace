import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify admin authentication
  const isAdmin = await isAdminAuthenticated()

  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { reason } = body

    // Find the listing
    const listing = await prisma.listing.findUnique({
      where: { id },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.reviewState !== 'pending') {
      return NextResponse.json(
        { error: 'Listing is not pending review' },
        { status: 400 }
      )
    }

    // Reject the listing
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        reviewState: 'rejected',
        rejectionReason: reason || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Listing rejected',
      listing: {
        id: updatedListing.id,
        name: updatedListing.name,
      },
    })
  } catch (error) {
    console.error('Error rejecting listing:', error)
    return NextResponse.json(
      { error: 'Failed to reject listing' },
      { status: 500 }
    )
  }
}
