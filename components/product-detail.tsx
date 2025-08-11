"use client"

import { useState } from "react"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft } from "lucide-react"
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
    images: [
      "/iphone-15-pro-max-titanium.png",
      "/iphone-15-pro-max-back.png",
      "/iphone-15-pro-max-side.png",
      "/iphone-15-pro-max-camera.png",
    ],
    rating: 4.9,
    reviews: 2847,
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storage: ["256GB", "512GB", "1TB"],
    isNew: true,
    isSale: true,
    description:
      "The most advanced iPhone ever with titanium design, A17 Pro chip, and the most powerful camera system.",
    features: [
      "6.7-inch Super Retina XDR display",
      "A17 Pro chip with 6-core GPU",
      "Pro camera system with 48MP Main camera",
      "Up to 29 hours video playback",
      "Titanium design with textured matte glass back",
      "Action Button for quick access to features",
    ],
    specifications: {
      Display: "6.7-inch Super Retina XDR OLED",
      Chip: "A17 Pro",
      Camera: "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      Battery: "Up to 29 hours video playback",
      Storage: "256GB, 512GB, 1TB",
      Colors: "4 titanium finishes",
      Weight: "221 grams",
      "Water Resistance": "IP68",
    },
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    category: "iPhone",
    price: 499,
    originalPrice: 999,
    images: ["/placeholder-bpfen.png", "/iphone-15-pro-back.png", "/iphone-15-pro-side.png"],
    rating: 4.8,
    reviews: 1923,
    colors: ["Blue Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
    storage: ["128GB", "256GB", "512GB", "1TB"],
    isNew: true,
    isSale: true,
    description: "Pro performance with titanium design and advanced camera system in a more compact size.",
    features: [
      "6.1-inch Super Retina XDR display",
      "A17 Pro chip with 6-core GPU",
      "Pro camera system with 48MP Main camera",
      "Up to 23 hours video playback",
      "Titanium design",
      "Action Button",
    ],
    specifications: {
      Display: "6.1-inch Super Retina XDR OLED",
      Chip: "A17 Pro",
      Camera: "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
      Battery: "Up to 23 hours video playback",
      Storage: "128GB, 256GB, 512GB, 1TB",
      Colors: "4 titanium finishes",
      Weight: "187 grams",
      "Water Resistance": "IP68",
    },
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    category: "MacBook",
    price: 1249,
    originalPrice: 2499,
    images: ["/macbook-pro-16-silver.png", "/placeholder-e1zsv.png", "/macbook-pro-16-inch-side.png"],
    rating: 4.9,
    reviews: 892,
    colors: ["Silver", "Space Gray"],
    storage: ["512GB", "1TB", "2TB", "4TB"],
    isNew: false,
    isSale: true,
    description:
      "The most powerful MacBook Pro ever with M3 Pro chip, stunning Liquid Retina XDR display, and all-day battery life.",
    features: [
      "16.2-inch Liquid Retina XDR display",
      "M3 Pro or M3 Max chip",
      "Up to 128GB unified memory",
      "Up to 22 hours battery life",
      "Advanced camera and audio",
      "Extensive connectivity",
    ],
    specifications: {
      Display: "16.2-inch Liquid Retina XDR",
      Chip: "M3 Pro or M3 Max",
      Memory: "18GB, 36GB, or 128GB unified memory",
      Storage: "512GB, 1TB, 2TB, 4TB SSD",
      Battery: "Up to 22 hours",
      Weight: "2.16 kg",
      Ports: "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      Colors: "Silver, Space Gray",
    },
  },
]

interface ProductDetailProps {
  productId: number
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const product = products.find((p) => p.id === productId)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedStorage, setSelectedStorage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { dispatch } = useCart()

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  // Set default selections
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0])
  }
  if (!selectedStorage && product.storage.length > 0) {
    setSelectedStorage(product.storage[0])
  }

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
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
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
              {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">50% OFF</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
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

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
            </div>
            <p className="text-lg text-green-600 font-medium">
              You save ${product.originalPrice - product.price} (50% off)
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Color: {selectedColor}</h3>
            <div className="flex space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedColor === color
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Storage: {selectedStorage}</h3>
            <div className="grid grid-cols-2 gap-3">
              {product.storage.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStorage === storage
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={addToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
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
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 border-b border-gray-200">
              <span className="font-medium text-gray-900">{key}</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
