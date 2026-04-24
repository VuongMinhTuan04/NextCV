import { Home, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

import type { User } from "../../hooks/headers/useHeaderSearch"

type Props = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  results: User[]
  mobileSearchOpen: boolean
  setMobileSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
  mobileSearchRef: React.RefObject<HTMLDivElement | null>
  mobileSearchInputRef: React.RefObject<HTMLInputElement | null>
  closeMobileSearch: () => void
  onHomeClick: () => void
}

const HeaderMobile = ({
  search,
  setSearch,
  mobileSearchOpen,
  setMobileSearchOpen,
  mobileSearchRef,
  mobileSearchInputRef,
  closeMobileSearch,
  onHomeClick,
}: Props) => {
  const location = useLocation()
  const isHomeActive = location.pathname === "/"

  return (
    <div
      ref={mobileSearchRef}
      className="relative flex flex-1 items-center justify-center sm:hidden"
    >
      <AnimatePresence mode="wait">
        {!mobileSearchOpen ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center gap-6"
          >
            <button
              onClick={onHomeClick}
              className={`grid h-10 w-10 place-items-center rounded-full transition ${
                isHomeActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Home className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Search className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="flex w-full items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={mobileSearchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm người dùng..."
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm outline-none transition focus:border-blue-300"
              />

              <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            <button
              onClick={closeMobileSearch}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HeaderMobile