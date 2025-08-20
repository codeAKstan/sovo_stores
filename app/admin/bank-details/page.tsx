"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle, Eye, EyeOff, Trash2 } from "lucide-react"

interface BankDetails {
  _id?: string
  bankName: string
  accountHolderName: string
  accountNumber: string
  address: string
  createdAt?: string
  updatedAt?: string
}

export default function BankDetailsPage() {
  const { currentAdmin, isAuthenticated, token } = useAdmin()
  const router = useRouter()
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)
  const [formData, setFormData] = useState<BankDetails>({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    address: ""
  })
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }
    if (token) {
      loadBankDetails()
    }
  }, [isAuthenticated, token, router])

  const loadBankDetails = async () => {
    if (!token) return
    
    try {
      const response = await fetch('/api/admin/bank-details', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBankDetails(data.bankDetails)
        setFormData(data.bankDetails)
      } else if (response.status === 404) {
        // No bank details found, show form
        setIsEditing(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to load bank details')
      }
    } catch (err) {
      setError('Failed to load bank details')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const method = bankDetails ? 'PUT' : 'POST'
      const response = await fetch('/api/admin/bank-details', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setBankDetails(data.bankDetails)
        setSuccess(bankDetails ? 'Bank details updated successfully!' : 'Bank details created successfully!')
        setIsEditing(false)
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred while saving bank details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!token) return
    if (!confirm('Are you sure you want to delete your bank details? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/admin/bank-details', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setBankDetails(null)
        setFormData({
          bankName: "",
          accountHolderName: "",
          accountNumber: "",
          address: ""
        })
        setSuccess('Bank details deleted successfully!')
        setIsEditing(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete bank details')
      }
    } catch (err) {
      setError('An error occurred while deleting bank details')
    } finally {
      setIsDeleting(false)
    }
  }

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return ""
    return accountNumber.replace(/\d(?=\d{4})/g, "*")
  }

  if (!isAuthenticated || !currentAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Bank Details</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
          <p className="text-gray-600">Manage bank account details for receiving payments</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Bank Account Information</CardTitle>
                <CardDescription>
                  {bankDetails ? "Current bank details on file" : "Add your bank account information"}
                </CardDescription>
              </div>
              {bankDetails && !isEditing && (
                <div className="flex space-x-2">
                  <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                      placeholder="e.g., Banco Agrícola"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                      required
                      placeholder="Account holder's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <div className="relative">
                      <Input
                        id="accountNumber"
                        type={showAccountNumber ? "text" : "password"}
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        required
                        placeholder="Account number"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowAccountNumber(!showAccountNumber)}
                      >
                        {showAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Bank Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Bank's physical address"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {bankDetails && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData(bankDetails)
                        setError("")
                        setSuccess("")
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Bank Details"}
                  </Button>
                </div>
              </form>
            ) : (
              bankDetails && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Bank Information</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Bank Name:</span> {bankDetails.bankName}
                        </p>
                        <p>
                          <span className="text-gray-500">Account Holder:</span> {bankDetails.accountHolderName}
                        </p>
                        <p>
                          <span className="text-gray-500">Account Number:</span>{" "}
                          {maskAccountNumber(bankDetails.accountNumber)}
                        </p>
                        <p>
                          <span className="text-gray-500">Address:</span> {bankDetails.address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Created:</span>{" "}
                          {bankDetails.createdAt ? new Date(bankDetails.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">Last Updated:</span>{" "}
                          {bankDetails.updatedAt ? new Date(bankDetails.updatedAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
