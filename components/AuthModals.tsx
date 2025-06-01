"use client"

import type React from "react"

import { useState } from "react"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { useAuthStore } from "@/stores"
import authStore from "@/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function RegisterModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  
  const { register, isLoading, error, clearError } = useAuthStore()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (formData.acceptTerms && formData.name && formData.email && formData.password) {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      
      if (success) {
        onSuccess?.()
        onClose()
        setFormData({
          name: "",
          email: "",
          password: "",
          acceptTerms: false,
        })
      } else {
        const currentError = authStore.getState().error
        
        if (currentError === "User with this email already exists") {
          toast({
            title: "Email já cadastrado",
            description: "Já existe uma conta com este endereço de email. Tente fazer login ou use outro email.",
            variant: "destructive",
          })
          clearError()
        }
      }
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  const handleClose = () => {
    clearError()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center gap-6 text-center mb-6">
            <Image
              src="/auth/sign-up.svg"
              alt="Registration illustration"
              width={300}
              height={200}
              className="mx-auto object-contain"
            />
            <h2 className="text-lg font-semibold text-gray-900">
              Preencha os campos abaixo para criar sua conta corrente!
            </h2>
          </div>

          {error && error !== "User with this email already exists" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="w-full pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                className="mt-1"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                Li e estou ciente quanto às condições de tratamento dos meus dados conforme descrito na Política de
                Privacidade do banco.
              </label>
            </div>

            <Button
              type="submit"
              disabled={!formData.acceptTerms || !formData.name || !formData.email || !formData.password || isLoading}
              className="w-full"
              variant="secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function LoginModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, isLoading, error, clearError } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (formData.email && formData.password) {
      const success = await login({
        email: formData.email,
        password: formData.password,
      })
      
      if (success) {
        onSuccess?.()
        onClose()
        setFormData({
          email: "",
          password: "",
        })
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  const handleClose = () => {
    clearError()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center gap-6 text-center mb-6">
            <Image
              src="/auth/sign-in.svg"
              alt="Login illustration"
              width={300}
              height={200}
              className="mx-auto object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="w-full pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-left">
              <button
                type="button"
                className="text-[#47A138] hover:text-[#48a138bc] text-sm font-medium transition-colors underline"
                disabled={isLoading}
              >
                Esqueci a senha!
              </button>
            </div>

            <Button
              type="submit"
              disabled={!formData.email || !formData.password || isLoading}
              className="w-full bg-[#47A138] hover:bg-[#48a138bc] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Acessar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
