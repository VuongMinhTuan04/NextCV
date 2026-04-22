import { ArrowLeft, LockKeyhole, X } from "lucide-react"

import type {
  ChangePasswordErrors,
  ChangePasswordFormState,
  PasswordStrengthState,
} from "../../hooks/informations/useInformationPage"

type Props = {
  open: boolean
  form: ChangePasswordFormState
  errors: ChangePasswordErrors
  strength: PasswordStrengthState
  onFieldChange: (
    field: keyof ChangePasswordFormState,
    value: string
  ) => void
  onChangePassword: () => void
  onBack: () => void
  onClose: () => void
}

const ChangePasswordModal = ({
  open,
  form,
  errors,
  strength,
  onFieldChange,
  onChangePassword,
  onBack,
  onClose,
}: Props) => {
  if (!open) return null

  const strengthBlocks = [
    {
      label: "Thấp",
      active: strength.score >= 1,
      barClass: "bg-rose-500",
      boxClass: "border-rose-100 bg-rose-50",
    },
    {
      label: "Trung bình",
      active: strength.score >= 2,
      barClass: "bg-amber-500",
      boxClass: "border-amber-100 bg-amber-50",
    },
    {
      label: "Cao",
      active: strength.score >= 3,
      barClass: "bg-emerald-500",
      boxClass: "border-emerald-100 bg-emerald-50",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Đổi mật khẩu
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Cập nhật mật khẩu mới để tăng độ an toàn cho tài khoản.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              value={form.oldPassword}
              onChange={(event) =>
                onFieldChange("oldPassword", event.target.value)
              }
              placeholder="Nhập mật khẩu cũ"
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.oldPassword
                  ? "border-rose-300 bg-rose-50 focus:border-rose-500"
                  : "border-slate-200 bg-white focus:border-blue-300"
              }`}
            />
            {errors.oldPassword && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.oldPassword}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(event) =>
                onFieldChange("newPassword", event.target.value)
              }
              placeholder="Nhập mật khẩu mới"
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.newPassword
                  ? "border-rose-300 bg-rose-50 focus:border-rose-500"
                  : "border-slate-200 bg-white focus:border-blue-300"
              }`}
            />
            {errors.newPassword && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.newPassword}
              </p>
            )}

            <div className="mt-4 grid grid-cols-3 gap-3">
              {strengthBlocks.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border px-3 py-3 transition ${
                    item.active ? item.boxClass : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`h-2 rounded-full ${
                      item.active ? item.barClass : "bg-slate-200"
                    }`}
                  />
                  <p className="mt-2 text-center text-xs font-medium text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Mật khẩu cần tối thiểu 6 ký tự.</span>
              <span>{strength.label}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                onFieldChange("confirmPassword", event.target.value)
              }
              placeholder="Nhập lại mật khẩu mới"
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.confirmPassword
                  ? "border-rose-300 bg-rose-50 focus:border-rose-500"
                  : "border-slate-200 bg-white focus:border-blue-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-rose-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onChangePassword}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <LockKeyhole className="h-4 w-4" />
              <span>Đổi mật khẩu</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
              <span>Đóng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal