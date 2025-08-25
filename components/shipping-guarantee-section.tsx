"use client"

import Image from "next/image"

export function ShippingGuaranteeSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Envíos a toda Latinoamérica</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enviamos productos premium a tu casa con nuestra red de envíos extensa cubriendo países latinoamericanos. Tu satisfacción está garantizada con nuestra promesa de devolución de dinero.
          </p>
        </div>

        <div className="relative">
          <Image
            src="/travel.png"

            alt="SovoStores shipping network en Latinoamérica con garantía de devolución de dinero"
            width={1200}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
            priority={false}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Amplio Coverage</h3>
            <p className="text-gray-600">
              Enviamos a Guatemala, Panamá, México, República Dominicana, Colombia, y más
            </p>
          </div>

          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Garantía de devolución de dinero</h3>
            <p className="text-gray-600">100% satisfacción garantizada o tu dinero devuelto, sin preguntas</p>
          </div>

          <div className="p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrega rápida</h3>
            <p className="text-gray-600">Opciones de envío express disponibles con seguimiento para todos los pedidos</p>
          </div>
        </div>
      </div>
    </section>
  )
}
