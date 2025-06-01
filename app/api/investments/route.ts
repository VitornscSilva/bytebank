import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/auth-utils'
import { investmentDb } from '@/lib/db/mock-database'
import { CreateInvestmentRequest, ApiResponse, Investment } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const investments = investmentDb.findByUserId(authResult.user.id)

    return NextResponse.json({
      success: true,
      data: investments,
      message: 'Investments retrieved successfully'
    } as ApiResponse<Investment[]>)

  } catch (error) {
    console.error('Get investments error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const body: CreateInvestmentRequest = await request.json()
    const { name, type, symbol, quantity, purchasePrice, purchaseDate } = body

    if (!name || !type || !symbol || !quantity || !purchasePrice || !purchaseDate) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      } as ApiResponse<null>, { status: 400 })
    }

    const validTypes = ['stocks', 'bonds', 'funds', 'crypto']
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid investment type'
      } as ApiResponse<null>, { status: 400 })
    }

    if (quantity <= 0 || purchasePrice <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Quantity and purchase price must be greater than 0'
      } as ApiResponse<null>, { status: 400 })
    }

    const currentPrice = purchasePrice
    const totalValue = currentPrice * quantity
    const profitLoss = 0
    const profitLossPercentage = 0

    const investment = investmentDb.create({
      userId: authResult.user.id,
      name,
      type,
      symbol: symbol.toUpperCase(),
      quantity,
      purchasePrice,
      currentPrice,
      totalValue,
      profitLoss,
      profitLossPercentage,
      purchaseDate,
    })

    return NextResponse.json({
      success: true,
      data: investment,
      message: 'Investment created successfully'
    } as ApiResponse<Investment>, { status: 201 })

  } catch (error) {
    console.error('Create investment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 