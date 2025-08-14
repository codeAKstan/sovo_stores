"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const reviews = [
  {
    id: 1,
    name: "Carlos Hernández",
    location: "San Salvador",
    rating: 5,
    review:
      "Excelente servicio! Mi iPhone 15 Pro llegó en perfectas condiciones y súper rápido. Los precios con 50% de descuento son increíbles.",
    product: "iPhone 15 Pro Max",
    image: "/happy-salvadoran-man.jpeg",
  },
  {
    id: 2,
    name: "María Elena Rodríguez",
    location: "Santa Ana",
    rating: 5,
    review:
      "Compré una MacBook Pro y quedé fascinada. La calidad es excelente y el envío fue súper seguro. Definitivamente recomiendo Sovo Stores.",
    product: 'MacBook Pro 16"',
    image: "/happy-salvadoran-woman.jpeg",
  },
  {
    id: 3,
    name: "José Antonio Martínez",
    location: "San Miguel",
    rating: 5,
    review:
      "La garantía de devolución del 100% me dio mucha confianza. El producto llegó exactamente como se describía. Muy profesional todo.",
    product: "Samsung Refrigerator",
    image: "/satisfied-salvadoran-custome.jpeg",
  },
  {
    id: 4,
    name: "Ana Sofía Morales",
    location: "Sonsonate",
    rating: 5,
    review:
      "Increíble experiencia de compra! El iPhone que pedí llegó en 3 días y funciona perfecto. Los precios son los mejores que he encontrado.",
    product: "iPhone 15 Plus",
    image: "/happy-salvadoran-woman2.jpeg",
  },
  {
    id: 5,
    name: "Beatriz Castillo",
    location: "La Libertad",
    rating: 5,
    review:
      "Servicio al cliente excepcional. Tuve una consulta y me respondieron inmediatamente. La lavadora que compré funciona de maravilla.",
    product: "LG Washing Machine",
    image: "/satisfied-salvadoran-man.jpeg",
  },
  {
    id: 6,
    name: "Claudia Beatriz Flores",
    location: "Ahuachapán",
    rating: 5,
    review:
      "Sovo Stores es confiable al 100%. Mi MacBook Air llegó perfecta y el proceso de compra fue súper fácil. Los recomiendo totalmente.",
    product: 'MacBook Air 15"',
    image: "/professional-salvadoran-woman.jpeg",
  },
]

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerPage = 3

  const nextReviews = () => {
    setCurrentIndex((prev) => (prev + reviewsPerPage >= reviews.length ? 0 : prev + reviewsPerPage))
  }

  const prevReviews = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, reviews.length - reviewsPerPage) : prev - reviewsPerPage))
  }

  const currentReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de clientes satisfechos en toda Centroamérica confían en Sovo Stores
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">{renderStars(5)}</div>
            <span className="text-sm text-gray-600 ml-2">4.9/5 basado en 2,847 reseñas</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="flex mb-4">{renderStars(review.rating)}</div>

                {/* Review Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">"{review.review}"</p>

                {/* Product */}
                <div className="text-sm text-blue-600 font-medium mb-4">Producto: {review.product}</div>

                {/* Customer Info */}
                <div className="flex items-center">
                  <img
                    src={review.image || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.location}, El Salvador</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevReviews}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * reviewsPerPage)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(currentIndex / reviewsPerPage) === i ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextReviews}
              className="flex items-center gap-2 bg-transparent"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">2,847+</div>
              <div className="text-sm text-gray-600">Reseñas Verificadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">4.9/5</div>
              <div className="text-sm text-gray-600">Calificación Promedio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">15,000+</div>
              <div className="text-sm text-gray-600">Productos Entregados</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
