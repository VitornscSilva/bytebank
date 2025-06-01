"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import TransactionList from "@/components/TransactionList"
import TransactionModal from "@/components/TransactionModal"
import { useAuthStore, useTransactionsStore } from "@/stores"
import { Eye, EyeOff, RefreshCw, CreditCard, Receipt, Plus, ArrowDownLeft, ArrowUpDown, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Transaction } from "@/types/api"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const balanceVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "backOut"
    }
  },
  tap: { scale: 0.95 }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0, 1]
    }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.95 }
}

export default function DashboardPage() {
  const router = useRouter()
  const [showBalance, setShowBalance] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTransactionType, setModalTransactionType] = useState<'deposit' | 'withdrawal' | 'transfer' | 'payment' | null>(null)
  const { toast } = useToast()

  const { user, isAuthenticated } = useAuthStore()
  const {
    transactions,
    isLoading: transactionsLoading,
    fetchTransactions,
    createTransaction,
    error: transactionError
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

  const handleQuickAction = (type: 'deposit' | 'withdrawal' | 'transfer' | 'payment') => {
    setModalTransactionType(type)
    setIsModalOpen(true)
  }

  const handleSaveTransaction = async (transactionData: Transaction) => {
    const success = await createTransaction({
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
      setIsModalOpen(false)
      setModalTransactionType(null)
    } else {
      const errorMessage = transactionError || "Erro ao criar transação. Tente novamente."
      const isInsufficientBalance = errorMessage.toLowerCase().includes('insufficient balance') ||
        errorMessage.toLowerCase().includes('saldo insuficiente')

      toast({
        title: isInsufficientBalance ? "Saldo insuficiente" : "Erro",
        description: isInsufficientBalance ? "Saldo insuficiente para a transacao" : errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setModalTransactionType(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <motion.main
          className="main-content main-content-mobile p-6 lg:ml-0 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                className="relative bg-gradient-to-br from-[#004D61] via-[#006B7D] via-[#0088A3] to-[#00A3C4] text-white rounded-2xl p-8 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#003847] via-transparent to-transparent opacity-60"></div>

                <motion.div
                  className="absolute inset-0 opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 2 }}
                >
                  <motion.div
                    className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl"
                    animate={{
                      x: [0, 20, 0],
                      y: [0, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                  <motion.div
                    className="absolute bottom-4 left-4 w-24 h-24 bg-[#00D4E6] rounded-full blur-2xl"
                    animate={{
                      x: [0, -15, 0],
                      y: [0, -20, 0],
                      scale: [1, 0.9, 1]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  ></motion.div>
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#0099B3] rounded-full blur-3xl opacity-30"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  ></motion.div>
                </motion.div>

                <motion.div
                  className="relative z-10 mb-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between mb-2">
                    <motion.h1
                      className="text-3xl font-bold"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      Olá, {user?.name}! 👋
                    </motion.h1>
                    <motion.div
                      className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full"
                        variants={pulseVariants}
                        animate="animate"
                      ></motion.div>
                      <span className="text-sm font-medium">Online</span>
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-white/90 capitalize text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {formatDate()}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="relative z-10 mb-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                      >
                        <CreditCard className="w-5 h-5 text-accent-orange" />
                      </motion.div>
                      <span className="text-lg font-medium">Conta Corrente</span>
                    </motion.div>
                  </div>

                  <motion.div
                    className="mb-2 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <span className="text-white/80 text-sm uppercase tracking-wide">Saldo Disponível</span>
                    <motion.button
                      onClick={() => setShowBalance(!showBalance)}
                      className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2 ml-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotateY: showBalance ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </motion.div>
                      <span className="text-sm">{showBalance ? "Ocultar" : "Mostrar"}</span>
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="text-4xl font-bold mb-4"
                    variants={balanceVariants}
                    key={showBalance ? 'visible' : 'hidden'}
                    initial="hidden"
                    animate="visible"
                    whileTap="tap"
                  >
                    {showBalance ? formatCurrency(user?.accountBalance || 0) : "••••••••"}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <h3 className="text-lg font-medium text-white/90 mb-3">Ações Rápidas</h3>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleQuickAction('deposit')}
                      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 border border-white/20 hover:border-white/30"
                    >
                      <motion.div
                        className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Plus className="w-4 h-4 text-green-300" />
                      </motion.div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Depósito</div>
                        <div className="text-xs text-white/70">Adicionar dinheiro</div>
                      </div>
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleQuickAction('withdrawal')}
                      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 border border-white/20 hover:border-white/30"
                    >
                      <motion.div
                        className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowDownLeft className="w-4 h-4 text-red-300" />
                      </motion.div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Saque</div>
                        <div className="text-xs text-white/70">Retirar dinheiro</div>
                      </div>
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleQuickAction('transfer')}
                      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 border border-white/20 hover:border-white/30"
                    >
                      <motion.div
                        className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <ArrowUpDown className="w-4 h-4 text-blue-300" />
                      </motion.div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Transferência</div>
                        <div className="text-xs text-white/70">Enviar dinheiro</div>
                      </div>
                    </motion.button>

                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => handleQuickAction('payment')}
                      className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300 border border-white/20 hover:border-white/30"
                    >
                      <motion.div
                        className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Wallet className="w-4 h-4 text-orange-300" />
                      </motion.div>
                      <div className="text-left">
                        <div className="text-sm font-medium">Pagamento</div>
                        <div className="text-xs text-white/70">Pagar conta</div>
                      </div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="space-y-6"
              variants={itemVariants}
            >
              <motion.div
                className="card"
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="flex items-center justify-between mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800">Extrato Recente</h2>
                  <div className="flex space-x-2">
                    <motion.button
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <Eye className="w-4 h-4 text-primary-teal" /> : <EyeOff className="w-4 h-4 text-primary-teal" />}
                    </motion.button>
                    <motion.button
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fetchTransactions()}
                    >
                      <RefreshCw className="w-4 h-4 text-accent-orange" />
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {transactionsLoading ? (
                    <div className="text-center py-4">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary-teal" />
                      <p className="text-sm text-gray-500 mt-2">Carregando transações...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      </motion.div>
                      <motion.h3
                        className="text-lg font-medium text-gray-600 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Nenhuma transação ainda
                      </motion.h3>
                      <motion.p
                        className="text-sm text-gray-500 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        Suas transações aparecerão aqui
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-teal/10 text-primary-teal">
                          💡 Use as ações rápidas!
                        </span>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <TransactionList transactions={transactions.slice(0, 5)} showActions={false} hideAmounts={!showBalance} />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.main>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTransaction}
        transaction={null}
        defaultType={modalTransactionType || undefined}
      />
    </div>
  )
}
