import { NextRequest, NextResponse } from 'next/server'
import { verifyNftHolder } from '@/lib/auth/nft'

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }

    const result = await verifyNftHolder(address)

    return NextResponse.json({
      isHolder: result.isHolder,
      checkedAt: result.checkedAt.toISOString(),
    })
  } catch (error) {
    console.error('Error checking NFT ownership:', error)
    return NextResponse.json(
      { error: 'Failed to check NFT ownership' },
      { status: 500 }
    )
  }
}
