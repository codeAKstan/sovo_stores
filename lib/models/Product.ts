import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
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
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['iPhone', 'MacBook', 'Linea Blanca', 'Accessories'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Original price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  features: {
    type: [String],
    default: []
  },
  specifications: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  colors: {
    type: [String],
    default: []
  },
  storage: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5
  },
  reviews: {
    type: Number,
    min: [0, 'Reviews cannot be negative'],
    default: 0
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isSale: {
    type: Boolean,
    default: false
  },
  quantityRemaining: {
    type: Number,
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  sold: {
    type: Number,
    min: [0, 'Sold quantity cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true // Add this to suppress the isNew warning
})

// Add indexes for better query performance
ProductSchema.index({ category: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ createdAt: -1 })

// Prevent re-compilation during development
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product