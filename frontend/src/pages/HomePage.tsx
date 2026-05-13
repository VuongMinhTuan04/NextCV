import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Loader2 } from "lucide-react"

import CreatePost from "../components/posts/CreatePost"
import PostCard from "../components/posts/PostCard"
import ImagePreviewModal from "../components/modals/ImagePreviewModal"
import { commentApi, postApi } from "../services/api"
import { useImagePreview } from "../hooks/commons/useImagePreview"
import { useInfinitePosts } from "../hooks/commons/useInfinitePosts"
import { useAuth } from "../contexts/AuthContext"
import type { Attachment } from "../utils/file"
import type { CommentItem, PostItem, User } from "../types/post"

const PAGE_SIZE = 5

const resolveAvatarSource = (src?: string) => {
  const value = (src ?? "").trim()

  if (!value) return "/avatar/user.png"
  if (value === "user.png") return "/avatar/user.png"
  if (value.endsWith("/user.png")) return "/avatar/user.png"
  if (value.startsWith("http")) return value
  if (value.startsWith("blob:")) return value
  if (value.startsWith("data:")) return value
  if (value.startsWith("/avatar/")) return value

  return `/avatar/${value.replace(/^\/+/, "")}`
}

const resolveAttachmentKind = (kind?: string, fileName?: string) => {
  const value = `${kind ?? ""} ${fileName ?? ""}`.toLowerCase()

  if (value.includes("pdf")) return "pdf"

  if (
    value.includes("doc") ||
    value.includes("word") ||
    value.includes("msword") ||
    value.includes("officedocument.wordprocessingml") ||
    value.endsWith(".doc") ||
    value.endsWith(".docx")
  ) {
    return "word"
  }

  return "image"
}

const getLikedStorageKey = (userId: string) => `nextcv_liked_posts_${userId}`

const readLikedPostIds = (userId: string) => {
  try {
    const raw = localStorage.getItem(getLikedStorageKey(userId))
    if (!raw) return new Set<string>()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set<string>()

    return new Set(parsed.map((item) => String(item)))
  } catch {
    return new Set<string>()
  }
}

const writeLikedPostIds = (userId: string, ids: Set<string>) => {
  try {
    localStorage.setItem(
      getLikedStorageKey(userId),
      JSON.stringify(Array.from(ids))
    )
  } catch {}
}

const mapComment = (c: any): CommentItem => {
  const userId = c.userId ?? c.user ?? {}

  const attachment: Attachment | undefined = c.attachment
    ? {
        name: String(c.attachment.name ?? ""),
        url: String(c.attachment.url ?? ""),
        kind: resolveAttachmentKind(
          c.attachment.kind ?? c.attachment.type,
          c.attachment.name
        ),
      }
    : c.fileUrl
      ? {
          name: String(c.fileName ?? ""),
          url: String(c.fileUrl ?? ""),
          kind: resolveAttachmentKind(c.fileType, c.fileName),
        }
      : undefined

  return {
    id: String(c.id ?? c._id ?? ""),
    user: {
      id: String(userId.id ?? userId._id ?? ""),
      fullName: String(userId.fullName ?? userId.fullname ?? ""),
      avatar: resolveAvatarSource(userId.avatar),
      email: userId.email,
    },
    content: String(c.content ?? ""),
    createdAt: String(c.createdAt ?? ""),
    attachment,
  }
}

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
  const fallbackUser: User = activeUser || {
    id: "",
    fullName: "",
    avatar: "/avatar/user.png",
  }

  const likedPostIds = useMemo(() => {
    if (!activeUser?.id) return new Set<string>()
    return readLikedPostIds(activeUser.id)
  }, [activeUser?.id])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setHasUserScrolled(true)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const loadMore = useCallback(() => {
    if (
      !hasLoadedInitialPosts ||
      !hasUserScrolled ||
      isLoading ||
      !hasMore ||
      posts.length === 0
    ) {
      return
    }

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

        const rawPosts = Array.isArray((response as any)?.data)
          ? (response as any).data
          : []

        const nextPostsBase: PostItem[] = rawPosts.map((p: any) => {
          const postId = String(p.id ?? p._id ?? "")

          return {
            id: postId,
            user: {
              id: String(p.user?.id ?? p.userId?._id ?? ""),
              fullName: String(p.user?.fullName ?? p.userId?.fullname ?? ""),
              avatar: resolveAvatarSource(
                p.user?.avatar ?? p.userId?.avatar ?? p.avatar
              ),
              email: p.user?.email,
            },
            title: String(p.title ?? ""),
            createdAt: String(p.createdAt ?? ""),
            attachment: p.attachment
              ? {
                  name: String(p.attachment.name ?? ""),
                  url: String(p.attachment.url ?? ""),
                  kind: resolveAttachmentKind(
                    p.attachment.kind,
                    p.attachment.name
                  ),
                }
              : p.fileUrl
                ? {
                    name: String(p.fileName ?? ""),
                    url: String(p.fileUrl ?? ""),
                    kind: resolveAttachmentKind(p.fileType, p.fileName),
                  }
                : undefined,
            liked: activeUser
              ? typeof p.liked === "boolean"
                ? p.liked || likedPostIds.has(postId)
                : likedPostIds.has(postId)
              : false,
            likes:
              typeof p.likes === "number"
                ? p.likes
                : Array.isArray(p.likes)
                  ? p.likes.length
                  : 0,
            comments: [],
          }
        })

        const postsWithComments = await Promise.all(
          nextPostsBase.map(async (post) => {
            try {
              const commentRes = await commentApi.getByPost(post.id)
              const rawComments = commentRes?.data?.comments
              const comments = Array.isArray(rawComments)
                ? rawComments.map(mapComment)
                : []

              return {
                ...post,
                comments,
              }
            } catch {
              return post
            }
          })
        )

        if (!active) return

        setPosts((prev) =>
          page === 1 ? postsWithComments : [...prev, ...postsWithComments]
        )
        setHasMore(postsWithComments.length === PAGE_SIZE)
      } catch {
        if (active && page === 1) setPosts([])
        setHasMore(false)
      } finally {
        if (active) {
          setIsLoading(false)
          if (page === 1) setHasLoadedInitialPosts(true)
        }
      }
    }

    void fetchPosts()

    return () => {
      active = false
    }
  }, [page, refreshKey, activeUser, likedPostIds])

  const { previewSrc, openPreview, closePreview } = useImagePreview()

  const handleCreatePost = async ({
    title,
    file,
  }: {
    title: string
    file: File
  }) => {
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

  const handleToggleLike = async (postId: string) => {
    if (!activeUser) return

    const res = await postApi.likePost(postId)

    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              liked: res.liked,
              likes: res.likesCount,
            }
      )
    )

    const nextIds = new Set(likedPostIds)
    if (res.liked) {
      nextIds.add(postId)
    } else {
      nextIds.delete(postId)
    }
    writeLikedPostIds(activeUser.id, nextIds)
  }

  const handleDeletePost = async (postId: string) => {
    if (!activeUser) return

    await postApi.deletePost(postId)
    setPosts((prev) => prev.filter((p) => p.id !== postId))

    if (activeUser.id) {
      const nextIds = new Set(likedPostIds)
      nextIds.delete(postId)
      writeLikedPostIds(activeUser.id, nextIds)
    }
  }

  const handleUpdatePost = async (postId: string, title: string) => {
    if (!activeUser) return

    await postApi.updatePost(postId, title)

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, title } : p))
    )
  }

  const handleAddComment = async (
    postId: string,
    payload: { content: string; file: File | null }
  ) => {
    if (!activeUser) return

    const formData = new FormData()
    formData.append("content", payload.content)
    if (payload.file) formData.append("file", payload.file)

    const res = await commentApi.create(postId, formData)
    const newComment = mapComment(res.data)

    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: [...post.comments, newComment],
            }
      )
    )
  }

  const handleUpdateComment = async (
    postId: string,
    commentId: string,
    content: string
  ) => {
    if (!activeUser) return

    await commentApi.update(commentId, content)

    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: post.comments.map((c) =>
                c.id === commentId ? { ...c, content } : c
              ),
            }
      )
    )
  }

  const handleDeleteComment = async (
    postId: string,
    commentId: string
  ) => {
    if (!activeUser) return

    await commentApi.delete(commentId)

    setPosts((prev) =>
      prev.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
            }
      )
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-0 pb-2 sm:px-6 lg:py-4">
      {activeUser && (
        <CreatePost currentUser={activeUser} onCreatePost={handleCreatePost} />
      )}

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