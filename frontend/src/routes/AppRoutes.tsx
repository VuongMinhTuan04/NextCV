import { matchPath, Route, Routes, useLocation } from "react-router"
import { useEffect, useState } from "react"

import MainLayout from "../layout/MainLayout"
import HomePage from "../pages/HomePage"
import NotFound from "../pages/NotFound"
import PageLoader from "../components/loaders/PageLoader"

const AppRoutes = () => {
  const validRoutes = [
    "/"
  ]

  const isValidPath = (pathname: string) => {
    return validRoutes.some((route) =>
      matchPath({ path: route, end: true }, pathname)
    )
  }

  const location = useLocation()
  const [pageLoading, setPageLoading] = useState(false)
  const validPath = isValidPath(location.pathname)

  useEffect(() => {
    if (!validPath) {
      setPageLoading(false)
      return
    }

    setPageLoading(true)

    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 700)

    return () => clearTimeout(timer)
  }, [location.pathname, validPath])

  if (!validPath) {
    return (
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  if (pageLoading) {
    return (
      <MainLayout>
        <PageLoader />
      </MainLayout>
    )
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes