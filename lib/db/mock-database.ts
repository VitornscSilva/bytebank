import { v4 as uuidv4 } from 'uuid'
import { User, Transaction, Investment } from '@/types/api'
import fs from 'fs'
import path from 'path'

interface Database {
  users: User[]
  transactions: Transaction[]
  investments: Investment[]
}

const dbPath = path.join(process.cwd(), '.next', 'mock-db.json')

const defaultDb: Database = {
  users: [
    {
      id: '1',
      name: 'Joana Silva',
      email: 'joana@example.com',
      accountBalance: 2500.0,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    }
  ],
  transactions: [
    {
      id: '1',
      userId: '1',
      type: 'deposit',
      amount: 150,
      description: 'Depósito via PIX',
      date: '2022-11-18',
      createdAt: '2022-11-18T10:00:00.000Z',
      updatedAt: '2022-11-18T10:00:00.000Z',
    },
    {
      id: '2',
      userId: '1',
      type: 'deposit',
      amount: 100,
      description: 'Depósito',
      date: '2022-11-21',
      createdAt: '2022-11-21T10:00:00.000Z',
      updatedAt: '2022-11-21T10:00:00.000Z',
    },
    {
      id: '3',
      userId: '1',
      type: 'deposit',
      amount: 50,
      description: 'Depósito',
      date: '2022-11-21',
      createdAt: '2022-11-21T11:00:00.000Z',
      updatedAt: '2022-11-21T11:00:00.000Z',
    },
    {
      id: '4',
      userId: '1',
      type: 'transfer',
      amount: 500,
      description: 'Transferência',
      date: '2022-11-21',
      createdAt: '2022-11-21T12:00:00.000Z',
      updatedAt: '2022-11-21T12:00:00.000Z',
    },
  ],
  investments: [
    {
      id: '1',
      userId: '1',
      name: 'Vale S.A.',
      type: 'stocks',
      symbol: 'VALE3',
      quantity: 100,
      purchasePrice: 50.0,
      currentPrice: 55.0,
      totalValue: 5500.0,
      profitLoss: 500.0,
      profitLossPercentage: 10.0,
      purchaseDate: '2023-01-15',
      createdAt: '2023-01-15T10:00:00.000Z',
      updatedAt: '2023-12-01T10:00:00.000Z',
    },
    {
      id: '2',
      userId: '1',
      name: 'Petrobras',
      type: 'stocks',
      symbol: 'PETR4',
      quantity: 200,
      purchasePrice: 30.0,
      currentPrice: 28.5,
      totalValue: 5700.0,
      profitLoss: -300.0,
      profitLossPercentage: -5.0,
      purchaseDate: '2023-02-10',
      createdAt: '2023-02-10T10:00:00.000Z',
      updatedAt: '2023-12-01T10:00:00.000Z',
    },
  ],
}

function loadDb(): Database {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.warn('Failed to load mock database from file, using default data')
  }
  return { ...defaultDb }
}

function saveDb(database: Database): void {
  try {
    const nextDir = path.dirname(dbPath)
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true })
    }
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2))
  } catch (error) {
    console.warn('Failed to save mock database to file:', error)
  }
}

const db: Database = loadDb()

export const userDb = {
  findByEmail: (email: string): User | null => {
    return db.users.find(user => user.email === email) || null
  },

  findById: (id: string): User | null => {
    return db.users.find(user => user.id === id) || null
  },

  create: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const now = new Date().toISOString()
    const user: User = {
      id: uuidv4(),
      ...userData,
      createdAt: now,
      updatedAt: now,
    }
    db.users.push(user)
    saveDb(db)
    return user
  },

  update: (id: string, userData: Partial<User>): User | null => {
    const userIndex = db.users.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    const updatedUser = {
      ...db.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }
    db.users[userIndex] = updatedUser
    saveDb(db)
    return updatedUser
  },

  updateBalance: (userId: string, amount: number, operation: 'add' | 'subtract'): User | null => {
    const user = userDb.findById(userId)
    if (!user) return null

    const newBalance = operation === 'add' 
      ? user.accountBalance + amount 
      : user.accountBalance - amount

    return userDb.update(userId, { accountBalance: newBalance })
  },
}

export const transactionDb = {
  findByUserId: (userId: string): Transaction[] => {
    return db.transactions
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  findById: (id: string): Transaction | null => {
    return db.transactions.find(transaction => transaction.id === id) || null
  },

  create: (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
    const now = new Date().toISOString()
    const transaction: Transaction = {
      id: uuidv4(),
      ...transactionData,
      createdAt: now,
      updatedAt: now,
    }
    db.transactions.push(transaction)

    const operation = transaction.type === 'deposit' ? 'add' : 'subtract'
    userDb.updateBalance(transaction.userId, transaction.amount, operation)

    saveDb(db)
    return transaction
  },

  update: (id: string, transactionData: Partial<Transaction>): Transaction | null => {
    const transactionIndex = db.transactions.findIndex(transaction => transaction.id === id)
    if (transactionIndex === -1) return null

    const oldTransaction = db.transactions[transactionIndex]
    const updatedTransaction = {
      ...oldTransaction,
      ...transactionData,
      updatedAt: new Date().toISOString(),
    }

    const oldOperation = oldTransaction.type === 'deposit' ? 'subtract' : 'add'
    userDb.updateBalance(oldTransaction.userId, oldTransaction.amount, oldOperation)

    const newOperation = updatedTransaction.type === 'deposit' ? 'add' : 'subtract'
    userDb.updateBalance(updatedTransaction.userId, updatedTransaction.amount, newOperation)

    db.transactions[transactionIndex] = updatedTransaction
    saveDb(db)
    return updatedTransaction
  },

  delete: (id: string): boolean => {
    const transactionIndex = db.transactions.findIndex(transaction => transaction.id === id)
    if (transactionIndex === -1) return false

    const transaction = db.transactions[transactionIndex]
    
    const operation = transaction.type === 'deposit' ? 'subtract' : 'add'
    userDb.updateBalance(transaction.userId, transaction.amount, operation)

    db.transactions.splice(transactionIndex, 1)
    saveDb(db)
    return true
  },
}

export const investmentDb = {
  findByUserId: (userId: string): Investment[] => {
    return db.investments
      .filter(investment => investment.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  findById: (id: string): Investment | null => {
    return db.investments.find(investment => investment.id === id) || null
  },

  create: (investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>): Investment => {
    const now = new Date().toISOString()
    const investment: Investment = {
      id: uuidv4(),
      ...investmentData,
      createdAt: now,
      updatedAt: now,
    }
    db.investments.push(investment)
    saveDb(db)
    return investment
  },

  update: (id: string, investmentData: Partial<Investment>): Investment | null => {
    const investmentIndex = db.investments.findIndex(investment => investment.id === id)
    if (investmentIndex === -1) return null

    const updatedInvestment = {
      ...db.investments[investmentIndex],
      ...investmentData,
      updatedAt: new Date().toISOString(),
    }
    db.investments[investmentIndex] = updatedInvestment
    saveDb(db)
    return updatedInvestment
  },

  delete: (id: string): boolean => {
    const investmentIndex = db.investments.findIndex(investment => investment.id === id)
    if (investmentIndex === -1) return false

    db.investments.splice(investmentIndex, 1)
    saveDb(db)
    return true
  },

  updatePrices: (priceUpdates: { symbol: string; newPrice: number }[]): Investment[] => {
    const updatedInvestments: Investment[] = []

    for (const update of priceUpdates) {
      const investmentIndex = db.investments.findIndex(inv => inv.symbol === update.symbol)
      if (investmentIndex !== -1) {
        const investment = db.investments[investmentIndex]
        const newTotalValue = investment.quantity * update.newPrice
        const newProfitLoss = newTotalValue - (investment.quantity * investment.purchasePrice)
        const newProfitLossPercentage = ((newProfitLoss / (investment.quantity * investment.purchasePrice)) * 100)

        const updatedInvestment = {
          ...investment,
          currentPrice: update.newPrice,
          totalValue: newTotalValue,
          profitLoss: newProfitLoss,
          profitLossPercentage: newProfitLossPercentage,
          updatedAt: new Date().toISOString(),
        }

        db.investments[investmentIndex] = updatedInvestment
        updatedInvestments.push(updatedInvestment)
      }
    }

    if (updatedInvestments.length > 0) {
      saveDb(db)
    }

    return updatedInvestments
  },
} 