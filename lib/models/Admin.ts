import mongoose, { Document, Schema } from 'mongoose'

export interface IAdmin extends Document {
  email: string
  password: string
  name: string
  role: 'super-admin' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const AdminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin'],
    default: 'admin'
  }
}, {
  timestamps: true
})

// Prevent re-compilation during development
const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin