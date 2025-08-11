import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <ProductGrid />
      <CartSidebar />
      {/* Added Footer component */}
      <Footer />
    </div>
  )
}
