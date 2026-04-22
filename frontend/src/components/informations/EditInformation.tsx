import { useRef, type ChangeEvent } from "react"
import {
  Camera,
  KeyRound,
  Save,
  X,
} from "lucide-react"

import type {
  EditInformationErrors,
  EditInformationFormState,
} from "../../hooks/informations/useInformationPage"

import AutoResizeTextarea from "../commons/AutoResizeTextarea"

type Props = {
  open: boolean
  form: EditInformationFormState
  errors: EditInformationErrors
  onFieldChange: (
    field: "fullName" | "phone" | "description",
    value: string
  ) => void
  onAvatarChange: (file: File | null) => void
  onUpdate: () => void
  onOpenPassword: () => void
  onClose: () => void
}

const EditInformationModal = ({
  open,
  form,
  errors,
  onFieldChange,
  onAvatarChange,
  onUpdate,
  onOpenPassword,
  onClose,
}: Props) => {
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  if (!open) return null

  const handleAvatarPicker = () => {
    avatarInputRef.current?.click()
  }

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const nextFile = event.target.files?.[0] ?? null
    onAvatarChange(nextFile)
    event.target.value = ""
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Cập nhật thông tin
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Chỉnh sửa họ tên, số điện thoại, mô tả và ảnh đại diện.
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

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={form.email}
                disabled
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Họ và tên
              </label>
              <input
                value={form.fullName}
                onChange={(event) =>
                  onFieldChange("fullName", event.target.value)
                }
                placeholder="Nhập họ và tên"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                  errors.fullName
                    ? "border-rose-300 bg-rose-50 focus:border-rose-500"
                    : "border-slate-200 bg-white focus:border-blue-300"
                }`}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-rose-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                value={form.phone}
                onChange={(event) =>
                  onFieldChange("phone", event.target.value)
                }
                inputMode="numeric"
                placeholder="Nhập số điện thoại"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                  errors.phone
                    ? "border-rose-300 bg-rose-50 focus:border-rose-500"
                    : "border-slate-200 bg-white focus:border-blue-300"
                }`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-rose-500">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Mô tả bản thân
              </label>
              <AutoResizeTextarea
                value={form.description}
                onChange={(event) =>
                  onFieldChange("description", event.target.value)
                }
                maxLength={255}
                placeholder="Viết vài dòng giới thiệu về bạn"
                className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Không bắt buộc</span>
                <span>{form.description.length}/255</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={onUpdate}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Cập nhật thông tin</span>
              </button>

              <button
                type="button"
                onClick={onOpenPassword}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                <KeyRound className="h-4 w-4" />
                <span>Đổi mật khẩu</span>
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

          <div className="flex flex-col items-center justify-center rounded-[24px] border border-slate-100 bg-slate-50 px-6 py-8">
            <div className="relative">
              <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl">
                <img
                  src={form.avatar}
                  alt={form.fullName || "Avatar"}
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={handleAvatarPicker}
                className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-600 shadow-lg transition hover:bg-blue-50 hover:text-blue-700"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <h4 className="text-base font-semibold text-slate-900">
                Ảnh đại diện
              </h4>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Chọn một ảnh JPG, PNG hoặc WebP để cập nhật hình đại diện.
              </p>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditInformationModal