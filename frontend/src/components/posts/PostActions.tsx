import { Heart, MessageCircle } from "lucide-react"

type Props = {
  liked: boolean
  likes: number
  commentsCount: number
  isCommentOpen: boolean
  onToggleLike: () => void
  onToggleComment: () => void
}

const PostActions = ({
  liked,
  likes,
  commentsCount,
  isCommentOpen,
  onToggleLike,
  onToggleComment,
}: Props) => {
  return (
    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onToggleLike}
        className={`flex min-w-[110px] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          liked
            ? "bg-red-100 text-red-600"
            : "text-slate-500 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <Heart
          className="h-4 w-4"
          fill={liked ? "currentColor" : "none"}
        />
        <span>{likes}</span>
      </button>

      <button
        type="button"
        onClick={onToggleComment}
        className={`flex min-w-[110px] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isCommentOpen
            ? "bg-blue-50 text-blue-600"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{commentsCount}</span>
      </button>
    </div>
  )
}

export default PostActions