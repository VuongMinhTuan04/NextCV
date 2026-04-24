import { useNavigate, useLocation } from "react-router-dom"

import HeaderDesktop from "../components/headers/HeaderDesktop"
import HeaderMobile from "../components/headers/HeaderMobile"
import HeaderRight from "../components/headers/HeaderRight"
import MobileSearchResult from "../components/headers/MobileSearchResult"
import { useHeaderSearch } from "../hooks/headers/useHeaderSearch"
import { useNotifications } from "../hooks/notifications/useNotifications"
import { currentUser } from "../services/mockPosts"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    search,
    setSearch,
    mobileSearchOpen,
    setMobileSearchOpen,
    results,
    mobileSearchRef,
    mobileSearchInputRef,
    closeMobileSearch,
  } = useHeaderSearch()

  const { unreadCount } = useNotifications(currentUser.id)

  const handleSelectUser = (userId: string) => {
    navigate(`/information/${userId}`)
    closeMobileSearch()
  }

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload()
    } else {
      navigate("/")
    }
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-[#F8FAFC]/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <HeaderDesktop
          search={search}
          setSearch={setSearch}
          results={results}
          mobileSearchOpen={mobileSearchOpen}
          onHomeClick={handleHomeClick}
        />

        <HeaderMobile
          search={search}
          setSearch={setSearch}
          results={results}
          mobileSearchOpen={mobileSearchOpen}
          setMobileSearchOpen={setMobileSearchOpen}
          mobileSearchRef={mobileSearchRef}
          mobileSearchInputRef={mobileSearchInputRef}
          closeMobileSearch={closeMobileSearch}
          onHomeClick={handleHomeClick}
        />

        <HeaderRight mobileSearchOpen={mobileSearchOpen} unreadCount={unreadCount} />
      </div>

      <MobileSearchResult
        mobileSearchOpen={mobileSearchOpen}
        results={results}
        search={search}
        onSelectUser={handleSelectUser}
      />
    </header>
  )
}

export default Header