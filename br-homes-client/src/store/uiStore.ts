import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isImageDialogOpen: boolean
  selectedImageIndex: number
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  openImageDialog: (index: number) => void
  closeImageDialog: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isImageDialogOpen: false,
  selectedImageIndex: 0,
  toggleMobileMenu: () =>
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openImageDialog: (index) =>
    set({ isImageDialogOpen: true, selectedImageIndex: index }),
  closeImageDialog: () => set({ isImageDialogOpen: false }),
}))
