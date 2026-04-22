import { toast } from "sonner"

import type { User, CommentItem as CommentType } from "../../services/mockPosts"
import { useComment } from "../../hooks/comments/useComment"
import CommentInput from "./CommentInput"
import CommentItem from "./CommentItem"

type Props = {
  currentUser: User
  comments: CommentType[]
  onAddComment: (payload: { content: string; file: File | null }) => void
  onUpdateComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
}

const CommentBox = ({
  currentUser,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: Props) => {
  const {
    content,
    setContent,
    file,
    fileName,
    fileKind,
    canSend,
    selectFile,
    removeFile,
    reset,
  } = useComment()

  const handleSend = () => {
    if (!canSend) return

    onAddComment({
      content: content.trim(),
      file,
    })

    reset()
    toast.success("Bình luận thành công")
  }

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} currentUser={currentUser}
              onUpdate={onUpdateComment} onDelete={onDeleteComment}
            />
          ))}
        </div>
      )}

      <CommentInput currentUser={currentUser} value={content} file={file} fileName={fileName} fileKind={fileKind}
        canSend={canSend} onChange={setContent} onSelectFile={selectFile} onRemoveFile={removeFile} onSend={handleSend}
      />
    </div>
  )
}

export default CommentBox