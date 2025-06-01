import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

type LandingHeaderProps = {
  setShowRegisterModal: (show: boolean) => void
  setShowLoginModal: (show: boolean) => void
}

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95
  }
}

const linkVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

export function LandingHeader({ setShowRegisterModal, setShowLoginModal }: LandingHeaderProps) {
  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image src="/logos/logo.svg" alt="Bytebank" width={146} height={32} />
          </motion.div>
          <motion.nav 
            className="hidden md:flex ml-10 space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div variants={linkVariants} whileHover="hover">
              <Link href="/" className="text-[#47A138] hover:text-[#48a138bc] transition-colors">
                Sobre
              </Link>
            </motion.div>
            <motion.div variants={linkVariants} whileHover="hover">
              <Link href="/" className="text-[#47A138] hover:text-[#48a138bc] transition-colors">
                Serviços
              </Link>
            </motion.div>
          </motion.nav>
        </div>
        <motion.div 
          className="hidden lg:flex space-x-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.button
            onClick={() => setShowRegisterModal(true)}
            className="bg-[#47A138] hover:bg-[#48a138bc] text-white px-4 py-2 rounded-md transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Abrir minha conta
          </motion.button>
          <motion.button
            onClick={() => setShowLoginModal(true)}
            className="border border-[#47A138] text-[#47A138] px-4 py-2 rounded-md hover:opacity-80 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Já tenho conta
          </motion.button>
        </motion.div>
      </div>
    </header>
  )
}