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
    
    let productsQuery = Product.find(query).sort({ createdAt: -1 })
    
    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit))
    }
    
    const products = await productsQuery
    
    return NextResponse.json(
      { products },
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