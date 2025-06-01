import { NextRequest, NextResponse } from 'next/server'
import { userDb } from '@/lib/db/mock-database'
import { comparePassword, generateToken, getUserPassword } from '@/lib/auth/auth-utils'
import { LoginRequest, ApiResponse, AuthResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse<null>, { status: 400 })
    }

    const user = userDb.findByEmail(email)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<null>, { status: 401 })
    }

    const storedPasswordHash = getUserPassword(email)
    if (!storedPasswordHash) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<null>, { status: 401 })
    }

    const isPasswordValid = await comparePassword(password, storedPasswordHash)
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      } as ApiResponse<null>, { status: 401 })
    }

    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    const authResponse: AuthResponse = {
      user,
      token
    }

    return NextResponse.json({
      success: true,
      data: authResponse,
      message: 'Login successful'
    } as ApiResponse<AuthResponse>)

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 