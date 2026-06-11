import { useState, useRef, useEffect } from 'react'
import { useSidebarAds } from '@/hooks/useSidebarAds'
import { useAdStore } from '@/store/adStore'
import { Film } from 'lucide-react'

interface SidebarAdSliderProps {
  id: string
  layout: 'sidebar' | 'inline'
}

export default function SidebarAdSlider({ id, layout }: SidebarAdSliderProps) {
  const { data: adsData, isLoading } = useSidebarAds()
  const ads = adsData?.data || []
  
  const currentAdId = useAdStore((state) => state.activeAds[id])
  const registerSection = useAdStore((state) => state.registerSection)
  const unregisterSection = useAdStore((state) => state.unregisterSection)
  const getNextAdId = useAdStore((state) => state.getNextAdId)

  const [isFading, setIsFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Register the section with the global store when ads are loaded
  useEffect(() => {
    if (ads.length > 0) {
      registerSection(id, ads)
    }
    return () => {
      unregisterSection(id)
    }
  }, [id, ads.length, registerSection, unregisterSection])

  const currentAd = ads.find((ad) => ad._id === currentAdId) || null

  const handleVideoEnded = () => {
    if (ads.length <= 1) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
      }
      return
    }

    setIsFading(true)
    setTimeout(() => {
      getNextAdId(id, ads)
      setIsFading(false)
    }, 300)
  }

  // Auto-play when the active ad changes
  useEffect(() => {
    if (videoRef.current && currentAd) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser
      })
    }
  }, [currentAdId, currentAd])

  if (isLoading || ads.length === 0 || !currentAd) return null

  const activeIdx = ads.findIndex((ad) => ad._id === currentAdId)
  const safeIdx = activeIdx >= 0 ? activeIdx : 0

  if (layout === 'sidebar') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
        {/* Header */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
          <Film className="w-3 h-3 text-violet-500" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sponsored</h3>
          {ads.length > 1 && (
            <span className="ml-auto text-[9px] text-slate-300 font-medium">
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
              src={currentAd.videoUrl}
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
          <div className="flex items-center justify-center gap-1.5 py-1.5">
            {ads.map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  i === safeIdx
                    ? 'bg-violet-500 w-3'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Inline layout (between contents on mobile or on homepage)
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-sm w-full transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
      <div className="flex items-center gap-2 mb-2">
        <Film className="w-3 h-3 text-violet-500" />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sponsored</h3>
      </div>
      <div className="w-full overflow-hidden rounded-lg bg-slate-950">
        <div
          className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <video
            ref={videoRef}
            src={currentAd.videoUrl}
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
