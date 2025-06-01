import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/auth-utils'
import { transactionDb } from '@/lib/db/mock-database'
import { UpdateTransactionRequest, ApiResponse, Transaction } from '@/types/api'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const transactionId = params.id
    const existingTransaction = transactionDb.findById(transactionId)

    if (!existingTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      } as ApiResponse<null>, { status: 404 })
    }

    if (existingTransaction.userId !== authResult.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 403 })
    }

    const body: UpdateTransactionRequest = await request.json()
    const { type, amount, description, date } = body

    if (type) {
      const validTypes = ['deposit', 'withdrawal', 'transfer', 'payment']
      if (!validTypes.includes(type)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid transaction type'
        } as ApiResponse<null>, { status: 400 })
      }
    }

    if (amount !== undefined && amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be greater than 0'
      } as ApiResponse<null>, { status: 400 })
    }

    const updatedTransaction = transactionDb.update(transactionId, {
      type,
      amount,
      description,
      date,
    })

    if (!updatedTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update transaction'
      } as ApiResponse<null>, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    } as ApiResponse<Transaction>)

  } catch (error) {
    console.error('Update transaction error:', error)
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

    const transactionId = params.id
    const existingTransaction = transactionDb.findById(transactionId)

    if (!existingTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      } as ApiResponse<null>, { status: 404 })
    }

    if (existingTransaction.userId !== authResult.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse<null>, { status: 403 })
    }

    const deleted = transactionDb.delete(transactionId)

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete transaction'
      } as ApiResponse<null>, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Transaction deleted successfully'
    } as ApiResponse<null>)

  } catch (error) {
    console.error('Delete transaction error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 