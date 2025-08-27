'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

interface WhatsAppWidgetProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppWidget({ 
  phoneNumber = '+50371362203', // Default phone number - replace with actual
  message = '¡Qué ondas! Me interesan sus productos, maje.'
}: WhatsAppWidgetProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          text here if you have any questions
        </span>
      </button>
    </div>
  )
}