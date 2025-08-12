import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const accessoryProducts = [
  {
    id: 1,
    name: "AirPods Pro (2nd generation)",
    price: 249,
    originalPrice: 299,
    image: "/placeholder.jpg",
    category: "Audio",
    compatibility: "iPhone, iPad, Mac",
    rating: 4.8,
    inStock: true,
    isNew: false
  },
  {
    id: 2,
    name: "MagSafe Charger",
    price: 39,
    originalPrice: 49,
    image: "/placeholder.jpg",
    category: "Charging",
    compatibility: "iPhone 12 and later",
    rating: 4.5,
    inStock: true,
    isNew: false
  },
  {
    id: 3,
    name: "Apple Watch Series 9",
    price: 399,
    originalPrice: 449,
    image: "/placeholder.jpg",
    category: "Wearables",
    compatibility: "iPhone",
    rating: 4.7,
    inStock: true,
    isNew: true
  },
  {
    id: 4,
    name: "Magic Keyboard",
    price: 179,
    originalPrice: 199,
    image: "/placeholder.jpg",
    category: "Input",
    compatibility: "Mac, iPad",
    rating: 4.6,
    inStock: true,
    isNew: false
  },
  {
    id: 5,
    name: "USB-C to Lightning Cable",
    price: 19,
    originalPrice: 29,
    image: "/placeholder.jpg",
    category: "Cables",
    compatibility: "iPhone, iPad",
    rating: 4.3,
    inStock: true,
    isNew: false
  },
  {
    id: 6,
    name: "iPhone 15 Pro Case",
    price: 49,
    originalPrice: 59,
    image: "/placeholder.jpg",
    category: "Cases",
    compatibility: "iPhone 15 Pro",
    rating: 4.4,
    inStock: true,
    isNew: true
  }
]

const categories = ["All", "Audio", "Charging", "Wearables", "Input", "Cables", "Cases"]

export default function Accessories() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 pt-36">

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Accessories</h1>
          <p className="text-xl md:text-2xl mb-8">Complete your Apple experience</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Free engraving on select accessories
          </Badge>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessoryProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      New
                    </Badge>
                  )}
                  <Badge className="absolute top-2 left-2 bg-purple-500">
                    {product.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-2">
                  Compatible with {product.compatibility}
                </CardDescription>
                <CardDescription className="mb-3">
                  ⭐ {product.rating} rating
                </CardDescription>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-purple-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
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