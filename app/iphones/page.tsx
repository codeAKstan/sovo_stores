import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const iPhoneProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    image: "/iphone-15-pro-max-back.png",
    storage: "256GB",
    color: "Natural Titanium",
    rating: 4.9,
    inStock: true,
    isNew: true
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 999,
    originalPrice: 1099,
    image: "/iphone-15-pro-back.png",
    storage: "128GB",
    color: "Blue Titanium",
    rating: 4.8,
    inStock: true,
    isNew: true
  },
  {
    id: 3,
    name: "iPhone 15 Plus",
    price: 899,
    originalPrice: 999,
    image: "/iphone-15-plus-pin.png",
    storage: "128GB",
    color: "Pink",
    rating: 4.7,
    inStock: true,
    isNew: false
  },
  {
    id: 4,
    name: "iPhone 15",
    price: 799,
    originalPrice: 899,
    image: "/pink-iphone-15.png",
    storage: "128GB",
    color: "Pink",
    rating: 4.6,
    inStock: true,
    isNew: false
  }
]

const storageOptions = ["128GB", "256GB", "512GB", "1TB"]
const colorOptions = ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium", "Pink", "Blue", "Green", "Yellow", "Black"]

export default function iPhones() {
  return (
    <div className="min-h-screen bg-gray-50">   
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16 pt-36">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">iPhones</h1>
          <p className="text-xl md:text-2xl mb-8">Experience the power of iPhone 15 series</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Trade in your old iPhone and save up to $800
          </Badge>
        </div>
      </div>

      {/* Filter Options */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Storage</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {storageOptions.map((storage) => (
              <Button
                key={storage}
                variant="outline"
                className="rounded-full"
              >
                {storage}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {iPhoneProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      New
                    </Badge>
                  )}
                  <Badge className="absolute top-2 left-2 bg-blue-500">
                    {product.storage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-3">
                  {product.color} • ⭐ {product.rating} rating
                </CardDescription>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ${product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  • Free delivery
                  <br />
                  • 1-year warranty
                  <br />
                  • 30-day return policy
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 space-y-2">
                <Button className="w-full" size="lg">
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  Learn More
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