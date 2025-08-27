// Make sure this model matches your database structure
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // This will include "Gaming"
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  description: { type: String },
  features: [{ type: String }],
  specifications: [{ type: String }], // or mongoose.Schema.Types.Mixed for flexible structure
  images: [{ type: String }],
  colors: [{ type: String }],
  storage: [{ type: String }], // For gaming, this could be storage capacity or game editions
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  quantityRemaining: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)