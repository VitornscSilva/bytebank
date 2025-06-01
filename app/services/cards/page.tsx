"use client"

import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "./_components/Card"
import useAuthStore from "@/stores/auth-store"

function formatCardName(fullName: string): string {
  const nameParts = fullName.trim().split(' ').filter(part => part.length > 0)
  
  if (nameParts.length <= 2) {
    return fullName
  }
  
  const firstName = nameParts[0]
  const middleNames = nameParts.slice(1, -1)
  const lastName = nameParts[nameParts.length - 1]
  
  const abbreviatedMiddleNames = middleNames.map(name => `${name.charAt(0).toUpperCase()}.`)
  
  return [firstName, ...abbreviatedMiddleNames, lastName].join(' ')
}

export default function CardsPage() {
  const { user } = useAuthStore()
  
  const formattedName = user?.name ? formatCardName(user.name) : "Nome do usuário"
  
  return (
    <div className="min-h-screen bg-background-light">
      <Header />

      <div className="flex relative">
        <Sidebar />

        <main className="main-content main-content-mobile p-6 lg:ml-0 w-full">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Meus cartões</h1>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Cartão físico</h2>

              <div className="flex items-center justify-between">
                <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
                  <Card 
                    name={formattedName}
                    cardNumber="•••• •••• •••• ••••"
                    cardType="physical"
                  />

                  <div className="space-y-2 w-full">
                    <Button variant="secondary" className="w-full">Configurar</Button>
                    <Button
                      variant="outline-secondary"
                      className="w-full"
                    >
                      Bloquear
                    </Button>
                    <div className="text-sm text-gray-600 text-center">Função: Débito/Crédito</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Cartão digital</h2>

              <div className="flex items-center justify-between">
                <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
                  <Card 
                    name={formattedName}
                    cardNumber="•••• •••• •••• ••••"
                    cardType="digital"
                  />
                  <div className="space-y-2 w-full">
                    <Button variant="secondary" className="w-full">Configurar</Button>
                    <Button
                      variant="outline-secondary"
                      className="w-full"
                    >
                      Bloquear
                    </Button>
                    <div className="text-sm text-gray-600 text-center">Função: Débito</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
