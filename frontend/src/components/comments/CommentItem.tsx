import {
  Download,
  Edit3,
  FileBadge,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

import type { CommentItem as CommentType, User } from "../../types/post"

import Avatar from "../commons/Avatar"
import AutoResizeTextarea from "../commons/AutoResizeTextarea"
import DropdownMenu from "../commons/DropdownMenu"

const resolveAvatar = (src?: string) => {
  const value = (src ?? "").trim()

  if (!value) return "/avatar/user.png"
  if (value.startsWith("http")) return value
  if (value.startsWith("blob:")) return value
  if (value.startsWith("data:")) return value
  if (value.startsWith("/avatar/")) return value

  return `/avatar/${value.replace(/^\/+/, "")}`
}

const formatTime = (date: string) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

  if (diff < 60) return "Vừa xong"
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  return `${Math.floor(diff / 86400)} ngày trước`
}

type Props = {
  comment: CommentType
  currentUser: User
  onUpdate: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  onPreviewImage?: (src: string) => void
}

const CommentItem = ({
  comment,
  currentUser,
  onUpdate,
  onDelete,
  onPreviewImage,
}: Props) => {
  const isMine = comment.user.id === currentUser.id
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [draftContent, setDraftContent] = useState(comment.content)
  const [time, setTime] = useState(formatTime(comment.createdAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(comment.createdAt))
    }, 60000)

    return () => clearInterval(interval)
  }, [comment.createdAt])

  useEffect(() => {
    if (!isEditing) {
      setDraftContent(comment.content)
    }
  }, [comment.content, isEditing])

  const handleSave = () => {
    const nextContent = draftContent.trim()
    if (!nextContent) return

    onUpdate(comment.id, nextContent)
    setIsEditing(false)
    toast.success("Sửa bình luận thành công", { duration: 1000 })
  }

  const handleDelete = () => {
    onDelete(comment.id)
    toast.success("Xóa bình luận thành công", { duration: 1000 })
  }

  const handleAvatarClick = () => {
    if (!isAuthenticated) {
      navigate(`/sign-in?redirect=${encodeURIComponent(`/information/${comment.user.id}`)}`)
    } else {
      navigate(`/information/${comment.user.id}`)
    }
  }

  const handleDownload = async () => {
    if (!comment.attachment) return

    const res = await fetch(comment.attachment.url)
    const blob = await res.blob()

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = comment.attachment.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleDraftChange = (value: string) => {
    const normalized = value
      .replace(/[^\S\n]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")

    setDraftContent(normalized)
  }

  const avatarSrc = resolveAvatar(comment.user.avatar)

  const isUnchanged =
    draftContent.trim() === comment.content.trim()

  return (
    <div className="flex gap-3 items-start px-3 py-2 rounded-2xl hover:bg-slate-50 transition">
      <button type="button" onClick={handleAvatarClick}>
        <Avatar src={avatarSrc} alt={comment.user.fullName} size="sm" />
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">
                {comment.user.fullName}
              </span>
              <span className="text-xs text-slate-400">{time}</span>
            </div>

            {!isEditing ? (
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">
                {comment.content}
              </p>
            ) : (
              <div className="mt-2 space-y-3">
                <AutoResizeTextarea value={draftContent} onChange={(e) => handleDraftChange(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm
                  text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  focus:bg-white"
                />

                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-1 rounded-full
                    px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    Hủy
                  </button>

                  <button type="button" onClick={handleSave}
                    disabled={
                      draftContent.trim().length === 0 ||
                      isUnchanged
                    }
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                      draftContent.trim().length > 0 &&
                      !isUnchanged
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}
          </div>

          {isMine && (
            <DropdownMenu
              trigger={
                <button type="button" className="rounded-full p-1 text-slate-500 hover:bg-slate-200
                hover:text-slate-900 transition"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
              items={[
                {
                  label: "Sửa bình luận",
                  icon: Edit3,
                  onClick: () => setIsEditing(true),
                },
                {
                  label: "Xóa bình luận",
                  icon: Trash2,
                  onClick: handleDelete,
                  destructive: true,
                },
              ]}
            />
          )}
        </div>

        {comment.attachment && (
          <div className="mt-2">
            {comment.attachment.kind === "image" ? (
              <button type="button" onClick={() => onPreviewImage?.(comment.attachment!.url)} className="block">
                <img src={comment.attachment.url} alt={comment.attachment.name} className="max-w-[300px] max-h-96 w-auto
                  h-auto cursor-pointer rounded-2xl border border-cyan-100 bg-cyan-50 object-cover transition hover:opacity-95"
                />
              </button>
            ) : comment.attachment.kind === "pdf" ? (
              <button type="button" onClick={handleDownload} className="mt-1 flex w-full cursor-pointer items-center
                justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-left transition
                hover:bg-rose-100"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-rose-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-rose-700">
                      {comment.attachment.name}
                    </p>
                    <p className="text-xs text-slate-500">Nhấn để tải file PDF</p>
                  </div>
                </div>

                <Download className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ) : (
              <button type="button" onClick={handleDownload} className="mt-1 flex w-full cursor-pointer items-center
                justify-between gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-left transition hover:bg-sky-100"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sky-600">
                    <FileBadge className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-sky-700">
                      {comment.attachment.name}
                    </p>
                    <p className="text-xs text-slate-500">Nhấn để tải file Word</p>
                  </div>
                </div>

                <Download className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentItem