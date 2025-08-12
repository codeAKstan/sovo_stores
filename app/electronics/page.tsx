import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function Electronics() {
  const categories = [
    {
      title: "Smartphones",
      description: "Latest iPhone models and accessories",
      image: "/iphone-15-pro-max-back.png",
      count: "25+ items",
      featured: [
        { name: "iPhone 15 Pro Max", price: "$1,199", originalPrice: "$1,299" },
        { name: "iPhone 15 Pro", price: "$999", originalPrice: "$1,099" },
        { name: "iPhone 15", price: "$699", originalPrice: "$799" }
      ]
    },
    {
      title: "Laptops",
      description: "MacBook Air and MacBook Pro series",
      image: "/macbook-pro-16-silver.png",
      count: "15+ items",
      featured: [
        { name: "MacBook Pro 16-inch", price: "$2,399", originalPrice: "$2,499" },
        { name: "MacBook Pro 14-inch", price: "$1,999", originalPrice: "$2,099" },
        { name: "MacBook Air 15-inch", price: "$1,299", originalPrice: "$1,399" }
      ]
    },
    {
      title: "Home Appliances",
      description: "Refrigerators, washers, and more",
      image: "/samsung-refrigerator.png",
      count: "30+ items",
      featured: [
        { name: "Samsung Refrigerator", price: "$1,899", originalPrice: "$2,199" },
        { name: "LG Washing Machine", price: "$899", originalPrice: "$999" },
        { name: "Whirlpool Dishwasher", price: "$749", originalPrice: "$899" }
      ]
    }
  ]

  const featuredDeals = [
    {
      name: "iPhone 15 Pro",
      price: "$999",
      originalPrice: "$1,099",
      image: "/iphone-15-pro-back.png",
      discount: "9% OFF",
      badge: "Best Seller"
    },
    {
      name: "MacBook Air 15-inch",
      price: "$1,299",
      originalPrice: "$1,399",
      image: "/macbook-air-15-midnight.png",
      discount: "7% OFF",
      badge: "New Release"
    },
    {
      name: "Samsung Refrigerator",
      price: "$1,899",
      originalPrice: "$2,199",
      image: "/samsung-refrigerato.png",
      discount: "14% OFF",
      badge: "Limited Time"
    },
    {
      name: "GE Electric Range",
      price: "$1,099",
      originalPrice: "$1,299",
      image: "/ge-electric-range.png",
      discount: "15% OFF",
      badge: "Hot Deal"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Added padding-top to account for fixed header */}
      <main className="container mx-auto px-4 py-8 pt-36">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Electronics</h1>
          <p className="text-xl text-gray-600 mb-8">Discover our wide range of premium electronics with unbeatable deals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Free Shipping</h3>
              <p className="text-sm text-blue-700">On orders over $99</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">30-Day Returns</h3>
              <p className="text-sm text-green-700">Hassle-free returns</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Expert Support</h3>
              <p className="text-sm text-purple-700">24/7 customer service</p>
            </div>
          </div>
        </div>

        {/* Featured Deals */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDeals.map((deal, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                <Badge className="absolute top-4 right-4 z-10" variant="destructive">
                  {deal.discount}
                </Badge>
                <Badge className="absolute top-4 left-4 z-10" variant="secondary">
                  {deal.badge}
                </Badge>
                <CardHeader className="pt-12">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <CardTitle className="text-lg">{deal.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-red-600">{deal.price}</span>
                      <span className="text-lg text-gray-500 line-through">{deal.originalPrice}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <Tabs defaultValue="Smartphones" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {categories.map((category) => (
                <TabsTrigger key={category.title} value={category.title}>
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.title} value={category.title}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                  {/* Category Overview */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="relative h-64 mb-4">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <CardTitle className="flex items-center justify-between text-2xl">
                        {category.title}
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {category.count}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" size="lg">
                        Browse All {category.title}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  {/* Featured Products */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Featured {category.title}</h3>
                    {category.featured.map((product, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-blue-600">{product.price}</span>
                                <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                                <Badge variant="destructive" className="text-xs">Sale</Badge>
                              </div>
                            </div>
                            <Button size="sm">Add to Cart</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Sovo Stores?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Free shipping on orders over $99</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">Warranty</h3>
                <p className="text-sm text-gray-600">Full manufacturer warranty on all products</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-sm text-gray-600">24/7 customer service and technical support</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Best Prices</h3>
                <p className="text-sm text-gray-600">Price matching guarantee</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <CartSidebar />
      <Footer />
    </div>
  )
}