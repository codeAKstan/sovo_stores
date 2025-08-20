"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Admin {
  id: string
  email: string
  name: string
  role: "super-admin" | "admin"
  createdAt: string
}

interface AdminContextType {
  currentAdmin: Admin | null
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (email: string, password: string, name: string) => Promise<boolean>
  checkAdminExists: () => Promise<boolean>
  addAdmin: (email: string, password: string, name: string, role: "super-admin" | "admin") => Promise<boolean>
  loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in on mount
    const savedToken = localStorage.getItem("adminToken")
    const savedAdmin = localStorage.getItem("currentAdmin")
    
    if (savedToken && savedAdmin) {
      try {
        setCurrentAdmin(JSON.parse(savedAdmin))
        setToken(savedToken)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved admin data:', error)
        localStorage.removeItem("adminToken")
        localStorage.removeItem("currentAdmin")
      }
    }
    setLoading(false)
  }, [])

  const checkAdminExists = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/check-exists')
      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error('Error checking admin exists:', error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setCurrentAdmin(data.admin)
        setToken(data.token)
        setIsAuthenticated(true)
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("currentAdmin", JSON.stringify(data.admin))
        return true
      } else {
        console.error('Login failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setCurrentAdmin(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem("adminToken")
    localStorage.removeItem("currentAdmin")
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setCurrentAdmin(data.admin)
        setToken(data.token)
        setIsAuthenticated(true)
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("currentAdmin", JSON.stringify(data.admin))
        return true
      } else {
        console.error('Signup failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const addAdmin = async (
    email: string,
    password: string,
    name: string,
    role: "super-admin" | "admin",
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await response.json()
      return response.ok
    } catch (error) {
      console.error('Add admin error:', error)
      return false
    }
  }

  return (
    <AdminContext.Provider
      value={{
        currentAdmin,
        isAuthenticated,
        token,
        login,
        logout,
        signup,
        checkAdminExists,
        addAdmin,
        loading,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
