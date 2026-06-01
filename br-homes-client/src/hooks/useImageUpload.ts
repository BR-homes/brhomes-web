import { useState, useCallback } from 'react'

interface PreviewImage {
  file: File
  preview: string
}

export const useImageUpload = (maxImages: number = 7) => {
  const [previews, setPreviews] = useState<PreviewImage[]>([])

  const addImages = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newPreviews: PreviewImage[] = []
      const remaining = maxImages - previews.length

      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          newPreviews.push({
            file,
            preview: URL.createObjectURL(file),
          })
        }
      }

      setPreviews((prev) => [...prev, ...newPreviews])
    },
    [previews.length, maxImages]
  )

  const removeImage = useCallback((index: number) => {
    setPreviews((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }, [])

  const clearImages = useCallback(() => {
    previews.forEach((p) => URL.revokeObjectURL(p.preview))
    setPreviews([])
  }, [previews])

  const getFiles = useCallback(() => {
    return previews.map((p) => p.file)
  }, [previews])

  return {
    previews,
    addImages,
    removeImage,
    clearImages,
    getFiles,
    canAddMore: previews.length < maxImages,
    imageCount: previews.length,
  }
}
