import { useCallback, useEffect, useMemo, useState } from "react"
import { notificationApi } from "../../services/api"

export type NotificationType =
  | "like_post"
  | "comment_post"
  | "reply_comment"
  | "like_comment"

export type NotificationItem = {
  id: string
  type: NotificationType
  actor: {
    id: string
    fullName: string
    avatar: string
  }
  receiverId: string
  postId: string
  commentId?: string
  postTitle: string
  commentPreview?: string
  actionText: string
  isRead: boolean
  createdAt: number
}

const resolveAvatar = (src?: string) => {
  const value = (src ?? "").trim()

  if (!value) return "/avatar/user.png"
  if (value.startsWith("http")) return value
  if (value.startsWith("blob:")) return value
  if (value.startsWith("data:")) return value
  if (value.startsWith("/avatar/")) return value

  return `/avatar/${value.replace(/^\/+/, "")}`
}

const safeText = (value: unknown) => {
  return typeof value === "string" ? value.trim() : ""
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    const res = await notificationApi.getAll()
    const list = res?.data?.notifications ?? []

    const mapped: NotificationItem[] = list.map((n: any) => {
      const fromUser = n.fromUserId ?? {}
      const post = n.postId ?? {}
      const comment = n.commentId ?? {}

      const postId =
        typeof n.postId === "object"
          ? String(post._id ?? post.id ?? "")
          : String(n.postId ?? "")

      const commentId =
        typeof n.commentId === "object"
          ? String(comment._id ?? comment.id ?? "")
          : n.commentId
            ? String(n.commentId)
            : undefined

      const actorFullName = safeText(
        fromUser.fullname || fromUser.fullName
      )

      const rawMessage = safeText(n.message)

      const normalizedMessage = rawMessage.startsWith(actorFullName)
        ? rawMessage.slice(actorFullName.length).trim()
        : rawMessage

      return {
        id: String(n._id ?? n.id ?? ""),
        type: n.type,
        actor: {
          id: String(fromUser._id ?? fromUser.id ?? ""),
          fullName: actorFullName,
          avatar: resolveAvatar(fromUser.avatar),
        },
        receiverId: String(n.userId ?? ""),
        postId,
        commentId,
        postTitle:
          safeText(n.postTitle) ||
          safeText(post.title) ||
          "",
        commentPreview:
          safeText(n.commentPreview) ||
          safeText(comment.content) ||
          "",
        actionText: normalizedMessage,
        isRead: Boolean(n.isRead),
        createdAt: new Date(n.createdAt).getTime(),
      }
    })

    setNotifications(mapped)
    setUnreadCount(res?.data?.unreadCount ?? 0)
  }, [])

  useEffect(() => {
    void fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = useCallback(async (id: string) => {
    await notificationApi.markAsRead(id)

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )

    setUnreadCount((prev) => Math.max(prev - 1, 0))
  }, [])

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead()

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [])

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  )

  return {
    notifications: sortedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}