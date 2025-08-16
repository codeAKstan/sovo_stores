import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email })
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      )
    }

    // Check if this is the first admin (make them super-admin)
    const adminCount = await Admin.countDocuments()
    const role = adminCount === 0 ? 'super-admin' : 'admin'

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create admin
    const admin = new Admin({
      email,
      password: hashedPassword,
      name,
      role
    })

    await admin.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Return admin data without password
    const adminData = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt
    }

    return NextResponse.json(
      { 
        message: 'Admin created successfully',
        admin: adminData,
        token
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}