import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BankDetails from '@/lib/models/BankDetails'

// GET - Fetch bank details for public use (checkout page)
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Get the first available bank details (assuming there's only one set for the store)
    const bankDetails = await BankDetails.findOne().select('bankName accountHolderName accountNumber address')
    
    if (!bankDetails) {
      return NextResponse.json(
        { error: 'Bank details not configured' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { bankDetails },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Get public bank details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}