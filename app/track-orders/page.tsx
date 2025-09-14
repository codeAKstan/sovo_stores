"use client"

import { useState, useEffect } from "react"
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
  const [currentOrder, setCurrentOrder] = useState(null)
  const [showProcessingMessage, setShowProcessingMessage] = useState(false)
  const [trackingForm, setTrackingForm] = useState({ orderNumber: '', email: '' })
  
  const orderStatuses = [
    { step: "Order Placed", completed: true, icon: CheckCircle },
    { step: "Processing", completed: true, icon: Package },
    { step: "Shipped", completed: false, icon: Truck },
    { step: "Delivered", completed: false, icon: CheckCircle }
  ]

  useEffect(() => {
    // Check if there's a current order from checkout
    const orderData = localStorage.getItem('currentOrder')
    if (orderData) {
      const order = JSON.parse(orderData)
      setCurrentOrder(order)
      setShowProcessingMessage(true)
      // Don't clear immediately - let user see the order details
    }
  }, [])

  const handleTrackOrder = (e) => {
    e.preventDefault()
    // Here you would typically make an API call to fetch order details
    // For now, we'll check localStorage for demonstration
    const storedOrders = JSON.parse(localStorage.getItem('allOrders') || '[]')
    const foundOrder = storedOrders.find(order => 
      order.orderNumber === trackingForm.orderNumber
    )
    
    if (foundOrder) {
      setCurrentOrder(foundOrder)
      setShowProcessingMessage(false)
    } else {
      alert('Order not found. Please check your order number and email.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-36">
        {showProcessingMessage && currentOrder && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-green-800">Order Placed Successfully!</h2>
            </div>
            <p className="text-green-700 mb-2">
              Your order for <strong>{currentOrder.products}</strong> is being processed.
            </p>
            <p className="text-green-600 text-sm">
              Order Number: <strong>{currentOrder.orderNumber}</strong>
            </p>
          </div>
        )}
        
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
              <form onSubmit={handleTrackOrder} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Order Number</label>
                  <Input 
                    placeholder="RR123456789SV" 
                    value={trackingForm.orderNumber}
                    onChange={(e) => setTrackingForm(prev => ({...prev, orderNumber: e.target.value}))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <Input 
                    placeholder="your@email.com" 
                    type="email"
                    value={trackingForm.email}
                    onChange={(e) => setTrackingForm(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Track Order</Button>
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
          
          {currentOrder && (
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order {currentOrder.orderNumber}</CardTitle>
                      <CardDescription>
                        Placed on: {new Date(currentOrder.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      {currentOrder.status === 'being processed' ? 'Processing' : currentOrder.status}
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
                          const isCompleted = index <= 1 // Only first two steps completed for new orders
                          return (
                            <div key={index} className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                isCompleted 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-gray-100 text-gray-400"
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className={`font-medium ${
                                isCompleted ? "text-green-600" : "text-gray-400"
                              }`}>
                                {status.step}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <Progress value={25} className="mt-4" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Order Status</h4>
                        <p className="text-sm text-gray-600 capitalize">{currentOrder.status}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Estimated Delivery</h4>
                        <p className="text-sm text-gray-600">3-5 business days</p>
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
                    <div className="py-2 border-b">
                      <p className="font-medium">{currentOrder.products}</p>
                      <p className="text-sm text-gray-600">Status: Being processed</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 font-bold">
                      <span>Order Total</span>
                      <span>${currentOrder.total || 'Calculating...'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <CartSidebar />
      <Footer />
    </div>
  )
}