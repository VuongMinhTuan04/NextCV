import { useEffect, useRef, useState } from "react"
import { informationApi } from "../../services/api"

export type User = {
  id: string
  fullName: string
  avatar: string
}

const normalize = (value: string) => value.trim().toLowerCase()

const resolveAvatarSource = (src?: string) => {
  const value = (src ?? "").trim()

  if (!value) return "/avatar/user.png"
  if (value.startsWith("http")) return value
  if (value.startsWith("blob:")) return value
  if (value.startsWith("data:")) return value
  if (value.startsWith("/avatar/")) return value

  return `/avatar/${value.replace(/^\/+/, "")}`
}

export const useHeaderSearch = () => {
  const [search, setSearch] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [results, setResults] = useState<User[]>([])

  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closeMobileSearch = () => {
    setMobileSearchOpen(false)
    setSearch("")
    setResults([])
  }

  useEffect(() => {
    const keyword = normalize(search)

    if (!keyword) {
      setResults([])
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await informationApi.searchUsers(keyword)

        setResults(
          (response.data ?? []).map((user) => ({
            id: user.id,
            fullName: user.fullName,
            avatar: resolveAvatarSource(user.avatar),
          }))
        )
      } catch {
        setResults([])
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [search])

  useEffect(() => {
    if (!mobileSearchOpen) return
    mobileSearchInputRef.current?.focus()
  }, [mobileSearchOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileSearchOpen) return

      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        closeMobileSearch()
      }
    }

    document.addEventListener("click", handleClickOutside)

    return () => document.removeEventListener("click", handleClickOutside)
  }, [mobileSearchOpen])

  return {
    search,
    setSearch,
    mobileSearchOpen,
    setMobileSearchOpen,
    results,
    mobileSearchRef,
    mobileSearchInputRef,
    closeMobileSearch,
  }
}