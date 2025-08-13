'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Notification {
  id: number
  name: string
  product: string
  action: string
  location: string
}

const SALVADOR_NAMES = [
  'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Roberto', 'Elena',
  'Miguel', 'Rosa', 'Francisco', 'Patricia', 'Antonio', 'Laura', 'Manuel',
  'Isabel', 'Rafael', 'Sofía', 'Diego', 'Gabriela', 'Fernando', 'Alejandra',
  'Sergio', 'Mónica', 'Andrés', 'Valeria', 'Ricardo', 'Daniela', 'Óscar', 'Beatriz'
]

const PRODUCTS = [
  'iPhone 15 Pro', 'iPhone 15 Pro Max', 'MacBook Pro 16"', 'MacBook Air 15"',
  'Samsung Refrigerator', 'LG Washing Machine', 'Frigidaire Refrigerator',
  'GE Electric Range', 'Whirlpool Dishwasher', 'Maytag Dryer',
  'iPhone 15 Plus', 'MacBook Pro 14"', 'iPad Pro', 'Apple Watch Series 9'
]

const ACTIONS = [
  'just bought', 'received their', 'product shipped for', 'order confirmed for'
]

const LOCATIONS = [
  'San Salvador', 'Santa Ana', 'San Miguel', 'Soyapango', 'Mejicanos',
  'Santa Tecla', 'Apopa', 'Delgado', 'Sonsonate', 'Ahuachapán'
]

export function PurchaseNotifications() {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [nextId, setNextId] = useState(1)
  const [notificationCount, setNotificationCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const generateNotification = (): Notification => {
    const randomName = SALVADOR_NAMES[Math.floor(Math.random() * SALVADOR_NAMES.length)]
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    const randomLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]

    return {
      id: nextId,
      name: randomName,
      product: randomProduct,
      action: randomAction,
      location: randomLocation
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Check if we should pause after 5 notifications
      if (notificationCount >= 5 && !isPaused) {
        setIsPaused(true)
        setNotificationCount(0)
        
        // Resume after 10 minutes (600,000 ms)
        setTimeout(() => {
          setIsPaused(false)
        }, 600000)
        
        return
      }

      // Don't show notifications during pause
      if (isPaused) {
        return
      }

      const newNotification = generateNotification()
      setNotification(newNotification)
      setNextId(prev => prev + 1)
      setNotificationCount(prev => prev + 1)

      // Auto remove notification after 10 seconds
      setTimeout(() => {
        setNotification(null)
      }, 10000)
    }, 5000)

    return () => clearInterval(interval)
  }, [nextId, notificationCount, isPaused])

  const removeNotification = () => {
    setNotification(null)
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notification && (
        <div
          key={notification.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-top-5 duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">
                  Recent Purchase
                </span>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{notification.name}</span> {notification.action}{' '}
                <span className="font-medium text-blue-600">{notification.product}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                📍 {notification.location}, El Salvador
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleTimeString()} • Verified Purchase
              </p>
            </div>
            <button
              onClick={removeNotification}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}