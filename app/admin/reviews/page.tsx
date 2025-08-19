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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Star, AlertCircle, CheckCircle, Upload, X, ImageIcon, Edit, Trash2 } from "lucide-react"
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
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    rating: "5",
    comment: "",
    location: "",
  })
  const [customerImageFile, setCustomerImageFile] = useState<File | null>(null)
  const [customerImagePreview, setCustomerImagePreview] = useState<string>('')
  const [keepExistingImage, setKeepExistingImage] = useState(true)
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

  const resetForm = () => {
    setFormData({
      customerName: "",
      productId: "",
      rating: "5",
      comment: "",
      location: "",
    })
    setCustomerImageFile(null)
    setCustomerImagePreview('')
    setKeepExistingImage(true)
    setEditingReview(null)
    setShowAddForm(false)
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setFormData({
      customerName: review.customerName,
      productId: review.productId._id,
      rating: String(review.rating),
      comment: review.comment,
      location: review.location,
    })
    setCustomerImagePreview(review.customerImage || '')
    setKeepExistingImage(true)
    setShowAddForm(true)
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setSuccess('Review deleted successfully!')
        loadReviews()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete review')
      }
    } catch (err) {
      setError('Error deleting review')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCustomerImageFile(file)
      setKeepExistingImage(false)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomerImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
      }
      
      if (editingReview) {
        submitFormData.append('keepExistingImage', String(keepExistingImage))
      }

      const url = editingReview 
        ? `/api/admin/reviews/${editingReview._id}` 
        : '/api/admin/reviews'
      const method = editingReview ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        body: submitFormData,
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(data.message)
        resetForm()
        loadReviews()
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Failed to ${editingReview ? 'update' : 'add'} review`)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setFormLoading(false)
      setIsUploading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
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
              <Star className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-semibold text-gray-900">Manage Reviews</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Add Review Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Review
          </Button>
        </div>

        {/* Add/Edit Review Form */}
        <Dialog open={showAddForm} onOpenChange={(open) => {
          if (!open) resetForm()
          setShowAddForm(open)
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
              <DialogDescription>
                {editingReview ? 'Update the review information' : 'Add a new customer review with optional image'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="customerImage">Customer Image (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="customerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {isUploading && (
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                  )}
                </div>
                
                {/* Image Preview */}
                {customerImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="relative inline-block">
                      <Image
                        src={customerImagePreview}
                        alt="Customer preview"
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-gray-200"
                      />
                      {editingReview && keepExistingImage && (
                        <Badge className="absolute -top-2 -right-2" variant="secondary">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                    placeholder="e.g., Carlos Hernández"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g., San Salvador, El Salvador"
                  />
                </div>
              </div>

              {/* Product and Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                width={20}
                                height={20}
                                className="rounded"
                              />
                            )}
                            <span>{product.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => setFormData({ ...formData, rating: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4">4 Stars - Very Good</SelectItem>
                      <SelectItem value="3">3 Stars - Good</SelectItem>
                      <SelectItem value="2">2 Stars - Fair</SelectItem>
                      <SelectItem value="1">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment">Review Comment</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                  placeholder="Write the customer's review..."
                  rows={4}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading || isUploading}>
                  {formLoading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      {editingReview ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingReview ? 'Update Review' : 'Add Review'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Existing Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>All Reviews ({reviews.length})</CardTitle>
            <CardDescription>Manage customer reviews with edit and delete options</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reviews...</p>
              </div>
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
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(review)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(review._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
