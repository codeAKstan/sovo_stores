import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'

// POST - Submit customer order to admin
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const orderData = await request.json()
    
    // Create new order in database
    const newOrder = new Order({
      orderNumber: orderData.orderNumber,
      products: orderData.products,
      status: orderData.status || 'being processed',
      timestamp: new Date(orderData.timestamp),
      total: orderData.total,
      items: orderData.items,
      paymentMethod: orderData.paymentMethod,
      customerInfo: orderData.customerInfo,
      shippingMethod: orderData.shippingMethod
    })
    
    // Save order to database
    const savedOrder = await newOrder.save()
    
    console.log('New order saved to database:', {
      orderNumber: savedOrder.orderNumber,
      customer: {
        name: savedOrder.customerInfo.name,
        email: savedOrder.customerInfo.email,
        address: savedOrder.customerInfo.address,
        phone: savedOrder.customerInfo.phone
      },
      items: savedOrder.items.length,
      total: savedOrder.total,
      paymentMethod: savedOrder.paymentMethod,
      timestamp: savedOrder.timestamp
    })
    
    // TODO: In a production application, you would:
    // 1. Send email notification to admin
    // 2. Send confirmation email to customer
    // 3. Update inventory
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Pedido enviado exitosamente al administrador',
        orderNumber: savedOrder.orderNumber,
        orderId: savedOrder._id
      },
      { status: 201 }
    )
    
  } catch (error: any) {
    console.error('Submit order error:', error)
    return NextResponse.json(
      { error: 'Error al enviar el pedido' },
      { status: 500 }
    )
  }
}

// GET - Fetch orders for admin
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    
    let query = {}
    if (status && status !== 'all') {
      query = { status }
    }
    
    let ordersQuery = Order.find(query).sort({ createdAt: -1 })
    
    if (limit) {
      ordersQuery = ordersQuery.limit(parseInt(limit))
    }
    
    const orders = await ordersQuery
    
    return NextResponse.json(
      { orders },
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Error al obtener pedidos' },
      { status: 500 }
    )
  }
}