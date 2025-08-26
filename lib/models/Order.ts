import mongoose from 'mongoose'

interface IOrderItem {
  id: string
  name: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  color: string
  storage: string
}

interface ICustomerInfo {
  name: string
  email: string
  address: string
  phone: string
  country: string
}

interface IOrder {
  orderNumber: string
  products: string
  status: string
  timestamp: Date
  total: string
  items: IOrderItem[]
  paymentMethod: string
  customerInfo: ICustomerInfo
  shippingMethod: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: false, default: '' },
  color: { type: String, required: false, default: '' },
  storage: { type: String, required: false, default: '' }
})

const CustomerInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: false, default: 'El Salvador' }
})

const OrderSchema = new mongoose.Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  products: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'being processed'
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  total: {
    type: String,
    required: true
  },
  items: {
    type: [OrderItemSchema],
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['bank', 'card']
  },
  customerInfo: {
    type: CustomerInfoSchema,
    required: true
  },
  shippingMethod: {
    type: String,
    required: true,
    enum: ['standard', 'express']
  }
}, {
  timestamps: true
})

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order
export type { IOrder, IOrderItem, ICustomerInfo }