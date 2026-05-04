import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { useAuth } from "../../contexts/AuthContext"
import { informationApi, postApi, type InformationProfile } from "../../services/api"

import type { PostItem, User } from "../../types/post"

import {
  buildPasswordStrength,
  validateEditForm,
  type ChangePasswordErrors,
  type ChangePasswordFormState,
  type EditInformationErrors,
  type EditInformationField,
  type EditInformationFormState,
  type PasswordStrengthState,
} from "./validation"

import { useInformationHandlers } from "./useInformationHandlers"

export type {
  EditInformationField,
  EditInformationFormState,
  EditInformationErrors,
  ChangePasswordFormState,
  ChangePasswordErrors,
  PasswordStrengthState,
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

const buildEditForm = (information: InformationData): EditInformationFormState => {
  return {
    email: information.email ?? "",
    fullName: information.fullName ?? "",
    phone: information.phone ?? "",
    about: information.about ?? "",
    avatar: information.avatar ?? "",
  }
}

const isObjectUrl = (value: string) => value.startsWith("blob:")

const normalizeForm = (form: EditInformationFormState) => ({
  fullName: form.fullName.trim(),
  phone: form.phone.replace(/\D/g, ""),
  about: form.about.trim(),
  avatar: form.avatar,
})

const areFormsEqual = (a: EditInformationFormState, b: EditInformationFormState) => {
  const na = normalizeForm(a)
  const nb = normalizeForm(b)
  return (
    na.fullName === nb.fullName &&
    na.phone === nb.phone &&
    na.about === nb.about &&
    na.avatar === nb.avatar
  )
}

const mapProfileToInformation = (profile: InformationProfile): InformationData => {
  return {
    id: profile.id,
    postOwnerId: profile.id,
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    about: profile.about ?? "",
    avatar: resolveAvatarSource(profile.avatar),
    password: "",
  }
}

export const useInformationPage = (id?: string) => {
  const draftAvatarRef = useRef<string | null>(null)
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUpdateLocked, setIsUpdateLocked] = useState(false)
  const { user: authUser, setUser } = useAuth()

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

  const canEditInformation = Boolean(
    authUser?.id && information.postOwnerId && authUser.id === information.postOwnerId
  )

  const initialEditForm = useMemo(() => buildEditForm(information), [information])

  const [editForm, setEditForm] = useState<EditInformationFormState>(initialEditForm)
  const [editInitialForm, setEditInitialForm] = useState<EditInformationFormState>(initialEditForm)

  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordErrors>({})

  const currentErrors = useMemo(() => validateEditForm(editForm), [editForm])

  const displayErrors = submitted ? currentErrors : {}

  const isDirty = useMemo(
    () => !areFormsEqual(editForm, editInitialForm),
    [editForm, editInitialForm]
  )

  const isFormValid = useMemo(() => Object.keys(currentErrors).length === 0, [currentErrors])

  const canUpdate = isDirty && isFormValid

  useEffect(() => {
    if (!profileId) return

    let cancelled = false

    const loadInformation = async () => {
      try {
        const response = await informationApi.getInformationById(profileId)

        if (cancelled) return

        const nextInformation = mapProfileToInformation(response.data as InformationProfile)
        setInformation(nextInformation)

        const nextForm = buildEditForm(nextInformation)
        setEditForm(nextForm)
        setEditInitialForm(nextForm)
        setSubmitted(false)
        setAvatarFile(null)

        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setPasswordErrors({})
      } catch (error: any) {
        if (cancelled) return
        toast.error(error?.response?.data?.message || "Không tải được thông tin")
      }
    }

    void loadInformation()

    return () => {
      cancelled = true
    }
  }, [profileId])

  useEffect(() => {
    if (!profileId) return

    let cancelled = false

    const loadPosts = async () => {
      try {
        const collectedPosts: PostItem[] = []
        let currentPage = 1

        while (true) {
          const response = await postApi.getPosts(currentPage, PAGE_SIZE, profileId)
          const nextPosts = response.data ?? []
          collectedPosts.push(...nextPosts)

          if (nextPosts.length < PAGE_SIZE) {
            break
          }

          currentPage += 1

          if (currentPage > 20) {
            break
          }
        }

        if (!cancelled) {
          setInformationPosts(collectedPosts)
        }
      } catch {
        if (!cancelled) {
          setInformationPosts([])
        }
      }
    }

    void loadPosts()

    return () => {
      cancelled = true
    }
  }, [profileId])

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current)
      }

      if (draftAvatarRef.current && isObjectUrl(draftAvatarRef.current)) {
        URL.revokeObjectURL(draftAvatarRef.current)
      }
    }
  }, [])

  const passwordStrength = useMemo(
    () => buildPasswordStrength(passwordForm.newPassword),
    [passwordForm.newPassword]
  )

  const openEditModal = useCallback(() => {
    const nextForm = buildEditForm(information)

    setPasswordErrors({})
    setPasswordOpen(false)
    setEditForm(nextForm)
    setEditInitialForm(nextForm)
    setSubmitted(false)
    setEditOpen(true)
  }, [information])

  const closeEditModal = useCallback(() => {
    if (
      draftAvatarRef.current &&
      isObjectUrl(draftAvatarRef.current) &&
      draftAvatarRef.current !== information.avatar
    ) {
      URL.revokeObjectURL(draftAvatarRef.current)
    }

    draftAvatarRef.current = null
    setAvatarFile(null)
    setEditForm(buildEditForm(information))
    setSubmitted(false)
    setEditOpen(false)
  }, [information])

  const openPasswordModal = useCallback(() => {
    setPasswordErrors({})
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setEditOpen(false)
    setPasswordOpen(true)
  }, [])

  const backToEditModal = useCallback(() => {
    setPasswordOpen(false)
    setEditOpen(true)
  }, [])

  const setField = useCallback(
    (field: EditInformationField, value: string) => {
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }))

      setSubmitted(false)
    },
    []
  )

  const setAvatar = useCallback((file: File | null) => {
    if (!file) return

    if (draftAvatarRef.current && isObjectUrl(draftAvatarRef.current)) {
      URL.revokeObjectURL(draftAvatarRef.current)
    }

    const url = URL.createObjectURL(file)
    draftAvatarRef.current = url
    setAvatarFile(file)

    setEditForm((prev) => ({
      ...prev,
      avatar: url,
    }))
  }, [])

  const setPasswordField = useCallback(
    (field: keyof ChangePasswordFormState, value: string) => {
      setPasswordForm((prev) => ({
        ...prev,
        [field]: value,
      }))

      setPasswordErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    },
    []
  )

  const handleUpdateInformation = useCallback(async () => {
    if (isUpdateLocked) return

    const nextErrors = validateEditForm(editForm)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(true)
      return
    }

    if (!isDirty || !canEditInformation) return

    setIsUpdateLocked(true)

    try {
      const formData = new FormData()
      formData.append("fullName", editForm.fullName.trim())
      formData.append("phone", editForm.phone.replace(/\D/g, ""))
      formData.append("about", editForm.about.replace(/\r\n/g, "\n"))

      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const response = await informationApi.updateMyInformation(formData)

      const nextInformation = mapProfileToInformation(response.data as InformationProfile)
      const previousAvatar = information.avatar

      setInformation(nextInformation)

      const nextForm = buildEditForm(nextInformation)
      setEditForm(nextForm)
      setEditInitialForm(nextForm)
      setSubmitted(false)
      setEditOpen(false)
      setAvatarFile(null)

      if (
        previousAvatar !== nextInformation.avatar &&
        previousAvatar.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previousAvatar)
      }

      draftAvatarRef.current = null

      setUser((prev) =>
        prev
          ? {
              ...prev,
              fullName: nextInformation.fullName,
              avatar: nextInformation.avatar,
              phone: nextInformation.phone,
              bio: nextInformation.about,
              email: nextInformation.email,
            }
          : prev
      )

      toast.success("Cập nhật thành công")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại")
    } finally {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current)
      }

      cooldownTimerRef.current = setTimeout(() => {
        setIsUpdateLocked(false)
      }, 3000)
    }
  }, [
    avatarFile,
    canEditInformation,
    draftAvatarRef,
    editForm,
    information.avatar,
    isDirty,
    isUpdateLocked,
    setEditForm,
    setEditInitialForm,
    setEditOpen,
    setInformation,
    setSubmitted,
    setUser,
  ])

  const handlers = useInformationHandlers({
    editForm,
    information,
    passwordForm,
    isEditDirty: canUpdate,
    viewerUser,
    draftAvatarRef,
    buildEditForm,
    setInformation,
    setInformationPosts,
    setEditErrors: () => {},
    setEditForm,
    setEditInitialForm,
    setEditOpen,
    setPasswordForm,
    setPasswordErrors,
    setPasswordOpen,
  })

  const {
    handleChangePassword,
    handleToggleLike,
    handleDeletePost,
    handleUpdatePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  } = handlers

  const openPreview = useCallback((src: string) => {
    setPreviewSrc(src)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewSrc("")
  }, [])

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
    passwordStrength,

    isEditDirty: canUpdate,
    isUpdateLocked,

    openPreview,
    closePreview,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    backToEditModal,

    setField,
    setAvatar,
    setPasswordField,
    handleUpdateInformation,

    handleChangePassword,
    handleToggleLike,
    handleDeletePost,
    handleUpdatePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
  }
}