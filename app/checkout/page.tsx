"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Truck, Shield, Check, Building2, Copy, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { X } from "lucide-react"

interface BankDetails {
  bankName: string
  accountHolderName: string
  accountNumber: string
  address: string
}

export default function CheckoutPage() {
  const { state } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isCardProcessing, setIsCardProcessing] = useState(false)
  const [showCardErrorModal, setShowCardErrorModal] = useState(false)
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)
  const [bankDetailsLoading, setBankDetailsLoading] = useState(false)
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

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = state.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = originalTotal - subtotal
  const shipping = formData.shippingMethod === "express" ? 5.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // Load bank details when component mounts
  useEffect(() => {
    loadBankDetails()
  }, [])

  const loadBankDetails = async () => {
    setBankDetailsLoading(true)
    try {
      const response = await fetch('/api/bank-details')
      if (response.ok) {
        const data = await response.json()
        setBankDetails(data.bankDetails)
      } else {
        console.error('Failed to load bank details')
      }
    } catch (error) {
      console.error('Error loading bank details:', error)
    } finally {
      setBankDetailsLoading(false)
    }
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    // Validate shipping form on step 1
    if (step === 1) {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address']
      const missingFields = requiredFields.filter(field => !formData[field].trim())
      
      if (missingFields.length > 0) {
        alert('Por favor llená todos los campos obligatorios, pues.')
        return
      }
    }
    
    // If moving from payment step and card is selected, simulate processing
    if (step === 3 && formData.paymentMethod === "card") {
      setIsCardProcessing(true)
      // Simulate 10 second loading then redirect to bank transfer
      setTimeout(() => {
        setIsCardProcessing(false)
        handleInputChange("paymentMethod", "bank")
        setShowCardErrorModal(true)
      }, 10000)
      return
    }
    
    if (step < 4) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePlaceOrder = () => {
    // Generate a random order number
    const orderNumber = `SO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // Get product names from cart items
    const productNames = state.items.map(item => item.name).join(', ')
    
    // Calculate total from cart
    const orderTotal = (subtotal + shipping + tax).toFixed(2)
    
    // Create order data
    const orderData = {
      orderNumber,
      products: productNames,
      status: 'being processed',
      timestamp: new Date().toISOString(),
      total: orderTotal,
      items: state.items,
      customerInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address
      }
    }
    
    // Store current order for immediate display
    localStorage.setItem('currentOrder', JSON.stringify(orderData))
    
    // Also store in order history
    const existingOrders = JSON.parse(localStorage.getItem('allOrders') || '[]')
    existingOrders.push(orderData)
    localStorage.setItem('allOrders', JSON.stringify(existingOrders))
    
    // Redirect to track orders page
    router.push('/track-orders')
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío, maje</h1>
          <p className="text-gray-600 mb-8">Agregá algunas cositas a tu carrito antes de pagar, pues.</p>
          <Link href="/">
            <Button>Seguir Comprando</Button>
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
            Seguir Comprando
          </Link>
          <h1 className="text-3xl font-bold">Pagar</h1>
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
            <span>Envío</span>
            <span>Facturación</span>
            <span>Pago</span>
            <span>Revisar</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Información de Envío"}
                  {step === 2 && "Información de Facturación"}
                  {step === 3 && "Información de Pago"}
                  {step === 4 && "Revisá tu Pedido"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre *</Label>
                        <Input
                          id="firstName"
                          placeholder="Tu nombre, pues"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido *</Label>
                        <Input
                          id="lastName"
                          placeholder="Tu apellido"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Correo *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@correo.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="7123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        placeholder="Tu dirección completa, maje"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    

                    {/* Shipping Method */}
                    <div>
                      <Label className="text-base font-medium">Método de Envío</Label>
                      <div className="mt-2 space-y-2">
                        {[
                          { id: "standard", name: "Envío Gratis", time: "2-3 días hábiles", price: 0 },
                          { id: "express", name: "Envío Express", time: "1-2 días hábiles", price: 5.99 },
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
                                <span className="font-medium">{method.price === 0 ? 'Gratis' : `$${method.price}`}</span>
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
                      <Label htmlFor="sameAsShipping">Igual que la dirección de envío</Label>
                    </div>

                    {!formData.sameAsShipping && (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billingFirstName">Nombre</Label>
                            <Input
                              id="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={(e) => handleInputChange("billingFirstName", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Apellido</Label>
                            <Input
                              id="billingLastName"
                              value={formData.billingLastName}
                              onChange={(e) => handleInputChange("billingLastName", e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="billingAddress">Dirección</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billingCity">Ciudad</Label>
                            <Input
                              id="billingCity"
                              value={formData.billingCity}
                              onChange={(e) => handleInputChange("billingCity", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingState">Departamento</Label>
                            <Input
                              id="billingState"
                              value={formData.billingState}
                              onChange={(e) => handleInputChange("billingState", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingZipCode">Código Postal</Label>
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

                {/* Step 3: Payment Information - Updated Bank Transfer Section */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <Label className="text-base font-medium">Método de Pago</Label>
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
                            <span className="font-medium">Transferencia Bancaria</span>
                            <p className="text-sm text-gray-600">Transferencia directa a cuenta bancaria</p>
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
                            <span className="font-medium">Pagar con Tarjeta</span>
                            <p className="text-sm text-gray-600">Tarjeta de Crédito o Débito</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Card Processing Loading */}
                    {isCardProcessing && (
                      <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="font-medium text-blue-900">Procesando pago con tarjeta...</p>
                        <p className="text-sm text-blue-700 mt-1">Esperá un toque mientras verificamos tu tarjeta, pues.</p>
                      </div>
                    )}

                    {/* Card Payment Form - Keep existing code */}
                    {formData.paymentMethod === "card" && !isCardProcessing && (
                      <div className="space-y-4">
                                   <div className="flex items-center space-x-2 mb-4">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Información de Tarjeta</span>
                        </div>

                        <div>
                          <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                          <Input
                            id="cardName"
                            placeholder="Como aparece en tu tarjeta"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardNumber">Número de Tarjeta</Label>
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
                            <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/AA"
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

                    {/* Bank Transfer Form - Updated to use backend data */}
                    {formData.paymentMethod === "bank" && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <Building2 className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">Información de Transferencia</span>
                        </div>

                        {bankDetailsLoading ? (
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-600" />
                            <p className="text-sm text-gray-600">Cargando datos del banco...</p>
                          </div>
                        ) : bankDetails ? (
                          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Nombre del Banco</Label>
                              <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                                <span className="text-gray-900 font-medium">{bankDetails.bankName}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(bankDetails.bankName, 'bankName')}
                                  className="h-8 px-2"
                                >
                                  {copiedField === 'bankName' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">Nombre del Titular</Label>
                              <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                                <span className="text-gray-900 font-medium">{bankDetails.accountHolderName}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(bankDetails.accountHolderName, 'accountHolder')}
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
                              <Label className="text-sm font-medium text-gray-700">Número de Cuenta</Label>
                              <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                                <span className="text-gray-900 font-medium">{bankDetails.accountNumber}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
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
                              <Label className="text-sm font-medium text-gray-700">Dirección del Banco</Label>
                              <div className="mt-1 flex items-center justify-between p-3 bg-white border rounded-md">
                                <span className="text-gray-900 font-medium">{bankDetails.address}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(bankDetails.address, 'bankAddress')}
                                  className="h-8 px-2"
                                >
                                  {copiedField === 'bankAddress' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-red-900">Datos del Banco No Disponibles</p>
                            <p className="text-sm text-red-700 mt-1">
                              La información del banco no está disponible ahorita. Contactanos o intentá más tarde, pues.
                            </p>
                          </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Instrucciones de Transferencia</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Transferí el monto total a la cuenta de arriba, maje. Poné tu número de orden en la referencia. Usá los botones de copiar para que sea más fácil.
                          </p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-sm font-medium text-yellow-900">Aviso de Transferencia</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Tu pedido se va a procesar cuando recibamos la transferencia. Puede tomar de 1 a 3 días hábiles, pues.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Pago Seguro</p>
                        <p className="text-sm text-blue-700">Tu información de pago está encriptada y segura, maje.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review Order - Updated to use backend data */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* ... existing shipping address code ... */}
                    <div>
                      <h3 className="font-medium mb-3">Dirección de Envío</h3>
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
                      <h3 className="font-medium mb-3">Método de Pago</h3>
                      <div className="text-sm text-gray-600">
                        {formData.paymentMethod === "card" ? (
                          <>
                            <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                            <p>{formData.cardName}</p>
                          </>
                        ) : (
                          <>
                            <p>Transferencia Bancaria</p>
                            {bankDetails && (
                              <>
                                <p>Banco: {bankDetails.bankName}</p>
                                <p>Cuenta: {bankDetails.accountNumber}</p>
                                <p>Titular: {bankDetails.accountHolderName}</p>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* ... existing order items code ... */}
                    <div>
                      <h3 className="font-medium mb-3">Artículos del Pedido</h3>
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
                    Anterior
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
                          Procesando...
                        </>
                      ) : (
                        "Siguiente"
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handlePlaceOrder} className="bg-green-600 hover:bg-green-700">
                      Hacer Pedido
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
                <CardTitle>Resumen del Pedido</CardTitle>
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
                    <span>Ahorros</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos</span>
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
                    <span>Devoluciones gratis hasta 30 días</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>100% garantía de devolución</span>
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
              <h3 className="text-xl font-semibold text-gray-900">Error con la Tarjeta</h3>
              <p className="text-gray-600">Ocurrió un error, maje.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCardErrorModal(false)
                  handleInputChange("paymentMethod", "bank")
                }}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}