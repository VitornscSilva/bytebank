import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/auth-utils'
import { transactionDb } from '@/lib/db/mock-database'
import { CreateTransactionRequest, ApiResponse, Transaction } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateRequest(request)
    
    if (!authResult.user) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      } as ApiResponse<null>, { status: 401 })
    }

    const transactions = transactionDb.findByUserId(authResult.user.id)

    return NextResponse.json({
      success: true,
      data: transactions,
      message: 'Transactions retrieved successfully'
    } as ApiResponse<Transaction[]>)

  } catch (error) {
    console.error('Get transactions error:', error)
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

    const body: CreateTransactionRequest = await request.json()
    const { type, amount, description, date } = body

    if (!type || !amount || !date) {
      return NextResponse.json({
        success: false,
        error: 'Type, amount, and date are required'
      } as ApiResponse<null>, { status: 400 })
    }

    const validTypes = ['deposit', 'withdrawal', 'transfer', 'payment']
    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transaction type'
      } as ApiResponse<null>, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be greater than 0'
      } as ApiResponse<null>, { status: 400 })
    }

    if (type !== 'deposit' && authResult.user.accountBalance < amount) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient balance'
      } as ApiResponse<null>, { status: 400 })
    }

    const transaction = transactionDb.create({
      userId: authResult.user.id,
      type,
      amount,
      description,
      date,
    })

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    } as ApiResponse<Transaction>, { status: 201 })

  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse<null>, { status: 500 })
  }
} 