import { BrowserRouter } from "react-router"
import { Toaster } from "sonner"
import AppRoutes from "./routes/AppRoutes"

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App