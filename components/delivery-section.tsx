import Image from "next/image"

export function DeliverySection() {
  return (
    <section className="bg-white">
            <Image
              src="/delivery.jpeg"
              alt="Fast and reliable delivery service"
              width={800}
              height={400}
              className="shadow-lg object-cover w-full h-auto"
              priority={false}
            />
    </section>
  )
}