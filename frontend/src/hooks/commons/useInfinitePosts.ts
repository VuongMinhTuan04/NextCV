import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

const PAGE_SIZE = 5

export const useInfinitePosts = <T,>(allPosts: T[]) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const visiblePosts = allPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allPosts.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, allPosts.length))
      setIsLoading(false)
    }, 600)
  }, [isLoading, hasMore, allPosts.length])

  useEffect(() => {
    const el = observerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, hasMore, isLoading])

  return {
    visiblePosts,
    isLoading,
    hasMore,
    observerRef,
  }
}