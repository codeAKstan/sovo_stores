"use client"

import { useState, useEffect } from "react"
import { Star, User, MapPin, Calendar, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Review {
  _id: string
  customerName: string
  customerImage?: string
  rating: number
  comment: string
  location: string
  createdAt: string
}

interface ReviewsData {
  reviews: Review[]
  totalReviews: number
  averageRating: number
  ratingCounts: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/products/${productId}/reviews`)
        
        if (response.ok) {
          const data = await response.json()
          setReviewsData(data)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load reviews')
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setError('Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchReviews()
    }
  }, [productId])

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    }
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="mt-16 border-t pt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!reviewsData || reviewsData.totalReviews === 0) {
    return (
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">Be the first to review this product!</p>
        </div>
      </div>
    )
  }

  const displayedReviews = showAllReviews ? reviewsData.reviews : reviewsData.reviews.slice(0, 3)

  return (
    <div className="mt-16 border-t pt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
      
      {/* Individual Reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Feedback</h3>
        
        {displayedReviews.map((review) => (
          <Card key={review._id} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Customer Avatar */}
                <div className="flex-shrink-0">
                  {review.customerImage ? (
                    <Image
                      src={review.customerImage}
                      alt={review.customerName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {review.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{review.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  
                  {/* Review Actions */}
                  <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Show More/Less Button */}
        {reviewsData.reviews.length > 3 && (
          <div className="text-center pt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="px-8"
            >
              {showAllReviews 
                ? `Show Less Reviews` 
                : `Show All ${reviewsData.totalReviews} Reviews`
              }
            </Button>
          </div>
        )}
      </div>
      {/* Reviews Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Overall Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl font-bold text-gray-900">
                {reviewsData.averageRating}
              </div>
              <div>
                <div className="flex items-center mb-1">
                  {renderStars(reviewsData.averageRating, 'lg')}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {reviewsData.totalReviews} review{reviewsData.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">{stars}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Progress 
                    value={(reviewsData.ratingCounts[stars as keyof typeof reviewsData.ratingCounts] / reviewsData.totalReviews) * 100} 
                    className="flex-1 h-2" 
                  />
                  <span className="text-sm text-gray-600 w-8">
                    {reviewsData.ratingCounts[stars as keyof typeof reviewsData.ratingCounts]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>        
      </div>

    </div>
  )
}