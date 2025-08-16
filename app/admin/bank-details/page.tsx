"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, CreditCard, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

export default function BankDetailsPage() {
  const { currentAdmin, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    swiftCode: "",
    address: "",
    country: "",
  })
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }
    loadBankDetails()
  }, [isAuthenticated, router])

  const loadBankDetails = () => {
    const savedDetails = localStorage.getItem("bankDetails")
    if (savedDetails) {
      const details = JSON.parse(savedDetails)
      setBankDetails(details)
      setFormData(details)
    } else {
      setIsEditing(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const bankData = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: currentAdmin?.name,
      }

      localStorage.setItem("bankDetails", JSON.stringify(bankData))
      setBankDetails(bankData)
      setSuccess("Bank details saved successfully!")
      setIsEditing(false)
    } catch (err) {
      setError("An error occurred while saving bank details")
    } finally {
      setLoading(false)
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
              {bankDetails && !isEditing && <Button onClick={() => setIsEditing(true)}>Edit Details</Button>}
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

                {/* Bank Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                      placeholder="e.g., Banco Agrícola"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input
                      id="accountName"
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      required
                      placeholder="Account holder's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
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
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                      placeholder="Bank routing number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code (International)</Label>
                    <Input
                      id="swiftCode"
                      value={formData.swiftCode}
                      onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                      placeholder="SWIFT/BIC code"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Bank Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Bank's physical address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SV">El Salvador</SelectItem>
                        <SelectItem value="GT">Guatemala</SelectItem>
                        <SelectItem value="HN">Honduras</SelectItem>
                        <SelectItem value="CR">Costa Rica</SelectItem>
                        <SelectItem value="PA">Panama</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                      </SelectContent>
                    </Select>
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
                          <span className="text-gray-500">Account Holder:</span> {bankDetails.accountName}
                        </p>
                        <p>
                          <span className="text-gray-500">Account Number:</span>{" "}
                          {maskAccountNumber(bankDetails.accountNumber)}
                        </p>
                        <p>
                          <span className="text-gray-500">Account Type:</span> {bankDetails.accountType}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">Routing Number:</span> {bankDetails.routingNumber || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">SWIFT Code:</span> {bankDetails.swiftCode || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">Country:</span> {bankDetails.country || "N/A"}
                        </p>
                        <p>
                          <span className="text-gray-500">Last Updated:</span>{" "}
                          {new Date(bankDetails.updatedAt).toLocaleDateString()}
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
