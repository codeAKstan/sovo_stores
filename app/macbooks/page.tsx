import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const macBookProducts = [
  {
    id: 1,
    name: "MacBook Pro 16-inch",
    price: 2499,
    originalPrice: 2699,
    image: "/macbook-pro-16-silver.png",
    chip: "M3 Max",
    memory: "32GB",
    storage: "1TB SSD",
    color: "Silver",
    rating: 4.9,
    inStock: true,
    isNew: true
  },
  {
    id: 2,
    name: "MacBook Pro 14-inch",
    price: 1999,
    originalPrice: 2199,
    image: "/macbook-pro-14-space-gray.png",
    chip: "M3 Pro",
    memory: "16GB",
    storage: "512GB SSD",
    color: "Space Gray",
    rating: 4.8,
    inStock: true,
    isNew: true
  },
  {
    id: 3,
    name: "MacBook Air 15-inch",
    price: 1299,
    originalPrice: 1499,
    image: "/macbook-air-15-midnight.png",
    chip: "M2",
    memory: "16GB",
    storage: "256GB SSD",
    color: "Midnight",
    rating: 4.7,
    inStock: true,
    isNew: false
  },
  {
    id: 4,
    name: "MacBook Air 13-inch",
    price: 1099,
    originalPrice: 1299,
    image: "/macbook.png",
    chip: "M2",
    memory: "8GB",
    storage: "256GB SSD",
    color: "Silver",
    rating: 4.6,
    inStock: true,
    isNew: false
  }
]

const chipOptions = ["M2", "M3", "M3 Pro", "M3 Max"]
const memoryOptions = ["8GB", "16GB", "32GB", "64GB"]
const storageOptions = ["256GB", "512GB", "1TB", "2TB"]

export default function MacBooks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-16 pt-36">

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">MacBooks</h1>
          <p className="text-xl md:text-2xl mb-8">Supercharged by Apple Silicon</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Education pricing available
          </Badge>
        </div>
      </div>

      {/* Filter Options */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Chip</h3>
            <div className="flex flex-wrap gap-2">
              {chipOptions.map((chip) => (
                <Button
                  key={chip}
                  variant="outline"
                  className="rounded-full"
                >
                  {chip}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Memory</h3>
            <div className="flex flex-wrap gap-2">
              {memoryOptions.map((memory) => (
                <Button
                  key={memory}
                  variant="outline"
                  className="rounded-full"
                >
                  {memory}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Storage</h3>
            <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {macBookProducts.map((product) => (
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
                    {product.chip}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
                <CardDescription className="mb-3">
                  {product.color} • ⭐ {product.rating} rating
                </CardDescription>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div>• {product.chip} chip</div>
                  <div>• {product.memory} unified memory</div>
                  <div>• {product.storage} storage</div>
                </div>
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
              </CardContent>
              <CardFooter className="p-6 pt-0 space-y-2">
                <Button className="w-full" size="lg">
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  Customize
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