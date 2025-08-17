"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Star, AlertCircle, CheckCircle, Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  category: string
  images: string[]
}

interface Review {
  _id: string
  customerName: string
  customerImage?: string
  productId: {
    _id: string
    name: string
    category: string
    images: string[]
  }
  productName: string
  rating: number
  comment: string
  location: string
  status: string
  createdAt: string
}

export default function ManageReviewsPage() {
  const { currentAdmin, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    rating: "5",
    comment: "",
    location: "",
  })
  const [customerImageFile, setCustomerImageFile] = useState<File | null>(null)
  const [customerImagePreview, setCustomerImagePreview] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }
    loadReviews()
    loadProducts()
  }, [isAuthenticated, router])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
      } else {
        setError('Failed to load reviews')
      }
    } catch (err) {
      setError('Error loading reviews')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      setError('Error loading products')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      setCustomerImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomerImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError('') // Clear any previous errors
    }
  }

  const removeImage = () => {
    setCustomerImageFile(null)
    setCustomerImagePreview('')
    setUploadProgress(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setFormLoading(true)
    setIsUploading(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append('customerName', formData.customerName)
      submitFormData.append('productId', formData.productId)
      submitFormData.append('rating', formData.rating)
      submitFormData.append('comment', formData.comment)
      submitFormData.append('location', formData.location)
      
      if (customerImageFile) {
        submitFormData.append('customerImage', customerImageFile)
        setUploadProgress(50) // Simulate progress
      }

      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        body: submitFormData,
      })

      if (customerImageFile) {
        setUploadProgress(100)
      }

      if (response.ok) {
        setSuccess("Review added successfully!")
        setFormData({
          customerName: "",
          productId: "",
          rating: "5",
          comment: "",
          location: "",
        })
        removeImage()
        setShowAddForm(false)
        loadReviews()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to add review')
      }
    } catch (err) {
      setError("An error occurred while adding the review")
    } finally {
      setFormLoading(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (!isAuthenticated || !currentAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Star className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Reviews</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Review Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </div>

          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Customer Review</CardTitle>
                <CardDescription>Add a new customer review with Vercel Blob image storage</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        required
                        placeholder="Customer's full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productId">Product</Label>
                      <Select
                        value={formData.productId}
                        onValueChange={(value) => setFormData({ ...formData, productId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product._id} value={product._id}>
                              <div className="flex items-center space-x-2">
                                {product.images[0] && (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={24}
                                    height={24}
                                    className="rounded"
                                  />
                                )}
                                <span>{product.name}</span>
                                <Badge variant="outline" className="text-xs">{product.category}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Customer's location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Select
                        value={formData.rating}
                        onValueChange={(value) => setFormData({ ...formData, rating: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced Customer Image Upload with Vercel Blob */}
                  <div className="space-y-2">
                    <Label htmlFor="customerImage">Customer Image (Optional)</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Input
                            id="customerImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Supported formats: JPG, PNG, GIF. Max size: 5MB. Stored securely with Vercel Blob.
                          </p>
                        </div>
                        {customerImagePreview && (
                          <div className="relative">
                            <Image
                              src={customerImagePreview}
                              alt="Customer preview"
                              width={80}
                              height={80}
                              className="rounded-lg object-cover border-2 border-gray-200"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeImage}
                              disabled={isUploading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Upload Progress */}
                      {isUploading && uploadProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Upload className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Uploading to Vercel Blob...</span>
                          </div>
                          <Progress value={uploadProgress} className="w-full" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Review Comment</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      required
                      placeholder="Customer's review comment..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                      disabled={formLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={formLoading || isUploading}>
                      {formLoading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          {isUploading ? 'Uploading...' : 'Adding...'}
                        </>
                      ) : (
                        'Add Review'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Existing Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>All Reviews</CardTitle>
            <CardDescription>Customer reviews stored with Vercel Blob images</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading reviews...</p>
            ) : (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews added yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
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
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                            <p className="text-sm text-gray-500">{review.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {review.productId?.images?.[0] && (
                                <Image
                                  src={review.productId.images[0]}
                                  alt={review.productName}
                                  width={20}
                                  height={20}
                                  className="rounded"
                                />
                              )}
                              <p className="text-sm text-blue-600">{review.productName}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <Badge variant="outline">Approved</Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-400">Added: {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
