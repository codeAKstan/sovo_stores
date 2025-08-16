"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Users, Package, Star, CreditCard, LogOut, ShoppingCart, DollarSign, Eye } from "lucide-react"

export default function AdminDashboard() {
  const { currentAdmin, isAuthenticated, logout } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !currentAdmin) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  // Mock data for dashboard metrics
  const metrics = {
    totalProducts: 15,
    totalOrders: 247,
    totalRevenue: 125430,
    totalReviews: 89,
    pendingOrders: 12,
    lowStock: 3,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Sovo Stores Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="text-gray-500">Welcome back,</p>
                <p className="font-medium text-gray-900">{currentAdmin.name}</p>
              </div>
              <Badge variant={currentAdmin.role === "super-admin" ? "default" : "secondary"}>{currentAdmin.role}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active products in store</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalReviews}</div>
                <p className="text-xs text-muted-foreground">Average rating: 4.8/5</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => router.push("/admin/admins")}
            >
              <Users className="h-6 w-6" />
              <span>Manage Admins</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => router.push("/admin/products")}
            >
              <Package className="h-6 w-6" />
              <span>Add Products</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => router.push("/admin/reviews")}
            >
              <Star className="h-6 w-6" />
              <span>Manage Reviews</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={() => router.push("/admin/bank-details")}
            >
              <CreditCard className="h-6 w-6" />
              <span>Bank Details</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">iPhone 15 Pro Max</p>
                    <p className="text-sm text-gray-500">Order #1234</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">MacBook Pro 16"</p>
                    <p className="text-sm text-gray-500">Order #1235</p>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Samsung Refrigerator</p>
                    <p className="text-sm text-gray-500">Order #1236</p>
                  </div>
                  <Badge variant="secondary">Processing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-600">Low Stock Alert</p>
                    <p className="text-sm text-gray-500">3 products are running low on inventory</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-yellow-600">Pending Reviews</p>
                    <p className="text-sm text-gray-500">5 customer reviews awaiting approval</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-600">Sales Target</p>
                    <p className="text-sm text-gray-500">Monthly target achieved: 108%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Store Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" onClick={() => router.push("/")} className="inline-flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            View Store Frontend
          </Button>
        </div>
      </div>
    </div>
  )
}
