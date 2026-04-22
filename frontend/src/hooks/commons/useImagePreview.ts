import { useCallback, useState } from "react"

export const useImagePreview = () => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const openPreview = useCallback((src: string) => {
    setPreviewSrc(src)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewSrc(null)
  }, [])

  return {
    previewSrc,
    openPreview,
    closePreview,
    isOpen: previewSrc !== null,
  }
}