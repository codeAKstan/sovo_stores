import { Shield, DollarSign, Award, Plane } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Garantía de devolución de dinero",
      description: "Compra con confianza sabiendo que tu compra está protegida",
    },
    {
      icon: DollarSign,
      title: "Costo total de pedido más bajo",
      description: "Mejores precios garantizados sin cargos ocultos",
    },
    {
      icon: Award,
      title: "Marcas premium y de lujo",
      description: "Solo productos auténticos de fabricantes confiables", 
    },
    {
      icon: Plane,
      title: "Envío internacional",
      description: "Entrega rápida y confiable a tu puerta",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-orange-500" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
