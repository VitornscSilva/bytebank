"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RegisterModal, LoginModal } from "@/components/AuthModals"
import Image from "next/image"
import { Footer } from "@/components/Footer"
import { LandingHeader } from "@/components/LandingHeader"

export default function NotFound() {
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()

  const handleAuthSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader setShowRegisterModal={setShowRegisterModal} setShowLoginModal={setShowLoginModal} />

      <main className="flex-1 bg-gradient-to-b from-primary-teal to-background-light py-16">
        <div className="container mx-auto px-4 text-center flex flex-col items-center justify-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">Ops! Não encontramos a página...</h1>
            <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
              E olha que exploramos o universo procurando por ela!
              <br />
              Que tal voltar e tentar novamente?
            </p>
            <Link
              href="/"
              className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-3 rounded-md inline-flex items-center transition-colors font-medium"
            >
              Voltar ao início
            </Link>
          </div>

          <Image 
            src="/not-found/404.svg" 
            alt="404" 
            width={500} 
            height={500} 
            className="animate-bounce-in animate-float"
          />
        </div>
      </main>

      <Footer setShowLoginModal={setShowLoginModal} />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleAuthSuccess}
      />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}
