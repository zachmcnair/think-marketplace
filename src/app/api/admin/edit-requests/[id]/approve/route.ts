import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth/admin'
import { ListingStatus, ListingType } from '@prisma/client'

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
    const editRequest = await prisma.editRequest.findUnique({
      where: { id },
      include: {
        listing: true,
      },
    })

    if (!editRequest) {
      return NextResponse.json(
        { error: 'Edit request not found' },
        { status: 404 }
      )
    }

    if (editRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Edit request is not pending review' },
        { status: 400 }
      )
    }

    const proposedChanges = editRequest.proposedChanges as {
      name?: string
      type?: ListingType
      shortDescription?: string
      longDescription?: string | null
      status?: ListingStatus
      tags?: string[]
      links?: Record<string, string>
      categories?: string[]
    }

    await prisma.$transaction([
      prisma.listing.update({
        where: { id: editRequest.listingId },
        data: {
          name: proposedChanges.name,
          type: proposedChanges.type,
          shortDescription: proposedChanges.shortDescription,
          longDescription: proposedChanges.longDescription ?? null,
          status: proposedChanges.status ?? editRequest.listing.status,
          tags: proposedChanges.tags ?? editRequest.listing.tags,
          links: proposedChanges.links ?? (editRequest.listing.links as Record<string, string>),
          ...(proposedChanges.categories
            ? {
                categories: {
                  deleteMany: {},
                  create: proposedChanges.categories.map((slug) => ({
                    category: {
                      connect: { slug },
                    },
                  })),
                },
              }
            : {}),
        },
      }),
      prisma.editRequest.update({
        where: { id },
        data: {
          status: 'approved',
          reviewedAt: new Date(),
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Edit request approved',
    })
  } catch (error) {
    console.error('Error approving edit request:', error)
    return NextResponse.json(
      { error: 'Failed to approve edit request' },
      { status: 500 }
    )
  }
}
