"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slidesData = [
  {
    id: "phone-watch",
    headline: "Iphone 16",

    sub: "256 GB • 8 GB RAM",
    // include: "Includes Smartwatch",
    media: [
      { alt: "Smartphone front and back", src: "/1.png?height=230&width=170" },
      { alt: "Smartwatch", src: "/3.png?height=140&width=120" },
    ],
    regularPrice: 1020,
    discountPercent: 50,
    cta: "Buy now",
    bg: "from-blue-900 to-blue-700",
  },
  {
    id: "laptop",
    headline: "Ultra Laptop 15”",
    sub: "Core i7 • 16 GB • 512 GB SSD",
    // include: "Includes Office 1 year",
    media: [{ alt: "Slim laptop open", src: "/2.png?height=200&width=260" }],
    regularPrice: 1199,
    discountPercent: 50,
    cta: "Shop laptop",
    bg: "from-blue-900 to-indigo-700",
  },
  {
    id: "phone-pro",
    headline: "Iphone 16 Pro",
    sub: "128 GB • Dual Camera",
    // include: "Free Fast Shipping",
    media: [{ alt: "Premium smartphone", src: "/1.png?height=220&width=160" }],
    regularPrice: 1199,
    discountPercent: 50,
    cta: "Shop phone",
    bg: "from-blue-900 to-cyan-700",
  },
]

function PriceReveal({ regular, percent, isActive }) {
  const [showDiscount, setShowDiscount] = useState(false)
  const discounted = useMemo(() => Math.round(regular * (1 - percent / 100)), [regular, percent])

  useEffect(() => {
    // Reset and reveal discount shortly after slide becomes active
    setShowDiscount(false)
    const t = setTimeout(() => setShowDiscount(true), 700)
    return () => clearTimeout(t)
  }, [isActive])

  return (
    <div className="mt-2" aria-live="polite" aria-atomic="true">
      {/* Regular price first, then strike and reveal new price */}
      <div className="text-sm text-white/90">Regular price</div>
      <div className="flex items-end gap-3">
        <div
          className={[
            "text-2xl sm:text-3xl font-semibold transition-all duration-500",
            showDiscount ? "line-through opacity-70" : "no-underline opacity-100",
          ].join(" ")}
        >
          {"$" + regular}
        </div>
        <div
          className={[
            "text-4xl sm:text-5xl font-extrabold text-white transition-all duration-500",
            showDiscount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          ].join(" ")}
        >
          {"$" + discounted}
        </div>
        <Badge
          variant="secondary"
          className={[
            "ml-1 bg-yellow-400 text-slate-900 font-bold border-0",
            showDiscount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            "transition-all duration-500",
          ].join(" ")}
          aria-label={`${percent}% discount`}
        >
          {percent}% OFF
        </Badge>
      </div>
    </div>
  )
}

export default function Hero({ slides = slidesData, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0)
  const count = slides.length
  const timerRef = useRef(null)
  const touchStartX = useRef(0)
  const touchDx = useRef(0)

  const goTo = (i) => setIndex((i + count) % count)
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  useEffect(() => {
    // autoplay
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [count, intervalMs])

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchDx.current = 0
    clearInterval(timerRef.current)
  }
  function onTouchMove(e) {
    touchDx.current = e.touches[0].clientX - touchStartX.current
  }
  function onTouchEnd() {
    const dx = touchDx.current
    if (Math.abs(dx) > 40) {
      if (dx < 0) next()
      else prev()
    }
    // resume autoplay
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs)
  }

  return (
    <section
      className="relative overflow-hidden pt-2 sm:pt-3"
      aria-label="Featured promotions"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={`bg-gradient-to-r ${slides[index].bg} text-white`}>
        <div className="relative mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-6">
          {/* Slider track */}
          <div
            className="flex transition-transform duration-500 will-change-transform"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => (
              <article
                key={s.id}
                className="min-w-full grid grid-cols-12 gap-4 items-center"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
              >
                {/* Media left */}
                <div className="col-span-5 sm:col-span-5 flex justify-center">
                  <div className="relative h-[160px] sm:h-[190px] w-full max-w-[260px]">
                    {/* Layer multiple images for depth */}
                    {s.media.map((m, idx) => (
                      <div
                        key={idx}
                        className="absolute"
                        style={{
                          left: idx === 0 ? "4%" : `${14 + idx * 18}%`,
                          bottom: idx === 0 ? "4%" : "0%",
                          zIndex: 10 + idx,
                        }}
                      >
                        <Image
                          src={m.src || "/placeholder.svg"}
                          alt={m.alt}
                          width={200}
                          height={160}
                          className="drop-shadow-xl rounded-md"
                          priority={i === index}
                        />
                      </div>
                    ))}
                    {/* Include badge */}
                    <div className="absolute -top-2 left-0">
                      <div className="rounded-lg bg-yellow-400 text-slate-900 font-bold px-3 py-1 text-xs sm:text-sm shadow">
                        {s.include}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text right */}
                <div className="col-span-7 sm:col-span-7">
                  <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{s.headline}</h2>
                  <p className="text-white/90 text-sm sm:text-base mt-1">{s.sub}</p>

                  <PriceReveal regular={s.regularPrice} percent={s.discountPercent} isActive={i === index} />

                  <div className="mt-4">
                    <Button className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold">{s.cta}</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
            <div className="flex items-center justify-between h-full">
              {/* <button
                type="button"
                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
                aria-label="Previous slide"
                onClick={prev}
              >
                <ChevronLeft className="h-5 w-5" />
              </button> */}
              {/* <button
                type="button"
                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
                aria-label="Next slide"
                onClick={next}
              >
                <ChevronRight className="h-5 w-5" />
              </button> */}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "h-2.5 w-2.5 rounded-full transition-all",
                  i === index ? "bg-white ring-2 ring-white/70 scale-110" : "bg-white/50 hover:bg-white/70",
                ].join(" ")}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
