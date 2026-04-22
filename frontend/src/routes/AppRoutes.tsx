import { matchPath, Route, Routes, useLocation } from "react-router"
import { useEffect, useState } from "react"

import MainLayout from "../layout/MainLayout"
import HomePage from "../pages/HomePage"
import NotFound from "../pages/NotFound"
import PageLoader from "../components/loaders/PageLoader"
import Information from "../pages/Information"

const validRoutes = ["/", "/information", "/information/:id"]

const isValidPath = (pathname: string) => {
  return validRoutes.some((route) =>
    matchPath({ path: route, end: true }, pathname)
  )
}

const AppRoutes = () => {
  const location = useLocation()
  const [pageLoading, setPageLoading] = useState(false)

  const validPath = isValidPath(location.pathname)

  useEffect(() => {
    if (!validPath) {
      setPageLoading(false)
      document.body.style.overflow = ""
      return
    }

    setPageLoading(true)
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setPageLoading(false)
      document.body.style.overflow = ""
    }, 700)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
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
        <Route path="/information" element={<Information />} />
        <Route path="/information/:id" element={<Information />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes