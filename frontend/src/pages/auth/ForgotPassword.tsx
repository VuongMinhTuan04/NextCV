import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Send, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { authApi } from "../../services/api"

type ForgotPasswordErrors = {
  email?: string
  code?: string
  newPassword?: string
  confirmPassword?: string
}

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<ForgotPasswordErrors>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSendCode = async () => {
    const newErrors: ForgotPasswordErrors = {}
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

    try {
      setIsSendingCode(true)
      await authApi.sendForgotPasswordCode(trimmedEmail)
      setErrors({})
      setStep(2)
      toast.success("Gửi mã xác nhận thành công", { duration: 1000 })
    } catch (error: any) {
      const message = error?.response?.data?.message || "Gửi mã thất bại"
      setErrors({ email: message })
      toast.error(message, { duration: 1000 })
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    const newErrors: ForgotPasswordErrors = {}
    const trimmedEmail = email.trim()
    const trimmedCode = code.trim()

    if (!trimmedCode) {
      newErrors.code = "Vui lòng nhập mã xác nhận"
    } else if (!/^\d{6}$/.test(trimmedCode)) {
      newErrors.code = "Mã xác nhận phải gồm 6 số"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsVerifyingCode(true)
      await authApi.verifyForgotPasswordCode(trimmedEmail, trimmedCode)
      setErrors({})
      setStep(3)
      toast.success("Xác nhận mã thành công", { duration: 1000 })
    } catch (error: any) {
      const message = error?.response?.data?.message || "Mã xác nhận không đúng"
      setErrors({ code: message })
      toast.error(message, { duration: 1000 })
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleChangePassword = async () => {
    const newErrors: ForgotPasswordErrors = {}
    const trimmedNewPassword = newPassword.trim()
    const trimmedConfirmPassword = confirmPassword.trim()
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

    if (!trimmedConfirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
    } else if (trimmedConfirmPassword !== trimmedNewPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsResettingPassword(true)
      await authApi.resetForgotPassword(
        email.trim(),
        code.trim(),
        trimmedNewPassword,
        trimmedConfirmPassword
      )
      setErrors({})
      toast.success("Đổi mật khẩu thành công", { duration: 1000 })
      navigate("/sign-in")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Đổi mật khẩu thất bại"
      setErrors({
        newPassword: message,
      })
      toast.error(message, { duration: 1000 })
    } finally {
      setIsResettingPassword(false)
    }
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
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
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
              disabled={isSendingCode}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              <Send className="h-5 w-5" />
              {isSendingCode ? "Đang gửi..." : "Gửi mã"}
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
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
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
              disabled={isVerifyingCode}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {isVerifyingCode ? "Đang xác nhận..." : "Xác nhận"}
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
              disabled={isResettingPassword}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {isResettingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
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