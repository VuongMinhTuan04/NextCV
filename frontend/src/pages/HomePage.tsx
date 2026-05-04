import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import CreatePost from "../components/posts/CreatePost"
import PostCard from "../components/posts/PostCard"
import ImagePreviewModal from "../components/modals/ImagePreviewModal"
import { postApi } from "../services/api"
import { buildAttachment } from "../utils/file"
import { useImagePreview } from "../hooks/commons/useImagePreview"
import { useInfinitePosts } from "../hooks/commons/useInfinitePosts"
import { useAuth } from "../contexts/AuthContext"
import type { PostItem, User } from "../types/post"

const PAGE_SIZE = 5

const HomePage = () => {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoadedInitialPosts, setHasLoadedInitialPosts] = useState(false)
  const [hasUserScrolled, setHasUserScrolled] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const [searchParams] = useSearchParams()
  const highlightPostId = searchParams.get("postId")
  const highlightCommentId = searchParams.get("commentId")
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  const activeUser = isAuthenticated && user ? user : null
  const fallbackUser: User = activeUser || { id: "", fullName: "", avatar: "/avatar/user.png" }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasUserScrolled(true)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!hasLoadedInitialPosts || !hasUserScrolled || isLoading || !hasMore || posts.length === 0) return
    setPage((prev) => prev + 1)
  }, [hasLoadedInitialPosts, hasUserScrolled, isLoading, hasMore, posts.length])

  const { observerRef } = useInfinitePosts(
    loadMore,
    hasMore,
    isLoading,
    hasLoadedInitialPosts && hasUserScrolled
  )

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!highlightPostId) {
      window.scrollTo(0, 0)
    }
  }, [highlightPostId])

  useEffect(() => {
    if (!highlightPostId) {
      setHighlightedPostId(null)
      return
    }

    const el = document.getElementById(`post-${highlightPostId}`)
    if (!el) return

    setHighlightedPostId(highlightPostId)
    el.scrollIntoView({ behavior: "smooth", block: "center" })

    const timer = setTimeout(() => {
      setHighlightedPostId(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [highlightPostId, posts])

  useEffect(() => {
    let active = true

    const fetchPosts = async () => {
      try {
        setIsLoading(true)

        const response = await postApi.getPosts(page, PAGE_SIZE)
        if (!active) return

        const nextPosts = response.data ?? []

        setPosts((prev) => (page === 1 ? nextPosts : [...prev, ...nextPosts]))
        setHasMore(nextPosts.length === PAGE_SIZE)
      } catch {
        if (active) {
          if (page === 1) {
            setPosts([])
          }
          setHasMore(false)
        }
      } finally {
        if (active) {
          setIsLoading(false)
          if (page === 1) {
            setHasLoadedInitialPosts(true)
          }
        }
      }
    }

    void fetchPosts()

    return () => {
      active = false
    }
  }, [page, refreshKey])

  const { previewSrc, openPreview, closePreview } = useImagePreview()

  const handleCreatePost = async ({ title, file }: { title: string; file: File }) => {
    if (!activeUser) return

    const formData = new FormData()
    formData.append("title", title)
    formData.append("file", file)

    const response = await postApi.createPost(formData)
    const createdPost = response.data

    if (!createdPost) {
      throw new Error("Tạo bài viết thất bại")
    }

    setPage(1)
    setPosts([])
    setHasMore(true)
    setHasLoadedInitialPosts(false)
    setHasUserScrolled(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleToggleLike = (postId: string) => {
    if (!activeUser) return
    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
      )
    )
  }

  const handleDeletePost = async (postId: string) => {
    if (!activeUser) return

    await postApi.deletePost(postId)

    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const handleUpdatePost = async (postId: string, title: string) => {
    if (!activeUser) return

    await postApi.updatePost(postId, title)

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

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
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
      ) : !isLoading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
          Chưa có bài viết nào.
        </div>
      ) : null}

      <div ref={observerRef} className="flex justify-center py-4">
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-slate-400" />}
      </div>

      <ImagePreviewModal src={previewSrc} onClose={closePreview} />
    </div>
  )
}

export default HomePage