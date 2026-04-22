import { useState } from "react"

import CreatePost from "../components/posts/CreatePost"
import PostCard from "../components/posts/PostCard"
import ImagePreviewModal from "../components/modals/ImagePreviewModal"
import { currentUser, initialPosts, type PostItem } from "../services/mockPosts"
import { buildAttachment } from "../utils/file"
import { useImagePreview } from "../hooks/commons/useImagePreview"

const HomePage = () => {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts)

  const { previewSrc, openPreview, closePreview } = useImagePreview()

  const handleCreatePost = ({
    title,
    file,
  }: {
    title: string
    file: File
  }) => {
    const attachment = buildAttachment(file)

    const newPost: PostItem = {
      id: crypto.randomUUID(),
      user: currentUser,
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
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        }
      })
    )
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const handleUpdatePost = (postId: string, title: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              title,
            }
          : post
      )
    )
  }

  const handleAddComment = (
    postId: string,
    payload: { content: string; file: File | null }
  ) => {
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
              user: currentUser,
              content: payload.content,
              createdAt: "Vừa xong",
              attachment,
            },
          ],
        }
      })
    )
  }

  const handleUpdateComment = (
    postId: string,
    commentId: string,
    content: string
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId ? { ...comment, content } : comment
          ),
        }
      })
    )
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        return {
          ...post,
          comments: post.comments.filter((comment) => comment.id !== commentId),
        }
      })
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4 sm:px-6 lg:py-6">
      <CreatePost currentUser={currentUser} onCreatePost={handleCreatePost} />

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onToggleLike={handleToggleLike}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
              onAddComment={handleAddComment}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
              onPreviewImage={openPreview}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
          Chưa có bài viết nào.
        </div>
      )}

      <ImagePreviewModal src={previewSrc} onClose={closePreview} />
    </div>
  )
}

export default HomePage