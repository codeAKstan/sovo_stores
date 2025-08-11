"use client"

import type React from "react"

import { useState } from "react"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function Footer() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Our Latest Deals</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get exclusive offers, new product announcements, and special discounts delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-gray-900 border-0 rounded-full px-6 py-3"
              required
            />
            <Button
              type="submit"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 font-semibold"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Sovo <span className="text-blue-400">stores</span>
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Your premium destination for the latest iPhones and MacBooks. We offer authentic products with
                unbeatable prices and exceptional customer service.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">1-800-SOVO-TECH</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">support@sovostores.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">123 Tech Street, Silicon Valley, CA</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/iphones" className="text-gray-300 hover:text-white transition-colors">
                  iPhones
                </Link>
              </li>
              <li>
                <Link href="/category/macbooks" className="text-gray-300 hover:text-white transition-colors">
                  MacBooks
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-gray-300 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-300 hover:text-white transition-colors">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-gray-300 hover:text-white transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="text-gray-300 hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-white transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-300 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-gray-300 hover:text-white transition-colors">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-gray-300 hover:text-white transition-colors">
                  Investors
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">Follow Us:</span>
              <div className="flex space-x-3">
                <Link
                  href="https://facebook.com/sovostores"
                  className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="https://twitter.com/sovostores"
                  className="p-2 bg-gray-800 rounded-full hover:bg-blue-400 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href="https://instagram.com/sovostores"
                  className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="https://youtube.com/sovostores"
                  className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">We Accept:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-sm">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-red-600 font-bold text-sm">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-800 font-bold text-sm">AMEX</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-sm">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Sovo Stores. All rights reserved. Built with precision and care.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
