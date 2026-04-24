import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import CreatePost from "../components/posts/CreatePost"
import PostCard from "../components/posts/PostCard"
import ImagePreviewModal from "../components/modals/ImagePreviewModal"
import { initialPosts, type PostItem } from "../services/mockPosts"
import { buildAttachment } from "../utils/file"
import { useImagePreview } from "../hooks/commons/useImagePreview"
import { useInfinitePosts } from "../hooks/commons/useInfinitePosts"
import { useAuth } from "../contexts/AuthContext"

const HomePage = () => {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts)
  const [searchParams] = useSearchParams()
  const highlightPostId = searchParams.get("postId")
  const highlightCommentId = searchParams.get("commentId")
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null)
  const { currentUser, isAuthenticated } = useAuth()

  const activeUser = isAuthenticated && currentUser ? currentUser : null
  const fallbackUser = activeUser || { id: "", fullName: "", avatar: "" }

  const { visiblePosts, isLoading, observerRef } = useInfinitePosts(posts)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!highlightPostId) {
      window.scrollTo(0, 0)
    }
  }, [highlightPostId])

  useEffect(() => {
    if (highlightPostId) {
      setHighlightedPostId(highlightPostId)
      const el = document.getElementById(`post-${highlightPostId}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      const timer = setTimeout(() => {
        setHighlightedPostId(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [highlightPostId])

  const { previewSrc, openPreview, closePreview } = useImagePreview()

  const handleCreatePost = ({ title, file }: { title: string; file: File }) => {
    if (!activeUser) return
    const attachment = buildAttachment(file)
    const newPost: PostItem = {
      id: crypto.randomUUID(),
      user: activeUser,
      title,
      createdAt: "Vừa xong",
      attachment,
      liked: false,
      likes: 0,
      comments: [],
    }
    setPosts((prev) => [newPost, ...prev])
  }

  const handleToggleLike = (postId: string) => {
    if (!activeUser) return
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
      )
    )
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const handleUpdatePost = (postId: string, title: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, title } : post))
    )
  }

  const handleAddComment = (postId: string, payload: { content: string; file: File | null }) => {
    if (!activeUser) return
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const attachment = payload.file ? buildAttachment(payload.file) : undefined
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: crypto.randomUUID(),
              user: activeUser,
              content: payload.content,
              createdAt: "Vừa xong",
              attachment,
            },
          ],
        }
      })
    )
  }

  const handleUpdateComment = (postId: string, commentId: string, content: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId ? { ...comment, content } : comment
              ),
            }
      )
    )
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) }
      )
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-0 pb-2 sm:px-6 lg:py-4">
      {activeUser && <CreatePost currentUser={activeUser} onCreatePost={handleCreatePost} />}

      {visiblePosts.length > 0 ? (
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <div key={post.id} id={`post-${post.id}`}>
              <PostCard
                post={post}
                currentUser={fallbackUser}
                onToggleLike={handleToggleLike}
                onDeletePost={handleDeletePost}
                onUpdatePost={handleUpdatePost}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                onPreviewImage={openPreview}
                initialCommentOpen={post.id === highlightPostId && !!highlightCommentId}
                highlightCommentId={highlightCommentId || undefined}
                isHighlighted={highlightedPostId === post.id}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
          Chưa có bài viết nào.
        </div>
      )}

      <div ref={observerRef} className="flex justify-center py-4">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        )}
      </div>

      <ImagePreviewModal src={previewSrc} onClose={closePreview} />
    </div>
  )
}

export default HomePage