"use client"

import { useState } from "react"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "iPhone",
    price: 599,
    originalPrice: 1199,
    image: "/iphone-15-pro-max-titanium.png",
    rating: 4.9,
    reviews: 2847,
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storage: ["256GB", "512GB", "1TB"],
    isNew: true,
    isSale: true,
    quantityRemaining: 3,
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "iPhone",
    price: 499,
    originalPrice: 999,
    image: "/Iphon15-pink.png",
    rating: 4.8,
    reviews: 1923,
    colors: ["Blue Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    isNew: true,
    isSale: true,
    quantityRemaining: 5,
  },
  {
    id: 3,
    name: "iPhone 15",
    category: "iPhone",
    price: 399,
    originalPrice: 799,
    image: "/pink-iphone-15.png",
    rating: 4.7,
    reviews: 3156,
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    storage: ["128GB", "256GB", "512GB"],
    isNew: true,
    isSale: true,
    quantityRemaining: 2,
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    category: "MacBook",
    price: 1249,
    originalPrice: 2499,
    image: "/macbook-pro-16-silver.png",
    rating: 4.9,
    reviews: 892,
    colors: ["Silver", "Space Gray"],
    storage: ["512GB", "1TB", "2TB", "4TB"],
    isNew: false,
    isSale: true,
    quantityRemaining: 8,
  },
  {
    id: 5,
    name: 'MacBook Pro 14"',
    category: "MacBook",
    price: 999,
    originalPrice: 1999,
    image: "/macbook-pro-16-inch-side.png",
    rating: 4.8,
    reviews: 1247,
    colors: ["Silver", "Space Gray"],
    storage: ["512GB", "1TB", "2TB"],
    isNew: false,
    isSale: true,
    quantityRemaining: 12,
  },
  {
    id: 6,
    name: "MacBook Air 15",
    category: "MacBook",
    price: 649,
    originalPrice: 1299,
    image: "/macbook-air-15-midnight.png",
    rating: 4.6,
    reviews: 2134,
    colors: ["Midnight", "Silver", "Space Gray", "Starlight"],
    storage: ["256GB", "512GB", "1TB", "2TB"],
    isNew: true,
    isSale: true,
    quantityRemaining: 7,
  },
  {
    id: 7,
    name: "Samsung French Door Refrigerator",
    category: "Linea Blanca",
    price: 899,
    originalPrice: 1799,
    image: "/samsung-refrigerator.jpg",
    rating: 4.7,
    reviews: 1456,
    colors: ["Stainless Steel", "Black Stainless", "White"],
    storage: ["25.5 cu ft", "28 cu ft", "30 cu ft"],
    isNew: false,
    isSale: true,
    quantityRemaining: 9,

  },
  {
    id: 8,
    name: "LG Front Load Washing Machine",
    category: "Linea Blanca",
    price: 549,
    originalPrice: 1099,
    image: "/lg-washing-machine.png",
    rating: 4.6,
    reviews: 2341,
    colors: ["White", "Graphite Steel", "Black Steel"],
    storage: ["4.5 cu ft", "5.2 cu ft", "5.8 cu ft"],
    isNew: true,
    isSale: true,
    quantityRemaining: 18,
  },
  {
    id: 9,
    name: "Whirlpool Built-in Dishwasher",
    category: "Linea Blanca",
    price: 399,
    originalPrice: 799,
    image: "/whirlpool-dishwasher.png",
    rating: 4.5,
    reviews: 987,
    colors: ["Stainless Steel", "Black", "White"],
    storage: ["Standard", "Tall Tub", "Third Rack"],
    isNew: false,
    isSale: true,
    quantityRemaining: 6,

  },
  {
    id: 10,
    name: "GE Electric Range",
    category: "Linea Blanca",
    price: 649,
    originalPrice: 1299,
    image: "/ge-electric-range.png",
    rating: 4.4,
    reviews: 1234,
    colors: ["Stainless Steel", "Black", "White"],
    storage: ["5.3 cu ft", "6.2 cu ft", "7.1 cu ft"],
    isNew: true,
    isSale: true,
    quantityRemaining: 8,

  },
  {
    id: 11,
    name: "Frigidaire Side-by-Side Refrigerator",
    category: "Linea Blanca",
    price: 749,
    originalPrice: 1499,
    image: "/frigidaire-refrigerator.png",
    rating: 4.3,
    reviews: 876,
    colors: ["Stainless Steel", "Black", "White"],
    storage: ["22.1 cu ft", "25.5 cu ft", "28.4 cu ft"],
    isNew: false,
    isSale: true,
    quantityRemaining: 1,

  },
  {
    id: 12,
    name: "Maytag Top Load Dryer",
    category: "Linea Blanca",
    price: 449,
    originalPrice: 899,
    image: "/maytag-dryer.jpg",
    rating: 4.6,
    reviews: 1567,
    colors: ["White", "Metallic Slate"],
    storage: ["7.0 cu ft", "7.4 cu ft", "8.8 cu ft"],
    isNew: true,
    isSale: true,
    quantityRemaining: 10,

  },
]

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<number[]>([])
  const { dispatch } = useCart()

  const categories = ["iPhone", "MacBook", "Linea Blanca"]

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory)

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const addToCart = (product: (typeof products)[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        selectedColor: product.colors[0], // Default to first color
        selectedStorage: product.storage[0], // Default to first storage option
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of iPhones, MacBooks, and home appliances with unbeatable prices and quality
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center space-x-2 bg-gray-100 rounded-full p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => {
            // Insert ad image before MacBook products (when viewing All or MacBook category)
            const shouldShowAd = (selectedCategory === "All" || selectedCategory === "MacBook") && 
                                product.category === "MacBook" && 
                                index === filteredProducts.findIndex(p => p.category === "MacBook")
            
            return (
              <>
                {shouldShowAd && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-8">
                    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden  transition-all duration-300">
                      <img
                        src="/ad.jpeg"
                        alt="Advertisement"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Product Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-64 cursor-pointer">
                      {product.isNew && (
                        <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">New</Badge>
                      )}
                      {product.isSale && (
                        <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600">50% OFF</Badge>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleFavorite(product.id)
                        }}
                        className="absolute top-4 right-16 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 z-10"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Storage Options */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.category === "Linea Blanca" ? "Capacity:" : "Storage:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.storage.slice(0, 3).map((storage) => (
                          <span key={storage} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {storage}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Remaining */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <Badge 
                          variant={product.quantityRemaining <= 10 ? "destructive" : "secondary"}
                          className={`text-xs ${
                            product.quantityRemaining <= 10 
                              ? "bg-red-100 text-red-800 border-red-200" 
                              : "bg-green-100 text-green-800 border-green-200"
                          }`}
                        >
                          {product.quantityRemaining} left
                        </Badge>
                      </div>
                      {product.quantityRemaining <= 10 && (
                        <span className="text-xs text-red-600 font-medium animate-pulse">
                          Limited Stock!
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                      <p className="text-sm text-green-600 font-medium">Save ${product.originalPrice - product.price}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </Button>
                      <Link href={`/product/${product.id}`}>
                        <Button variant="outline" className="px-4 py-3 rounded-xl bg-transparent">
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full font-semibold transition-all duration-300 bg-transparent"
          >
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  )
}
