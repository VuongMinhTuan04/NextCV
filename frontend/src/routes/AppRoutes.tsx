import { Route, Routes } from "react-router"
import MainLayout from "../layout/MainLayout"
import HomePage from "../pages/HomePage"
import NotFound from "../pages/NotFound"
import Information from "../pages/Information"
import Notification from "../pages/Notification"
import SignIn from "../pages/auth/SignIn"
import SignUp from "../pages/auth/SignUp"
import ForgotPassword from "../pages/auth/ForgotPassword"

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/information" element={<Information />} />
        <Route path="/information/:id" element={<Information />} />
        <Route path="/notification" element={<Notification />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes