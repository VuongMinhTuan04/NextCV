import type { User } from "../../hooks/headers/useHeaderSearch"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

type Props = {
  mobileSearchOpen: boolean
  results: User[]
  search: string
  onSelectUser: (userId: string) => void
}

const MobileSearchResult = ({ mobileSearchOpen, results, search, onSelectUser }: Props) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (!mobileSearchOpen || results.length === 0 || search.trim() === "") return null

  const handleClick = (userId: string) => {
    if (isAuthenticated) {
      onSelectUser(userId)
    } else {
      navigate(`/signin?redirect=${encodeURIComponent(`/information/${userId}`)}`)
    }
  }

  return (
    <div className="absolute left-0 top-16 z-50 w-full border-b border-slate-200 bg-white sm:hidden">
      <ul className="py-2">
        {results.map((user) => (
          <li
            key={user.id}
            onClick={() => handleClick(user.id)}
            className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-slate-100"
          >
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm text-slate-700">{user.fullName}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileSearchResult