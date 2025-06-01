"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { RegisterModal, LoginModal } from "@/components/AuthModals"
import { Footer } from "@/components/Footer"
import { HeroSection } from "@/components/HeroSection"
import { BankFeatures } from "@/components/BankFeatures"
import { LandingHeader } from "@/components/LandingHeader"

export default function HomePage() {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  const handleAuthSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <LandingHeader setShowRegisterModal={setShowRegisterModal} setShowLoginModal={setShowLoginModal} />
      </motion.div>

      <motion.div 
        className="bg-gradient-to-b from-primary-teal to-background-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <HeroSection setShowRegisterModal={setShowRegisterModal} setShowLoginModal={setShowLoginModal} />
        <BankFeatures />
      </motion.div>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Footer setShowLoginModal={setShowLoginModal} />
      </motion.div>

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleAuthSuccess}
      />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleAuthSuccess} />
    </motion.div>
  )
}
