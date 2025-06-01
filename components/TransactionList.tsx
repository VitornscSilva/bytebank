"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/api"

interface TransactionListProps {
  transactions: Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
  showActions?: boolean
  hideAmounts?: boolean
}

export default function TransactionList({ transactions, onEdit, onDelete, showActions = true, hideAmounts = false }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    return localDate.toLocaleDateString("pt-BR")
  }

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      deposit: "Depósito",
      transfer: "Transferência",
      withdrawal: "Saque",
      payment: "Pagamento",
    }
    return types[type] || type
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-primary-green"
      case "transfer":
      case "withdrawal":
      case "payment":
        return "text-accent-red"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-primary-green font-medium">{formatDate(transaction.date)}</span>
                {showActions && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => onEdit?.(transaction)} className="p-1 h-auto">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete?.(transaction.id)}
                      className="p-1 h-auto text-accent-red hover:text-accent-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="font-medium text-gray-900">{getTransactionTypeLabel(transaction.type)}</div>
              {transaction.description && <div className="text-sm text-gray-600 mt-1">{transaction.description}</div>}
              <div className={`font-semibold mt-1 ${getTransactionColor(transaction.type)}`}>
                {hideAmounts ? "••••••" : `${transaction.type === "deposit" ? "+" : "-"}${formatCurrency(Math.abs(transaction.amount))}`}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
