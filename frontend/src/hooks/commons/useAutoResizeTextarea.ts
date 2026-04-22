import { useCallback, useLayoutEffect, useRef } from "react"

export const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [])

  useLayoutEffect(() => {
    resizeTextarea()
  }, [value, resizeTextarea])

  return {
    textareaRef,
    resizeTextarea,
  }
}