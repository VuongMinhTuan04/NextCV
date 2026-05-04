import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Send, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const emailRegex = /^[^\s@]+@gmail\.com$/i
  const mockCode = "123456"

  const handleSendCode = () => {
    const newErrors: typeof errors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    toast.success("Gửi mã xác nhận thành công", { duration: 1000 })
    setErrors({})
    setStep(2)
  }

  const handleVerifyCode = () => {
    const newErrors: typeof errors = {}

    if (!code.trim()) {
      newErrors.code = "Vui lòng nhập mã xác nhận"
    } else if (code.trim() !== mockCode) {
      newErrors.code = "Mã xác nhận không đúng"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStep(3)
  }

  const handleChangePassword = () => {
    const newErrors: typeof errors = {}
    const trimmedNewPassword = newPassword.trim()
    const hasVietnameseDiacritics = /[^\x00-\x7F]/.test(newPassword)

    if (!trimmedNewPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu"
    } else if (hasVietnameseDiacritics) {
      newErrors.newPassword = "Mật khẩu không được nhập chữ có dấu"
    } else if (trimmedNewPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu ít nhất 6 ký tự"
    } else if (!/^[ -~]+$/.test(newPassword)) {
      newErrors.newPassword = "Mật khẩu không hợp lệ"
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    toast.success("Đổi mật khẩu thành công", { duration: 1000 })
    navigate("/signin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-blue-900">NextCV</h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          {step === 1 ? "Quên mật khẩu" : step === 2 ? "Nhập mã xác nhận" : "Đổi mật khẩu"}
        </p>

        {step === 1 && (
          <div className="mt-8 space-y-4">
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

            <button
              type="button"
              onClick={handleSendCode}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
            >
              <Send className="h-5 w-5" />
              Gửi mã
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4 text-slate-400" />
                Mã xác nhận <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  setErrors((prev) => ({ ...prev, code: "" }))
                }}
                placeholder="Nhập mã 6 số"
                maxLength={6}
                className={`w-full rounded-xl border py-3 px-4 text-sm outline-none transition ${
                  errors.code
                    ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                    : "border-slate-200 bg-slate-50 focus:border-blue-300"
                }`}
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                {errors.code ? (
                  <span className="text-rose-500">{errors.code}</span>
                ) : (
                  <span />
                )}
                <span />
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyCode}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
            >
              Xác nhận
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1)
                setCode("")
                setErrors({})
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Lock className="h-4 w-4 text-slate-400" />
                Mật khẩu mới <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value.replace(/\s/g, ""))
                    setErrors((prev) => ({ ...prev, newPassword: "" }))
                  }}
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full rounded-xl border py-2.5 px-4 pr-12 text-sm outline-none transition ${
                    errors.newPassword
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                      : "border-slate-200 bg-slate-50 focus:border-blue-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-rose-500">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Lock className="h-4 w-4 text-slate-400" />
                Xác nhận mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value.replace(/\s/g, ""))
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                  }}
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full rounded-xl border py-2.5 px-4 pr-12 text-sm outline-none transition ${
                    errors.confirmPassword
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                      : "border-slate-200 bg-slate-50 focus:border-blue-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-500">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer"
            >
              Đổi mật khẩu
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/sign-in" className="font-medium text-blue-600 hover:text-blue-800">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword