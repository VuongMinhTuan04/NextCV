import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "../../contexts/AuthContext"
import {
  informationApi,
  postApi,
  type InformationProfile,
} from "../../services/api"

import type { PostItem, User } from "../../types/post"

import {
  buildPasswordStrength,
  validateEditForm,
  validatePasswordForm,
  type ChangePasswordErrors,
  type ChangePasswordFormState,
  type EditInformationErrors,
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
  if (value.startsWith("http")) return value
  if (value.startsWith("blob:")) return value
  if (value.startsWith("data:")) return value
  if (value.startsWith("/avatar/")) return value
  return `/avatar/${value.replace(/^\/+/, "")}`
}

const buildEditForm = (information: InformationData): EditInformationFormState => ({
  email: information.email ?? "",
  fullName: information.fullName ?? "",
  phone: information.phone ?? "",
  about: information.about ?? "",
  avatar: information.avatar ?? "",
})

const mapProfileToInformation = (profile: InformationProfile): InformationData => {
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

export const useInformationPage = (id?: string) => {
  const { user: authUser } = useAuth()

  const [information, setInformation] = useState<InformationData>(emptyInformation)
  const [informationPosts, setInformationPosts] = useState<PostItem[]>([])

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const profileId = id || authUser?.id

  const viewerUser: User = useMemo(
    () => ({
      id: authUser?.id ?? "",
      fullName: authUser?.fullName ?? "",
      avatar: authUser?.avatar ?? "",
    }),
    [authUser]
  )

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

  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordErrors>({})

  const currentErrors = useMemo(() => validateEditForm(editForm), [editForm])
  const displayErrors = submitted ? currentErrors : {}

  const isDirty = useMemo(
    () => JSON.stringify(editForm) !== JSON.stringify(editInitialForm),
    [editForm, editInitialForm]
  )

  const avatarFileRef = useRef<File | null>(null)

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
        avatarFileRef.current = null
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
        setInformationPosts(res.data ?? [])
      } catch {
        setInformationPosts([])
      }
    }

    loadPosts()
  }, [profileId])

  const openEditModal = useCallback(() => {
    const form = buildEditForm(information)
    setEditForm(form)
    setEditInitialForm(form)
    setSubmitted(false)
    setEditOpen(true)
    avatarFileRef.current = null
  }, [information])

  const closeEditModal = useCallback(() => setEditOpen(false), [])

  const openPasswordModal = useCallback(() => {
    setPasswordOpen(true)
  }, [])

  const backToEditModal = useCallback(() => {
    setPasswordOpen(false)
    setEditOpen(true)
  }, [])

  const setField = (field: any, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const setAvatar = (file: File | null) => {
    if (!file) return

    avatarFileRef.current = file

    const url = URL.createObjectURL(file)

    setEditForm((prev) => {
      if (prev.avatar?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.avatar)
      }
      return { ...prev, avatar: url }
    })
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

      if (avatarFileRef.current) {
        formData.append("avatar", avatarFileRef.current)
      }

      const res = await informationApi.updateMyInformation(formData)

      if (avatarFileRef.current) {
        avatarFileRef.current = null
      }

      const updated = {
        ...information,
        ...editForm,
        avatar: res.data?.avatar || editForm.avatar,
      }

      setInformation(updated)
      setEditInitialForm(editForm)
      setEditOpen(false)

      toast.success("Cập nhật thành công")
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update fail")
    }
  }

  const setPasswordField = (field: any, value: string) => {
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
      toast.success("Đổi mật khẩu thành công")
    } catch (e: any) {
      setPasswordErrors({
        oldPassword: e?.response?.data?.message || "Lỗi",
      })
    }
  }

  const openPreview = (src: string) => setPreviewSrc(src)
  const closePreview = () => setPreviewSrc("")

  const handleToggleLike = useCallback((postId: string) => {
    setInformationPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }, [])

  const handleDeletePost = useCallback((postId: string) => {
    setInformationPosts((prev) => prev.filter((p) => p.id !== postId))
  }, [])

  const handleUpdatePost = useCallback((postId: string, title: string) => {
    setInformationPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, title } : p))
    )
  }, [])

  const handleAddComment = useCallback(() => {}, [])
  const handleUpdateComment = useCallback(() => {}, [])
  const handleDeleteComment = useCallback(() => {}, [])

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