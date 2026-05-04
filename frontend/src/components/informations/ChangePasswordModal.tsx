import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react"

import type {
  ChangePasswordErrors,
  ChangePasswordFormState,
} from "../../hooks/informations/validation"

type Props = {
  open: boolean
  form: ChangePasswordFormState
  errors: ChangePasswordErrors
  onFieldChange: (
    field: keyof ChangePasswordFormState,
    value: string
  ) => void
  onChangePassword: () => void
  onBack: () => void
}

const PasswordField = ({
  label,
  value,
  error,
  placeholder,
  onChange,
  visible,
  onToggleVisible,
}: {
  label: string
  value: string
  error?: string
  placeholder: string
  onChange: (value: string) => void
  visible: boolean
  onToggleVisible: () => void
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div
        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${
          error
            ? "border-rose-300 bg-rose-50/60 focus-within:border-rose-400"
            : "border-slate-200 bg-white focus-within:border-blue-300"
        }`}
      >
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/\s/g, ""))}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={onToggleVisible}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {visible ? (
            <EyeOff className="h-4.5 w-4.5" />
          ) : (
            <Eye className="h-4.5 w-4.5" />
          )}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  )
}

const ChangePasswordModal = ({
  open,
  form,
  errors,
  onFieldChange,
  onChangePassword,
  onBack,
}: Props) => {
  const [visible, setVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-2xl items-center justify-center">
        <div
          className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:rounded-[28px]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-700">
                  <LockKeyhole className="h-4 w-4" />
                </span>
                <span>Đổi mật khẩu</span>
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Cập nhật mật khẩu mới để tăng độ an toàn cho tài khoản.
              </p>
            </div>
          </div>

          <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-6">
            <PasswordField
              label="Mật khẩu cũ"
              value={form.oldPassword}
              error={errors.oldPassword}
              placeholder="Nhập mật khẩu cũ"
              visible={visible.oldPassword}
              onToggleVisible={() =>
                setVisible((prev) => ({
                  ...prev,
                  oldPassword: !prev.oldPassword,
                }))
              }
              onChange={(value) => onFieldChange("oldPassword", value)}
            />

            <PasswordField
              label="Mật khẩu mới"
              value={form.newPassword}
              error={errors.newPassword}
              placeholder="Nhập mật khẩu mới"
              visible={visible.newPassword}
              onToggleVisible={() =>
                setVisible((prev) => ({
                  ...prev,
                  newPassword: !prev.newPassword,
                }))
              }
              onChange={(value) => onFieldChange("newPassword", value)}
            />

            <PasswordField
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              visible={visible.confirmPassword}
              onToggleVisible={() =>
                setVisible((prev) => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword,
                }))
              }
              onChange={(value) =>
                onFieldChange("confirmPassword", value)
              }
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={onChangePassword}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <LockKeyhole className="h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal