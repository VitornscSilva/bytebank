import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/auth-utils'
import { investmentDb } from '@/lib/db/mock-database'
import { UpdateInvestmentRequest, ApiResponse, Investment } from '@/types/api'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const investmentId = params.id
    const existingInvestment = investmentDb.findById(investmentId)

    if (!existingInvestment) {
      return NextResponse.json({
        success: false,
        error: 'Investment not found'
      } as ApiResponse<null>, { status: 404 })
    }

    if (existingInvestment.userId !== authResult.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 403 })
    }

    const body: UpdateInvestmentRequest = await request.json()
    const { name, type, symbol, quantity, purchasePrice, purchaseDate } = body

    if (type) {
      const validTypes = ['stocks', 'bonds', 'funds', 'crypto']
      if (!validTypes.includes(type)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid investment type'
        } as ApiResponse<null>, { status: 400 })
      }
    }

    if ((quantity !== undefined && quantity <= 0) || (purchasePrice !== undefined && purchasePrice <= 0)) {
      return NextResponse.json({
        success: false,
        error: 'Quantity and purchase price must be greater than 0'
      } as ApiResponse<null>, { status: 400 })
    }

    const updateData: Partial<Investment> = {}
    if (name) updateData.name = name
    if (type) updateData.type = type
    if (symbol) updateData.symbol = symbol.toUpperCase()
    if (quantity) updateData.quantity = quantity
    if (purchasePrice) updateData.purchasePrice = purchasePrice
    if (purchaseDate) updateData.purchaseDate = purchaseDate

    if (quantity || purchasePrice) {
      const newQuantity = quantity || existingInvestment.quantity
      const newPurchasePrice = purchasePrice || existingInvestment.purchasePrice
      const currentPrice = existingInvestment.currentPrice
      
      const totalValue = currentPrice * newQuantity
      const profitLoss = totalValue - (newPurchasePrice * newQuantity)
      const profitLossPercentage = ((totalValue - (newPurchasePrice * newQuantity)) / (newPurchasePrice * newQuantity)) * 100

      updateData.totalValue = Math.round(totalValue * 100) / 100
      updateData.profitLoss = Math.round(profitLoss * 100) / 100
      updateData.profitLossPercentage = Math.round(profitLossPercentage * 100) / 100
    }

    const updatedInvestment = investmentDb.update(investmentId, updateData)

    if (!updatedInvestment) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update investment'
      } as ApiResponse<null>, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedInvestment,
      message: 'Investment updated successfully'
    } as ApiResponse<Investment>)

  } catch (error) {
    console.error('Update investment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const investmentId = params.id
    const existingInvestment = investmentDb.findById(investmentId)

    if (!existingInvestment) {
      return NextResponse.json({
        success: false,
        error: 'Investment not found'
      } as ApiResponse<null>, { status: 404 })
    }

    if (existingInvestment.userId !== authResult.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 403 })
    }

    const deleted = investmentDb.delete(investmentId)

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete investment'
      } as ApiResponse<null>, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Investment deleted successfully'
    } as ApiResponse<null>)

  } catch (error) {
    console.error('Delete investment error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 