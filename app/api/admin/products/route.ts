import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Get only essential fields for dropdown
    const products = await Product.find({}, {
      _id: 1,
      name: 1,
      category: 1,
      images: { $slice: 1 } // Get only first image
    }).sort({ name: 1 })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}