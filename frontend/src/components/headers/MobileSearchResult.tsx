import type { User } from "../../hooks/headers/useHeaderSearch"

type Props = {
  mobileSearchOpen: boolean
  results: User[]
  search: string
  onSelectUser: (id: string) => void
}

const MobileSearchResult = ({
  mobileSearchOpen,
  results,
  search,
  onSelectUser,
}: Props) => {
  if (
    !mobileSearchOpen ||
    results.length === 0 ||
    search.trim() === ""
  ) {
    return null
  }

  return (
    <div className="absolute left-0 top-16 z-50 max-h-72 w-full overflow-auto border-t border-slate-100 bg-white shadow-lg sm:hidden">
      <ul className="py-1">
        {results.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-slate-100"
          >
            <img
              src={user.avatar}
              alt={user.fullName}
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="text-sm text-slate-700">
              {user.fullName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileSearchResult