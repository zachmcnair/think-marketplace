import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuthToken } from '@/lib/auth/verify'
import { checkNftOwnership } from '@/lib/auth/nft'
import { ListingType, ListingStatus } from '@prisma/client'

// Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Generate unique slug
async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name)
  let slug = baseSlug
  let counter = 1

  while (await prisma.listing.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    const user = await verifyAuthToken(authHeader)

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()

    // Get wallet address from request body (sent from client)
    const walletAddress = body.walletAddress

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      )
    }

    // Verify NFT ownership
    const isHolder = await checkNftOwnership(walletAddress)

    if (!isHolder) {
      return NextResponse.json(
        { error: 'NFT ownership required to submit listings' },
        { status: 403 }
      )
    }

    // Validate required fields
    const { name, type, shortDescription, longDescription, builderName, links, categories, tags } = body

    if (!name || !type || !shortDescription || !builderName) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, shortDescription, builderName' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['app', 'tool', 'agent'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be app, tool, or agent' },
        { status: 400 }
      )
    }

    // Validate short description length
    if (shortDescription.length > 300) {
      return NextResponse.json(
        { error: 'Short description must be 300 characters or less' },
        { status: 400 }
      )
    }

    // Find or create builder
    let builder = await prisma.builder.findFirst({
      where: {
        OR: [
          { walletAddress: walletAddress },
          { name: builderName },
        ],
      },
    })

    if (!builder) {
      // Create new builder
      const builderSlug = await generateUniqueSlug(builderName)
      builder = await prisma.builder.create({
        data: {
          name: builderName,
          slug: builderSlug,
          walletAddress: walletAddress,
          bio: body.builderBio || null,
          website: body.builderWebsite || null,
          twitter: body.builderTwitter || null,
          github: body.builderGithub || null,
        },
      })
    }

    // Generate unique slug for listing
    const listingSlug = await generateUniqueSlug(name)

    // Create listing (pending review)
    const listing = await prisma.listing.create({
      data: {
        name,
        slug: listingSlug,
        type: type as ListingType,
        shortDescription,
        longDescription: longDescription || null,
        status: ListingStatus.concept, // Default to concept until verified
        tags: tags || [],
        links: links || {},
        media: [],
        thinkFit: body.thinkFit || {},
        builderId: builder.id,
        submitterWallet: walletAddress,
        visibility: 'public',
        reviewState: 'pending',
        categories: categories?.length ? {
          create: categories.map((categorySlug: string) => ({
            category: {
              connect: { slug: categorySlug },
            },
          })),
        } : undefined,
      },
      include: {
        builder: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Listing submitted for review',
      listing: {
        id: listing.id,
        name: listing.name,
        slug: listing.slug,
        status: listing.reviewState,
      },
    })
  } catch (error) {
    console.error('Error submitting listing:', error)
    return NextResponse.json(
      { error: 'Failed to submit listing' },
      { status: 500 }
    )
  }
}
