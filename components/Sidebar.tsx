"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Home, ArrowLeftRight, TrendingUp, Settings, Menu, X } from "lucide-react"
import Image from "next/image"

const menuItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/transactions", label: "Transferências", icon: ArrowLeftRight },
  { href: "/investments", label: "Investimentos", icon: TrendingUp },
  { href: "/services", label: "Outros serviços", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-[#FF5031]" />
        ) : (
          <Menu className="w-6 h-6 text-[#FF5031]" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`
        w-64 bg-white shadow-sm min-h-screen fixed lg:static
        transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex justify-center items-center py-4 lg:hidden">
          <Image src="/logos/logo.svg" alt="Bytebank Logo" width={120} height={32} />
        </div>
        <nav className="lg:pt-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
