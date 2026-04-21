import { Link } from "react-router-dom"
import { Bell, Heart, MessageCircle } from "lucide-react"
import { useNotifications } from "../context/NotificationContext"

const Notification = () => {
  const { notifications, markAsRead } = useNotifications()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Banner */}
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

      {/* Content */}
      <div className="mt-5">
        {notifications.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
              <Bell className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              Bạn chưa nhận được thông báo nào
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Khi có lượt thích, bình luận hoặc hoạt động mới, thông báo sẽ xuất
              hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const to = `/?postId=${n.postId}${
                n.commentId ? `&commentId=${n.commentId}` : ""
              }`

              return (
                <Link
                  key={n.id}
                  to={to}
                  onClick={() => markAsRead(n.id)}
                  className={`group block rounded-[22px] border p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    n.isRead
                      ? "border-slate-100 bg-white"
                      : "border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={n.user.avatar}
                        alt={n.user.name}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
                      />

                      <div
                        className={`absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full text-white shadow-sm ${
                          n.type === "like" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {n.type === "like" ? (
                          <Heart className="h-3 w-3 fill-white" />
                        ) : (
                          <MessageCircle className="h-3 w-3" />
                        )}
                      </div>
                    </div>

                    {/* Nội dung */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-6 ${
                          n.isRead ? "text-slate-500" : "text-slate-700"
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            n.isRead ? "text-slate-700" : "text-slate-900"
                          }`}
                        >
                          {n.user.name}
                        </span>{" "}
                        {n.content}
                      </p>

                      {n.postPreview && (
                        <div className="mt-2 rounded-2xl bg-white/80 px-3 py-2 text-sm italic text-slate-500 ring-1 ring-slate-100">
                          {n.postPreview}
                        </div>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-xs font-medium text-slate-400">
                          {n.time}
                        </p>

                        {!n.isRead && (
                          <span className="inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-medium text-white">
                            Mới
                          </span>
                        )}
                      </div>
                    </div>

                    {!n.isRead && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-indigo-500" />
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification