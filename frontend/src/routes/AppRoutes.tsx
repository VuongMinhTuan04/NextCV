import { Route, Routes } from "react-router"
import MainLayout from "../layout/MainLayout"
import HomePage from "../pages/HomePage"
import NotFound from "../pages/NotFound"
import Information from "../pages/Information"
import Notification from "../pages/Notification"

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/information" element={<Information />} />
        <Route path="/information/:id" element={<Information />} />
        <Route path="/notification" element={<Notification />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes