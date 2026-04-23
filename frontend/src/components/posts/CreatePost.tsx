import { useRef, type ChangeEvent } from "react"
import {
  FileText,
  Image as ImageIcon,
  Paperclip,
  Send,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import type { User } from "../../services/mockPosts"
import type { AttachmentKind } from "../../utils/file"
import { useCreatePost } from "../../hooks/posts/useCreatePost"

import Avatar from "../commons/Avatar"
import AutoResizeTextarea from "../commons/AutoResizeTextarea"

type Props = {
  currentUser: User
  onCreatePost: (payload: {
    title: string
    file: File
  }) => void
}

type FileChipProps = {
  name: string
  kind: AttachmentKind
  onRemove: () => void
}

const FileChip = ({
  name,
  kind,
  onRemove,
}: FileChipProps) => {
  const isImage = kind === "image"
  const isPdf = kind === "pdf"

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

  return (
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
          {name}
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="grid h-8 w-8 place-items-center rounded-full text-red-500 transition hover:bg-red-100 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

const CreatePost = ({
  currentUser,
  onCreatePost,
}: Props) => {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const {
    title,
    setTitle,
    file,
    fileName,
    fileKind,
    canSubmit,
    selectFile,
    removeFile,
    reset,
  } = useCreatePost()

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const nextFile =
      event.target.files?.[0] ?? null

    selectFile(nextFile)
    event.target.value = ""
  }

  const handleRemoveFile = () => {
    removeFile()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!canSubmit || !file) return

    onCreatePost({
      title: title.trim(),
      file,
    })

    reset()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    toast.success("Đăng bài thành công")
  }

  const handleAvatarClick = () => {
    navigate(`/information/${currentUser.id}`)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <button
          type="button"
          onClick={handleAvatarClick}
          className="shrink-0 rounded-full cursor-pointer transition hover:opacity-80"
        >
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.fullName}
          />
        </button>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <AutoResizeTextarea
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Bạn đang nghĩ gì?"
              className="max-h-52 min-h-[40px] w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={openFilePicker}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${
            canSubmit
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
          <FileChip
            name={fileName}
            kind={fileKind}
            onRemove={handleRemoveFile}
          />
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
    </section>
  )
}

export default CreatePost