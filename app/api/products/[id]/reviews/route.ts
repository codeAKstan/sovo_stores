import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/lib/models/Review'

// GET reviews for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = await params
    
    // Fetch reviews for the specific product
    const reviews = await Review.find({ productId: id })
      .populate('productId', 'name category images')
      .sort({ createdAt: -1 })
    
    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0
    
    // Count ratings by star level
    const ratingCounts = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
    
    return NextResponse.json({ 
      reviews,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCounts
    })
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}