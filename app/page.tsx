import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { PurchaseNotifications } from "@/components/purchase-notifications"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ProductGrid />
      <CartSidebar />
      <Footer />
      <PurchaseNotifications />
    </div>
  )
}
