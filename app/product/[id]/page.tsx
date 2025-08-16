import { Header } from "@/components/header"
import { ProductDetail } from "@/components/product-detail"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductDetail productId={id} />
      <CartSidebar />
      <Footer />
    </div>
  )
}
