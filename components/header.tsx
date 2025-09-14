"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Menu, ShoppingCart, Search, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const defaultNav = [
  { label: "📱 Celulares", caret: true, href: "/?category=iPhone", description: "Los últimos teléfonos y accesorios" },
  { label: "💻 Laptops", caret: true, href: "/?category=MacBook", description: "Computadoras de primera" },
  { label: "🏠 Línea Blanca", caret: true, href: "/?category=Linea Blanca", description: "Refris, lavadoras y más chunches" },
  { label: "🎮 Gaming", caret: true, href: "/gaming", description: "Consolas, PCs y chunches para jugar" },
]

function SovoHeader({ navItems = defaultNav }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingNavItem, setLoadingNavItem] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = async (href: string, label: string) => {
    setLoadingNavItem(label)
    setIsSheetOpen(false) // Close the mobile menu
    // Show loader for a brief moment to provide visual feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if this is a category navigation
    const url = new URL(href, window.location.origin)
    const category = url.searchParams.get('category')
    
    if (category && (category === 'iPhone' || category === 'MacBook' || category === 'Linea Blanca')) {
      // Navigate to homepage first
      router.push('/')
      
      // Wait for navigation to complete, then scroll to the product section
      setTimeout(() => {
        const productSection = document.querySelector('#featured-products')
        if (productSection) {
          productSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        setLoadingNavItem(null)
      }, 1000)
    } else {
      // Regular navigation
      router.push(href)
      setLoadingNavItem(null)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e as any)
    }
  }

  return (
    <>
      {/* Full Screen Loading Overlay */}
      {loadingNavItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-lg font-medium text-gray-900">Cargando...</p>
            <p className="text-sm text-gray-600">Navegando a {loadingNavItem}</p>
          </div>
        </div>
      )}
      
      {/* Before header image */}
      <div className="w-full bg-blue-600">
        <Image
          src="/after.png"
          alt="Before header banner"
          width={1200}
          height={100}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      <header className="relative z-50">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 bg-primary text-primary-foreground px-3 py-1 rounded"
        >
          Skip to content
        </a>

      {/* Top utility bar */}
      <div className="hidden md:block bg-gray-100 border-b px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-600">
            <span>Mi Cuenta</span>
            <span>👤</span>
            <Link href="/cart" className="flex items-center gap-1">
              <span>Mi carrito</span>
              <ShoppingCart className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main header with logo and search */}
      <div className="bg-white">
        {/* Mobile header layout */}
        <div className="md:hidden">
          {/* Top bar with menu, logo, and cart */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            {/* Mobile menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>navegar</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.href, item.label)}
                      disabled={loadingNavItem !== null}
                      className="flex items-center justify-between rounded px-2 py-2 hover:bg-accent disabled:opacity-50 text-left w-full"
                    >
                      <span className="text-sm">{item.label}</span>
                      {item.caret && (
                        <ChevronDown className="h-4 w-4 opacity-70" />
                      )}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Sovo stores home">
              <div className="bg-yellow-400 rounded-full p-1.5">
                <span className="text-lg">☀️</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">
                sovo <span className="text-black">stores</span>
              </span>
            </Link>

            {/* Cart icon */}
            <Link href="/cart" aria-label="Shopping cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Search bar below */}
          <div className="px-4 py-3 bg-blue-600">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="¿Qué está buscando?"
                aria-label="Search Sovo stores"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                className="h-12 pr-12 rounded-full border-0 text-base placeholder:text-gray-500 bg-white"
              />
              <Button 
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Desktop header layout */}
        <div className="hidden md:block px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Sovo stores home">
              <div className="bg-yellow-400 rounded-full p-2">
                <span className="text-2xl">☀️</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                sovo <span className="text-black">stores</span>
              </span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="¿Qué está buscando?"
                  aria-label="Search Sovo stores"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  className="h-12 pr-12 rounded-lg border-2 border-gray-300 text-base placeholder:text-gray-500"
                />
                <Button 
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar - hidden on mobile */}
      <nav aria-label="Primary" className="hidden md:block bg-blue-700 text-white">
        <div className="flex items-center px-4">
          {/* Categories button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-3 rounded-none flex items-center gap-2">
                <Menu className="h-5 w-5" />
                <span className="font-medium">CATEGORÍAS</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Categorías</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-accent"
                  >
                    <span className="text-sm">{item.label}</span>
                    {item.caret ? <ChevronDown className="h-4 w-4 opacity-70" /> : null}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Promotional badge */}
          <div className="bg-yellow-400 text-black px-3 py-1 mx-2 rounded text-sm font-bold">
            Promociones
          </div>

          {/* Navigation items */}
          <div className="flex items-center gap-6 overflow-x-auto">
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className="whitespace-nowrap px-3 py-3 hover:bg-blue-600 transition-colors text-sm font-medium"
                title={item.description}
              >
                {item.label}
              </Link>
            ))}
            <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold whitespace-nowrap">
              necesidad diaria
            </div>
            <Link href="/support" className="whitespace-nowrap px-3 py-3 hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-1">
              🏢 Centro de servicio
            </Link>
          </div>
        </div>
      </nav>
    </header>
    </>
  )
}

export { SovoHeader as Header }
