import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function GET() {
  try {
    await connectDB()
    
    const adminCount = await Admin.countDocuments()
    
    return NextResponse.json(
      { exists: adminCount > 0 },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check admin exists error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}