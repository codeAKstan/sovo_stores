import { Shield, DollarSign, Award, Plane } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "100% Money Back Guarantee",
      description: "Shop with confidence knowing your purchase is protected",
    },
    {
      icon: DollarSign,
      title: "Lowest Overall Order Cost",
      description: "Best prices guaranteed with no hidden fees",
    },
    {
      icon: Award,
      title: "Premium & Luxury Brands",
      description: "Only authentic products from trusted manufacturers",
    },
    {
      icon: Plane,
      title: "Worldwide Shipping",
      description: "Fast and reliable delivery to your doorstep",
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
