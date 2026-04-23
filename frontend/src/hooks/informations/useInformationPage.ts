import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import * as mockPostsModule from "../../services/mockPosts"
import { getInformationById } from "../../services/mockInformation"
import { currentUser } from "../../services/mockPosts"

import type { InformationData } from "../../services/mockInformation"
import type { PostItem, User } from "../../services/mockPosts"

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

const pickFirst = (...values: unknown[]) => {
  return values.find((value) => value !== undefined && value !== null)
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

export const useInformationPage = (id?: string) => {
  const draftAvatarRef = useRef<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const resolvedInformation = useMemo(() => {
    return getInformationById(id)
  }, [id])

  const postsModule = mockPostsModule as Record<string, unknown>

  const rawPosts = useMemo(() => {
    return pickFirst(
      postsModule.mockPosts,
      postsModule.posts,
      postsModule.informationPosts,
      postsModule.data
    )
  }, [postsModule])

  const [informationPosts, setInformationPosts] = useState<PostItem[]>([])

  const viewerUser: User = useMemo(() => ({
    id: resolvedInformation.postOwnerId,
    fullName: resolvedInformation.fullName,
    avatar: resolvedInformation.avatar,
  }), [resolvedInformation])

  const canEditInformation = currentUser.id === resolvedInformation.postOwnerId

  const [information, setInformation] = useState<InformationData>(resolvedInformation)

  const initialEditForm = useMemo(
    () => buildEditForm(resolvedInformation),
    [resolvedInformation]
  )

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
    if (draftAvatarRef.current && isObjectUrl(draftAvatarRef.current)) {
      URL.revokeObjectURL(draftAvatarRef.current)
      draftAvatarRef.current = null
    }

    setInformation(resolvedInformation)

    const nextForm = buildEditForm(resolvedInformation)
    setEditForm(nextForm)
    setEditInitialForm(nextForm)
    setSubmitted(false)

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordErrors({})
  }, [resolvedInformation])

  useEffect(() => {
    if (Array.isArray(rawPosts)) {
      setInformationPosts(rawPosts as PostItem[])
    } else {
      setInformationPosts([])
    }
  }, [rawPosts])

  useEffect(() => {
    return () => {
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

  const handleUpdateInformation = useCallback(() => {
    const nextErrors = validateEditForm(editForm)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(true)
      return
    }

    if (!isDirty) return

    const previousAvatar = information.avatar
    const nextInformation: InformationData = {
      ...information,
      fullName: editForm.fullName.trim(),
      phone: editForm.phone.replace(/\D/g, ""),
      about: editForm.about.replace(/\r\n/g, "\n"),
      avatar: editForm.avatar,
    }

    setInformation(nextInformation)

    const nextForm = buildEditForm(nextInformation)
    setEditForm(nextForm)
    setEditInitialForm(nextForm)
    setSubmitted(false)
    setEditOpen(false)

    if (previousAvatar !== nextInformation.avatar && previousAvatar.startsWith("blob:")) {
      URL.revokeObjectURL(previousAvatar)
    }

    draftAvatarRef.current = null
    toast.success("Cập nhật thành công")
  }, [editForm, information, isDirty])

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