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
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Package, AlertCircle, CheckCircle, Upload, X, Edit, Trash2, Plus, Eye, Search, GripVertical } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  originalPrice: number
  description: string
  features: string[]
  specifications: string[]
  images: string[]
  colors: string[]
  storage: string[]
  rating: number
  reviews: number
  isNew: boolean
  isSale: boolean
  quantityRemaining: number
  sold: number
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export default function ProductsManagementPage() {
  const { currentAdmin, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  
  // Form data for adding/editing products
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
  // Fix: Add the missing setter function for imagePreviews
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [formLoading, setFormLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        setError('Failed to fetch products')
      }
    } catch (err) {
      setError('Error fetching products')
      console.error('Fetch products error:', err)
    } finally {
      setLoading(false)
    }
  }

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

  const resetForm = () => {
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
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      discountPercentage: String(Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)),
      originalPrice: String(product.originalPrice),
      description: product.description,
      features: product.features.join('\n'),
      specifications: product.specifications.join('\n'),
      colors: product.colors.join(', '),
      storage: product.storage.join(', '),
      rating: String(product.rating),
      reviews: String(product.reviews),
      quantityRemaining: String(product.quantityRemaining),
      sold: String(product.sold),
      isNew: product.isNew,
      isSale: product.isSale
    })
    setImagePreviews(product.images)
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setFormLoading(true)

    try {
      let imageUrls = imagePreviews
      
      // Upload new images if any
      if (selectedFiles.length > 0) {
        const newImageUrls = await uploadImages(selectedFiles)
        imageUrls = [...imagePreviews.filter(url => url.startsWith('http')), ...newImageUrls]
      }

      if (imageUrls.length === 0) {
        setError("Please select at least one image")
        setFormLoading(false)
        return
      }

      const salePrice = calculateSalePrice()
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
        colors: formData.colors.split(",").map((c) => c.trim()).filter((c) => c),
        storage: formData.storage.split(",").map((s) => s.trim()).filter((s) => s),
        images: imageUrls,
        isNew: formData.isNew,
        isSale: formData.isSale
      }

      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${editingProduct ? 'update' : 'create'} product`)
      }

      setSuccess(`Product ${editingProduct ? 'updated' : 'added'} successfully!`)
      resetForm()
      fetchProducts()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setSuccess('Product deleted successfully!')
        fetchProducts()
      } else {
        setError('Failed to delete product')
      }
    } catch (err) {
      setError('Error deleting product')
    }
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Sort by sortOrder if available, otherwise by creation date
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder
      }
      if (a.sortOrder !== undefined) return -1
      if (b.sortOrder !== undefined) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, productId: string) => {
    setDraggedItem(productId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, productId: string) => {
    e.preventDefault()
    setDragOverItem(productId)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = async (e: React.DragEvent, targetProductId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetProductId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    try {
      // Find the dragged and target products
      const draggedProduct = filteredProducts.find(p => p._id === draggedItem)
      const targetProduct = filteredProducts.find(p => p._id === targetProductId)
      
      if (!draggedProduct || !targetProduct) return

      // Create new order for products
      const updatedProducts = [...filteredProducts]
      const draggedIndex = updatedProducts.findIndex(p => p._id === draggedItem)
      const targetIndex = updatedProducts.findIndex(p => p._id === targetProductId)
      
      // Remove dragged item and insert at target position
      const [removed] = updatedProducts.splice(draggedIndex, 1)
      updatedProducts.splice(targetIndex, 0, removed)
      
      // Update sortOrder for all products
      const sortOrderUpdates = updatedProducts.map((product, index) => ({
        _id: product._id,
        sortOrder: index
      }))
      
      // Update products in state immediately for better UX
      setProducts(prevProducts => 
        prevProducts.map(product => {
          const update = sortOrderUpdates.find(u => u._id === product._id)
          return update ? { ...product, sortOrder: update.sortOrder } : product
        })
      )
      
      // Send update to backend
      const response = await fetch('/api/products/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates: sortOrderUpdates }),
      })
      
      if (response.ok) {
        // Refresh products from database to get updated sortOrder
        await fetchProducts()
      } else {
        console.error('Failed to update product order')
        // Refresh products on error to restore original state
        fetchProducts()
      }
      
    } catch (error) {
      console.error('Error reordering products:', error)
      // Refresh products on error
      fetchProducts()
    }
    
    setDraggedItem(null)
    setDragOverItem(null)
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
              <h1 className="text-xl font-semibold text-gray-900">Product Management</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="iPhone">iPhone</SelectItem>
              <SelectItem value="MacBook">MacBook</SelectItem>
              <SelectItem value="Linea Blanca">Linea Blanca</SelectItem>
              <SelectItem value="Apple Watch">Apple Watch</SelectItem>
              <SelectItem value="Gaming">Gaming</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowAddForm(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <CardDescription>
              Manage your store products. Drag and drop products using the grip handle to reorder them as they appear on your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Order</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sold</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow 
                        key={product._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, product._id)}
                        onDragOver={(e) => handleDragOver(e, product._id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, product._id)}
                        className={`
                          ${draggedItem === product._id ? 'opacity-50' : ''}
                          ${dragOverItem === product._id ? 'bg-blue-50 border-blue-200' : ''}
                          cursor-move hover:bg-gray-50 transition-colors
                        `}
                      >
                        <TableCell className="text-center">
                          <GripVertical className="h-4 w-4 text-gray-400 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.images[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">Rating: {product.rating}/5</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">${product.price}</p>
                            {product.price < product.originalPrice && (
                              <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.quantityRemaining > 5 ? "default" : product.quantityRemaining > 0 ? "secondary" : "destructive"}>
                            {product.quantityRemaining}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.isNew && <Badge variant="default">New</Badge>}
                            {product.isSale && <Badge variant="secondary">Sale</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog open={showAddForm} onOpenChange={(open) => {
          if (!open) resetForm()
          setShowAddForm(open)
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product information' : 'Add a new product to your store'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
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
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Images ({imagePreviews.length}):</p>
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
                      <SelectItem value="Apple Watch">Apple Watch</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
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

              {/* Features and Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="features">Features (one per line)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Feature 1\nFeature 2\nFeature 3"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">Specifications (one per line)</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    placeholder="Display: 6.7-inch\nProcessor: A17 Pro\nStorage: 128GB"
                    rows={4}
                  />
                </div>
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
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={formLoading || uploadingImages || !formData.discountPercentage || imagePreviews.length === 0}
                >
                  {formLoading ? (editingProduct ? "Updating..." : "Adding...") : (editingProduct ? "Update Product" : "Add Product")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Product Dialog */}
        <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {viewingProduct && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewingProduct.name}</DialogTitle>
                  <DialogDescription>Product Details</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Images */}
                  <div>
                    <h3 className="font-medium mb-2">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {viewingProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${viewingProduct.name} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Category:</span> {viewingProduct.category}</p>
                        <p><span className="font-medium">Price:</span> ${viewingProduct.price}</p>
                        <p><span className="font-medium">Original Price:</span> ${viewingProduct.originalPrice}</p>
                        <p><span className="font-medium">Rating:</span> {viewingProduct.rating}/5</p>
                        <p><span className="font-medium">Reviews:</span> {viewingProduct.reviews}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Inventory</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Stock:</span> {viewingProduct.quantityRemaining}</p>
                        <p><span className="font-medium">Sold:</span> {viewingProduct.sold}</p>
                        <p><span className="font-medium">New Product:</span> {viewingProduct.isNew ? 'Yes' : 'No'}</p>
                        <p><span className="font-medium">On Sale:</span> {viewingProduct.isSale ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{viewingProduct.description}</p>
                  </div>

                  {/* Features */}
                  {viewingProduct.features.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {viewingProduct.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  {viewingProduct.specifications.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Specifications</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {viewingProduct.specifications.map((spec, index) => (
                          <li key={index}>{spec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {viewingProduct.colors.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Available Colors</h3>
                        <div className="flex flex-wrap gap-2">
                          {viewingProduct.colors.map((color, index) => (
                            <Badge key={index} variant="outline">{color}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {viewingProduct.storage.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Storage Options</h3>
                        <div className="flex flex-wrap gap-2">
                          {viewingProduct.storage.map((storage, index) => (
                            <Badge key={index} variant="outline">{storage}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
