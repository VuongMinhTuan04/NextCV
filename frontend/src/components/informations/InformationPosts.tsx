import type { PostItem, User } from "../../services/mockPosts"
import PostCard from "../posts/PostCard"

type Props = {
  posts: PostItem[]
  currentUser: User
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
}

const InformationPosts = ({
  posts,
  currentUser,
  onToggleLike,
  onDeletePost,
  onUpdatePost,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onPreviewImage,
}: Props) => {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Bài viết đã đăng
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách bài viết của người dùng này
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {posts.length} bài viết
        </span>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onToggleLike={onToggleLike}
              onDeletePost={onDeletePost}
              onUpdatePost={onUpdatePost}
              onAddComment={onAddComment}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
              onPreviewImage={onPreviewImage}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
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