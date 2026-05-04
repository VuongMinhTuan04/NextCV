import { useCallback, type Dispatch, type MutableRefObject, type SetStateAction } from "react"
import { toast } from "sonner"
import { informationApi } from "../../services/api"
import { pushNotification } from "../notifications/useNotifications"

import type { InformationData } from "./useInformationPage"
import type { PostItem, User } from "../../types/post"
import type { Attachment } from "../../utils/file"
import { getAttachmentKind } from "../../utils/file"

import {
  normalizeSpaces,
  validateEditForm,
  validatePasswordForm,
  type ChangePasswordErrors,
  type ChangePasswordFormState,
  type EditInformationErrors,
  type EditInformationFormState,
} from "./validation"

type PostComment = {
  id: string
  content: string
  createdAt?: string
  user: User
  attachment?: Attachment
}

type PostLikeShape = PostItem & {
  likedByUser?: boolean
  likes?: number
  comments?: PostComment[]
  title?: string
}

type BuildEditForm = (information: InformationData) => EditInformationFormState

type Props = {
  editForm: EditInformationFormState
  information: InformationData
  passwordForm: ChangePasswordFormState
  isEditDirty: boolean
  viewerUser: User
  draftAvatarRef: MutableRefObject<string | null>
  buildEditForm: BuildEditForm
  setInformation: Dispatch<SetStateAction<InformationData>>
  setInformationPosts: Dispatch<SetStateAction<PostItem[]>>
  setEditErrors: Dispatch<SetStateAction<EditInformationErrors>>
  setEditForm: Dispatch<SetStateAction<EditInformationFormState>>
  setEditInitialForm: Dispatch<SetStateAction<EditInformationFormState>>
  setEditOpen: Dispatch<SetStateAction<boolean>>
  setPasswordForm: Dispatch<SetStateAction<ChangePasswordFormState>>
  setPasswordErrors: Dispatch<SetStateAction<ChangePasswordErrors>>
  setPasswordOpen: Dispatch<SetStateAction<boolean>>
}

export const useInformationHandlers = ({
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
}: Props) => {
  const handleUpdateInformation = useCallback(() => {
    const nextErrors = validateEditForm(editForm)
    setEditErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return
    if (!isEditDirty) return

    const previousAvatar = information.avatar
    const nextInformation: InformationData = {
      ...information,
      fullName: normalizeSpaces(editForm.fullName),
      phone: editForm.phone.replace(/\D/g, ""),
      about: editForm.about.replace(/\r\n/g, "\n"),
      avatar: editForm.avatar,
    }

    setInformation(nextInformation)

    const nextForm = buildEditForm(nextInformation)
    setEditForm(nextForm)
    setEditInitialForm(nextForm)
    setEditOpen(false)

    if (previousAvatar !== nextInformation.avatar && previousAvatar.startsWith("blob:")) {
      URL.revokeObjectURL(previousAvatar)
    }

    draftAvatarRef.current = null
    toast.success("Cập nhật thành công")
  }, [
    buildEditForm,
    draftAvatarRef,
    editForm,
    information,
    isEditDirty,
    setEditErrors,
    setEditForm,
    setEditInitialForm,
    setEditOpen,
    setInformation,
  ])

  const handleChangePassword = useCallback(async () => {
    const nextErrors = validatePasswordForm(passwordForm)
    setPasswordErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    try {
      await informationApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordErrors({})
      setPasswordOpen(false)
      setEditOpen(true)

      toast.success("Đổi mật khẩu thành công")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Đổi mật khẩu thất bại"
      setPasswordErrors({
        oldPassword: message,
      })
    }
  }, [
    passwordForm,
    setEditOpen,
    setPasswordErrors,
    setPasswordForm,
    setPasswordOpen,
  ])

  const handleToggleLike = useCallback((postId: string) => {
    setInformationPosts((prev) => {
      const nextPosts = prev.map((post) => {
        if (String(post.id) !== String(postId)) return post

        const wasLiked = post.liked
        const currentLikes = post.likes ?? 0

        return {
          ...post,
          liked: !wasLiked,
          likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
        } as PostItem
      })

      const targetPost = prev.find((p) => String(p.id) === String(postId))
      if (targetPost && !targetPost.liked && viewerUser.id !== targetPost.user.id) {
        pushNotification({
          type: "like",
          actor: {
            id: viewerUser.id,
            fullName: viewerUser.fullName,
            avatar: viewerUser.avatar,
          },
          receiverId: targetPost.user.id,
          postId: targetPost.id,
          postTitle: targetPost.title || targetPost.user.fullName,
          actionText: "đã thích bài viết của bạn",
        })
      }

      return nextPosts
    })
  }, [viewerUser, setInformationPosts])

  const handleDeletePost = useCallback((postId: string) => {
    setInformationPosts((prev) =>
      prev.filter((post) => String(post.id) !== String(postId))
    )
  }, [setInformationPosts])

  const handleUpdatePost = useCallback((postId: string, title: string) => {
    setInformationPosts((prev) =>
      prev.map((post) => {
        if (String(post.id) !== String(postId)) return post
        return { ...post, title } as PostItem
      })
    )
  }, [setInformationPosts])

  const handleAddComment = useCallback(
    (postId: string, payload: { content: string; file: File | null }) => {
      setInformationPosts((prev) => {
        const nextPosts = prev.map((post) => {
          if (String(post.id) !== String(postId)) return post

          const currentComments = Array.isArray((post as PostLikeShape).comments)
            ? ((post as PostLikeShape).comments as PostComment[])
            : []

          let attachment: Attachment | undefined
          if (payload.file) {
            const kind = getAttachmentKind(payload.file)
            if (kind) {
              attachment = {
                name: payload.file.name,
                url: URL.createObjectURL(payload.file),
                kind,
              }
            }
          }

          const nextComment: PostComment = {
            id: crypto.randomUUID(),
            content: payload.content,
            createdAt: new Date().toISOString(),
            user: viewerUser,
            attachment,
          }

          return {
            ...post,
            comments: [...currentComments, nextComment],
          } as PostItem
        })

        const targetPost = prev.find((p) => String(p.id) === String(postId))
        if (targetPost && viewerUser.id !== targetPost.user.id) {
          pushNotification({
            type: "comment",
            actor: {
              id: viewerUser.id,
              fullName: viewerUser.fullName,
              avatar: viewerUser.avatar,
            },
            receiverId: targetPost.user.id,
            postId: targetPost.id,
            commentId: undefined,
            postTitle: targetPost.title || targetPost.user.fullName,
            commentPreview: payload.content.substring(0, 100),
            actionText: "đã bình luận về bài viết của bạn",
          })
        }

        return nextPosts
      })
    },
    [viewerUser, setInformationPosts]
  )

  const handleUpdateComment = useCallback(
    (postId: string, commentId: string, content: string) => {
      setInformationPosts((prev) =>
        prev.map((post) => {
          if (String(post.id) !== String(postId)) return post

          const currentComments = Array.isArray((post as PostLikeShape).comments)
            ? ((post as PostLikeShape).comments as PostComment[])
            : []

          return {
            ...post,
            comments: currentComments.map((comment) =>
              String(comment.id) === String(commentId)
                ? { ...comment, content }
                : comment
            ),
          } as PostItem
        })
      )
    },
    [setInformationPosts]
  )

  const handleDeleteComment = useCallback((postId: string, commentId: string) => {
    setInformationPosts((prev) =>
      prev.map((post) => {
        if (String(post.id) !== String(postId)) return post

        const currentComments = Array.isArray((post as PostLikeShape).comments)
          ? ((post as PostLikeShape).comments as PostComment[])
          : []

        const targetComment = currentComments.find(
          (comment) => String(comment.id) === String(commentId)
        )

        if (targetComment?.attachment?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(targetComment.attachment.url)
        }

        return {
          ...post,
          comments: currentComments.filter(
            (comment) => String(comment.id) !== String(commentId)
          ),
        } as PostItem
      })
    )
  }, [setInformationPosts])

  return {
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