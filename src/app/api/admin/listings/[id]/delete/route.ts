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

    // Find the listing first
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Delete the listing (cascades to category associations)
    await prisma.listing.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Listing deleted',
      listing: {
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
      },
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}
