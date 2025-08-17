import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET dashboard metrics
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get all products for calculations
    const products = await Product.find({})
    
    // Calculate metrics from real data
    const totalProducts = products.length
    
    // Calculate total revenue from sold products
    const totalRevenue = products.reduce((sum, product) => {
      return sum + (product.sold * product.price)
    }, 0)
    
    // Calculate total orders (sum of all sold quantities)
    const totalOrders = products.reduce((sum, product) => {
      return sum + product.sold
    }, 0)
    
    // Calculate total reviews
    const totalReviews = products.reduce((sum, product) => {
      return sum + product.reviews
    }, 0)
    
    // Calculate low stock items (products with quantityRemaining < 5)
    const lowStock = products.filter(product => product.quantityRemaining < 5).length
    
    // Get recent products (last 5 created) to simulate recent orders
    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(product => ({
        id: product._id,
        name: product.name,
        status: product.quantityRemaining > 0 ? 'In Stock' : 'Out of Stock',
        price: product.price,
        sold: product.sold
      }))
    
    // Calculate pending orders (products with recent activity)
    const pendingOrders = products.filter(product => 
      product.quantityRemaining > 0 && product.sold > 0
    ).length
    
    const metrics = {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalReviews,
      pendingOrders,
      lowStock,
      recentProducts,
      // Additional calculated metrics
      averageRating: totalReviews > 0 ? 
        products.reduce((sum, product) => sum + product.rating, 0) / products.length : 0,
      outOfStock: products.filter(product => product.quantityRemaining === 0).length
    }
    
    return NextResponse.json(
      { metrics },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get dashboard metrics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}