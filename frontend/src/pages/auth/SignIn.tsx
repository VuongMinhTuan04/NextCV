import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useRedirectAfterLogin } from "../../hooks/auths/useRedirectAfterLogin"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const { goToRedirect } = useRedirectAfterLogin()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmail = emailRegex.test(email.trim())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail || password.trim() === "") return

    if (login(email, password)) {
      goToRedirect()
    } else {
      setError("Sai tài khoản hoặc mật khẩu")
      setPassword("")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-blue-900">NextCV</h2>
        <p className="mt-1 text-center text-sm text-slate-500">Đăng nhập vào NextCV nhé</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-blue-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Nhớ mật khẩu
            </label>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">Quên mật khẩu?</a>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isValidEmail || password.trim() === ""}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition ${
              isValidEmail && password.trim() !== ""
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            <LogIn className="h-5 w-5" />
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-800">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn