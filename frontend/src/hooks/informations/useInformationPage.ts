import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "../../contexts/AuthContext"
import {
  commentApi,
  informationApi,
  postApi,
  type InformationProfile,
} from "../../services/api"

import type { Attachment } from "../../utils/file"
import type { CommentItem, PostItem, User } from "../../types/post"

import {
  buildPasswordStrength,
  validateEditForm,
  validatePasswordForm,
  type ChangePasswordErrors,
  type ChangePasswordFormState,
  type EditInformationField,
  type EditInformationFormState,
} from "./validation"

export type InformationData = {
  id: string
  postOwnerId: string
  fullName: string
  email: string
  phone: string
  about: string
  avatar: string
  password: string
}

const PAGE_SIZE = 5

const emptyInformation: InformationData = {
  id: "",
  postOwnerId: "",
  fullName: "",
  email: "",
  phone: "",
  about: "",
  avatar: "",
  password: "",
}

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

const buildEditForm = (
  information: InformationData
): EditInformationFormState => ({
  email: information.email ?? "",
  fullName: information.fullName ?? "",
  phone: information.phone ?? "",
  about: information.about ?? "",
  avatar: information.avatar ?? "",
})

const mapProfileToInformation = (
  profile: InformationProfile
): InformationData => {
  const resolvedId = (profile as any)._id || (profile as any).id || ""

  return {
    id: resolvedId,
    postOwnerId: resolvedId,
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    about: profile.about ?? "",
    avatar: resolveAvatarSource(profile.avatar),
    password: "",
  }
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

export const useInformationPage = (id?: string) => {
  const { user: authUser, setUser } = useAuth()

  const [information, setInformation] = useState<InformationData>(
    emptyInformation
  )
  const [informationPosts, setInformationPosts] = useState<PostItem[]>([])

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const profileId = id || authUser?.id

  const viewerUser: User = useMemo(
    () => ({
      id: authUser?.id ?? "",
      fullName: authUser?.fullName ?? "",
      avatar: authUser?.avatar ?? "/avatar/user.png",
    }),
    [authUser]
  )

  const activeUser = authUser && authUser.id ? authUser : null

  const likedPostIds = useMemo(() => {
    if (!activeUser?.id) return new Set<string>()
    return readLikedPostIds(activeUser.id)
  }, [activeUser?.id])

  const canEditInformation =
    authUser?.id && information.postOwnerId
      ? String(authUser.id) === String(information.postOwnerId)
      : false

  const [editForm, setEditForm] = useState<EditInformationFormState>(
    buildEditForm(emptyInformation)
  )
  const [editInitialForm, setEditInitialForm] = useState(editForm)

  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordErrors>(
    {}
  )

  const currentErrors = useMemo(() => validateEditForm(editForm), [editForm])
  const displayErrors = submitted ? currentErrors : {}

  const isDirty = useMemo(
    () => JSON.stringify(editForm) !== JSON.stringify(editInitialForm),
    [editForm, editInitialForm]
  )

  const canUpdate = isDirty && Object.keys(currentErrors).length === 0

  useEffect(() => {
    if (!profileId) return

    const load = async () => {
      try {
        const res = await informationApi.getInformationById(profileId)
        if (!res.data) return

        const data = mapProfileToInformation(res.data)
        setInformation(data)

        const form = buildEditForm(data)
        setEditForm(form)
        setEditInitialForm(form)
        setAvatarFile(null)
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Lỗi load info")
      }
    }

    load()
  }, [profileId])

  useEffect(() => {
    if (!profileId) return

    const loadPosts = async () => {
      try {
        const res = await postApi.getPosts(1, PAGE_SIZE, profileId)
        const rawPosts = Array.isArray(res.data) ? res.data : []

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

        setInformationPosts(postsWithComments)
      } catch {
        setInformationPosts([])
      }
    }

    loadPosts()
  }, [profileId, activeUser, likedPostIds])

  const openEditModal = useCallback(() => {
    const form = buildEditForm(information)
    setEditForm(form)
    setEditInitialForm(form)
    setSubmitted(false)
    setEditOpen(true)
  }, [information])

  const closeEditModal = useCallback(() => setEditOpen(false), [])

  const openPasswordModal = useCallback(() => {
    setPasswordOpen(true)
  }, [])

  const backToEditModal = useCallback(() => {
    setPasswordOpen(false)
    setEditOpen(true)
  }, [])

  const setField = (field: EditInformationField, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const setAvatar = (file: File | null) => {
    if (!file) return

    setAvatarFile(file)

    const url = URL.createObjectURL(file)
    setEditForm((prev) => ({ ...prev, avatar: url }))
  }

  const handleUpdateInformation = async () => {
    const errors = validateEditForm(editForm)
    setSubmitted(true)
    if (Object.keys(errors).length > 0) return

    try {
      const formData = new FormData()
      formData.append("fullName", editForm.fullName)
      formData.append("phone", editForm.phone)
      formData.append("about", editForm.about)

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const res = await informationApi.updateMyInformation(formData)
      if (!res.data) return

      const updated = mapProfileToInformation(res.data)

      setInformation(updated)

      const form = buildEditForm(updated)
      setEditForm(form)
      setEditInitialForm(form)

      setAvatarFile(null)

      if (authUser) {
        setUser((prev) => {
          if (!prev) return prev

          return {
            ...prev,
            fullName: updated.fullName,
            avatar: updated.avatar,
            phone: updated.phone,
            bio: updated.about,
          }
        })
      }

      setEditOpen(false)

      toast.success("Cập nhật thành công")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update fail")
    }
  }

  const setPasswordField = (
    field: keyof ChangePasswordFormState,
    value: string
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleChangePassword = async () => {
    const errors = validatePasswordForm(passwordForm)
    setPasswordErrors(errors)
    if (Object.keys(errors).length > 0) return

    try {
      await informationApi.changePassword(passwordForm)
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordOpen(false)
      setEditOpen(true)
      toast.success("Đổi mật khẩu thành công")
    } catch (e: any) {
      setPasswordErrors({
        oldPassword: e?.response?.data?.message || "Lỗi",
      })
    }
  }

  const handleToggleLike = useCallback(
    async (postId: string) => {
      if (!activeUser) return

      try {
        const res = await postApi.likePost(postId)

        setInformationPosts((prev) =>
          prev.map((post) => {
            if (String(post.id) !== String(postId)) return post

            return {
              ...post,
              liked: res.liked,
              likes: res.likesCount,
            } as PostItem
          })
        )

        const nextIds = new Set(likedPostIds)
        if (res.liked) {
          nextIds.add(postId)
        } else {
          nextIds.delete(postId)
        }
        writeLikedPostIds(activeUser.id, nextIds)
      } catch (e: any) {
        toast.error(
          e?.response?.data?.message || "Không thể cập nhật lượt thích"
        )
      }
    },
    [activeUser, likedPostIds]
  )

  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (!activeUser) return

      try {
        await postApi.deletePost(postId)

        setInformationPosts((prev) =>
          prev.filter((post) => String(post.id) !== String(postId))
        )

        if (activeUser.id) {
          const nextIds = new Set(likedPostIds)
          nextIds.delete(postId)
          writeLikedPostIds(activeUser.id, nextIds)
        }
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Không thể xóa bài viết")
      }
    },
    [activeUser, likedPostIds]
  )

  const handleUpdatePost = useCallback(
    async (postId: string, title: string) => {
      if (!activeUser) return

      try {
        await postApi.updatePost(postId, title)

        setInformationPosts((prev) =>
          prev.map((post) => {
            if (String(post.id) !== String(postId)) return post
            return { ...post, title } as PostItem
          })
        )
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Không thể cập nhật bài viết")
      }
    },
    [activeUser]
  )

  const handleAddComment = useCallback(
    async (postId: string, payload: { content: string; file: File | null }) => {
      if (!activeUser) return

      try {
        const formData = new FormData()
        formData.append("content", payload.content)
        if (payload.file) formData.append("file", payload.file)

        const res = await commentApi.create(postId, formData)
        const newComment = mapComment(res.data)

        setInformationPosts((prev) =>
          prev.map((post) =>
            String(post.id) !== String(postId)
              ? post
              : {
                  ...post,
                  comments: [...post.comments, newComment],
                }
          )
        )
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Không thể bình luận")
      }
    },
    [activeUser]
  )

  const handleUpdateComment = useCallback(
    async (postId: string, commentId: string, content: string) => {
      if (!activeUser) return

      try {
        const res = await commentApi.update(commentId, content)
        const updatedComment = mapComment(res.data)

        setInformationPosts((prev) =>
          prev.map((post) =>
            String(post.id) !== String(postId)
              ? post
              : {
                  ...post,
                  comments: post.comments.map((comment) =>
                    String(comment.id) === String(commentId)
                      ? updatedComment
                      : comment
                  ),
                }
          )
        )
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Không thể sửa bình luận")
      }
    },
    [activeUser]
  )

  const handleDeleteComment = useCallback(
    async (postId: string, commentId: string) => {
      if (!activeUser) return

      try {
        await commentApi.delete(commentId)

        setInformationPosts((prev) =>
          prev.map((post) =>
            String(post.id) !== String(postId)
              ? post
              : {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => String(comment.id) !== String(commentId)
                  ),
                }
          )
        )
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Không thể xóa bình luận")
      }
    },
    [activeUser]
  )

  const openPreview = (src: string) => setPreviewSrc(src)
  const closePreview = () => setPreviewSrc("")

  return {
    information,
    informationPosts,
    viewerUser,
    canEditInformation,

    editOpen,
    passwordOpen,
    previewSrc,

    editForm,
    editErrors: displayErrors,

    passwordForm,
    passwordErrors,
    passwordStrength: buildPasswordStrength(passwordForm.newPassword),

    isEditDirty: canUpdate,

    openEditModal,
    closeEditModal,

    openPasswordModal,
    backToEditModal,

    setField,
    setAvatar,

    handleUpdateInformation,

    setPasswordField,
    handleChangePassword,

    handleToggleLike,
    handleDeletePost,
    handleUpdatePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,

    openPreview,
    closePreview,
  }
}