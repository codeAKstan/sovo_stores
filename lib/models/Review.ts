import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerImage: { type: String }, // URL to uploaded customer image
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true }, // Denormalized for easier display
  productImage: { type: String }, // URL to uploaded product image
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdBy: { type: String }, // Admin who created the review
}, {
  timestamps: true
})

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)