import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCode, createAdminSession, getAdminCookieName, isAdminAuthenticated } from '@/lib/auth/admin'
import { getClientIp, rateLimit } from '@/lib/security/rate-limit'

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers)
    const limiter = rateLimit(`admin-login:${ip}`, 5, 15 * 60_000)

    if (!limiter.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Admin code is required' },
        { status: 400 }
      )
    }

    if (!verifyAdminCode(code)) {
      return NextResponse.json(
        { error: 'Invalid admin code' },
        { status: 401 }
      )
    }

    // Create session
    const sessionToken = createAdminSession()

    // Set cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set(getAdminCookieName(), sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

// GET - Check auth status
export async function GET() {
  const authenticated = await isAdminAuthenticated()

  return NextResponse.json({ authenticated })
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(getAdminCookieName())

  return response
}
