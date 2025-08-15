"use client"

import { useState } from "react"
// Remove this line: const [showCardErrorModal, setShowCardErrorModal] = useState(false);
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck, Shield, Check, Building2, Copy, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { X } from "lucide-react";

export default function CheckoutPage() {
  const { state } = useCart()
  const [step, setStep] = useState(1)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isCardProcessing, setIsCardProcessing] = useState(false)
  const [showCardErrorModal, setShowCardErrorModal] = useState(false); // Move this line here
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Billing Information
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
    sameAsShipping: true,

    // Payment Information
    paymentMethod: "bank", // Changed default to bank transfer
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Shipping Method
    shippingMethod: "standard",
  })

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = state.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = originalTotal - subtotal
  const shipping =
    formData.shippingMethod === "express" ? 5.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    // If moving from payment step and card is selected, simulate processing
    if (step === 3 && formData.paymentMethod === "card") {
      setIsCardProcessing(true)
      // Simulate 10 second loading then redirect to bank transfer
      setTimeout(() => {
        setIsCardProcessing(false)
        handleInputChange("paymentMethod", "bank")
        setShowCardErrorModal(true);
      }, 10000)
      return
    }
    
    if (step < 4) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePlaceOrder = () => {
    // Here you would integrate with payment processing
    alert("Order placed successfully! (This is a demo)")
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-0.5 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Shipping</span>
            <span>Billing</span>
            <span>Payment</span>
            <span>Review</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Shipping Information"}
                  {step === 2 && "Billing Information"}
                  {step === 3 && "Payment Information"}
                  {step === 4 && "Review Your Order"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    

                    {/* Shipping Method */}
                    <div>
                      <Label className="text-base font-medium">Shipping Method</Label>
                      <div className="mt-2 space-y-2">
                        {[
                          { id: "standard", name: "Free Shipping", time: "2-3 business days", price: 0 },
                          { id: "express", name: "Express Shipping", time: "1-2 business days", price: 5.99 },
                        ].map((method) => (
                          <label
                            key={method.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={method.id}
                              checked={formData.shippingMethod === method.id}
                              onChange={(e) => handleInputChange("shippingMethod", e.target.value)}
                              className="text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">{method.name}</span>
                                <span className="font-medium">{method.price === 0 ? 'Free' : `$${method.price}`}</span>
                              </div>
                              <span className="text-sm text-gray-600">{method.time}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Billing Information */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sameAsShipping"
                        checked={formData.sameAsShipping}
                        onChange={(e) => handleInputChange("sameAsShipping", e.target.checked.toString())}
                        className="rounded"
                      />
                      <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                    </div>

                    {!formData.sameAsShipping && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingFirstName">First Name</Label>
                            <Input
                              id="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={(e) => handleInputChange("billingFirstName", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Last Name</Label>
                            <Input
                              id="billingLastName"
                              value={formData.billingLastName}
                              onChange={(e) => handleInputChange("billingLastName", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="billingAddress">Address</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billingCity">City</Label>
                            <Input
                              id="billingCity"
                              value={formData.billingCity}
                              onChange={(e) => handleInputChange("billingCity", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingState">State</Label>
                            <Input
                              id="billingState"
                              value={formData.billingState}
                              onChange={(e) => handleInputChange("billingState", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingZipCode">ZIP Code</Label>
                            <Input
                              id="billingZipCode"
                              value={formData.billingZipCode}
                              onChange={(e) => handleInputChange("billingZipCode", e.target.value)}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Payment Information */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <Label className="text-base font-medium">Payment Method</Label>
                      <div className="mt-3 space-y-3">
                        <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank"
                            checked={formData.paymentMethod === "bank"}
                            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                            className="text-blue-600"
                          />
                          <Building2 className="w-5 h-5 text-gray-600" />
                          <div>
                            <span className="font-medium">Bank Transfer</span>
                            <p className="text-sm text-gray-600">Direct bank account transfer</p>
                          </div>
                        </label>
                        
                        <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                            className="text-blue-600"
                            disabled={isCardProcessing}
                          />
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <div>
                            <span className="font-medium">Pay with Card</span>
                            <p className="text-sm text-gray-600">Credit or Debit Card</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Card Processing Loading */}
                    {isCardProcessing && (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="font-medium text-blue-900">Processing card payment...</p>
                        <p className="text-sm text-blue-700 mt-1">Please wait while we verify your payment details.</p>
                      </div>
                    )}

                    {/* Card Payment Form */}
                    {formData.paymentMethod === "card" && !isCardProcessing && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Credit Card Information</span>
                        </div>

                        <div>
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer Form */}
                    {formData.paymentMethod === "bank" && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <Building2 className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Bank Transfer Information</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Account Holder Name</Label>
                            <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                              <span className="text-gray-900 font-medium">Sovo Stores</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('Sovo Stores', 'accountHolder')}
                                className="h-8 px-2"
                              >
                                {copiedField === 'accountHolder' ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Account Number</Label>
                            <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                              <span className="text-gray-900 font-medium">120120120</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('120120120', 'accountNumber')}
                                className="h-8 px-2"
                              >
                                {copiedField === 'accountNumber' ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Routing Number</Label>
                            <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                              <span className="text-gray-900 font-medium">123456</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('123456', 'routingNumber')}
                                className="h-8 px-2"
                              >
                                {copiedField === 'routingNumber' ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Transfer Instructions</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Please transfer the total amount to the account details shown above. Include your order number in the transfer reference. Use the copy buttons to easily copy the account details.
                          </p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-yellow-900">Bank Transfer Notice</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your order will be processed after we receive the bank transfer. This may take 1-3 business days.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                        <p className="text-sm text-blue-700">Your payment information is encrypted and secure.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review Order */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.address}</p>
                        <p>
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        {formData.paymentMethod === "card" ? (
                          <>
                            <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                            <p>{formData.cardName}</p>
                          </>
                        ) : (
                          <>
                            <p>Bank Transfer</p>
                            <p>Account: 120120120</p>
                            <p>Routing: 123456</p>
                            <p>Sovo Stores</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {state.items.map((item) => (
                          <div
                            key={`${item.id}-${item.color}-${item.storage}`}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.color} • {item.storage} • Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-sm text-gray-500 line-through">
                                ${(item.originalPrice * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePrevStep} disabled={step === 1}>
                    Previous
                  </Button>

                  {step < 4 ? (
                    <Button 
                      onClick={handleNextStep} 
                      disabled={isCardProcessing}
                      className={isCardProcessing ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {isCardProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Next"
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handlePlaceOrder} className="bg-green-600 hover:bg-green-700">
                      Place Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.storage}`} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>100% Money back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      {/* Card Error Modal */}
{showCardErrorModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
      <button
        onClick={() => setShowCardErrorModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
          <X className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Card Error</h3>
        <p className="text-gray-600">An error occured.</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setShowCardErrorModal(false);
            handleInputChange("paymentMethod", "bank");
          }}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}


const copyToClipboard = async (text: string, fieldName: string) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000) // Reset after 2 seconds
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}