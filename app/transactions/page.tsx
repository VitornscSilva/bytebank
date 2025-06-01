"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import TransactionList from "@/components/TransactionList"
import TransactionModal from "@/components/TransactionModal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Plus, Receipt, ArrowUpDown, RefreshCw } from "lucide-react"
import { useAuthStore, useTransactionsStore } from "@/stores"
import { useRouter } from "next/navigation"
import { Transaction } from "@/types/api"
import { TransactionsLoading } from "./_components/TransactionsLoading"

const pageVariants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const initialItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const emptyStateVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const transactionsVariants = {
  hidden: { 
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
}

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const iconVariants = {
  animate: {
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function TransactionsPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const { toast } = useToast()

  const { user, isAuthenticated } = useAuthStore()
  const { 
    transactions, 
    isLoading, 
    error,
    fetchTransactions, 
    createTransaction,
    updateTransaction,
    deleteTransaction,
    clearError
  } = useTransactionsStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
    }
  }, [isAuthenticated, fetchTransactions])

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      })
      clearError()
    }
  }, [error, toast, clearError])

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const success = await deleteTransaction(id)
    if (success) {
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso!",
      })
    }
  }

  const handleSaveTransaction = async (transactionData: Transaction) => {
    let success = false
    
    if (editingTransaction) {
      success = await updateTransaction(editingTransaction.id, {
        type: transactionData.type,
        amount: transactionData.amount,
        description: transactionData.description,
        date: transactionData.date,
      })
      if (success) {
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso!",
        })
      }
    } else {
      success = await createTransaction({
        type: transactionData.type,
        amount: transactionData.amount,
        description: transactionData.description,
        date: transactionData.date,
      })
      if (success) {
        toast({
          title: "Sucesso",
          description: "Transação criada com sucesso!",
        })
      }
    }

    if (success) {
      setIsModalOpen(false)
      setEditingTransaction(null)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
    clearError()
  }

  const hasTransactions = transactions.length > 0

  const EmptyState = () => (
    <motion.div
      key="empty-state"
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-lg p-12"
    >
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="mb-8"
      >
        <motion.div
          variants={iconVariants}
          animate="animate"
          className="w-24 h-24 bg-gradient-to-br from-primary-teal to-primary-green rounded-full flex items-center justify-center shadow-lg"
        >
          <Receipt className="w-12 h-12 text-white" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="text-2xl font-bold text-gray-800 mb-4"
        variants={initialItemVariants}
      >
        Nenhuma transação encontrada
      </motion.h3>
      
      <motion.p 
        className="text-gray-600 text-center mb-8 max-w-md"
        variants={initialItemVariants}
      >
        Você ainda não possui transações registradas. Que tal começar adicionando sua primeira transação?
      </motion.p>
      
      <motion.div variants={initialItemVariants}>
        <Button
          onClick={handleAddTransaction}
          className="text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isLoading}
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Primeira Transação
        </Button>
      </motion.div>
    </motion.div>
  )

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>
  }

  return (
    <motion.div 
      className="min-h-screen bg-background-light"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <Header />
      
      <div className="flex relative">
        <Sidebar />
        
        <motion.main 
          className="main-content main-content-mobile p-6 lg:ml-0 w-full"
          variants={initialItemVariants}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Transações
                </motion.h1>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Gerencie todas as suas transações financeiras
                </motion.p>
              </div>
              
              <motion.div 
                className="flex space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={() => fetchTransactions()}
                    variant="outline-secondary"
                    className="flex items-center space-x-2"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                  </Button>
                </motion.div>
                
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={handleAddTransaction}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Transação</span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {isLoading && transactions.length === 0 && (
              <TransactionsLoading />
            )}

            <AnimatePresence mode="wait">
              {!isLoading && !hasTransactions && (
                <EmptyState key="empty" />
              )}
              
              {!isLoading && hasTransactions && (
                <motion.div
                  key="transactions-container"
                  layout
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
                >
                  <motion.div 
                    className="p-6 border-b border-gray-200"
                    layout
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-teal to-primary-green rounded-lg flex items-center justify-center">
                          <ArrowUpDown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            Histórico de Transações
                          </h2>
                          <motion.p 
                            className="text-sm text-gray-600"
                            layout
                            key={transactions.length}
                          >
                            {transactions.length} transaç{transactions.length !== 1 ? 'ões' : 'ão'} encontrada{transactions.length !== 1 ? 's' : ''}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div layout>
                    <TransactionList 
                      transactions={transactions} 
                      showActions={true}
                      hideAmounts={false}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.main>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </motion.div>
  )
}
