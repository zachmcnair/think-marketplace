import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuthToken } from '@/lib/auth/verify'
import { ListingStatus, ListingType } from '@prisma/client'
import { getClientIp, rateLimit } from '@/lib/security/rate-limit'

function normalizeWallet(wallet: string) {
  return wallet.trim().toLowerCase()
}

function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return tags.map((tag) => `${tag}`.trim()).filter(Boolean)
}

function sanitizeCategories(categories: unknown): string[] {
  if (!Array.isArray(categories)) return []
  return categories.map((category) => `${category}`.trim()).filter(Boolean)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = getClientIp(request.headers)
    const limiter = rateLimit(`edit:get:${ip}`, 30, 60_000)

    if (!limiter.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const user = await verifyAuthToken(authHeader)

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const walletAddress = request.nextUrl.searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const normalizedWallet = normalizeWallet(walletAddress)

    if (!user.walletAddresses.includes(normalizedWallet)) {
      return NextResponse.json(
        { error: 'Wallet address does not match authenticated user' },
        { status: 403 }
      )
    }

    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
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

    if (!listing.submitterWallet || normalizeWallet(listing.submitterWallet) !== normalizedWallet) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this listing' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      listing: {
        id: listing.id,
        name: listing.name,
        type: listing.type,
        short_description: listing.shortDescription,
        long_description: listing.longDescription,
        status: listing.status,
        tags: listing.tags,
        links: listing.links,
        categories: listing.categories.map((category) => category.category.slug),
      },
    })
  } catch (error) {
    console.error('Error loading listing for edit:', error)
    return NextResponse.json(
      { error: 'Failed to load listing' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ip = getClientIp(request.headers)
    const limiter = rateLimit(`edit:post:${ip}`, 10, 60_000)

    if (!limiter.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const user = await verifyAuthToken(authHeader)

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const body = await request.json()
    const {
      walletAddress,
      name,
      type,
      shortDescription,
      longDescription,
      status,
      tags,
      links,
      categories,
    } = body

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    const normalizedWallet = normalizeWallet(walletAddress)

    if (!user.walletAddresses.includes(normalizedWallet)) {
      return NextResponse.json(
        { error: 'Wallet address does not match authenticated user' },
        { status: 403 }
      )
    }

    if (!name || !type || !shortDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, shortDescription' },
        { status: 400 }
      )
    }

    if (!['app', 'tool', 'agent'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be app, tool, or agent' },
        { status: 400 }
      )
    }

    if (status && !['live', 'beta', 'concept'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be live, beta, or concept' },
        { status: 400 }
      )
    }

    if (shortDescription.length > 300) {
      return NextResponse.json(
        { error: 'Short description must be 300 characters or less' },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.findUnique({
      where: { slug },
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (!listing.submitterWallet || normalizeWallet(listing.submitterWallet) !== normalizedWallet) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this listing' },
        { status: 403 }
      )
    }

    const proposedChanges = {
      name,
      type: type as ListingType,
      shortDescription,
      longDescription: longDescription || null,
      status: (status || listing.status) as ListingStatus,
      tags: sanitizeTags(tags),
      links: links || {},
      categories: sanitizeCategories(categories),
    }

    await prisma.$transaction([
      prisma.editRequest.deleteMany({
        where: {
          listingId: listing.id,
          status: 'pending',
        },
      }),
      prisma.editRequest.create({
        data: {
          listingId: listing.id,
          requesterWallet: normalizedWallet,
          proposedChanges,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Edit request submitted for review',
    })
  } catch (error) {
    console.error('Error submitting edit request:', error)
    return NextResponse.json(
      { error: 'Failed to submit edit request' },
      { status: 500 }
    )
  }
}
