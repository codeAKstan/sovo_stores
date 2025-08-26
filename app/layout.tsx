import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { CartProvider } from "@/contexts/cart-context"
import { AdminProvider } from "@/contexts/admin-context"
import WhatsAppWidget from "@/components/whatsapp-widget"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sovo Stores - Premium iPhones & MacBooks",
  description: "Your premium destination for iPhones and MacBooks with unbeatable deals",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AdminProvider>
          <CartProvider>
            {children}
            <WhatsAppWidget />
          </CartProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
