import {
  Edit3,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import type {
  CommentItem as CommentType,
  User,
} from "../../services/mockPosts"

import Avatar from "../commons/Avatar"
import AutoResizeTextarea from "../commons/AutoResizeTextarea"
import DropdownMenu from "../commons/DropdownMenu"

type Props = {
  comment: CommentType
  currentUser: User
  onUpdate: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
}

const CommentItem = ({
  comment,
  currentUser,
  onUpdate,
  onDelete,
}: Props) => {
  const isMine = comment.user.id === currentUser.id

  const [isEditing, setIsEditing] = useState(false)
  const [draftContent, setDraftContent] = useState(comment.content)

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

    toast.success("Sửa bình luận thành công")
  }

  const handleDelete = () => {
    onDelete(comment.id)
    toast.success("Xóa bình luận thành công")
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3">
      <Avatar
        src={comment.user.avatar}
        alt={comment.user.fullName}
        size="sm"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 leading-none">
              <span className="truncate text-sm font-semibold text-slate-700">
                {comment.user.fullName}
              </span>

              <span className="shrink-0 text-xs text-slate-400">
                · {comment.createdAt}
              </span>
            </div>

            {!isEditing ? (
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                {comment.content}
              </p>
            ) : (
              <div className="mt-2 space-y-3">
                <AutoResizeTextarea
                  value={draftContent}
                  onChange={(event) =>
                    setDraftContent(event.target.value)
                  }
                  placeholder="Chỉnh sửa bình luận..."
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftContent(comment.content)
                      setIsEditing(false)
                    }}
                    className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      draftContent.trim().length === 0
                    }
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                      draftContent.trim().length > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}

            {comment.attachment && !isEditing && (
              <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {comment.attachment.kind === "image" ? (
                  <img
                    src={comment.attachment.url}
                    alt={comment.attachment.name}
                    className="h-auto w-full cursor-pointer object-cover"
                  />
                ) : (
                  <a
                    href={comment.attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 transition hover:bg-slate-100"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-500">
                      <FileText className="h-4 w-4" />
                    </div>

                    <span className="truncate text-sm text-slate-600">
                      {comment.attachment.name}
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>

          {isMine && !isEditing && (
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
      </div>
    </div>
  )
}

export default CommentItem