"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Users, Package, Star, CreditCard, LogOut, ShoppingCart, DollarSign, Eye, FileText } from "lucide-react"

interface DashboardMetrics {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalReviews: number
  pendingOrders: number
  lowStock: number
  recentProducts: Array<{
    id: string
    name: string
    status: string
    price: number
    sold: number
  }>
  averageRating: number
  outOfStock: number
}

export default function AdminDashboard() {
  const { currentAdmin, isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/dashboard')
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.metrics)
        } else {
          setError('Failed to fetch dashboard metrics')
        }
      } catch (err) {
        setError('Error fetching dashboard data')
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchDashboardMetrics()
    }
  }, [isAuthenticated])

  if (!isAuthenticated || !currentAdmin) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load dashboard data'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
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
                <p className="text-xs text-muted-foreground">
                  {metrics.outOfStock > 0 && (
                    <span className="text-red-600">{metrics.outOfStock} out of stock</span>
                  )}
                  {metrics.outOfStock === 0 && "All products in stock"}
                </p>
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
                  {metrics.pendingOrders} products with sales
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
                  From {metrics.totalOrders} total sales
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
                <p className="text-xs text-muted-foreground">
                  Average rating: {metrics.averageRating.toFixed(1)}/5
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              onClick={() => router.push("/admin/orders")}
            >
              <FileText className="h-6 w-6" />
              <span>Customer Orders</span>
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
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products in your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentProducts.length > 0 ? (
                  metrics.recentProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price} • {product.sold} sold</p>
                      </div>
                      <Badge variant={product.status === 'In Stock' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No products found</p>
                )}
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
                {metrics.lowStock > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-red-600">Low Stock Alert</p>
                      <p className="text-sm text-gray-500">{metrics.lowStock} products are running low on inventory</p>
                    </div>
                  </div>
                )}
                {metrics.outOfStock > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-red-600">Out of Stock</p>
                      <p className="text-sm text-gray-500">{metrics.outOfStock} products are out of stock</p>
                    </div>
                  </div>
                )}
                {metrics.totalProducts > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-green-600">Store Status</p>
                      <p className="text-sm text-gray-500">{metrics.totalProducts} products available in store</p>
                    </div>
                  </div>
                )}
                {metrics.totalRevenue > 0 && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-blue-600">Revenue Update</p>
                      <p className="text-sm text-gray-500">Total revenue: ${metrics.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                )}
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
