import { useEffect, useRef, useState } from "react"
import { mockInformation } from "../../services/mockInformation"

export type User = {
  id: string
  fullName: string
  avatar: string
}

const users: User[] = mockInformation.map((info) => ({
  id: info.postOwnerId,
  fullName: info.fullName,
  avatar: info.avatar,
}))

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
      users.filter((user) =>
        normalize(user.fullName).startsWith(keyword)
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