"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateTransactionRequest } from "@/types/api"

interface TransactionFormProps {
  onSubmit?: (transaction: CreateTransactionRequest & { id: string; date: string }) => void
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        type: type as 'deposit' | 'withdrawal' | 'transfer' | 'payment',
        amount: Number.parseFloat(amount),
        description,
        date: new Date().toISOString(),
        id: Date.now().toString(),
      })
    }
    setType("")
    setAmount("")
    setDescription("")
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Nova transação</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de transação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Depósito</SelectItem>
              <SelectItem value="transfer">Transferência</SelectItem>
              <SelectItem value="withdrawal">Saque</SelectItem>
              <SelectItem value="payment">Pagamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <Input
            type="text"
            placeholder="Descrição da transação"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full btn-primary" disabled={!type || !amount}>
          Concluir transação
        </Button>
      </form>
    </div>
  )
}
