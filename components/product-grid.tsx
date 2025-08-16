"use client"

import { useState, useEffect } from "react"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  originalPrice: number
  imageUrl: string
  rating: number
  reviews: number
  colors: string[]
  storage: string[]
  isNew: boolean
  isSale: boolean
  quantityRemaining: number
  sold: number
}

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  const categories = ["All", "iPhone", "MacBook", "Linea Blanca"]

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === "All" 
        ? '/api/products' 
        : `/api/products?category=${encodeURIComponent(selectedCategory)}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    )
  }

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.imageUrl,
        selectedColor: product.colors[0] || "Default",
        selectedStorage: product.storage[0] || "Default",
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of iPhones, MacBooks, and home appliances with unbeatable prices and quality
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
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
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Product Image */}
                <div className="relative h-64 bg-gray-50 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNew && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        New
                      </Badge>
                    )}
                    {product.isSale && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        Sale
                      </Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors duration-200 ${
                        favorites.includes(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {product.originalPrice > product.price && (
                        <Badge variant="destructive" className="text-xs">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
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
                  {product.storage.length > 0 && (
                    <div className="mb-4">
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
                  )}

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <div className="flex items-center space-x-1">
                          <span className={`text-sm font-medium ${
                            product.quantityRemaining < 10 ? "text-red-600" : "text-green-600"
                          }`}>
                            {product.quantityRemaining}
                          </span>
                          {product.quantityRemaining < 10 && (
                            <span className="text-xs text-red-600 font-medium">
                              Limited Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Sold:</span>
                        <span className="text-sm font-medium text-gray-900">{product.sold}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                    disabled={product.quantityRemaining === 0}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{product.quantityRemaining === 0 ? "Out of Stock" : "Add to Cart"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
