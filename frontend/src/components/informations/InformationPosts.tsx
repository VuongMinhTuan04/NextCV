import { useEffect, useRef } from "react"

import type { PostItem, User } from "../../types/post"
import PostCard from "../posts/PostCard"

type Props = {
  posts: PostItem[]
  currentUser: User
  ownerId: string
  ownerEmail?: string
  onToggleLike: (postId: string) => void
  onDeletePost: (postId: string) => void
  onUpdatePost: (postId: string, title: string) => void
  onAddComment: (
    postId: string,
    payload: { content: string; file: File | null }
  ) => void
  onUpdateComment: (
    postId: string,
    commentId: string,
    content: string
  ) => void
  onDeleteComment: (postId: string, commentId: string) => void
  onPreviewImage: (src: string) => void
  highlightPostId?: string
  highlightCommentId?: string
  isAuthenticated?: boolean
}

const InformationPosts = ({
  posts,
  currentUser,
  ownerId,
  onToggleLike,
  onDeletePost,
  onUpdatePost,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onPreviewImage,
  highlightPostId,
  highlightCommentId,
  isAuthenticated = false,
}: Props) => {
  const userPosts = posts.filter((post) => post.user.id === ownerId)
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (highlightPostId && postRefs.current.has(highlightPostId)) {
      const el = postRefs.current.get(highlightPostId)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [highlightPostId, userPosts])

  return (
    <section className="space-y-4 lg:max-w-3xl lg:mx-auto">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Bài viết đã đăng
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách bài viết của người dùng này
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {userPosts.length} bài viết
        </span>
      </div>

      {userPosts.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {userPosts.map((post) => (
            <div
              key={post.id}
              ref={(el) => {
                if (el) postRefs.current.set(post.id, el)
                else postRefs.current.delete(post.id)
              }}
            >
              <PostCard
                post={post}
                currentUser={currentUser}
                onToggleLike={onToggleLike}
                onDeletePost={onDeletePost}
                onUpdatePost={onUpdatePost}
                onAddComment={onAddComment}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                onPreviewImage={onPreviewImage}
                initialCommentOpen={post.id === highlightPostId && !!highlightCommentId}
                highlightCommentId={highlightCommentId}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm sm:px-6 sm:py-12">
          <p className="text-sm font-medium text-slate-700">
            Chưa có bài viết nào.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Người dùng này chưa đăng bài viết nào để hiển thị.
          </p>
        </div>
      )}
    </section>
  )
}

export default InformationPosts