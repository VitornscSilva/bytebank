"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, PlusCircle, BarChart3 } from "lucide-react"
import { Pie, PieChart } from "recharts"

import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const chartData = [
  { investment: "fundos", amount: 15000, fill: "var(--color-fundos)" },
  { investment: "tesouro", amount: 12000, fill: "var(--color-tesouro)" },
  { investment: "previdencia", amount: 9000, fill: "var(--color-previdencia)" },
  { investment: "bolsa", amount: 14000, fill: "var(--color-bolsa)" },
]

const chartConfig = {
  amount: {
    label: "Valor",
  },
  fundos: {
    label: "Fundos de investimento",
    color: "#3b82f6",
  },
  tesouro: {
    label: "Tesouro Direto",
    color: "#8b5cf6",
  },
  previdencia: {
    label: "Previdência Privada",
    color: "#ef4444",
  },
  bolsa: {
    label: "Bolsa de Valores",
    color: "#f97316",
  },
} satisfies ChartConfig

const pageVariants = {
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
    y: 30,
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
    y: 40,
    rotateX: -10
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

const investmentVariants = {
  hidden: { 
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1],
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const chartVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.5,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.25, 0, 1],
      delay: 0.3
    }
  }
}

const legendItemVariants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function InvestmentsPage() {
  const [hasInvestments, setHasInvestments] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const EmptyState = () => (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4"
      variants={emptyStateVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="text-center max-w-md"
        variants={itemVariants}
      >
        <motion.div 
          className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
          variants={floatingVariants}
          animate="animate"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "#e0f2fe",
            transition: { duration: 0.3 }
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-gray-900 mb-3"
          variants={itemVariants}
        >
          Comece a investir hoje
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-8 leading-relaxed"
          variants={itemVariants}
        >
          Você ainda não possui investimentos. Que tal dar o primeiro passo rumo à sua independência financeira?
        </motion.p>
        
        <motion.div 
          className="space-y-3"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full bg-primary-teal hover:bg-primary-teal/90 text-white"
              onClick={() => setHasInvestments(true)}
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <PlusCircle className="w-4 h-4" />
              </motion.div>
              Fazer meu primeiro investimento
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="outline-secondary" className="w-full">
              Aprender sobre investimentos
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-200"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-500 mb-3">Opções populares para começar:</p>
          <motion.div 
            className="grid grid-cols-2 gap-3 text-sm"
            variants={pageVariants}
          >
            <motion.div 
              className="bg-gray-50 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#f0f9ff",
                transition: { duration: 0.2 }
              }}
            >
              <h4 className="font-medium text-gray-900">Tesouro Direto</h4>
              <p className="text-gray-600">Baixo risco</p>
            </motion.div>
            <motion.div 
              className="bg-gray-50 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#f0f9ff",
                transition: { duration: 0.2 }
              }}
            >
              <h4 className="font-medium text-gray-900">Fundos DI</h4>
              <p className="text-gray-600">Liquidez diária</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background-light">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <motion.main 
          className="main-content main-content-mobile p-6 lg:ml-0 w-full"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="max-w-4xl mx-auto space-y-6"
            variants={pageVariants}
          >
            <motion.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Investimentos
              </motion.h1>
            </motion.div>

            <AnimatePresence mode="wait">
              {hasInvestments ? (
                <motion.div
                  key="investments"
                  variants={investmentVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div 
                    className="card hover:shadow-xl transition-shadow duration-300"
                    variants={cardVariants}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <motion.h2 
                      className="text-lg font-semibold mb-4 text-gray-800"
                      variants={itemVariants}
                    >
                      Total: <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
                      >
                        {formatCurrency(50000)}
                      </motion.span>
                    </motion.h2>

                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center"
                      variants={pageVariants}
                    >
                      <motion.div 
                        className="bg-primary-teal text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200"
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 0.95,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <h3 className="font-medium mb-2">Renda Fixa</h3>
                        <motion.p 
                          className="text-2xl font-bold"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          {formatCurrency(36000)}
                        </motion.p>
                      </motion.div>

                      <motion.div 
                        className="bg-primary-teal text-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200"
                        variants={itemVariants}
                        whileHover={{ 
                          scale: 0.95,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <h3 className="font-medium mb-2">Renda Variável</h3>
                        <motion.p 
                          className="text-2xl font-bold"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          {formatCurrency(14000)}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="flex flex-col">
                      <CardHeader>
                        <motion.div
                          variants={itemVariants}
                        >
                          <CardTitle className="text-lg font-semibold text-gray-800">Distribuição de Investimentos</CardTitle>
                          <CardDescription>Portfólio atual por categoria</CardDescription>
                        </motion.div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <motion.div 
                          className="bg-primary-teal p-6 rounded-lg"
                          variants={itemVariants}
                        >
                          <div className="flex lg:flex-row flex-col items-center justify-between">
                            <motion.div
                              variants={chartVariants}
                              className="mx-auto aspect-square max-h-[200px] w-72"
                            >
                              <ChartContainer config={chartConfig}>
                                <PieChart>
                                  <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                  />
                                  <Pie
                                    data={chartData}
                                    dataKey="amount"
                                    nameKey="investment"
                                    innerRadius={40}
                                    outerRadius={80}
                                  />
                                </PieChart>
                              </ChartContainer>
                            </motion.div>

                            <motion.div 
                              className="flex-1 ml-6 space-y-3"
                              variants={pageVariants}
                            >
                              {[
                                { color: "bg-blue-400", label: "Fundos de investimento" },
                                { color: "bg-purple-400", label: "Tesouro Direto" },
                                { color: "bg-red-400", label: "Previdência Privada" },
                                { color: "bg-orange-400", label: "Bolsa de Valores" }
                              ].map((item, index) => (
                                <motion.div 
                                  key={item.label}
                                  className="flex items-center space-x-3"
                                  variants={legendItemVariants}
                                  whileHover={{ 
                                    x: 5,
                                    transition: { duration: 0.2 }
                                  }}
                                >
                                  <motion.div 
                                    className={`w-3 h-3 ${item.color} rounded-full`}
                                    animate={{ 
                                      scale: [1, 1.2, 1],
                                    }}
                                    transition={{ 
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: index * 0.5
                                    }}
                                  ></motion.div>
                                  <span className="text-white">{item.label}</span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2 text-sm items-start">
                        <motion.div 
                          className="flex items-center gap-2 leading-none font-medium"
                          variants={itemVariants}
                        >
                          Portfolio cresceu 5.2% este mês 
                          <motion.div
                            animate={{ 
                              y: [0, -3, 0],
                              x: [0, 2, 0]
                            }}
                            transition={{ 
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <TrendingUp className="h-4 w-4" />
                          </motion.div>
                        </motion.div>
                        <motion.div 
                          className="text-muted-foreground leading-none"
                          variants={itemVariants}
                        >
                          Mostrando distribuição total de investimentos
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  className="card"
                  variants={cardVariants}
                >
                  <EmptyState />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}
