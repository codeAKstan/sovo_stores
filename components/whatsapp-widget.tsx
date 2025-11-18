'use client'

import React from 'react'
import Image from 'next/image'

interface WhatsAppWidgetProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppWidget({ 
  phoneNumber = '+1 (812) 802-3467', // Default phone number - replace with actual
  message = ''
}: WhatsAppWidgetProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">   
      <button
        onClick={handleWhatsAppClick}
        className=" text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        <Image 
          src="/wa.png" 
          alt="WhatsApp" 
          width={64} 
          height={64} 
          className="w-12 h-12"
        />
        {/* Desktop tooltip - hidden on mobile */}
        <span className="hidden md:block absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          text here if you have any questions
        </span>
      </button>
    </div>
  )
}