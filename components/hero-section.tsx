"use client"

import { useState, useEffect } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

const heroProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    image: "/1.png",
    originalPrice: 1199,
    salePrice: 599,
    color: "Natural Titanium",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    image: "/3.png",
    originalPrice: 999,
    salePrice: 499,
    color: "Blue Titanium",
  },
  {
    id: 3,
    name: "iPhone 15",
    image: "/pink-iphone-15.png",
    originalPrice: 799,
    salePrice: 399,
    color: "Grey",
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    image: "/macbook-pro-16-silver.png",
    originalPrice: 2499,
    salePrice: 1249,
    color: "Silver",
  },
]

export function HeroSection() {
  const [currentProductSlide, setCurrentProductSlide] = useState(0)

  useEffect(() => {
    const productTimer = setInterval(() => {
      setCurrentProductSlide((prev) => (prev + 1) % heroProducts.length)
    }, 3000)

    return () => clearInterval(productTimer)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px]">
          {/* Text Content */}
          <div className="space-y-6 z-10">
            <div className="space-y-2">
              <p className="text-blue-300 font-medium tracking-wide uppercase text-sm">Promo por tiempo chiquito, aprovechá vos</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Massive
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  50% OFF
                </span>
                Sale
              </h1>
            </div>

            <p className="text-xl text-gray-300 max-w-lg">
              Get the latest iPhones and MacBooks at unbeatable prices. Premium technology, premium savings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-transparent"
              >
                View All products
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-transparent"
              >
                Track Orders
              </Button>
            </div>
          </div>

          {/* Product Carousel */}
          <div className="relative">
            <div className="relative h-[500px] flex items-center justify-center">
              {heroProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute transition-all duration-700 ease-in-out transform ${
                    index === currentProductSlide
                      ? "opacity-100 translate-x-0 scale-100 z-10"
                      : index === (currentProductSlide + 1) % heroProducts.length
                        ? "opacity-30 translate-x-20 scale-90 z-5"
                        : index === (currentProductSlide - 1 + heroProducts.length) % heroProducts.length
                          ? "opacity-30 -translate-x-20 scale-90 z-5"
                          : "opacity-0 translate-x-40 scale-75 z-0"
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                    <div className="text-center space-y-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-48 h-64 object-contain mx-auto"
                      />
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-gray-300 text-sm">{product.color}</p>
                        <div className="space-y-1">
                          <p className="text-gray-400 line-through text-lg">${product.originalPrice}</p>
                          <p className="text-3xl font-bold text-green-400">${product.salePrice}</p>
                          <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            50% OFF
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  )
}
