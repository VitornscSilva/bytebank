import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export function TransactionsLoading() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-teal" />
        <p className="text-gray-600">Carregando transações...</p>
      </div>
    </motion.div>
  )
}