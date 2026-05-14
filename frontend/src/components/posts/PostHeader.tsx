import { Edit3, MoreHorizontal, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import type { PostItem } from "../../types/post"
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
  isAuthenticated?: boolean
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
  isAuthenticated = false,
}: Props) => {
  const navigate = useNavigate()

  const handleAvatarClick = () => {
    if (!isAuthenticated) {
      navigate(`/sign-in?redirect=${encodeURIComponent(`/information/${post.user.id}`)}`)
    } else {
      navigate(`/information/${post.user.id}`)
    }
  }

  const handleSave = () => {
    onSaveEdit()
    toast.success("Cập nhật bài viết thành công", { duration: 1000 })
  }

  const handleDelete = () => {
    onDeletePost()
    toast.success("Xóa bài viết thành công", { duration: 1000 })
  }

  const avatarSrc = post.user.avatar?.startsWith("http")
    ? post.user.avatar
    : post.user.avatar?.includes("user.png") || !post.user.avatar
      ? "/avatar/user.png"
      : `/avatar/${post.user.avatar.replace(/^\/+/, "")}`

  const fixedPost = {
    ...post,
    user: {
      ...post.user,
      avatar: avatarSrc,
    },
  }

  const isUnchanged =
    draftTitle.trim() === post.title.trim()

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">
      <button type="button" onClick={handleAvatarClick}
        className="shrink-0 cursor-pointer rounded-full transition hover:opacity-80"
      >
        <Avatar src={fixedPost.user.avatar} alt={fixedPost.user.fullName} />
      </button>

      <div className="min-w-0">
        <div className="flex items-center gap-2 leading-none">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {fixedPost.user.fullName}
          </h3>
          <span className="shrink-0 text-xs text-slate-400">
            {fixedPost.createdAt}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-3 space-y-3">
            <AutoResizeTextarea value={draftTitle} onChange={(event) => onDraftTitleChange(event.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm
            text-slate-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white"
            />

            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={onCancelEdit} className="flex items-center gap-1 rounded-full px-4 py-2
                text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
                Hủy
              </button>

              <button type="button" onClick={handleSave}
                disabled={
                  draftTitle.trim().length === 0 ||
                  isUnchanged
                }
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                  draftTitle.trim().length > 0 &&
                  !isUnchanged
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Check className="h-4 w-4" />
                Lưu
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
            {fixedPost.title}
          </p>
        )}
      </div>

      {canManage && !isEditing && (
        <DropdownMenu trigger={<MoreHorizontal className="h-4 w-4" />}
          items={[
            { label: "Sửa bài viết", icon: Edit3, onClick: onStartEdit },
            { label: "Xóa bài viết", icon: Trash2, onClick: handleDelete, destructive: true },
          ]}
        />
      )}
    </div>
  )
}

export default PostHeader