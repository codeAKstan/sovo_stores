"use client"

import Link from "next/link"
import { Menu, ShoppingCart, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const defaultNav = [
  { label: "Medical Care", caret: true, href: "#" },
  { label: "Luxury", caret: false, href: "#" },
  { label: "Best Sellers", caret: false, href: "#" },
  { label: "Basics", caret: false, href: "#" },
  { label: "New Releases", caret: false, href: "#" },
  { label: "Groceries", caret: true, href: "#" },
  { label: "Today's Deals", caret: false, href: "#" },
  { label: "Registry", caret: false, href: "#" },
]

export default function SovoHeader({ navItems = defaultNav }) {
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
              <SheetTitle>Browse</SheetTitle>
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
            placeholder="What are you looking for?"
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
            <Link key={item.label} href={item.href} className="inline-flex items-center gap-1 hover:text-white">
              <span>{item.label}</span>
              {item.caret ? <ChevronDown className="h-4 w-4 opacity-80" /> : null}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
