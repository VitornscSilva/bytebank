import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { 
    y: 50, 
    opacity: 0,
    scale: 0.9
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

const titleVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export function BankFeatures() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          Vantagens do nosso banco:
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="flex flex-col items-center text-center gap-4"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Image src="/landing/gift.svg" alt="Gift" width={73} height={56} />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#47A138]">Conta e cartão gratuitos</h3>
            <p className="text-gray-600 text-sm">
              Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center text-center gap-4"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Image src="/landing/withdrawl.svg" alt="Withdrawl" width={73} height={56} />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#47A138]">Saques sem custo</h3>
            <p className="text-gray-600 text-sm">Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.</p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center text-center gap-4"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Image src="/landing/star.svg" alt="Star" width={73} height={56} />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#47A138]">Programa de pontos</h3>
            <p className="text-gray-600 text-sm">
              Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center text-center gap-4"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Image src="/landing/devices.svg" alt="Devices" width={73} height={56} />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#47A138]">Seguro Dispositivos</h3>
            <p className="text-gray-600 text-sm">
              Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}