import { Outlet } from "react-router"

import Header from "./Header"

type Props = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-[#EFF1F3]">
      <Header />

      <main className="pt-16 pb-6 sm:pt-18 lg:pt-20">
        <div className="mx-auto w-full max-w-7xl">
          {children ? children : <Outlet />}
        </div>
      </main>
    </div>
  )
}

export default MainLayout