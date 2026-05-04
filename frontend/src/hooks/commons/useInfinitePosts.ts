import { useEffect, useRef } from "react"

export const useInfinitePosts = (
  loadMore: () => void,
  hasMore: boolean,
  isLoading: boolean,
  enabled = true
) => {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const isTriggeringRef = useRef(false)

  useEffect(() => {
    if (!isLoading) {
      isTriggeringRef.current = false
    }
  }, [isLoading, enabled])

  useEffect(() => {
    const el = observerRef.current
    if (!enabled || !el || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isTriggeringRef.current) {
          isTriggeringRef.current = true
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, hasMore, isLoading, enabled])

  return {
    observerRef,
  }
}