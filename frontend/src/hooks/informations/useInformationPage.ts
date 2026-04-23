import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import * as mockPostsModule from "../../services/mockPosts"
import { getInformationById } from "../../services/mockInformation"

import type { InformationData } from "../../services/mockInformation"
import type { PostItem, User } from "../../services/mockPosts"

import {
  buildPasswordStrength,
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

const areEqual = (a: EditInformationFormState, b: EditInformationFormState) => {
  return (
    a.fullName === b.fullName &&
    a.phone === b.phone &&
    a.about === b.about &&
    a.avatar === b.avatar
  )
}

export const useInformationPage = (id?: string) => {
  const draftAvatarRef = useRef<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [previewSrc, setPreviewSrc] = useState("")

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

  const viewerUser: User = {
    id: resolvedInformation.postOwnerId,
    fullName: resolvedInformation.fullName,
    avatar: resolvedInformation.avatar,
  }

  const canEditInformation = useMemo(() => {
    return resolvedInformation.postOwnerId === viewerUser.id
  }, [resolvedInformation.postOwnerId, viewerUser.id])

  const [information, setInformation] = useState<InformationData>(resolvedInformation)

  const initialEditForm = useMemo(
    () => buildEditForm(resolvedInformation),
    [resolvedInformation]
  )

  const [editForm, setEditForm] = useState<EditInformationFormState>(initialEditForm)
  const [editInitialForm, setEditInitialForm] = useState<EditInformationFormState>(initialEditForm)
  const [editErrors, setEditErrors] = useState<EditInformationErrors>({})

  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordErrors>({})

  useEffect(() => {
    if (draftAvatarRef.current && isObjectUrl(draftAvatarRef.current)) {
      URL.revokeObjectURL(draftAvatarRef.current)
      draftAvatarRef.current = null
    }

    setInformation(resolvedInformation)

    const nextForm = buildEditForm(resolvedInformation)
    setEditForm(nextForm)
    setEditInitialForm(nextForm)
    setEditErrors({})

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

  const isEditDirty = useMemo(() => {
    return !areEqual(editForm, editInitialForm)
  }, [editForm, editInitialForm])

  const passwordStrength = useMemo(
    () => buildPasswordStrength(passwordForm.newPassword),
    [passwordForm.newPassword]
  )

  const openEditModal = useCallback(() => {
    const nextForm = buildEditForm(information)

    setEditErrors({})
    setPasswordErrors({})
    setPasswordOpen(false)
    setEditForm(nextForm)
    setEditInitialForm(nextForm)
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
    setEditErrors({})
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

      setEditErrors((prev) => ({
        ...prev,
        [field]: undefined,
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

  const handlers = useInformationHandlers({
    editForm,
    information,
    passwordForm,
    isEditDirty,
    viewerUser,
    draftAvatarRef,
    buildEditForm,
    setInformation,
    setInformationPosts,
    setEditErrors,
    setEditForm,
    setEditInitialForm,
    setEditOpen,
    setPasswordForm,
    setPasswordErrors,
    setPasswordOpen,
  })

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
    editErrors,
    passwordForm,
    passwordErrors,
    passwordStrength,

    isEditDirty,

    openPreview,
    closePreview,
    openEditModal,
    closeEditModal,
    openPasswordModal,
    backToEditModal,

    setField,
    setAvatar,
    setPasswordField,

    ...handlers,
  }
}