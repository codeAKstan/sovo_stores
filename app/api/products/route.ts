import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    
    let query = {}
    if (category && category !== 'All') {
      query = { category }
    }
    
    let productsQuery = Product.find(query)
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit))
    }
    
    const products = await productsQuery
    
    // Initialize sortOrder for products that don't have it
    const productsWithSortOrder = await Promise.all(
      products.map(async (product, index) => {
        if (product.sortOrder === undefined || product.sortOrder === null) {
          // Assign sortOrder based on creation date (newest first gets lower sortOrder)
          const sortOrder = index
          await Product.findByIdAndUpdate(product._id, { sortOrder })
          return { ...product.toObject(), sortOrder }
        }
        return product.toObject()
      })
    )
    
    // Sort products by sortOrder within each category
    const sortedProducts = productsWithSortOrder.sort((a, b) => {
      // If same category, sort by sortOrder first
      if (a.category === b.category) {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder
        }
        if (a.sortOrder !== undefined) return -1
        if (b.sortOrder !== undefined) return 1
        // Fallback to creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      // Different categories, maintain original order
      return 0
    })
    
    return NextResponse.json(
       { products: sortedProducts },
       { status: 200 }
     )
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const productData = await request.json()
    
    // Validation
    if (!productData.name || !productData.category || !productData.price || !productData.originalPrice || !productData.images || productData.images.length === 0) {
      return NextResponse.json(
        { error: 'Name, category, price, original price, and at least one image are required' },
        { status: 400 }
      )
    }
    
    // Create product
    const product = new Product(productData)
    await product.save()
    
    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create product error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}