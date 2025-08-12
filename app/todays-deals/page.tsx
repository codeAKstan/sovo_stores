import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

const todaysDeals = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 899,
    originalPrice: 1099,
    image: "/iphone-15-pro-back.png",
    category: "iPhone",
    discount: 18,
    timeLeft: "6h 23m",
    claimed: 67,
    totalDeals: 100,
    rating: 4.8,
    dealType: "Lightning Deal"
  },
  {
    id: 2,
    name: "MacBook Air 13-inch",
    price: 999,
    originalPrice: 1299,
    image: "/macbook.png",
    category: "MacBook",
    discount: 23,
    timeLeft: "4h 15m",
    claimed: 45,
    totalDeals: 75,
    rating: 4.6,
    dealType: "Daily Deal"
  },
  {
    id: 3,
    name: "AirPods Pro (2nd gen)",
    price: 199,
    originalPrice: 299,
    image: "/placeholder.jpg",
    category: "Audio",
    discount: 33,
    timeLeft: "2h 45m",
    claimed: 89,
    totalDeals: 150,
    rating: 4.8,
    dealType: "Flash Sale"
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    price: 329,
    originalPrice: 449,
    image: "/placeholder.jpg",
    category: "Wearables",
    discount: 27,
    timeLeft: "8h 12m",
    claimed: 23,
    totalDeals: 50,
    rating: 4.7,
    dealType: "Deal of the Day"
  },
  {
    id: 5,
    name: "iPad Air 11-inch",
    price: 499,
    originalPrice: 699,
    image: "/placeholder.jpg",
    category: "iPad",
    discount: 29,
    timeLeft: "12h 30m",
    claimed: 34,
    totalDeals: 80,
    rating: 4.5,
    dealType: "Limited Time"
  },
  {
    id: 6,
    name: "Magic Keyboard",
    price: 149,
    originalPrice: 199,
    image: "/placeholder.jpg",
    category: "Accessories",
    discount: 25,
    timeLeft: "5h 55m",
    claimed: 56,
    totalDeals: 100,
    rating: 4.4,
    dealType: "Lightning Deal"
  }
]

const dealTypes = ["All Deals", "Lightning Deal", "Daily Deal", "Flash Sale", "Deal of the Day", "Limited Time"]
const discountRanges = ["All", "10-20%", "20-30%", "30%+"]

export default function TodaysDeals() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16 pt-36">

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Today's Deals</h1>
          <p className="text-xl md:text-2xl mb-8">Limited time offers you don't want to miss</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            ⏰ Deals refresh daily at midnight
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Deal Type</h3>
            <div className="flex flex-wrap gap-2">
              {dealTypes.map((type) => (
                <Button
                  key={type}
                  variant={type === "All Deals" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Discount Range</h3>
            <div className="flex flex-wrap gap-2">
              {discountRanges.map((range) => (
                <Button
                  key={range}
                  variant={range === "All" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysDeals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-contain p-4"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    -{deal.discount}%
                  </Badge>
                  <Badge className="absolute top-2 left-2 bg-orange-500">
                    {deal.dealType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{deal.name}</CardTitle>
                <CardDescription className="mb-2">
                  ⭐ {deal.rating} rating • {deal.category}
                </CardDescription>
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-red-600">
                    ${deal.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ${deal.originalPrice}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    Save ${deal.originalPrice - deal.price}
                  </Badge>
                </div>

                {/* Time Left */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600 font-medium">⏰ {deal.timeLeft} left</span>
                    <span className="text-gray-600">{deal.claimed}/{deal.totalDeals} claimed</span>
                  </div>
                  <Progress 
                    value={(deal.claimed / deal.totalDeals) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-red-500 hover:bg-red-600">
                  Claim Deal
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Deal Alert */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Don't Miss Tomorrow's Deals!</h3>
          <p className="text-yellow-700 mb-4">Get notified when new deals go live</p>
          <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
            Set Deal Alerts
          </Button>
        </div>
      </div>

      <CartSidebar />
      <Footer />
    </div>
  )
}