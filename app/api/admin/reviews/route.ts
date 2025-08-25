import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/lib/models/Review'
import Product from '@/lib/models/Product'
import { put } from '@vercel/blob'

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
    const productImageFile = formData.get('productImage') as File
    
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
    let productImageUrl = ''
    
    // Handle customer image upload to Vercel Blob if provided
    if (customerImageFile && customerImageFile.size > 0) {
      try {
        // Generate unique filename
        const filename = `customer-${Date.now()}-${customerImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        // Upload to Vercel Blob
        const blob = await put(filename, customerImageFile, {
          access: 'public',
          handleUploadUrl: '/api/upload', // Optional: custom upload handler
        })
        
        customerImageUrl = blob.url
      } catch (uploadError) {
        console.error('Error uploading customer image to Vercel Blob:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload customer image' },
          { status: 500 }
        )
      }
    }
    
    // Handle product image upload to Vercel Blob if provided
    if (productImageFile && productImageFile.size > 0) {
      try {
        // Generate unique filename
        const filename = `product-review-${Date.now()}-${productImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        // Upload to Vercel Blob
        const blob = await put(filename, productImageFile, {
          access: 'public',
          handleUploadUrl: '/api/upload', // Optional: custom upload handler
        })
        
        productImageUrl = blob.url
      } catch (uploadError) {
        console.error('Error uploading product image to Vercel Blob:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload product image' },
          { status: 500 }
        )
      }
    }
    
    // Create review
    const review = new Review({
      customerName,
      customerImage: customerImageUrl,
      productImage: productImageUrl,
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