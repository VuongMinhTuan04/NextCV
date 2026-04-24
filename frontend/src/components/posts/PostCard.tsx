import { useEffect, useState } from "react"

import type { PostItem, User } from "../../services/mockPosts"
import { usePostActions } from "../../hooks/posts/usePostActions"
import PostHeader from "./PostHeader"
import PostMedia from "./PostMedia"
import PostActions from "./PostActions"
import CommentBox from "../comments/CommentBox"

type Props = {
  post: PostItem
  currentUser: User
  onToggleLike: (postId: string) => void
  onDeletePost: (postId: string) => void
  onUpdatePost: (postId: string, title: string) => void
  onAddComment: (postId: string, payload: { content: string; file: File | null }) => void
  onUpdateComment: (postId: string, commentId: string, content: string) => void
  onDeleteComment: (postId: string, commentId: string) => void
  onPreviewImage: (src: string) => void
  initialCommentOpen?: boolean
  highlightCommentId?: string
  isHighlighted?: boolean
}

const PostCard = ({
  post,
  currentUser,
  onToggleLike,
  onDeletePost,
  onUpdatePost,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onPreviewImage,
  initialCommentOpen = false,
  highlightCommentId,
  isHighlighted = false,
}: Props) => {
  const [isCommentOpen, setIsCommentOpen] = useState(initialCommentOpen)

  useEffect(() => {
    if (initialCommentOpen) {
      setIsCommentOpen(true)
    }
  }, [initialCommentOpen])

  const {
    isEditing,
    draftTitle,
    setDraftTitle,
    hasChanges,
    startEdit,
    cancelEdit,
    setIsEditing,
  } = usePostActions(post.title)

  const handleSaveEdit = () => {
    const nextTitle = draftTitle.trim()
    if (!nextTitle) return

    if (nextTitle !== post.title.trim()) {
      onUpdatePost(post.id, nextTitle)
    }

    setIsEditing(false)
  }

  const handleDeletePost = () => {
    onDeletePost(post.id)
  }

  const handleAddComment = (payload: { content: string; file: File | null }) => {
    onAddComment(post.id, payload)
    setIsCommentOpen(true)
  }

  const handleUpdateComment = (commentId: string, content: string) => {
    onUpdateComment(post.id, commentId, content)
  }

  const handleDeleteComment = (commentId: string) => {
    onDeleteComment(post.id, commentId)
  }

  const canManage = post.user.id === currentUser.id

  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-500 ${
        isHighlighted ? "ring-2 ring-blue-300 scale-[1.01]" : ""
      }`}
    >
      <PostHeader
        post={post}
        canManage={canManage}
        isEditing={isEditing}
        draftTitle={draftTitle}
        onDraftTitleChange={setDraftTitle}
        onStartEdit={startEdit}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={cancelEdit}
        onDeletePost={handleDeletePost}
      />

      <PostMedia attachment={post.attachment} onPreviewImage={onPreviewImage} />

      <PostActions
        liked={post.liked}
        likes={post.likes}
        commentsCount={post.comments.length}
        isCommentOpen={isCommentOpen}
        onToggleLike={() => onToggleLike(post.id)}
        onToggleComment={() => setIsCommentOpen((prev) => !prev)}
      />

      {isCommentOpen && (
        <CommentBox
          currentUser={currentUser}
          comments={post.comments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onPreviewImage={onPreviewImage}
        />
      )}
    </article>
  )
}

export default PostCard