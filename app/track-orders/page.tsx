import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

export default function TrackOrders() {
  const orderStatuses = [
    { step: "Order Placed", completed: true, icon: CheckCircle },
    { step: "Processing", completed: true, icon: Package },
    { step: "Shipped", completed: true, icon: Truck },
    { step: "Delivered", completed: false, icon: CheckCircle }
  ]

  const sampleOrder = {
    orderNumber: "SO-2023-001234",
    status: "In Transit",
    estimatedDelivery: "December 15, 2023",
    trackingNumber: "1Z999AA1234567890",
    items: [
      { name: "iPhone 15 Pro", quantity: 1, price: "$999" },
      { name: "MagSafe Charger", quantity: 1, price: "$39" }
    ],
    total: "$1,038",
    shippingAddress: "123 Main St, Anytown, ST 12345"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Added padding-top to account for fixed header */}
      <main className="container mx-auto px-4 py-8 pt-36">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to track your shipment</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Track Order</CardTitle>
              <CardDescription>Enter your order information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Order Number</label>
                  <Input placeholder="SO-2023-XXXXXX" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <Input placeholder="your@email.com" type="email" />
                </div>
                <Button className="w-full">Track Order</Button>
              </form>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Can't find your order number? Check your email confirmation or contact support.
                </p>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order {sampleOrder.orderNumber}</CardTitle>
                    <CardDescription>Estimated delivery: {sampleOrder.estimatedDelivery}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    {sampleOrder.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Order Progress</h3>
                    <div className="space-y-4">
                      {orderStatuses.map((status, index) => {
                        const Icon = status.icon
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              status.completed 
                                ? "bg-green-100 text-green-600" 
                                : "bg-gray-100 text-gray-400"
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className={`font-medium ${
                              status.completed ? "text-green-600" : "text-gray-400"
                            }`}>
                              {status.step}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <Progress value={75} className="mt-4" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Tracking Number</h4>
                      <p className="text-sm text-gray-600 font-mono">{sampleOrder.trackingNumber}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">{sampleOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium">{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 font-bold">
                    <span>Total</span>
                    <span>{sampleOrder.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <CartSidebar />
      <Footer />
    </div>
  )
}