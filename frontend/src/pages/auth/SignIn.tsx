import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const SignIn = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search)
    const redirect = searchParams.get("redirect")

    if (redirect && redirect.startsWith("/")) {
      return redirect
    }

    return "/"
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!trimmedPassword) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    const result = await login(email.trim(), password, rememberMe)

    setIsSubmitting(false)

    if (result.ok) {
      navigate(getRedirectPath(), { replace: true })
      return
    }

    setErrors({ password: result.message ?? "Sai email hoặc mật khẩu" })
    setPassword("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-blue-900">NextCV</h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Đăng nhập vào NextCV nhé
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" />
              Email
            </label>
            <input
              type="text"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.replace(/\s/g, ""))
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              placeholder="example@gmail.com"
              className={`w-full rounded-xl border py-3 px-4 text-sm outline-none transition ${
                errors.email
                  ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                  : "border-slate-200 bg-slate-50 focus:border-blue-300"
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              {errors.email ? (
                <span className="text-rose-500">{errors.email}</span>
              ) : (
                <span />
              )}
              <span />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Lock className="h-4 w-4 text-slate-400" />
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.replace(/\s/g, ""))
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="Nhập mật khẩu"
                className={`w-full rounded-xl border py-3 px-4 pr-12 text-sm outline-none transition ${
                  errors.password
                    ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                    : "border-slate-200 bg-slate-50 focus:border-blue-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              {errors.password ? (
                <span className="text-rose-500">{errors.password}</span>
              ) : (
                <span />
              )}
              <span />
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
              Ghi nhớ đăng nhập
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogIn className="h-5 w-5" />
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link to="/sign-up" className="font-medium text-blue-600 hover:text-blue-800">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn