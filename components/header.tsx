"use client"

import { useState } from "react"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { state, dispatch } = useCart()

  const navigationItems = [
    { name: "Electronics", href: "/electronics" },
    { name: "iPhones", href: "/iphones" },
    { name: "MacBooks", href: "/macbooks" },
    { name: "Accessories", href: "/accessories" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "New Releases", href: "/new-releases" },
    { name: "Today's Deals", href: "/todays-deals" },
    { name: "Support", href: "/support" },
    { name: "Track Orders", href: "/track-orders" },
  ]

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white border-b z-50 shadow-sm">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold cursor-pointer">
              Sovo <span className="text-blue-600">stores</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Cart Icon */}
        <Button variant="ghost" size="sm" className="relative" onClick={() => dispatch({ type: "TOGGLE_CART" })}>
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="What are you looking for?"
            className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className={`bg-blue-600 text-white ${isMobileMenuOpen ? "block" : "hidden"} md:block`}>
        <div className="px-4 py-2">
          <nav className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-left md:text-center hover:text-blue-200 transition-colors py-1 md:py-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
