"use client"

import { useState, useEffect } from "react"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

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
  specifications: Record<string, string> | string[]
}

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedStorage, setSelectedStorage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/products/${productId}`)
        
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (!selectedColor && product.colors.length > 0) {
        setSelectedColor(product.colors[0])
      }
      if (!selectedStorage && product.storage.length > 0) {
        setSelectedStorage(product.storage[0])
      }
    }
  }, [product, selectedColor, selectedStorage])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product Not Found'}</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          selectedColor,
          selectedStorage,
        },
      })
    }
    dispatch({ type: "OPEN_CART" })
  }

  const storageLabel = product.category === "Linea Blanca" ? "Capacity" : "Storage"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg p-2 border-2 transition-all ${
                    selectedImage === index ? "border-blue-600" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {product.isNew && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge variant="destructive" className="text-xs">
                  Sale
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-blue-600">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice > product.price && (
                <Badge variant="destructive" className="text-xs">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selection */}
          {product.storage.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{storageLabel}</h3>
              <div className="flex flex-wrap gap-3">
                {product.storage.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedStorage === storage
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantityRemaining, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {product.quantityRemaining} available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={addToCart}
              disabled={product.quantityRemaining === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{product.quantityRemaining === 0 ? "Out of Stock" : "Add to Cart"}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsFavorite(!isFavorite)}
              className="px-6 py-4 rounded-xl border-2"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shipping Info */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-green-600" />
              <span className="text-gray-600">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-gray-600">1-year warranty included</span>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <span className="text-gray-600">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <div className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.isArray(product.specifications) ? (
              product.specifications.map((spec, index) => (
                <div key={index} className="py-3 border-b border-gray-200">
                  <span className="text-gray-600">{spec}</span>
                </div>
              ))
            ) : (
              Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
