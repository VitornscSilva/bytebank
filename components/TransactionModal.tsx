"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { CurrencyInput } from "@/components/ui/currency-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Transaction } from "@/types/api"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (transaction: Transaction) => void
  transaction?: Transaction | null
  defaultType?: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | null
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction,
  defaultType,
}: TransactionModalProps) {
  const [formData, setFormData] = useState({
    type: defaultType || "",
    amount: "",
    description: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const isEditing = !!transaction


  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description || "",
      })
      setSelectedDate(parseLocalDate(transaction.date))
    } else {
      setFormData({
        type: defaultType || "",
        amount: "",
        description: "",
      })
      setSelectedDate(new Date())
    }
  }, [transaction, isOpen, defaultType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.type || !formData.amount || !selectedDate) {
      return
    }

    const formatDateLocal = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const transactionData: Transaction = {
      id: transaction?.id || Date.now().toString(),
      userId: transaction?.userId || '',
      type: formData.type as 'deposit' | 'withdrawal' | 'transfer' | 'payment',
      amount: parseFloat(formData.amount),
      description: formData.description || undefined,
      date: formatDateLocal(selectedDate),
      createdAt: transaction?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(transactionData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmountChange = (value: string) => {
    setFormData((prev) => ({ ...prev, amount: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="deposit">Depósito</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="withdrawal">Saque</SelectItem>
                <SelectItem value="payment">Pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700">Valor</Label>
            <CurrencyInput
              id="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">Descrição (opcional)</Label>
            <Input
              id="description"
              placeholder="Descrição da transação"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700">Data</Label>
            <DatePicker
              date={selectedDate}
              onSelect={setSelectedDate}
              placeholder="Selecione a data da transação"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline-secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="secondary">
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 