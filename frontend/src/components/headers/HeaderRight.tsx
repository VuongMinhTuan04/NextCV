import { Bell } from "lucide-react"
import { NavLink } from "react-router-dom"

type Props = {
  mobileSearchOpen: boolean
}

const HeaderRight = ({ mobileSearchOpen }: Props) => {
  return (
    <div
      className={`flex items-center gap-4 ${
        mobileSearchOpen ? "max-sm:hidden" : ""
      } sm:flex`}
    >
      <NavLink
        to="/notification"
        className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      </NavLink>

      <NavLink
        to="/information"
        className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-200"
      >
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </NavLink>
    </div>
  )
}

export default HeaderRight