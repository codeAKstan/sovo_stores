import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/lib/models/Review'
import Product from '@/lib/models/Product'
import { writeFile } from 'fs/promises'
import path from 'path'

// GET - Fetch all reviews
export async function GET() {
  try {
    await dbConnect()
    
    const reviews = await Review.find({})
      .populate('productId', 'name category images')
      .sort({ createdAt: -1 })
    
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST - Add new review
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const formData = await request.formData()
    const customerName = formData.get('customerName') as string
    const productId = formData.get('productId') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string
    const location = formData.get('location') as string
    const customerImageFile = formData.get('customerImage') as File
    
    // Validate required fields
    if (!customerName || !productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get product details
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    let customerImageUrl = ''
    
    // Handle customer image upload if provided
    if (customerImageFile && customerImageFile.size > 0) {
      const bytes = await customerImageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Generate unique filename
      const filename = `customer-${Date.now()}-${customerImageFile.name}`
      const filepath = path.join(process.cwd(), 'public', 'customer-images', filename)
      
      // Ensure directory exists
      const fs = require('fs')
      const dir = path.dirname(filepath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      await writeFile(filepath, buffer)
      customerImageUrl = `/customer-images/${filename}`
    }
    
    // Create review
    const review = new Review({
      customerName,
      customerImage: customerImageUrl,
      productId,
      productName: product.name,
      rating,
      comment,
      location,
      status: 'approved'
    })
    
    await review.save()
    
    // Populate product details for response
    await review.populate('productId', 'name category images')
    
    return NextResponse.json({ 
      message: 'Review added successfully',
      review 
    })
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
}