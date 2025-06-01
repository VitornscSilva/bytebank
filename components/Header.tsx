"use client"

import { User, Bell, LogOut, UserCircle, Settings } from "lucide-react"
import Image from "next/image"
import { useAuthStore } from "@/stores"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleMyAccount = () => {
    // TODO: Navigate to account page
    console.log("Navigate to Minha Conta")
  }

  const handleSettings = () => {
    // TODO: Navigate to settings page
    console.log("Navigate to Configurações")
  }

  return (
    <header className="bg-primary-teal text-white px-6 py-4 sticky top-0 z-50 lg:static">
      <div className="flex justify-end lg:justify-between items-center">
        <div className="items-center space-x-4 hidden lg:flex">
          <Image
            src="/logos/logo-white.svg"
            alt="Bytebank Logo"
            width={120}
            height={32}
            className="text-white"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Bell className="hidden lg:block w-5 h-5 cursor-pointer hover:text-primary-green transition-colors" />
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden lg:block">
              {user?.name || "Usuário"}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center p-0 hover:bg-primary-green/80"
                >
                  <User className="w-4 h-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleMyAccount} className="cursor-pointer">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Minha Conta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
