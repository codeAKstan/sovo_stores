"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Package, Eye, AlertCircle, CheckCircle, Clock, Truck } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  color: string
  storage: string
}

interface CustomerInfo {
  name: string
  email: string
  address: string
  phone: string
  country: string
}

interface Order {
  _id: string
  orderNumber: string
  products: string
  status: string
  timestamp: string
  total: string
  items: OrderItem[]
  paymentMethod: string
  customerInfo: CustomerInfo
  shippingMethod: string
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const { isAuthenticated, currentAdmin } = useAdmin()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }
    loadOrders()
  }, [isAuthenticated, router, statusFilter])

  const loadOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const url = statusFilter === "all" 
        ? "/api/orders" 
        : `/api/orders?status=${statusFilter}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders)
      } else {
        setError(data.error || "Error loading orders")
      }
    } catch (error) {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "being processed":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Processing</Badge>
      case "shipped":
        return <Badge variant="default"><Truck className="w-3 h-3 mr-1" />Shipped</Badge>
      case "delivered":
        return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Delivered</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentMethodText = (method: string) => {
    return method === "bank" ? "Bank Transfer" : "Card"
  }

  const getShippingMethodText = (method: string) => {
    return method === "standard" ? "Free Shipping" : "Express Shipping"
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Orders</h1>
              <p className="text-gray-600">Manage all received orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All orders</SelectItem>
                  <SelectItem value="being processed">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Orders List ({orders.length})
            </CardTitle>
            <CardDescription>
              All orders received from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No orders available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerInfo.name}</p>
                            <p className="text-sm text-gray-500">{order.customerInfo.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${order.total}</TableCell>
                        <TableCell>{getPaymentMethodText(order.paymentMethod)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString('en-US')}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order Details {order.orderNumber}</DialogTitle>
                                <DialogDescription>
                                  Complete customer order information
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Customer Information */}
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Customer Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                                        <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                                        <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                                        <p><strong>Country:</strong> {selectedOrder.customerInfo.country}</p>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Order Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        <p><strong>Number:</strong> {selectedOrder.orderNumber}</p>
                                        <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                        <p><strong>Total:</strong> ${selectedOrder.total}</p>
                                        <p><strong>Payment Method:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                                        <p><strong>Shipping Method:</strong> {getShippingMethodText(selectedOrder.shippingMethod)}</p>
                                        <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString('en-US')}</p>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  
                                  {/* Order Items */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Order Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-4">
                                        {selectedOrder.items.map((item, index) => (
                                          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <img
                                              src={item.image || "/placeholder.svg"}
                                              alt={item.name}
                                              className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                              <h4 className="font-medium">{item.name}</h4>
                                              <p className="text-sm text-gray-600">
                                                {item.color} • {item.storage} • Quantity: {item.quantity}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                              <p className="text-sm text-gray-500 line-through">
                                                ${(item.originalPrice * item.quantity).toFixed(2)}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}