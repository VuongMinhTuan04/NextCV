import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"
import { authApi } from "../../services/api"

const SignUp = () => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    setPhone(digits)
    setErrors((prev) => ({ ...prev, phone: "" }))
  }

  const hasVietnameseDiacritics = (str: string) => {
    return /[^\x00-\x7F]/.test(str)
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    const trimmedEmail = email.trim()
    const trimmedFullName = fullName.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!trimmedPassword) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    } else if (hasVietnameseDiacritics(password)) {
      newErrors.password = "Mật khẩu không được nhập chữ có dấu"
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Mật khẩu ít nhất 6 ký tự"
    } else if (!/^[ -~]+$/.test(password)) {
      newErrors.password = "Mật khẩu không hợp lệ"
    }

    if (!trimmedFullName) {
      newErrors.fullName = "Vui lòng nhập họ và tên"
    } else if (fullName !== trimmedFullName) {
      newErrors.fullName = "Không được có khoảng cách ở đầu hoặc cuối"
    } else if (!/^[\p{L}\s]+$/u.test(trimmedFullName)) {
      newErrors.fullName = "Họ và tên không hợp lệ"
    }

    if (!phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    } else if (phone.length < 10) {
      newErrors.phone = "Số điện thoại không ít hơn 10 số"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      await authApi.signUp({
        email: email.trim(),
        password,
        fullname: fullName.trim(),
        phone,
      })

      navigate("/sign-in", { replace: true, state: { email: email.trim() } })
    } catch (error: any) {
      const message = error?.response?.data?.message || "Đăng ký thất bại"

      if (String(message).toLowerCase().includes("email")) {
        setErrors({ email: message })
      } else if (String(message).toLowerCase().includes("password")) {
        setErrors({ password: message })
      } else if (String(message).toLowerCase().includes("phone")) {
        setErrors({ phone: message })
      } else if (String(message).toLowerCase().includes("full name")) {
        setErrors({ fullName: message })
      } else {
        setErrors({ email: message })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-blue-900">NextCV</h2>
        <p className="mt-1 text-center text-sm text-slate-500">Tạo tài khoản để bắt đầu</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" />
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.replace(/\s/g, ""))
                setErrors((prev) => ({ ...prev, email: "" }))
              }}
              placeholder="example@gmail.com"
              className={`w-full rounded-xl border py-2.5 px-4 text-sm outline-none transition ${
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
              Mật khẩu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.replace(/\s/g, ""))
                  setErrors((prev) => ({ ...prev, password: "" }))
                }}
                placeholder="Nhập mật khẩu"
                className={`w-full rounded-xl border py-2.5 px-4 pr-12 text-sm outline-none transition ${
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
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value.slice(0, 50))
                setErrors((prev) => ({ ...prev, fullName: "" }))
              }}
              placeholder="Nhập họ và tên"
              className={`w-full rounded-xl border py-2.5 px-4 text-sm outline-none transition ${
                errors.fullName
                  ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                  : "border-slate-200 bg-slate-50 focus:border-blue-300"
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              {errors.fullName ? (
                <span className="text-rose-500">{errors.fullName}</span>
              ) : (
                <span />
              )}
              <span>{fullName.length}/50</span>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Phone className="h-4 w-4 text-slate-400" />
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Nhập số điện thoại"
              inputMode="numeric"
              className={`w-full rounded-xl border py-2.5 px-4 text-sm outline-none transition ${
                errors.phone
                  ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                  : "border-slate-200 bg-slate-50 focus:border-blue-300"
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              {errors.phone ? (
                <span className="text-rose-500">{errors.phone}</span>
              ) : (
                <span />
              )}
              <span>{phone.length}/11</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            <UserPlus className="h-5 w-5" />
            Đăng ký
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link to="/sign-in" className="font-medium text-blue-600 hover:text-blue-800">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp