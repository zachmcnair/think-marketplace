import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth/admin'

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
    const { reason } = body

    const editRequest = await prisma.editRequest.findUnique({
      where: { id },
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

    await prisma.editRequest.update({
      where: { id },
      data: {
        status: 'rejected',
        adminNotes: reason || null,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Edit request rejected',
    })
  } catch (error) {
    console.error('Error rejecting edit request:', error)
    return NextResponse.json(
      { error: 'Failed to reject edit request' },
      { status: 500 }
    )
  }
}
