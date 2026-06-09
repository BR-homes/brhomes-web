import { useState, useRef, useEffect } from 'react'
import { useSidebarAds } from '@/hooks/useSidebarAds'
import { Film } from 'lucide-react'

interface SidebarAdSliderProps {
  layout: 'sidebar' | 'inline'
}

export default function SidebarAdSlider({ layout }: SidebarAdSliderProps) {
  const { data: adsData, isLoading } = useSidebarAds()
  const ads = adsData?.data || []
  const [activeIdx, setActiveIdx] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Safe index bounds check
  const safeIdx = ads.length > 0 ? activeIdx % ads.length : 0
  const currentAd = ads.length > 0 ? ads[safeIdx] : null

  // Reset index if ads change
  useEffect(() => {
    if (ads.length > 0 && activeIdx >= ads.length) {
      setActiveIdx(0)
    }
  }, [ads.length, activeIdx])

  const handleVideoEnded = () => {
    if (ads.length <= 1) {
      // Only one video, replay it
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
      }
      return
    }

    // Fade out, switch, fade in
    setIsFading(true)
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % ads.length)
      setIsFading(false)
    }, 300)
  }

  // Auto-play when the active ad changes
  useEffect(() => {
    if (videoRef.current && currentAd) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser — silent fail
      })
    }
  }, [safeIdx, currentAd])

  if (isLoading || ads.length === 0) return null

  if (layout === 'sidebar') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-violet-500" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sponsored</h3>
          {ads.length > 1 && (
            <span className="ml-auto text-[10px] text-slate-300 font-medium">
              {safeIdx + 1}/{ads.length}
            </span>
          )}
        </div>

        {/* Video Player */}
        <div className="w-full overflow-hidden bg-slate-950">
          <div
            className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <video
              ref={videoRef}
              src={currentAd?.videoUrl}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>

        {/* Progress dots */}
        {ads.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-2">
            {ads.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === safeIdx
                    ? 'bg-violet-500 w-4'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Inline layout (between contents on mobile)
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm my-6">
      <div className="flex items-center gap-2 mb-3">
        <Film className="w-3.5 h-3.5 text-violet-500" />
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sponsored</h3>
      </div>
      <div className="w-full max-w-lg mx-auto overflow-hidden rounded-lg bg-slate-950">
        <div
          className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <video
            ref={videoRef}
            src={currentAd?.videoUrl}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="w-full aspect-video object-cover"
          />
        </div>
      </div>
    </div>
  )
}
