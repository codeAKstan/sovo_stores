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
  description: "Tu destino premium para iPhones y MacBooks con ofertas inigualables",
  generator: "codeakstan",
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
        {/* Smartsupp Live Chat script */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '74ec5102a00154eecc18463cb2fe77ad4cc844b6';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `
        }} />
        <noscript>
          Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a>
        </noscript>
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
