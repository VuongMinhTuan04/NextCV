import { Edit3, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import type { PostItem } from "../../services/mockPosts"
import Avatar from "../commons/Avatar"
import DropdownMenu from "../commons/DropdownMenu"
import AutoResizeTextarea from "../commons/AutoResizeTextarea"

type Props = {
  post: PostItem
  canManage: boolean
  isEditing: boolean
  draftTitle: string
  onDraftTitleChange: (value: string) => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDeletePost: () => void
}

const PostHeader = ({
  post,
  canManage,
  isEditing,
  draftTitle,
  onDraftTitleChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeletePost,
}: Props) => {
  const [localEditing, setLocalEditing] = useState(isEditing)

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 gap-3">
        <Avatar src={post.user.avatar} alt={post.user.fullName} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 leading-none">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {post.user.fullName}
            </h3>
            <span className="shrink-0 text-xs text-slate-400">
              · {post.createdAt}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-3">
              <AutoResizeTextarea
                value={draftTitle}
                onChange={(event) => onDraftTitleChange(event.target.value)}
                placeholder="Nhập nội dung bài viết..."
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Hủy
                </button>

                <button type="button"
                  onClick={() => {
                    onSaveEdit()
                    toast.success("Cập nhật bài viết thành công")
                  }}
                  disabled={draftTitle.trim().length === 0}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    draftTitle.trim().length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
              {post.title}
            </p>
          )}
        </div>
      </div>

      {canManage && !isEditing && (
        <DropdownMenu trigger={<MoreHorizontal className="h-4 w-4" />}
          items={[
            {
              label: "Sửa bài viết",
              icon: Edit3,
              onClick: onStartEdit,
            },
            {
              label: "Xóa bài viết",
              icon: Trash2,
              onClick: () => {
                onDeletePost()
                toast.success("Xóa bài viết thành công")
              },
              destructive: true,
            },
          ]}
        />
      )}
    </div>
  )
}

export default PostHeader