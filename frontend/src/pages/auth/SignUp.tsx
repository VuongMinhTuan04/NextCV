import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useRedirectAfterLogin } from "../../hooks/auths/useRedirectAfterLogin"

const buildPasswordStrength = (value: string) => {
  if (!value) return { score: 0, label: "Chưa nhập" }
  let score = 0
  if (value.length >= 6) score++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score++
  const final = Math.min(score, 3) as 0 | 1 | 2 | 3
  return {
    score: final,
    label: final <= 1 ? "Yếu" : final === 2 ? "Trung bình" : "Mạnh",
  }
}

const SignUp = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const { goToRedirect } = useRedirectAfterLogin()

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    setPhone(digits)
  }

  const passwordStrength = useMemo(() => buildPasswordStrength(password), [password])

  const isFormValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.length >= 10 &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password.length >= 6

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }
    if (!isFormValid) return

    if (login(email, password)) {
      goToRedirect()
    } else {
      setError("Đăng ký thất bại. Vui lòng thử email khác.")
    }
  }

  const strengthWidth = `${(passwordStrength.score / 3) * 100}%`
  const strengthColor =
    passwordStrength.score <= 1
      ? "bg-rose-500"
      : passwordStrength.score === 2
        ? "bg-amber-500"
        : "bg-emerald-500"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900 text-center">Tạo tài khoản</h1>
        <p className="mt-2 text-sm text-slate-500 text-center">Nhập thông tin để bắt đầu</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300"
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">Ví dụ: example@gmail.com</div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="0123456789"
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300"
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Tối thiểu 10 chữ số</span>
              <span>{phone.length}/11</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300"
              />
            </div>
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${strengthColor}`}
                  style={{ width: strengthWidth }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Ít nhất 6 ký tự</span>
                <span>{passwordStrength.label}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-300"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            <UserPlus className="h-5 w-5" />
            Đăng ký
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-800">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp