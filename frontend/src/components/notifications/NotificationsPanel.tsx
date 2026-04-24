import { Link } from "react-router-dom"
import { Bell, Heart, MessageCircle } from "lucide-react"
import type { NotificationItem } from "../../hooks/notifications/useNotifications"

type Props = {
  notifications: NotificationItem[]
  unreadCount: number
  markAsRead: (id: string) => void
}

const NotificationsPanel = ({
  notifications,
  unreadCount,
  markAsRead,
}: Props) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <section className="rounded-[24px] bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 px-5 py-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
              <Bell className="h-5 w-5" />
            </div>

            <h1 className="truncate text-lg font-semibold tracking-tight">
              Thông báo
            </h1>
          </div>

          <span className="inline-flex shrink-0 items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium ring-1 ring-white/15">
            {unreadCount} chưa đọc
          </span>
        </div>
      </section>

      <div className="mt-5 space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <Bell className="mx-auto h-7 w-7 text-slate-400" />
            <div className="mt-4 text-slate-500">Không có thông báo</div>
          </div>
        ) : (
          notifications.map((n) => {
            const to = `/?postId=${n.postId}${n.commentId ? `&commentId=${n.commentId}` : ""}`

            return (
              <Link
                key={n.id}
                to={to}
                onClick={() => markAsRead(n.id)}
                className={`relative block rounded-2xl border bg-white p-4 shadow-sm ${
                  n.isRead ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={n.actor.avatar}
                    className="h-10 w-10 rounded-full"
                  />

                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold">
                        {n.actor.fullName}
                      </span>{" "}
                      {n.actionText}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {n.postTitle}
                    </div>

                    {n.commentPreview ? (
                      <div className="mt-2 text-xs italic text-slate-400">
                        {n.commentPreview}
                      </div>
                    ) : null}
                  </div>

                  {n.type === "like" ? (
                    <Heart className="h-4 w-4 text-red-500" />
                  ) : (
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                {!n.isRead && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm" />
                )}
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

export default NotificationsPanel