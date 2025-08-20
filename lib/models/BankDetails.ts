import mongoose, { Document, Schema } from 'mongoose'

export interface IBankDetails extends Document {
  bankName: string
  accountHolderName: string
  accountNumber: string
  address: string
  adminId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BankDetailsSchema = new Schema<IBankDetails>({
  bankName: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
    maxlength: [100, 'Bank name cannot exceed 100 characters']
  },
  accountHolderName: {
    type: String,
    required: [true, 'Account holder name is required'],
    trim: true,
    maxlength: [100, 'Account holder name cannot exceed 100 characters']
  },
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    trim: true,
    maxlength: [50, 'Account number cannot exceed 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
})

// Prevent re-compilation during development
const BankDetails = mongoose.models.BankDetails || mongoose.model<IBankDetails>('BankDetails', BankDetailsSchema)

export default BankDetails