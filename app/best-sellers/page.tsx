import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const bestSellerProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    originalPrice: 1099,
    image: "/iphone-15-pro-back.png",
    category: "iPhone",
    salesRank: 1,
    unitsSold: "50K+",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "MacBook Air 13-inch",
    price: 1099,
    originalPrice: 1299,
    image: "/macbook.png",
    category: "MacBook",
    salesRank: 2,
    unitsSold: "35K+",
    rating: 4.6,
    inStock: true
  },
  {
    id: 3,
    name: "AirPods Pro (2nd gen)",
    price: 249,
    originalPrice: 299,
    image: "/placeholder.jpg",
    category: "Accessories",
    salesRank: 3,
    unitsSold: "75K+",
    rating: 4.8,
    inStock: true
  },
  {
    id: 4,
    name: "iPhone 15",
    price: 799,
    originalPrice: 899,
    image: "/pink-iphone-15.png",
    category: "iPhone",
    salesRank: 4,
    unitsSold: "40K+",
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: "MacBook Pro 14-inch",
    price: 1999,
    originalPrice: 2199,
    image: "/macbook-pro-14-space-gray.png",
    category: "MacBook",
    salesRank: 5,
    unitsSold: "25K+",
    rating: 4.8,
    inStock: true
  },
  {
    id: 6,
    name: "Apple Watch Series 9",
    price: 399,
    originalPrice: 449,
    image: "/placeholder.jpg",
    category: "Accessories",
    salesRank: 6,
    unitsSold: "30K+",
    rating: 4.7,
    inStock: true
  }
]

const timeRanges = ["This Week", "This Month", "This Year", "All Time"]
const categoryFilters = ["All", "iPhone", "MacBook", "Accessories"]

export default function BestSellers() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16 pt-36">

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Best Sellers</h1>
          <p className="text-xl md:text-2xl mb-8">Our most popular products loved by customers</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            🔥 Trending now
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Time Range</h3>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((range) => (
                <Button
                  key={range}
                  variant={range === "This Month" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Best Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellerProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              {/* Sales Rank Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-yellow-500 text-black font-bold text-lg px-3 py-1">
                  #{product.salesRank}
                </Badge>
              </div>
              
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-2">
                  🔥 {product.unitsSold} sold • ⭐ {product.rating} rating
                </CardDescription>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-orange-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  ✓ Best Seller in {product.category}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  )
}