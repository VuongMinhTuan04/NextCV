import { Outlet } from "react-router"
import Header from "./Header"

type Props = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <Header />
      <main className="pt-14 pb-2 sm:pt-16 lg:pt-18">
        <div className="mx-auto w-full max-w-7xl">
          {children ? children : <Outlet />}
        </div>
      </main>
    </div>
  )
}

export default MainLayout