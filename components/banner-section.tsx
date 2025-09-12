import Image from "next/image"

export function BannerSection() {
  return (
    <section className="py-4 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">¡Ofertas imperdibles!</h2>
          
          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Top Banner - Xiaomi Phone */}
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src="/redmi.jpg"
                alt="Redmi Banner"
                width={400}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Bottom Row - Two Banner Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/banner2.jpeg"
                  alt="Banner 2"
                  width={200}
                  height={150}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/banner3.jpeg"
                  alt="Banner 3"
                  width={200}
                  height={150}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout - Match Mobile Structure */}
          <div className="hidden md:block space-y-4">
            {/* Top Banner */}
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src="/redmi.jpg"
                alt="Redmi Banner"
                width={800}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Bottom Row - Two Banners */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/banner2.jpeg"
                  alt="Banner 2"
                  width={400}
                  height={250}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/banner3.jpeg"
                  alt="Banner 3"
                  width={400}
                  height={250}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}