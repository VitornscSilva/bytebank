import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/auth-utils'
import { ApiResponse, User } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: authResult.user,
      message: 'User retrieved successfully'
    } as ApiResponse<User>)

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 