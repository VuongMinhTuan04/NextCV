import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { useImagePreview } from "../commons/useImagePreview"
import { buildAttachment } from "../../utils/file"
import {
  currentUser,
  initialPosts,
  type PostItem,
  type User,
} from "../../services/mockPosts"
import {
  getInformationById,
  type InformationData,
} from "../../services/mockInformation"

export type EditInformationFormState = {
  email: string
  fullName: string
  phone: string
  description: string
  avatar: string
}

export type EditInformationErrors = {
  fullName?: string
  phone?: string
}

export type ChangePasswordFormState = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export type ChangePasswordErrors = {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export type PasswordStrengthState = {
  level: "low" | "medium" | "high"
  score: 1 | 2 | 3
  label: string
}

const createInformationForm = (
  information: InformationData
): EditInformationFormState => ({
  email: information.email,
  fullName: information.fullName,
  phone: information.phone,
  description: information.description,
  avatar: information.avatar,
})

const createPasswordForm = (): ChangePasswordFormState => ({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})

const getPasswordStrength = (
  password: string
): PasswordStrengthState => {
  if (password.length < 6) {
    return { level: "low", score: 1, label: "Thấp" }
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const scoreBase = [
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length

  if (password.length >= 8 && scoreBase >= 3) {
    return { level: "high", score: 3, label: "Cao" }
  }

  if (scoreBase >= 2) {
    return { level: "medium", score: 2, label: "Trung bình" }
  }

  return { level: "low", score: 1, label: "Thấp" }
}

const getOwnerPosts = (ownerId: string) => {
  return initialPosts.filter((post) => post.user.id === ownerId)
}

const syncInformationIntoPosts = (
  nextInformation: InformationData,
  posts: PostItem[]
) => {
  return posts.map((post) => {
    const nextPostUser =
      post.user.id === nextInformation.postOwnerId
        ? {
            ...post.user,
            fullName: nextInformation.fullName,
            avatar: nextInformation.avatar,
          }
        : post.user

    return {
      ...post,
      user: nextPostUser,
      comments: post.comments.map((comment) => {
        const nextCommentUser =
          comment.user.id === nextInformation.postOwnerId
            ? {
                ...comment.user,
                fullName: nextInformation.fullName,
                avatar: nextInformation.avatar,
              }
            : comment.user

        return {
          ...comment,
          user: nextCommentUser,
        }
      }),
    }
  })
}

export const useInformationPage = (informationId?: string) => {
  const routeInformation = useMemo(
    () => getInformationById(informationId),
    [informationId]
  )

  const [information, setInformation] =
    useState<InformationData>(routeInformation)

  const [informationPosts, setInformationPosts] = useState<PostItem[]>(
    () => getOwnerPosts(routeInformation.postOwnerId)
  )

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const [editForm, setEditForm] = useState<EditInformationFormState>(
    createInformationForm(routeInformation)
  )
  const [editErrors, setEditErrors] = useState<EditInformationErrors>({})

  const [passwordForm, setPasswordForm] =
    useState<ChangePasswordFormState>(createPasswordForm())
  const [passwordErrors, setPasswordErrors] =
    useState<ChangePasswordErrors>({})

  const { previewSrc, openPreview, closePreview } = useImagePreview()
  const avatarPreviewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    const nextInformation = getInformationById(informationId)

    setInformation(nextInformation)
    setInformationPosts(getOwnerPosts(nextInformation.postOwnerId))
    setEditOpen(false)
    setPasswordOpen(false)
    setEditForm(createInformationForm(nextInformation))
    setEditErrors({})
    setPasswordForm(createPasswordForm())
    setPasswordErrors({})

    return () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current)
        avatarPreviewUrlRef.current = null
      }
    }
  }, [informationId])

  const canEditInformation = information.postOwnerId === currentUser.id

  const viewerUser: User = useMemo(() => {
    if (information.postOwnerId !== currentUser.id) {
      return currentUser
    }

    return {
      ...currentUser,
      fullName: information.fullName,
      avatar: information.avatar,
    }
  }, [information.avatar, information.fullName, information.postOwnerId])

  const openEditModal = () => {
    setEditForm(createInformationForm(information))
    setEditErrors({})
    setPasswordOpen(false)
    setEditOpen(true)
  }

  const closeEditModal = () => {
    setEditOpen(false)
    setEditErrors({})
  }

  const openPasswordModal = () => {
    setPasswordForm(createPasswordForm())
    setPasswordErrors({})
    setEditOpen(false)
    setPasswordOpen(true)
  }

  const backToEditModal = () => {
    setPasswordOpen(false)
    setPasswordErrors({})
    setEditOpen(true)
  }

  const closePasswordModal = () => {
    setPasswordOpen(false)
    setPasswordErrors({})
  }

  const setInformationField = (
    field: "fullName" | "phone" | "description",
    value: string
  ) => {
    if (field === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11)

      setEditForm((prev) => ({
        ...prev,
        phone: digitsOnly,
      }))

      setEditErrors((prev) => ({
        ...prev,
        phone: "",
      }))

      return
    }

    if (field === "description") {
      const limitedValue = value.slice(0, 255)

      setEditForm((prev) => ({
        ...prev,
        description: limitedValue,
      }))

      return
    }

    setEditForm((prev) => ({
      ...prev,
      fullName: value,
    }))

    setEditErrors((prev) => ({
      ...prev,
      fullName: "",
    }))
  }

  const setAvatar = (file: File | null) => {
    if (!file) return

    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current)
      avatarPreviewUrlRef.current = null
    }

    const previewUrl = URL.createObjectURL(file)
    avatarPreviewUrlRef.current = previewUrl

    setEditForm((prev) => ({
      ...prev,
      avatar: previewUrl,
    }))
  }

  const handleUpdateInformation = () => {
    const nextErrors: EditInformationErrors = {}

    const nextFullName = editForm.fullName.trim()
    const nextPhone = editForm.phone.trim()
    const nextDescription = editForm.description.slice(0, 255).trim()

    if (!nextFullName) {
      nextErrors.fullName = "Không được để trống họ và tên"
    }

    if (!nextPhone) {
      nextErrors.phone = "Không được để trống số điện thoại"
    } else if (nextPhone.length < 10 || nextPhone.length > 11) {
      nextErrors.phone = "Số điện thoại phải từ 10 đến 11 chữ số"
    }

    setEditErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const nextInformation: InformationData = {
      ...information,
      fullName: nextFullName,
      phone: nextPhone,
      description: nextDescription,
      avatar: editForm.avatar,
    }

    setInformation(nextInformation)
    setInformationPosts((prev) =>
      syncInformationIntoPosts(nextInformation, prev)
    )
    setEditForm(createInformationForm(nextInformation))
    setEditOpen(false)
    setPasswordOpen(false)

    toast.success("Cập nhật thông tin thành công")
  }

  const setPasswordField = (
    field: keyof ChangePasswordFormState,
    value: string
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setPasswordErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  const handleChangePassword = () => {
    const nextErrors: ChangePasswordErrors = {}

    const oldPassword = passwordForm.oldPassword.trim()
    const newPassword = passwordForm.newPassword.trim()
    const confirmPassword = passwordForm.confirmPassword.trim()

    if (!oldPassword) {
      nextErrors.oldPassword = "Không được bỏ trống mật khẩu cũ"
    } else if (oldPassword !== information.password) {
      nextErrors.oldPassword = "Mật khẩu cũ không đúng"
    }

    if (!newPassword) {
      nextErrors.newPassword = "Không được bỏ trống mật khẩu mới"
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu không ít hơn 6 ký tự"
    } else if (newPassword === oldPassword) {
      nextErrors.newPassword =
        "Mật khẩu mới không được giống mật khẩu cũ"
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Không được bỏ trống xác nhận mật khẩu"
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword =
        "Xác nhận mật khẩu không đúng"
    }

    setPasswordErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setInformation((prev) => ({
      ...prev,
      password: newPassword,
    }))

    setPasswordForm(createPasswordForm())
    setPasswordOpen(false)
    setEditOpen(false)

    toast.success("Đổi mật khẩu thành công")
  }

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordForm.newPassword.trim()),
    [passwordForm.newPassword]
  )

  const handleToggleLike = (postId: string) => {
    setInformationPosts((prev) =>
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
    setInformationPosts((prev) =>
      prev.filter((post) => post.id !== postId)
    )
  }

  const handleUpdatePost = (postId: string, title: string) => {
    setInformationPosts((prev) =>
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
    setInformationPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        const attachment = payload.file
          ? buildAttachment(payload.file)
          : undefined

        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: crypto.randomUUID(),
              user: viewerUser,
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
    setInformationPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        return {
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content }
              : comment
          ),
        }
      })
    )
  }

  const handleDeleteComment = (
    postId: string,
    commentId: string
  ) => {
    setInformationPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        return {
          ...post,
          comments: post.comments.filter(
            (comment) => comment.id !== commentId
          ),
        }
      })
    )
  }

  return {
    information,
    informationPosts,
    viewerUser,
    canEditInformation,
    editOpen,
    passwordOpen,
    editForm,
    editErrors,
    passwordForm,
    passwordErrors,
    passwordStrength,
    previewSrc,
    openPreview,
    closePreview,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    backToEditModal,
    closePasswordModal,
    setInformationField,
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
  }
}