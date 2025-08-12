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
    images: ["/Iphon15-pink.png", "/iphone-15-pro-back.png", "/iphone-15-pro-side.png"],
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
    id: 3,
    name: "iPhone 15 Plus",
    category: "iPhone",
    price: 449,
    originalPrice: 899,
    images: ["/pink-iphone-15.png", "/iphone-15-plus-pin.png"],
    rating: 4.7,
    reviews: 1456,
    colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
    storage: ["128GB", "256GB", "512GB"],
    isNew: true,
    isSale: true,
    description: "The perfect balance of size and performance with A16 Bionic chip and advanced dual-camera system.",
    features: [
      "6.7-inch Super Retina XDR display",
      "A16 Bionic chip",
      "Advanced dual-camera system with 48MP Main",
      "Up to 26 hours video playback",
      "Dynamic Island",
      "USB-C connectivity",
    ],
    specifications: {
      Display: "6.7-inch Super Retina XDR OLED",
      Chip: "A16 Bionic",
      Camera: "48MP Main, 12MP Ultra Wide",
      Battery: "Up to 26 hours video playback",
      Storage: "128GB, 256GB, 512GB",
      Colors: "5 vibrant colors",
      Weight: "201 grams",
      "Water Resistance": "IP68",
    },
  },
  {
    id: 4,
    name: 'MacBook Pro 16"',
    category: "MacBook",
    price: 1249,
    originalPrice: 2499,
    images: ["/macbook-pro-16-silver.png", "/macbook-air-15-midnight.png", "/macbook-pro-16-inch-side.png"],
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
   {
    id: 5,
    name: 'MacBook Pro 14"',
    category: "MacBook",
    price: 999,
    originalPrice: 1999,
    images: ["/macbook-pro-14-space-gray.png", "/macbook-pro-16-inch-side.png"],
    rating: 4.8,
    reviews: 634,
    colors: ["Silver", "Space Gray"],
    storage: ["512GB", "1TB", "2TB"],
    isNew: false,
    isSale: true,
    description: "Compact powerhouse with M3 Pro chip, Liquid Retina XDR display, and professional performance.",
    features: [
      "14.2-inch Liquid Retina XDR display",
      "M3 Pro chip",
      "Up to 36GB unified memory",
      "Up to 18 hours battery life",
      "Advanced camera and audio",
      "Professional connectivity",
    ],
    specifications: {
      Display: "14.2-inch Liquid Retina XDR",
      Chip: "M3 Pro",
      Memory: "18GB or 36GB unified memory",
      Storage: "512GB, 1TB, 2TB SSD",
      Battery: "Up to 18 hours",
      Weight: "1.61 kg",
      Ports: "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3",
      Colors: "Silver, Space Gray",
    },
  },
  {
    id: 6,
    name: 'MacBook Air 15"',
    category: "MacBook",
    price: 649,
    originalPrice: 1299,
    images: ["/macbook-air-15-midnight.png", "/macbook.png"],
    rating: 4.6,
    reviews: 789,
    colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
    storage: ["256GB", "512GB", "1TB", "2TB"],
    isNew: true,
    isSale: true,
    description: "Incredibly thin and light with M2 chip, stunning 15-inch display, and all-day battery life.",
    features: [
      "15.3-inch Liquid Retina display",
      "M2 chip with 8-core CPU",
      "Up to 24GB unified memory",
      "Up to 18 hours battery life",
      "1080p FaceTime HD camera",
      "MagSafe charging",
    ],
    specifications: {
      Display: "15.3-inch Liquid Retina",
      Chip: "M2",
      Memory: "8GB, 16GB, or 24GB unified memory",
      Storage: "256GB, 512GB, 1TB, 2TB SSD",
      Battery: "Up to 18 hours",
      Weight: "1.51 kg",
      Ports: "2x Thunderbolt, MagSafe 3, 3.5mm headphone",
      Colors: "4 beautiful colors",
    },
  },
  {
    id: 7,
    name: "Samsung 28 cu. ft. French Door Refrigerator",
    category: "Linea Blanca",
    price: 899,
    originalPrice: 1799,
    images: ["/samsung-refrigerator.jpg", "/samsung-refrigerato.png"],
    rating: 4.6,
    reviews: 324,
    colors: ["Stainless Steel", "Black Stainless", "White"],
    storage: ["28 cu. ft.", "25 cu. ft.", "32 cu. ft."],
    isNew: false,
    isSale: true,
    description: "Spacious French door refrigerator with advanced cooling technology and smart features.",
    features: [
      "28 cu. ft. total capacity",
      "Twin Cooling Plus technology",
      "FlexZone drawer with 4 temperature settings",
      "Ice and water dispenser",
      "ENERGY STAR certified",
      "Smart connectivity with Wi-Fi",
    ],
    specifications: {
      Capacity: "28 cu. ft.",
      Type: "French Door",
      "Ice Maker": "Built-in with dispenser",
      "Water Filter": "Yes, replaceable",
      Dimensions: '35.75" W x 70" H x 36.25" D',
      "Energy Rating": "ENERGY STAR",
      Warranty: "1 year parts and labor",
      Features: "Smart connectivity, FlexZone drawer",
    },
  },
  {
    id: 8,
    name: "LG 5.2 cu. ft. Front Load Washing Machine",
    category: "Linea Blanca",
    price: 549,
    originalPrice: 1099,
    images: ["/lg-washing-machine.png"],
    rating: 4.5,
    reviews: 567,
    colors: ["White", "Graphite Steel", "Black Steel"],
    storage: ["5.2 cu. ft.", "4.5 cu. ft.", "5.8 cu. ft."],
    isNew: true,
    isSale: true,
    description: "High-efficiency front load washer with steam technology and smart features.",
    features: [
      "5.2 cu. ft. capacity",
      "TurboWash 360° technology",
      "Steam technology for better cleaning",
      "14 wash cycles",
      "SmartThinQ app connectivity",
      "ENERGY STAR Most Efficient",
    ],
    specifications: {
      Capacity: "5.2 cu. ft.",
      Type: "Front Load",
      "Wash Cycles": "14 cycles",
      "Water Temperature": "5 temperature options",
      Dimensions: '27" W x 39" H x 30.25" D',
      "Energy Rating": "ENERGY STAR Most Efficient",
      Warranty: "1 year parts and labor",
      Features: "Steam, SmartThinQ, TurboWash 360°",
    },
  },
  {
    id: 9,
    name: "Whirlpool Built-In Dishwasher",
    category: "Linea Blanca",
    price: 399,
    originalPrice: 799,
    images: ["/whirlpool-dishwasher.png"],
    rating: 4.4,
    reviews: 289,
    colors: ["Stainless Steel", "White", "Black"],
    storage: ["Standard Capacity", "Large Capacity"],
    isNew: false,
    isSale: true,
    description: "Quiet and efficient built-in dishwasher with multiple wash cycles and stainless steel interior.",
    features: [
      "Stainless steel interior",
      "Quiet operation at 47 dBA",
      "6 wash cycles including Heavy and Quick",
      "Adjustable upper rack",
      "Heated dry option",
      "ENERGY STAR certified",
    ],
    specifications: {
      Type: "Built-in Dishwasher",
      "Noise Level": "47 dBA",
      "Wash Cycles": "6 cycles",
      Racks: "2 racks with adjustable upper",
      Dimensions: '24" W x 34" H x 24" D',
      "Energy Rating": "ENERGY STAR",
      Warranty: "1 year limited",
      Features: "Stainless interior, Heated dry",
    },
  },
  {
    id: 10,
    name: "GE 30-inch Electric Range",
    category: "Linea Blanca",
    price: 649,
    originalPrice: 1299,
    images: ["/ge-electric-range.png"],
    rating: 4.3,
    reviews: 412,
    colors: ["Stainless Steel", "White", "Black"],
    storage: ["5.3 cu. ft. Oven", "6.2 cu. ft. Oven"],
    isNew: false,
    isSale: true,
    description: "Versatile electric range with convection oven and smooth cooktop surface.",
    features: [
      "5.3 cu. ft. oven capacity",
      "True European convection",
      "Smooth ceramic glass cooktop",
      "Self-cleaning oven",
      "Storage drawer",
      "Sabbath mode available",
    ],
    specifications: {
      "Oven Capacity": "5.3 cu. ft.",
      "Cooktop Type": "Smooth ceramic glass",
      Elements: "4 radiant elements",
      Convection: "True European convection",
      Dimensions: '29.875" W x 47" H x 28.25" D',
      "Self-Cleaning": "Yes",
      Warranty: "1 year limited",
      Features: "Storage drawer, Sabbath mode",
    },
  },
  {
    id: 11,
    name: "Frigidaire 18 cu. ft. Top Freezer Refrigerator",
    category: "Linea Blanca",
    price: 449,
    originalPrice: 899,
    images: ["/frigidaire-refrigerator.png"],
    rating: 4.2,
    reviews: 198,
    colors: ["White", "Stainless Steel", "Black"],
    storage: ["18 cu. ft.", "16 cu. ft.", "20 cu. ft."],
    isNew: false,
    isSale: true,
    description: "Reliable top freezer refrigerator with adjustable shelves and crisper drawers.",
    features: [
      "18 cu. ft. total capacity",
      "Adjustable glass shelves",
      "2 humidity-controlled crisper drawers",
      "Gallon door storage",
      "Reversible door",
      "ENERGY STAR qualified",
    ],
    specifications: {
      Capacity: "18 cu. ft.",
      Type: "Top Freezer",
      Shelves: "Adjustable glass shelves",
      "Crisper Drawers": "2 humidity-controlled",
      Dimensions: '30" W x 66.125" H x 32.125" D',
      "Energy Rating": "ENERGY STAR",
      Warranty: "1 year parts and labor",
      Features: "Reversible door, Gallon storage",
    },
  },
  {
    id: 12,
    name: "Maytag 7.4 cu. ft. Electric Dryer",
    category: "Linea Blanca",
    price: 499,
    originalPrice: 999,
    images: ["/maytag-dryer.jpg"],
    rating: 4.7,
    reviews: 445,
    colors: ["White", "Metallic Slate"],
    storage: ["7.4 cu. ft.", "6.7 cu. ft.", "8.8 cu. ft."],
    isNew: true,
    isSale: true,
    description: "Powerful electric dryer with advanced moisture sensing and wrinkle prevention.",
    features: [
      "7.4 cu. ft. capacity",
      "Advanced moisture sensing",
      "Wrinkle Prevent option",
      "10 drying cycles",
      "Sanitize cycle",
      "PowerDry system",
    ],
    specifications: {
      Capacity: "7.4 cu. ft.",
      Type: "Electric Dryer",
      "Drying Cycles": "10 cycles",
      "Moisture Sensing": "Advanced sensing",
      Dimensions: '27" W x 39" H x 30" D',
      "Lint Filter": "Easy-access lint filter",
      Warranty: "1 year limited",
      Features: "Wrinkle Prevent, Sanitize cycle",
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

          {/* Storage/Capacity Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {storageLabel}: {selectedStorage}
            </h3>
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
