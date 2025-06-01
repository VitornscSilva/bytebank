import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { userDb } from '../db/mock-database'
import fs from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const SALT_ROUNDS = 12

export interface TokenPayload {
  userId: string
  email: string
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export const authenticateRequest = (request: NextRequest): { user: any; error?: string } | { user: null; error: string } => {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'No token provided' }
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    return { user: null, error: 'Invalid token' }
  }

  const user = userDb.findById(payload.userId)
  if (!user) {
    return { user: null, error: 'User not found' }
  }

  return { user }
}

const passwordStorePath = path.join(process.cwd(), '.next', 'passwords.json')

function loadPasswordStore(): Map<string, string> {
  try {
    if (fs.existsSync(passwordStorePath)) {
      const data = fs.readFileSync(passwordStorePath, 'utf8')
      const obj = JSON.parse(data)
      return new Map(Object.entries(obj))
    }
  } catch (error) {
    console.warn('Failed to load password store from file, using default data')
  }
  
  return new Map([
    ['joana@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewpY5mytzRQ.8BRy'],
  ])
}

function savePasswordStore(store: Map<string, string>): void {
  try {
    const nextDir = path.dirname(passwordStorePath)
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true })
    }
    
    const obj = Object.fromEntries(store)
    fs.writeFileSync(passwordStorePath, JSON.stringify(obj, null, 2))
  } catch (error) {
    console.warn('Failed to save password store to file:', error)
  }
}

const passwordStore = loadPasswordStore()

export const getUserPassword = (email: string): string | null => {
  return passwordStore.get(email) || null
}

export const setUserPassword = (email: string, hashedPassword: string): void => {
  passwordStore.set(email, hashedPassword)
  savePasswordStore(passwordStore)
} 