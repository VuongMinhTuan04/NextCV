import { BrowserRouter } from "react-router"
import { Toaster } from "sonner"
import AppRoutes from "./routes/AppRoutes"
import { useEffect, useState } from "react"
import AppLoader from "./components/loaders/AppLoader"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <AppLoader />
  }

  return (
    <>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
