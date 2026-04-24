import { useCallback, useEffect, useMemo, useState } from "react"

export type NotificationType = "like" | "comment"

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

const STORAGE_KEY = "nextcv_notifications"

const notificationsBus: {
  listeners: Set<(n: NotificationItem) => void>
  emit: (n: NotificationItem) => void
} = {
  listeners: new Set(),
  emit(n) {
    this.listeners.forEach((fn) => fn(n))
  },
}

export const pushNotification = (payload: Omit<NotificationItem, "id" | "isRead" | "createdAt">) => {
  const item: NotificationItem = {
    ...payload,
    id: crypto.randomUUID(),
    isRead: false,
    createdAt: Date.now(),
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  const prev = raw ? (JSON.parse(raw) as NotificationItem[]) : []

  const next = [item, ...prev]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  notificationsBus.emit(item)
}

const getStoredNotifications = (): NotificationItem[] | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return null
  } catch {
    return null
  }
}

const seedMockNotifications = () => {
  const existing = getStoredNotifications()
  if (existing) return

  const now = Date.now()
  const mockItems: NotificationItem[] = [
    {
      id: "mock-1",
      type: "like",
      actor: {
        id: "user-2",
        fullName: "An Nguyen",
        avatar: "https://i.pravatar.cc/100?img=1",
      },
      receiverId: "user-1",
      postId: "post-1",
      postTitle: "Mình đang build giao diện NextCV, tập trung vào clean UI và trải nghiệm mượt hơn.",
      actionText: "đã thích bài viết của bạn",
      isRead: false,
      createdAt: now - 60000,
    },
    {
      id: "mock-2",
      type: "comment",
      actor: {
        id: "user-3",
        fullName: "Bao Le",
        avatar: "https://i.pravatar.cc/100?img=3",
      },
      receiverId: "user-1",
      postId: "post-3",
      commentId: "cmt-4",
      postTitle: "Mình vừa deploy thử nghiệm, tốc độ load cải thiện rõ rệt.",
      commentPreview: "Có thể share config cụ thể không?",
      actionText: "đã bình luận về bài viết của bạn",
      isRead: false,
      createdAt: now - 120000,
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockItems))
}

seedMockNotifications()

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setNotifications(JSON.parse(raw))
      } catch {
        setNotifications([])
      }
    }
  }, [])

  useEffect(() => {
    const fn = (n: NotificationItem) => {
      if (!userId || n.receiverId !== userId) return
      setNotifications((prev) => [n, ...prev])
    }

    notificationsBus.listeners.add(fn)
    return () => {
      notificationsBus.listeners.delete(fn)
    }
  }, [userId])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}