"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
  images: string[]
  rating: number
  reviews: number
  colors: string[]
  storage: string[]
  isNew: boolean
  isSale: boolean
  quantityRemaining: number
  sold: number
  sortOrder?: number
  createdAt?: string
}

export function ProductGrid() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  const categories = ["iPhone", "MacBook", "Linea Blanca"]

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

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
        
        // Sort products by category priority: iPhone first, then MacBook, then Linea Blanca
        const sortedProducts = data.products.sort((a: Product, b: Product) => {
          const categoryPriority = {
            'iPhone': 1,
            'MacBook': 2,
            'Linea Blanca': 3
          }
          
          const aPriority = categoryPriority[a.category as keyof typeof categoryPriority] || 999
          const bPriority = categoryPriority[b.category as keyof typeof categoryPriority] || 999
          
          // If same category, sort by admin-defined sortOrder, then by creation date
          if (aPriority === bPriority) {
            // Sort by sortOrder if available
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
              return a.sortOrder - b.sortOrder
            }
            if (a.sortOrder !== undefined) return -1
            if (b.sortOrder !== undefined) return 1
            // Fallback to creation date (newest first)
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          }
          
          return aPriority - bPriority
        })
        
        setProducts(sortedProducts)
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra colección premium de iPhones, MacBooks y aparatos domésticos con precios inmejorables y calidad
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
    <>
      {/* Banner Section */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">¡Ofertas imperdibles!</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Image
                  src="/banner1.jpeg"
                  alt="Oferta Xiaomi Redmi Note 14"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <Image
                  src="/banner2.jpeg"
                  alt="Sala Seccional"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <Image
                  src="/banner3.jpeg"
                  alt="Cocina a gas"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Header section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra colección premium de iPhones, MacBooks y aparatos domésticos con precios inmejorables y calidad
            </p>
          </div>

        {/* Category filters */}
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
            {(() => {
              // Separate products by category in the desired order
              const iPhoneProducts = products.filter(product => product.category === "iPhone")
              const macBookProducts = products.filter(product => product.category === "MacBook")
              const lineaBlancaProducts = products.filter(product => product.category === "Linea Blanca")
              
              const renderProductCard = (product: Product) => (
                <div key={product._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-50 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2">
                      {product.isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                          Nuevo
                        </Badge>
                      )}
                      {product.isSale && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white">
                          En Oferta
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
                          {product.rating} ({product.reviews} reseñas)
                        </span>
                      </div>
                    </div>

                    {/* Storage Options */}
                    {product.storage.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          {product.category === "Linea Blanca" ? "Capacidad:" : "Almacenamiento:"}
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
                          <span className="text-sm text-gray-600">Disponible:</span>
                          <div className="flex items-center space-x-1">
                            <span className={`text-sm font-medium ${
                              product.quantityRemaining < 10 ? "text-red-600" : "text-green-600"
                            }`}>
                              {product.quantityRemaining}
                            </span>
                            {product.quantityRemaining < 10 && (
                              <span className="text-xs text-red-600 font-medium">
                                Agotado
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Vendidos:</span>
                          <span className="text-sm font-medium text-gray-900">{product.sold}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                        disabled={product.quantityRemaining === 0}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>{product.quantityRemaining === 0 ? "Agotado" : "Agregar al Carrito"}</span>
                      </Button>
                      
                      {/* Buy Now Button */}
                      <Link href={`/product/${product._id}`}>
                        <Button
                          variant="outline"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                          disabled={product.quantityRemaining === 0}
                        >
                          <span>{product.quantityRemaining === 0 ? "Agotado" : "Comprar Ahora"}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
              
              const allItems = []
              
              // 1. Add ad1 image first (only if there are iPhone products and we're showing "All" or "iPhone" category)
              if (iPhoneProducts.length > 0 && (selectedCategory === "All" || selectedCategory === "iPhone")) {
                allItems.push(
                  <div key="ad-before-iphones" className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative h-64 bg-gray-50 overflow-hidden">
                      <Image
                        src="/ad1.jpeg"
                        alt="Advertisement"
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        Oferta especial
                      </h3>
                      <p className="text-gray-600 text-center">
                        Descubre nuestras ofertas especiales!
                      </p>
                    </div>
                  </div>
                )
              }
              
              // 2. Add iPhone products with ad3 after first 2 products
              iPhoneProducts.forEach((product, index) => {
                allItems.push(renderProductCard(product))
                
                // Add ad3 after the first 2 iPhone products
                if (index === 1 && iPhoneProducts.length > 2 && (selectedCategory === "All" || selectedCategory === "iPhone")) {
                  allItems.push(
                    <div key="ad3-after-two-iphones" className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="relative h-64 bg-gray-50 overflow-hidden">
                        <Image
                          src="/ad3.jpeg"
                          alt="Advertisement"
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                          Precios mejores
                        </h3>
                        <p className="text-gray-600 text-center">
                          Productos de calidad a precios inmejorables!
                        </p>
                      </div>
                    </div>
                  )
                }
              })
              
              // Add ad2 after all iPhone products (before MacBooks)
              if (iPhoneProducts.length > 0 && (selectedCategory === "All" || selectedCategory === "iPhone")) {
                allItems.push(
                  <div key="ad2-after-iphones" className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="relative h-64 bg-gray-50 overflow-hidden">
                      <Image
                        src="/ad2.jpeg"
                        alt="Advertisement"
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                        Oferta exclusiva
                      </h3>
                      <p className="text-gray-600 text-center">
                        No te pierdas nuestras ofertas exclusivas!
                      </p>
                    </div>
                  </div>
                )
              }
              
              // 3. Add MacBook products
              macBookProducts.forEach(product => {
                allItems.push(renderProductCard(product))
              })
              
              // 4. Add Linea Blanca products last
              lineaBlancaProducts.forEach(product => {
                allItems.push(renderProductCard(product))
              })
              
              return allItems
            })()}
          </div>
        )}
      </div>
    </section>
    </>
  )
}
