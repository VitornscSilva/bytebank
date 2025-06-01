import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/auth-utils'
import { investmentDb } from '@/lib/db/mock-database'
import { ApiResponse, Investment } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const userInvestments = investmentDb.findByUserId(authResult.user.id)
    
    const priceUpdates = userInvestments.map(investment => {
      const priceChange = (Math.random() - 0.5) * 0.1
      const newPrice = Math.round(investment.currentPrice * (1 + priceChange) * 100) / 100
      return {
        symbol: investment.symbol,
        newPrice: newPrice
      }
    })

    const updatedInvestments = investmentDb.updatePrices(priceUpdates)

    return NextResponse.json({
      success: true,
      data: updatedInvestments,
      message: 'Investment prices updated successfully'
    } as ApiResponse<Investment[]>)

  } catch (error) {
    console.error('Refresh prices error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 