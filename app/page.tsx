import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { DeliverySection } from "@/components/delivery-section"
import { BannerSection } from "@/components/banner-section"
import { ProductGrid } from "@/components/product-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { FeaturesSection } from "@/components/features-section"
import { ShippingGuaranteeSection } from "@/components/shipping-guarantee-section"
import { Footer } from "@/components/footer"
import { ReviewsSection } from "@/components/reviews-section"
import { PurchaseNotifications } from "@/components/purchase-notifications"
import { Suspense } from "react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <Suspense fallback={
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos destacados</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre nuestra colección premium de iPhones, MacBooks y electrodomésticos con precios y calidad incomparables
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </section>
      }>
        <div className="w-full bg-blue-600">
          <Image
            src="/before.png"
            alt="After delivery banner"
            width={1200}
            height={200}
            className="w-full h-auto object-cover"
            priority
            />
        </div>
        <BannerSection />
        <DeliverySection />
        <ProductGrid />
      </Suspense>
      <ShippingGuaranteeSection />
      <FeaturesSection />
      <ReviewsSection />
      <CartSidebar />
      <Footer />
      <PurchaseNotifications />
    </div>
  )
}
