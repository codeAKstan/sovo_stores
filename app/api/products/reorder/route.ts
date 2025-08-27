import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// POST - Reorder products
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { updates } = await request.json()
    
    console.log('Received reorder request with updates:', updates)
    
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Invalid updates data' },
        { status: 400 }
      )
    }
    
    // Update sortOrder for each product
    const updatePromises = updates.map(async (update: { _id: string, sortOrder: number }) => {
      console.log(`Updating product ${update._id} with sortOrder ${update.sortOrder}`)
      const result = await Product.findByIdAndUpdate(
        update._id,
        { sortOrder: update.sortOrder },
        { new: true }
      )
      console.log(`Updated product:`, result?.name, 'sortOrder:', result?.sortOrder)
      return result
    })
    
    const results = await Promise.all(updatePromises)
    console.log('All products updated successfully:', results.length)
    
    return NextResponse.json(
      { success: true, message: 'Products reordered successfully' },
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error('Reorder products error:', error)
    return NextResponse.json(
      { error: 'Failed to reorder products' },
      { status: 500 }
    )
  }
}