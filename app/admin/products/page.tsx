"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Package, AlertCircle, CheckCircle, Upload, X } from "lucide-react"

export default function AddProductsPage() {
  const { currentAdmin, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    discountPercentage: "",
    originalPrice: "",
    description: "",
    features: "",
    specifications: "",
    colors: "",
    storage: "",
    rating: "5",
    reviews: "0",
    quantityRemaining: "10",
    sold: "0",
    isNew: true,
    isSale: true
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  // Calculate sale price based on discount percentage
  const calculateSalePrice = () => {
    if (!formData.originalPrice || !formData.discountPercentage) return 0
    const originalPrice = parseFloat(formData.originalPrice)
    const discount = parseFloat(formData.discountPercentage)
    return originalPrice * (1 - discount / 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files])
      
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setUploadingImages(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const filename = `products/${Date.now()}-${Math.random()}-${file.name}`
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
          method: 'POST',
          body: file,
        })
        
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        
        const { url } = await response.json()
        return url
      })
      
      return await Promise.all(uploadPromises)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (selectedFiles.length === 0) {
        setError("Please select at least one image file")
        setLoading(false)
        return
      }

      // Upload images first
      const imageUrls = await uploadImages(selectedFiles)

      // Calculate the sale price
      const salePrice = calculateSalePrice()

      // Create product data - IMPORTANT: Use 'images' not 'imageUrl'
      const productData = {
        name: formData.name,
        category: formData.category,
        price: salePrice,
        originalPrice: parseFloat(formData.originalPrice),
        description: formData.description,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        quantityRemaining: parseInt(formData.quantityRemaining),
        sold: parseInt(formData.sold),
        features: formData.features.split("\n").filter((f) => f.trim()),
        specifications: formData.specifications.split("\n").filter((s) => s.trim()),
        colors: formData.colors
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        storage: formData.storage
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        images: imageUrls, // Use 'images' array, not 'imageUrl'
        isNew: formData.isNew,
        isSale: formData.isSale
      }

      console.log('Sending product data:', productData) // Debug log

      // Save product to database
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }

      setSuccess("Product added successfully!")
      setFormData({
        name: "",
        category: "",
        discountPercentage: "",
        originalPrice: "",
        description: "",
        features: "",
        specifications: "",
        colors: "",
        storage: "",
        rating: "5",
        reviews: "0",
        quantityRemaining: "10",
        sold: "0",
        isNew: true,
        isSale: true
      })
      setSelectedFiles([])
      setImagePreviews([])
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the product")
    } finally {
      setLoading(false)
    }
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
              <Package className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Add Products</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
            <CardDescription>Add a new product to the Sovo Stores catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Multiple Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                  {uploadingImages && (
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </div>
                  )}
                </div>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Selected Images ({imagePreviews.length}):</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., iPhone 15 Pro Max"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iPhone">iPhone</SelectItem>
                      <SelectItem value="MacBook">MacBook</SelectItem>
                      <SelectItem value="Linea Blanca">Linea Blanca</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price ($)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    required
                    placeholder="1199.99"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage</Label>
                  <Select
                    value={formData.discountPercentage}
                    onValueChange={(value) => setFormData({ ...formData, discountPercentage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10% OFF</SelectItem>
                      <SelectItem value="20">20% OFF</SelectItem>
                      <SelectItem value="50">50% OFF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sale Price Display */}
              {formData.originalPrice && formData.discountPercentage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Calculated Sale Price</p>
                      <p className="text-2xl font-bold text-blue-800">
                        ${calculateSalePrice().toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Original: ${formData.originalPrice}</p>
                      <p className="text-sm text-green-600 font-medium">
                        You save: ${(parseFloat(formData.originalPrice) - calculateSalePrice()).toFixed(2)} ({formData.discountPercentage}% OFF)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={4}
                />
              </div>

              {/* Specifications */}
              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications (one per line)</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Display: 6.7-inch Super Retina XDR&#10;Processor: A17 Pro chip&#10;Storage: 128GB, 256GB, 512GB, 1TB"
                  rows={4}
                />
              </div>

              {/* Product Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="colors">Available Colors (comma-separated)</Label>
                  <Input
                    id="colors"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Natural Titanium, Blue Titanium, White Titanium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage Options (comma-separated)</Label>
                  <Input
                    id="storage"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    placeholder="128GB, 256GB, 512GB, 1TB"
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantityRemaining">Quantity</Label>
                  <Input
                    id="quantityRemaining"
                    type="number"
                    min="0"
                    value={formData.quantityRemaining}
                    onChange={(e) => setFormData({ ...formData, quantityRemaining: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sold">Sold Count</Label>
                  <Input
                    id="sold"
                    type="number"
                    min="0"
                    value={formData.sold}
                    onChange={(e) => setFormData({ ...formData, sold: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || uploadingImages || !formData.discountPercentage || selectedFiles.length === 0}>
                  {loading ? "Adding Product..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
