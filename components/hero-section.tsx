"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ShoppingBag, Smartphone, Truck } from "lucide-react"
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

const heroSlides = [
  {
    id: 1,
    type: "products",
    title: "Massive 50% OFF Sale",
    subtitle: "Limited Time Offer",
    description: "Get the latest iPhones and MacBooks at unbeatable prices. Premium technology, premium savings.",
    background: "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900",
  },
  {
    id: 2,
    type: "shopping",
    title: "Shop Anytime, Anywhere",
    subtitle: "Mobile Shopping Made Easy",
    description:
      "Browse thousands of products, compare prices, and shop with confidence using our mobile-optimized platform.",
    background: "bg-gradient-to-br from-blue-800 via-teal-700 to-cyan-800",
    image:
      "/ad.jpg",
  },
  {
    id: 3,
    type: "shipping",
    title: "Shipping Across Latin America",
    subtitle: "Money Back Guaranteed",
    description:
      "Fast, reliable delivery to Guatemala, Panama, Mexico, Dominican Republic, Colombia and more. 100% satisfaction guaranteed.",
    background: "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600",
    image:
    "/travel.jpeg",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentProductSlide, setCurrentProductSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 40000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const productTimer = setInterval(() => {
      setCurrentProductSlide((prev) => (prev + 1) % heroProducts.length)
    }, 3000)

    return () => clearInterval(productTimer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const renderProductSlide = () => (
    <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px]">
      {/* Text Content */}
      <div className="space-y-6 z-10">
        <div className="space-y-2">
          <p className="text-blue-300 font-medium tracking-wide uppercase text-sm">{heroSlides[0].subtitle}</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Massive
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              50% OFF
            </span>
            Sale
          </h1>
        </div>

        <p className="text-xl text-gray-300 max-w-lg">{heroSlides[0].description}</p>

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
            View All Deals
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
  )

  const renderShoppingSlide = () => (
    <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px]">
      {/* Text Content */}
      <div className="space-y-6 z-10">
        <div className="space-y-2">
          <p className="text-cyan-300 font-medium tracking-wide uppercase text-sm flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            {heroSlides[1].subtitle}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Shop
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Anytime
            </span>
            Anywhere
          </h1>
        </div>

        <p className="text-xl text-gray-200 max-w-lg">{heroSlides[1].description}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Start Shopping
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-transparent"
          >
            Track Order
          </Button>
        </div>
      </div>

      {/* Shopping Image */}
      <div className="relative flex items-center justify-center">
        <div className="relative">
          <img
            src={heroSlides[1].image || "/placeholder.svg"}
            alt="Happy customer shopping"
            className="w-full max-w-md h-auto object-contain rounded-2xl shadow-2xl"
          />
          <div className="absolute -top-4 -right-4 bg-teal-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-bounce">
            Easy Shopping!
          </div>
        </div>
      </div>
    </div>
  )

  const renderShippingSlide = () => (
    <div className="grid md:grid-cols-2 gap-8 items-center min-h-[500px]">
      {/* Text Content */}
      <div className="space-y-6 z-10">
        <div className="space-y-2">
          <p className="text-blue-300 font-medium tracking-wide uppercase text-sm flex items-center gap-2">
            <Truck className="h-4 w-4" />
            {heroSlides[2].subtitle}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Shipping
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Across
            </span>
            Latin America
          </h1>
        </div>

        <p className="text-xl text-gray-200 max-w-lg">{heroSlides[2].description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Guatemala</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Panama</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Mexico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Dominican Republic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Colombia</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Truck className="h-5 w-5 mr-2" />
            Track Order
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold transition-all duration-300 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>

      {/* Shipping Map Image */}
      <div className="relative flex items-center justify-center">
        <img
          src={heroSlides[2].image || "/placeholder.svg"}
          alt="Shipping across Latin America"
          className="w-full max-w-lg h-auto object-contain"
        />
      </div>
    </div>
  )

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section
      className={`relative ${currentSlideData.background} text-white overflow-hidden transition-all duration-1000`}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {currentSlideData.type === "products" && renderProductSlide()}
        {currentSlideData.type === "shopping" && renderShoppingSlide()}
        {currentSlideData.type === "shipping" && renderShippingSlide()}

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-2 z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  )
}
