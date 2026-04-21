import { useEffect, useRef, useState } from "react"

export type User = {
  id: string
  fullName: string
  avatar: string
}

const mockUsers: User[] = [
  { id: "1", fullName: "An Nguyen", avatar: "https://i.pravatar.cc/100?img=1" },
  { id: "2", fullName: "Ah Tran", avatar: "https://i.pravatar.cc/100?img=2" },
  { id: "3", fullName: "Bao Le", avatar: "https://i.pravatar.cc/100?img=3" },
]

const normalize = (value: string) => value.trim().toLowerCase()

export const useHeaderSearch = () => {
  const [search, setSearch] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [results, setResults] = useState<User[]>([])

  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

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

    setResults(
      mockUsers.filter((user) =>
        user.fullName.toLowerCase().startsWith(keyword)
      )
    )
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

    return () =>
      document.removeEventListener("click", handleClickOutside)
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