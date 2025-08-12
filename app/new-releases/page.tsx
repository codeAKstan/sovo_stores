import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const newReleaseProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    image: "/iphone-15-pro-max-back.png",
    category: "iPhone",
    releaseDate: "2024-01-15",
    preOrder: false,
    rating: 4.9,
    inStock: true,
    features: ["Titanium Design", "A17 Pro Chip", "Action Button"]
  },
  {
    id: 2,
    name: "MacBook Pro 16-inch M3 Max",
    price: 2499,
    originalPrice: 2699,
    image: "/macbook-pro-16-silver.png",
    category: "MacBook",
    releaseDate: "2024-01-20",
    preOrder: false,
    rating: 4.9,
    inStock: true,
    features: ["M3 Max Chip", "22-hour battery", "Liquid Retina XDR"]
  },
  {
    id: 3,
    name: "Apple Vision Pro",
    price: 3499,
    originalPrice: 3499,
    image: "/placeholder.jpg",
    category: "AR/VR",
    releaseDate: "2024-02-01",
    preOrder: true,
    rating: null,
    inStock: false,
    features: ["Spatial Computing", "EyeSight", "Dual 4K Displays"]
  },
  {
    id: 4,
    name: "AirPods Max (USB-C)",
    price: 549,
    originalPrice: 579,
    image: "/placeholder.jpg",
    category: "Audio",
    releaseDate: "2024-01-10",
    preOrder: false,
    rating: 4.7,
    inStock: true,
    features: ["USB-C", "Active Noise Cancellation", "Spatial Audio"]
  },
  {
    id: 5,
    name: "iPad Pro 13-inch M4",
    price: 1299,
    originalPrice: 1399,
    image: "/placeholder.jpg",
    category: "iPad",
    releaseDate: "2024-01-25",
    preOrder: false,
    rating: 4.8,
    inStock: true,
    features: ["M4 Chip", "OLED Display", "Ultra Thin Design"]
  },
  {
    id: 6,
    name: "Apple Watch Ultra 3",
    price: 799,
    originalPrice: 849,
    image: "/placeholder.jpg",
    category: "Wearables",
    releaseDate: "2024-02-15",
    preOrder: true,
    rating: null,
    inStock: false,
    features: ["Titanium Case", "Extended Battery", "Advanced Health Sensors"]
  }
]

const sortOptions = ["Release Date", "Price: Low to High", "Price: High to Low", "Name"]
const categoryFilters = ["All", "iPhone", "MacBook", "iPad", "Audio", "Wearables", "AR/VR"]

export default function NewReleases() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 pt-36">

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">New Releases</h1>
          <p className="text-xl md:text-2xl mb-8">Discover the latest innovations from Apple</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            ✨ Just launched
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option}
                  variant={option === "Release Date" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {option}
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

        {/* New Releases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newReleaseProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    New
                  </Badge>
                  <Badge className="absolute top-2 left-2 bg-blue-500">
                    {product.category}
                  </Badge>
                  {product.preOrder && (
                    <Badge className="absolute bottom-2 right-2 bg-yellow-500 text-black">
                      Pre-Order
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-2">
                  Released: {new Date(product.releaseDate).toLocaleDateString()}
                </CardDescription>
                {product.rating && (
                  <CardDescription className="mb-3">
                    ⭐ {product.rating} rating
                  </CardDescription>
                )}
                <div className="space-y-1 mb-3 text-sm text-gray-600">
                  {product.features.map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  {product.originalPrice !== product.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        Save ${product.originalPrice - product.price}
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  disabled={!product.inStock && !product.preOrder}
                  variant={product.preOrder ? "outline" : "default"}
                >
                  {product.preOrder ? "Pre-Order Now" : product.inStock ? "Add to Cart" : "Out of Stock"}
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