import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth/admin'
import { ListingStatus, ListingType, ListingVisibility } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const listing = await prisma.listing.findUnique({
      where: { id },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    const {
      name,
      type,
      shortDescription,
      longDescription,
      status,
      visibility,
      tags,
      links,
      categories,
    } = body as {
      name?: string
      type?: ListingType
      shortDescription?: string
      longDescription?: string
      status?: ListingStatus
      visibility?: ListingVisibility
      tags?: string[]
      links?: Record<string, string>
      categories?: string[]
    }

    const updateData = {
      name: name ?? listing.name,
      type: type ?? listing.type,
      shortDescription: shortDescription ?? listing.shortDescription,
      longDescription: longDescription ?? listing.longDescription,
      status: status ?? listing.status,
      visibility: visibility ?? listing.visibility,
      tags: Array.isArray(tags) ? tags : listing.tags,
      links: links ?? listing.links,
      ...(Array.isArray(categories)
        ? {
            categories: {
              deleteMany: {},
              create: categories.map((slug) => ({
                category: {
                  connect: { slug },
                },
              })),
            },
          }
        : {}),
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Listing updated',
      listing: {
        id: updatedListing.id,
        name: updatedListing.name,
        slug: updatedListing.slug,
      },
    })
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    )
  }
}
