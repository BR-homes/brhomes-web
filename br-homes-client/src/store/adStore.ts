import { create } from 'zustand'

interface AdState {
  // Mapping of sectionId -> active ad _id
  activeAds: Record<string, string>
  
  // Registers a section with a distinct ad.
  // Returns the _id of the assigned ad, or null if none available.
  registerSection: (sectionId: string, availableAds: { _id: string }[]) => string | null

  // Unregisters a section when it unmounts.
  unregisterSection: (sectionId: string) => void

  // Returns the next distinct ad _id for a section when its video ends.
  getNextAdId: (sectionId: string, availableAds: { _id: string }[]) => string | null
}

export const useAdStore = create<AdState>((set) => ({
  activeAds: {},

  registerSection: (sectionId, availableAds) => {
    if (!availableAds || availableAds.length === 0) return null

    let assignedAdId: string | null = null

    set((state) => {
      // If already registered, keep current if valid, else pick new
      const current = state.activeAds[sectionId]
      if (current && availableAds.some(ad => ad._id === current)) {
        return state
      }

      // Find other active ads
      const otherActiveIds = Object.entries(state.activeAds)
        .filter(([id]) => id !== sectionId)
        .map(([_, adId]) => adId)

      // Find first ad that is not active in other sections
      const distinctAd = availableAds.find(ad => !otherActiveIds.includes(ad._id))

      if (distinctAd) {
        assignedAdId = distinctAd._id
      } else {
        // Fallback: pick the first ad
        assignedAdId = availableAds[0]._id
      }

      return {
        activeAds: {
          ...state.activeAds,
          [sectionId]: assignedAdId,
        }
      }
    })

    return assignedAdId
  },

  unregisterSection: (sectionId) => {
    set((state) => {
      const nextActiveAds = { ...state.activeAds }
      delete nextActiveAds[sectionId]
      return { activeAds: nextActiveAds }
    })
  },

  getNextAdId: (sectionId, availableAds) => {
    if (!availableAds || availableAds.length === 0) return null

    let nextAdId: string | null = null

    set((state) => {
      const currentAdId = state.activeAds[sectionId]
      const currIdx = availableAds.findIndex(ad => ad._id === currentAdId)

      // Find other active ads
      const otherActiveIds = Object.entries(state.activeAds)
        .filter(([id]) => id !== sectionId)
        .map(([_, adId]) => adId)

      // Scan sequentially starting from current index + 1
      for (let offset = 1; offset <= availableAds.length; offset++) {
        const nextIdx = (currIdx + offset) % availableAds.length
        const candidate = availableAds[nextIdx]
        if (!otherActiveIds.includes(candidate._id)) {
          nextAdId = candidate._id
          break
        }
      }

      // Fallback if no distinct ad is available: pick next sequential
      if (!nextAdId) {
        const nextIdx = (currIdx + 1) % availableAds.length
        nextAdId = availableAds[nextIdx]._id
      }

      return {
        activeAds: {
          ...state.activeAds,
          [sectionId]: nextAdId,
        }
      }
    })

    return nextAdId
  }
}))
