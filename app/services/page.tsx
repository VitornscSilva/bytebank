"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { DollarSign, CreditCard, Heart, Smartphone, Shield, Banknote } from "lucide-react"
import Link from "next/link"

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
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
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const iconVariants = {
  rest: {
    scale: 1,
    rotate: 0
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
}

const floatingVariants = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function ServicesPage() {
  const services = [
    {
      icon: DollarSign,
      title: "Empréstimo",
      description: "Solicite seu empréstimo com as melhores taxas",
      route: "/services",
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverBgColor: "group-hover:bg-green-100",
    },
    {
      icon: CreditCard,
      title: "Meus cartões",
      description: "Gerencie seus cartões de crédito e débito",
      route: "/services/cards",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBgColor: "group-hover:bg-blue-100",
    },
    {
      icon: Heart,
      title: "Doações",
      description: "Faça doações para instituições de caridade",
      route: "/services",
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverBgColor: "group-hover:bg-red-100",
    },
    {
      icon: Smartphone,
      title: "Pix",
      description: "Transferências instantâneas 24h",
      route: "/services",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBgColor: "group-hover:bg-purple-100",
    },
    {
      icon: Shield,
      title: "Seguros",
      description: "Proteja o que é importante para você",
      route: "/services",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverBgColor: "group-hover:bg-indigo-100",
    },
    {
      icon: Banknote,
      title: "Crédito celular",
      description: "Recarregue seu celular rapidamente",
      route: "/services",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverBgColor: "group-hover:bg-orange-100",
    },
  ]

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
            <motion.h1 
              className="text-2xl font-bold text-gray-900"
              variants={itemVariants}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Confira os serviços disponíveis
            </motion.h1>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={pageVariants}
            >
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Link 
                      href={service.route} 
                      className="card hover:shadow-xl transition-all duration-300 cursor-pointer group block"
                    >
                      <motion.div 
                        className="text-center space-y-4"
                        variants={itemVariants}
                      >
                        <motion.div 
                          className={`w-16 h-16 mx-auto ${service.bgColor} ${service.hoverBgColor} rounded-full flex items-center justify-center transition-all duration-300`}
                          variants={floatingVariants}
                          animate="animate"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <motion.div
                            variants={iconVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Icon className={`w-8 h-8 ${service.color}`} />
                          </motion.div>
                        </motion.div>
                        
                        <motion.h3 
                          className="font-semibold text-gray-900 group-hover:text-primary-teal transition-colors duration-300"
                          variants={itemVariants}
                        >
                          {service.title}
                        </motion.h3>
                        
                        <motion.p 
                          className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                          variants={itemVariants}
                        >
                          {service.description}
                        </motion.p>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            <motion.div
              className="mt-12 text-center"
              variants={itemVariants}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 text-gray-500 text-sm"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ✨
                </motion.div>
                <span>Mais serviços em breve</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}
