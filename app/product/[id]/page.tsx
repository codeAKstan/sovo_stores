import { Header } from "@/components/header"
import { ProductDetail } from "@/components/product-detail"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetail productId={Number.parseInt(params.id)} />
      <CartSidebar />
      <Footer />
    </div>
  )
}
