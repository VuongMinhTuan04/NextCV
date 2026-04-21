import { createContext, useContext, useEffect, useMemo, useState } from "react"

type NotificationType = "like" | "comment"

export type NotificationItem = {
  id: number
  type: NotificationType
  user: {
    name: string
    avatar: string
  }
  content: string
  time: string
  postId: number
  commentId?: number
  postPreview?: string
  isRead: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "comment",
    user: {
      name: "Elena Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    content: "commented on your post",
    time: "12 minutes ago",
    postId: 1,
    commentId: 1,
    postPreview:
      '"This is a fantastic breakdown! particularly loved the section..."',
    isRead: false,
  },
  {
    id: 2,
    type: "like",
    user: {
      name: "Marcus Chen",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    content: "liked your post",
    time: "2 hours ago",
    postId: 2,
    isRead: false,
  },
  {
    id: 3,
    type: "comment",
    user: {
      name: "Sarah Jenkins",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    content: "commented on your post",
    time: "Yesterday",
    postId: 2,
    commentId: 1,
    postPreview: "Really useful insight on frontend architecture.",
    isRead: false,
  },
]

type NotificationContextValue = {
  notifications: NotificationItem[]
  unreadCount: number
  markAsRead: (id: number) => void
  markAllAsRead: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const STORAGE_KEY = "nextcv_notifications"

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as NotificationItem[]
      if (Array.isArray(parsed)) {
        setNotifications(parsed)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    )
  }
  return ctx
}