import Image from "next/image"
import { motion } from "framer-motion"

type HeroSectionProps = {
  setShowRegisterModal: (show: boolean) => void
  setShowLoginModal: (show: boolean) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const buttonVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95
  }
}

export function HeroSection({ setShowRegisterModal, setShowLoginModal }: HeroSectionProps) {
  return (
    <section className="flex-1 py-16">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <motion.div 
          className="lg:w-1/2 mb-10 lg:mb-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-3xl md:text-4xl text-center lg:text-left font-bold text-black mb-6 max-w-lg"
            variants={itemVariants}
          >
            Experimente mais liberdade no controle da sua vida financeira. Crie sua conta com a gente!
          </motion.h1>
          <motion.div 
            className="flex justify-center space-x-4 lg:hidden"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setShowRegisterModal(true)}
              className="bg-black hover:bg-[#48a138bc] text-white px-4 py-2 rounded-md transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Abrir minha conta
            </motion.button>
            <motion.button
              onClick={() => setShowLoginModal(true)}
              className="border border-black text-black px-4 py-2 rounded-md hover:opacity-80 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Já tenho conta
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            className="relative h-[190px] md:h-[412px]"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/landing/banner.svg"
              alt="Financial growth chart"
              width={660}
              height={412}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}