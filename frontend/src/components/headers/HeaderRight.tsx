import { Bell, LogIn } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../hooks/notifications/useNotifications"

type Props = {
  mobileSearchOpen: boolean
}

const HeaderRight = ({ mobileSearchOpen }: Props) => {
  const { currentUser } = useAuth()
  const { unreadCount } = useNotifications(currentUser?.id)

  return (
    <div className={`flex items-center gap-4 ${mobileSearchOpen ? "max-sm:hidden" : ""} sm:flex`}>
      {currentUser ? (
        <>
          <NavLink
            to="/notification"
            className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to={`/information/${currentUser.id}`}
            className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-200"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="h-full w-full object-cover"
            />
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/signin"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <LogIn className="h-4 w-4" />
          Đăng nhập
        </NavLink>
      )}
    </div>
  )
}

export default HeaderRight