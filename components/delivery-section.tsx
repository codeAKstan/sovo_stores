import Image from "next/image"

export function DeliverySection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fast & Reliable Delivery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We ensure your products reach you safely and on time, every time.
          </p> */}
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl">
            <Image
              src="/delivery.jpeg"
              alt="Fast and reliable delivery service"
              width={800}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}