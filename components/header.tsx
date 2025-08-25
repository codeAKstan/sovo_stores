"use client"

import Link from "next/link"
import { Menu, ShoppingCart, Search, ChevronDown } from "lucide-react"
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
  return (
    <header className="sticky top-0 z-50">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 bg-primary text-primary-foreground px-3 py-1 rounded"
      >
        Skip to content
      </a>

      {/* Top bar: menu, brand, cart */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <Sheet>
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

        <Link href="/" className="inline-flex items-center gap-2" aria-label="Sovo stores home">
          <span className="text-xl font-extrabold tracking-tight">
            Sovo <span className="text-blue-700">stores</span>
          </span>
        </Link>

        <Link href="/cart" aria-label="Open cart">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Search band */}
      <div className="bg-blue-800 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="¿Qué andás buscando vos?"
            aria-label="Search Sovo stores"
            className="h-11 pl-11 pr-4 rounded-full bg-white text-base placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Under-search nav (horizontal scroll), styled like the reference */}
      <nav aria-label="Primary" className="bg-slate-900 text-white/90 text-sm">
        <div
          className="flex items-center gap-6 px-3 py-2 overflow-x-auto whitespace-nowrap
                     [-ms-overflow-style:none] [scrollbar-width:none]
                     [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="inline-flex items-center gap-1 hover:text-white hover:bg-slate-800 
                         px-3 py-2 rounded-md transition-all duration-200 hover:scale-105
                         group relative"
              title={item.description}
            >
              <span className="font-medium">{item.label}</span>
              {item.caret ? (
                <ChevronDown className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : null}
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export { SovoHeader as Header }
