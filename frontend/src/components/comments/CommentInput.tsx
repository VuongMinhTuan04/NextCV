import { useRef, type ChangeEvent } from "react"
import {
  FileText,
  Image as ImageIcon,
  Paperclip,
  Send,
  X,
} from "lucide-react"

import type { User } from "../../services/mockPosts"
import type { AttachmentKind } from "../../utils/file"

import Avatar from "../commons/Avatar"
import AutoResizeTextarea from "../commons/AutoResizeTextarea"

type Props = {
  currentUser: User
  value: string
  file: File | null
  fileName: string
  fileKind: AttachmentKind | null
  canSend: boolean
  onChange: (value: string) => void
  onSelectFile: (file: File | null) => void
  onRemoveFile: () => void
  onSend: () => void
}

const CommentInput = ({
  currentUser,
  value,
  file,
  fileName,
  fileKind,
  canSend,
  onChange,
  onSelectFile,
  onRemoveFile,
  onSend,
}: Props) => {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const nextFile =
      event.target.files?.[0] ?? null

    onSelectFile(nextFile)
    event.target.value = ""
  }

  const isImage = fileKind === "image"
  const isPdf = fileKind === "pdf"

  const Icon = isImage ? ImageIcon : FileText

  const wrapperClass = isImage
    ? "border-cyan-100 bg-cyan-50"
    : isPdf
      ? "border-rose-100 bg-rose-50"
      : "border-sky-100 bg-sky-50"

  const iconClass = isImage
    ? "bg-cyan-100 text-cyan-700"
    : isPdf
      ? "bg-rose-100 text-rose-700"
      : "bg-sky-100 text-sky-700"

  const textClass = isImage
    ? "text-cyan-700"
    : isPdf
      ? "text-rose-700"
      : "text-sky-700"

  const avatarSrc =
    currentUser.avatar?.startsWith("http")
      ? currentUser.avatar
      : `/avatar/${currentUser.avatar || "user.png"}`

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Avatar
          src={avatarSrc}
          alt={currentUser.fullName}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <AutoResizeTextarea
              value={value}
              onChange={(event) =>
                onChange(event.target.value)
              }
              placeholder="Viết bình luận..."
              className="max-h-44 min-h-[40px] w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={openFilePicker}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
            canSend
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-200 text-slate-400"
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {file && fileKind && (
        <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3">
          <div />

          <div
            className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 ${wrapperClass}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${iconClass}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span
                className={`truncate text-sm font-medium ${textClass}`}
              >
                {fileName}
              </span>
            </div>

            <button
              type="button"
              onClick={onRemoveFile}
              className="grid h-8 w-8 place-items-center rounded-full text-red-500 transition hover:bg-red-100 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default CommentInput