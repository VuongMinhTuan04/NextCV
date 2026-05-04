import { Bell, LogIn } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../hooks/notifications/useNotifications"

type Props = {
  mobileSearchOpen: boolean
}

const HeaderRight = ({ mobileSearchOpen }: Props) => {
  const { user } = useAuth()
  const { unreadCount } = useNotifications(user?.id)

  return (
    <div className={`flex items-center gap-4 ${mobileSearchOpen ? "max-sm:hidden" : ""} sm:flex`}>
      {user ? (
        <>
          <NavLink
            to="/notification"
            className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 10 ? "10+" : unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to={`/information/${user.id}`}
            className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-200"
          >
            <img
              src={
                user.avatar?.startsWith("http")
                  ? user.avatar
                  : `/avatar/${user.avatar || "user.png"}`
              }
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/sign-in"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
        >
          <span className="inline-flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </span>
        </NavLink>
      )}
    </div>
  )
}

export default HeaderRight