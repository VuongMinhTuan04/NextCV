import { Home, Search } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

import type { User } from "../../hooks/headers/useHeaderSearch"

type Props = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  results: User[]
  mobileSearchOpen: boolean
  onHomeClick: () => void
}

const HeaderDesktop = ({
  search,
  setSearch,
  results,
  mobileSearchOpen,
  onHomeClick,
}: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomeActive = location.pathname === "/"

  return (
    <>
      <div
        className={`flex items-center gap-3 ${
          mobileSearchOpen ? "max-sm:hidden" : ""
        } sm:flex`}
      >
        <span className="text-lg font-semibold text-blue-900">
          NextCV
        </span>
      </div>

      <div className="hidden flex-1 items-center justify-center gap-4 sm:flex">
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <button
                onClick={onHomeClick}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isHomeActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Trang chủ</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="relative w-72">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm người dùng..."
            className="w-full rounded-full border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm outline-none transition focus:border-blue-300"
          />

          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />

          {results.length > 0 && search.trim() !== "" && (
            <div className="absolute left-0 top-12 z-50 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
              <ul className="py-2">
                {results.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      navigate(`/information/${user.id}`)
                      setSearch("")
                    }}
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
          )}
        </div>
      </div>
    </>
  )
}

export default HeaderDesktop