import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/lib/models/Review'
import Product from '@/lib/models/Product'
import { put } from '@vercel/blob'
import { ObjectId } from 'mongodb'

// GET single review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid review ID format' },
        { status: 400 }
      )
    }
    
    const review = await Review.findById(id).populate('productId', 'name category images')
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ review })
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// PUT update review by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid review ID format' },
        { status: 400 }
      )
    }
    
    const formData = await request.formData()
    const customerName = formData.get('customerName') as string
    const productId = formData.get('productId') as string
    const rating = parseInt(formData.get('rating') as string)
    const comment = formData.get('comment') as string
    const location = formData.get('location') as string
    const customerImageFile = formData.get('customerImage') as File
    const keepExistingImage = formData.get('keepExistingImage') === 'true'
    
    // Validate required fields
    if (!customerName || !productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get existing review
    const existingReview = await Review.findById(id)
    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
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
    
    let customerImageUrl = existingReview.customerImage || ''
    
    // Handle customer image upload if new image provided
    if (customerImageFile && customerImageFile.size > 0 && !keepExistingImage) {
      try {
        // Generate unique filename
        const filename = `customer-${Date.now()}-${customerImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        // Upload to Vercel Blob
        const blob = await put(filename, customerImageFile, {
          access: 'public',
        })
        
        customerImageUrl = blob.url
      } catch (uploadError) {
        console.error('Error uploading image to Vercel Blob:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload customer image' },
          { status: 500 }
        )
      }
    }
    
    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        customerName,
        customerImage: customerImageUrl,
        productId,
        productName: product.name,
        rating,
        comment,
        location,
      },
      { new: true, runValidators: true }
    ).populate('productId', 'name category images')
    
    return NextResponse.json({ 
      message: 'Review updated successfully',
      review: updatedReview 
    })
  } catch (error: any) {
    console.error('Error updating review:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE review by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid review ID format' },
        { status: 400 }
      )
    }
    
    const deletedReview = await Review.findByIdAndDelete(id)
    
    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      message: 'Review deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}