import { useRef, type ChangeEvent } from "react"
import { Camera, KeyRound, PencilLine, Save } from "lucide-react"

import type {
  EditInformationErrors,
  EditInformationFormState,
  EditInformationField,
} from "../../hooks/informations/useInformationPage"

type Props = {
  open: boolean
  form: EditInformationFormState
  errors: EditInformationErrors
  isDirty: boolean
  onFieldChange: (field: EditInformationField, value: string) => void
  onAvatarChange: (file: File | null) => void
  onUpdate: () => void
  onOpenPassword: () => void
  onClose: () => void
}

const EditInformation = ({
  open,
  form,
  errors,
  isDirty,
  onFieldChange,
  onAvatarChange,
  onUpdate,
  onOpenPassword,
  onClose,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const isComposing = useRef(false)

  if (!open) return null

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    onAvatarChange(nextFile)
    event.target.value = ""
  }

  const handleFullNameChange = (value: string) => {
    const cleaned = value.replace(/[^\p{L}\s]/gu, "")
    if (isComposing.current) {
      onFieldChange("fullName", cleaned)
      return
    }
    onFieldChange("fullName", cleaned.slice(0, 50))
  }

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (isComposing.current) {
      onFieldChange("phone", cleaned)
      return
    }
    onFieldChange("phone", cleaned.slice(0, 11))
  }

  const handleAboutChange = (value: string) => {
    if (isComposing.current) {
      onFieldChange("about", value)
      return
    }
    onFieldChange("about", value.slice(0, 100))
  }

  const aboutLineCount = form.about.replace(/\r\n/g, "\n").split("\n").length

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:rounded-[28px]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600">
              <PencilLine className="h-4.5 w-4.5" />
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Cập nhật thông tin
            </h2>
          </div>

          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="order-2 space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:order-1">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  disabled
                  value={form.email}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  value={form.fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  onCompositionStart={() => { isComposing.current = true }}
                  onCompositionEnd={(e) => {
                    isComposing.current = false
                    handleFullNameChange(e.currentTarget.value)
                  }}
                  placeholder="Nhập họ và tên"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                    errors.fullName
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                      : "border-slate-200 bg-white focus:border-blue-300"
                  }`}
                />
                <div className="mt-1 text-right text-xs text-slate-400">
                  {form.fullName.length}/50
                </div>
                {errors.fullName && (
                  <p className="mt-2 text-sm text-rose-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onCompositionStart={() => { isComposing.current = true }}
                  onCompositionEnd={(e) => {
                    isComposing.current = false
                    handlePhoneChange(e.currentTarget.value)
                  }}
                  inputMode="numeric"
                  placeholder="Nhập số điện thoại"
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                    errors.phone
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                      : "border-slate-200 bg-white focus:border-blue-300"
                  }`}
                />
                <div className="mt-1 text-right text-xs text-slate-400">
                  {form.phone.length}/11
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-rose-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mô tả bản thân
                </label>
                <textarea
                  value={form.about}
                  placeholder="Viết vài dòng giới thiệu về bạn"
                  rows={4}
                  className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                    errors.about
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-400"
                      : "border-slate-200 bg-white focus:border-blue-300"
                  }`}
                  onChange={(e) => handleAboutChange(e.target.value)}
                  onCompositionStart={() => { isComposing.current = true }}
                  onCompositionEnd={(e) => {
                    isComposing.current = false
                    handleAboutChange(e.currentTarget.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && aboutLineCount >= 2) {
                      event.preventDefault()
                    }
                  }}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Không bắt buộc</span>
                  <span>{form.about.length}/100</span>
                </div>
                {errors.about && (
                  <p className="mt-2 text-sm text-rose-500">{errors.about}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-1 lg:flex-row">
                <button
                  type="button"
                  onClick={onUpdate}
                  disabled={!isDirty}
                  className="inline-flex min-w-[160px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  <Save className="h-4 w-4" />
                  <span>Cập nhật thông tin</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenPassword}
                  className="inline-flex min-w-[160px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Đổi mật khẩu</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-w-[160px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  <span>Đóng</span>
                </button>
              </div>
            </div>

            <div className="order-1 border-b border-slate-100 bg-slate-50 px-4 py-5 sm:px-6 lg:order-2 lg:border-b-0 lg:border-l lg:px-6 lg:py-6">
              <div className="flex h-full flex-col items-center justify-center rounded-[24px] border border-slate-100 bg-white px-4 py-5 shadow-sm sm:px-6 sm:py-6">
                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl sm:h-32 sm:w-32 lg:h-40 lg:w-40">
                    <img
                      src={form.avatar}
                      alt={form.fullName || "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-1 right-1 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-slate-600 shadow-lg transition hover:bg-blue-50 hover:text-blue-700"
                    aria-label="Đổi ảnh đại diện"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5 text-center">
                  <h4 className="text-base font-semibold text-slate-900">
                    Ảnh đại diện
                  </h4>
                  <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                    Chọn ảnh JPG, PNG hoặc WebP để cập nhật hình đại diện.
                  </p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditInformation