import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth/verify'
import { checkNftOwnership } from '@/lib/auth/nft'
import { uploadFile, generateFilename, isValidImageType, MAX_FILE_SIZE } from '@/lib/storage/s3'

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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'icon' or 'thumbnail'
    const walletAddress = formData.get('walletAddress') as string | null

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
        { error: 'NFT ownership required to upload files' },
        { status: 403 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Generate filename based on type
    const prefix = type === 'icon' ? 'icons' : type === 'thumbnail' ? 'thumbnails' : 'uploads'
    const filename = generateFilename(file.name, prefix)

    // Upload to S3
    const url = await uploadFile(buffer, filename, file.type)

    return NextResponse.json({
      success: true,
      url,
      filename,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
