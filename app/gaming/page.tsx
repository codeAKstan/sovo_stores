"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Gamepad2, Monitor, Headphones, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  originalPrice: number
  images: string[]
  rating: number
  reviews: number
  colors: string[]
  storage: string[]
  isNew: boolean
  isSale: boolean
  quantityRemaining: number
  sold: number
  description: string
  features: string[]
  specifications: string[]
  createdAt?: string
}

const categories = ["All", "Console", "PC", "Monitor", "Accessories"]

export default function GamingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const { dispatch } = useCart()

  useEffect(() => {
    fetchGamingProducts()
  }, [])

  const fetchGamingProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?category=Gaming')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        console.error('Failed to fetch gaming products')
      }
    } catch (error) {
      console.error('Error fetching gaming products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || '/placeholder.jpg',
        selectedColor: product.colors[0] || '',
        selectedStorage: product.storage[0] || '',
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ))
  }

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes('console') || categoryLower.includes('playstation') || categoryLower.includes('xbox') || categoryLower.includes('nintendo')) {
      return <Gamepad2 className="h-5 w-5" />
    } else if (categoryLower.includes('pc') || categoryLower.includes('computer')) {
      return <Monitor className="h-5 w-5" />
    } else if (categoryLower.includes('monitor') || categoryLower.includes('display')) {
      return <Monitor className="h-5 w-5" />
    } else if (categoryLower.includes('headset') || categoryLower.includes('audio') || categoryLower.includes('keyboard') || categoryLower.includes('mouse')) {
      return <Headphones className="h-5 w-5" />
    } else {
      return <Gamepad2 className="h-5 w-5" />
    }
  }

  const getProductSubcategory = (product: Product) => {
    const name = product.name.toLowerCase()
    const description = product.description?.toLowerCase() || ''
    const features = product.features.join(' ').toLowerCase()
    
    const text = `${name} ${description} ${features}`
    
    if (text.includes('console') || text.includes('playstation') || text.includes('xbox') || text.includes('nintendo')) {
      return 'Console'
    } else if (text.includes('pc') || text.includes('computer') || text.includes('desktop')) {
      return 'PC'
    } else if (text.includes('monitor') || text.includes('display') || text.includes('screen')) {
      return 'Monitor'
    } else if (text.includes('headset') || text.includes('keyboard') || text.includes('mouse') || text.includes('controller')) {
      return 'Accessories'
    } else {
      return 'Gaming'
    }
  }

  const filteredProducts = products.filter(product => {
    if (selectedCategory === "All") return true
    return getProductSubcategory(product) === selectedCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🎮 Gaming Paradise
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Level up your gaming experience with premium consoles, PCs & accessories
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Free Shipping on Gaming PCs
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Extended Warranty Available
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Gaming Setup Consultation
            </Badge>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category !== "All" && getCategoryIcon(category)}
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-lg">Loading gaming products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Gamepad2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {selectedCategory === "All" ? "No gaming products found" : `No ${selectedCategory.toLowerCase()} products found`}
            </h3>
            <p className="text-gray-500 mb-4">
              Check back later or browse other categories
            </p>
            <Button onClick={() => setSelectedCategory("All")} variant="outline">
              View All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const subcategory = getProductSubcategory(product)
              const isFavorite = favorites.includes(product._id)
              
              return (
                <Card key={product._id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Link href={`/product/${product._id}`}>
                        <Image
                          src={product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="absolute top-2 left-2 flex gap-2">
                        {product.isNew && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            New
                          </Badge>
                        )}
                        {product.isSale && (
                          <Badge className="bg-red-500 hover:bg-red-600">
                            Sale
                          </Badge>
                        )}
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getCategoryIcon(subcategory)}
                          {subcategory}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                          isFavorite ? 'text-red-500' : 'text-gray-600'
                        }`}
                        onClick={() => toggleFavorite(product._id)}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <Link href={`/product/${product._id}`}>
                      <CardTitle className="text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {product.name}
                      </CardTitle>
                    </Link>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-sm text-gray-600">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Features */}
                    {product.features.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {product.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={product.quantityRemaining > 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {product.quantityRemaining > 0 ? `${product.quantityRemaining} in stock` : "Out of Stock"}
                      </Badge>
                      {product.sold > 0 && (
                        <span className="text-xs text-gray-500">
                          {product.sold} sold
                        </span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <div className="flex gap-2 w-full">
                      <Button 
                        className="flex-1" 
                        disabled={product.quantityRemaining === 0}
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => toggleFavorite(product._id)}
                        className={isFavorite ? 'text-red-500 border-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Gaming Setup Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Gaming Setups
            </h2>
            <p className="text-xl text-gray-300">
              Pre-configured gaming systems for every budget and preference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6 text-green-400" />
                  Starter Setup
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Perfect for casual gaming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-4">Starting at $899</div>
                <ul className="space-y-2 text-sm">
                  <li>• Gaming Console</li>
                  <li>• Gaming Headset</li>
                  <li>• Extra Controller</li>
                  <li>• Popular Games Bundle</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Browse Starter Products
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-blue-400" />
                  Pro Setup
                </CardTitle>
                <CardDescription className="text-gray-300">
                  For serious gamers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-4">Starting at $2,499</div>
                <ul className="space-y-2 text-sm">
                  <li>• High-End Gaming PC</li>
                  <li>• 4K Gaming Monitor</li>
                  <li>• Mechanical Keyboard & Mouse</li>
                  <li>• Premium Gaming Chair</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Browse Pro Products
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-6 w-6 text-purple-400" />
                  Ultimate Setup
                </CardTitle>
                <CardDescription className="text-gray-300">
                  No compromises gaming
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400 mb-4">Starting at $4,999</div>
                <ul className="space-y-2 text-sm">
                  <li>• Top-tier Gaming PC</li>
                  <li>• Dual 4K Monitors</li>
                  <li>• Premium Peripherals</li>
                  <li>• Professional Streaming Setup</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Browse Ultimate Products
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <CartSidebar />
      <Footer />
    </div>
  )
}