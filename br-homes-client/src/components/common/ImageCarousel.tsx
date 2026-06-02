import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { IPropertyImage } from '@/types'

interface ImageCarouselProps {
  images: IPropertyImage[]
  alt: string
  className?: string
  autoSlideInterval?: number
  showDots?: boolean
  showArrows?: boolean
  imageClassName?: string
}

export default function ImageCarousel({
  images,
  alt,
  className = '',
  autoSlideInterval = 3000,
  showDots = true,
  showArrows = true,
  imageClassName = '',
}: ImageCarouselProps) {
  const hasMultiple = images.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goNext = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!hasMultiple) return
    if (isHovered) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoSlideInterval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hasMultiple, isHovered, images.length, autoSlideInterval])

  return (
    <div
      className={`relative overflow-hidden group/carousel ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sliding images */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img.imageUrl}
            alt={i === 0 ? alt : `${alt} - ${i + 1}`}
            loading="lazy"
            className={`w-full h-full object-cover flex-shrink-0 ${imageClassName}`}
          />
        ))}
      </div>

      {/* Prev/Next arrows */}
      {hasMultiple && showArrows && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-white z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-white z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && showDots && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-white w-3.5 shadow-sm'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full z-10">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  )
}
