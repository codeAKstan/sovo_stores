import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import BankDetails from '@/lib/models/BankDetails'
import Admin from '@/lib/models/Admin'

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Fetch bank details
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bankDetails = await BankDetails.findOne({ adminId: decoded.adminId })
    
    if (!bankDetails) {
      return NextResponse.json(
        { message: 'No bank details found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { bankDetails },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Get bank details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create bank details
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bankName, accountHolderName, accountNumber, address } = await request.json()

    // Validation
    if (!bankName || !accountHolderName || !accountNumber || !address) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if bank details already exist for this admin
    const existingDetails = await BankDetails.findOne({ adminId: decoded.adminId })
    if (existingDetails) {
      return NextResponse.json(
        { error: 'Bank details already exist. Use PUT to update.' },
        { status: 409 }
      )
    }

    // Create new bank details
    const bankDetails = new BankDetails({
      bankName,
      accountHolderName,
      accountNumber,
      address,
      adminId: decoded.adminId
    })

    await bankDetails.save()

    return NextResponse.json(
      { 
        message: 'Bank details created successfully',
        bankDetails
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Create bank details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update bank details
export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bankName, accountHolderName, accountNumber, address } = await request.json()

    // Validation
    if (!bankName || !accountHolderName || !accountNumber || !address) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Update bank details
    const bankDetails = await BankDetails.findOneAndUpdate(
      { adminId: decoded.adminId },
      {
        bankName,
        accountHolderName,
        accountNumber,
        address
      },
      { new: true, runValidators: true }
    )

    if (!bankDetails) {
      return NextResponse.json(
        { error: 'Bank details not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Bank details updated successfully',
        bankDetails
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Update bank details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete bank details
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bankDetails = await BankDetails.findOneAndDelete({ adminId: decoded.adminId })

    if (!bankDetails) {
      return NextResponse.json(
        { error: 'Bank details not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Bank details deleted successfully' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Delete bank details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}