import { NextRequest, NextResponse } from 'next/server'
import { userDb } from '@/lib/db/mock-database'
import { hashPassword, generateToken, setUserPassword } from '@/lib/auth/auth-utils'
import { RegisterRequest, ApiResponse, AuthResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Name, email, and password are required'
      } as ApiResponse<null>, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      } as ApiResponse<null>, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 6 characters long'
      } as ApiResponse<null>, { status: 400 })
    }

    const existingUser = userDb.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      } as ApiResponse<null>, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const user = userDb.create({
      name,
      email,
      accountBalance: 0,
    })

    setUserPassword(email, hashedPassword)

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
      message: 'User created successfully'
    } as ApiResponse<AuthResponse>, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 