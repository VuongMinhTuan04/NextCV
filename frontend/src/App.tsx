import { BrowserRouter, useLocation, matchPath } from "react-router"
import { Toaster } from "sonner"
import { useEffect, useState } from "react"

import AppRoutes from "./routes/AppRoutes"
import AppLoader from "./components/loaders/AppLoader"

const validRoutes = [
  "/",
]

const isValidPath = (pathname: string) => {
  return validRoutes.some((route) =>
    matchPath({ path: route, end: true }, pathname)
  )
}

const AppContent = () => {
  const location = useLocation()

  const [loading, setLoading] = useState(true)

  const validPath = isValidPath(location.pathname)

  useEffect(() => {
    if (!validPath) {
      setLoading(false)
      document.body.style.overflow = ""
      return
    }

    setLoading(true)
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setLoading(false)
      document.body.style.overflow = ""
    }, 2000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [location.pathname, validPath])

  if (loading && validPath) {
    return <AppLoader />
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App