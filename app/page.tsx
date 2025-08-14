import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { FeaturesSection } from "@/components/features-section"
import { ShippingGuaranteeSection } from "@/components/shipping-guarantee-section"
import { Footer } from "@/components/footer"
import { ReviewsSection } from "@/components/reviews-section"
import { PurchaseNotifications } from "@/components/purchase-notifications"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <ProductGrid />
      <FeaturesSection />
      <ReviewsSection />
      <ShippingGuaranteeSection />
      <CartSidebar />
      <Footer />
      <PurchaseNotifications />
    </div>
  )
}
