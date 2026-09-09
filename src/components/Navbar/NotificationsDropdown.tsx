"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useDeleteNotification,
  type AppNotification,
} from "@/state/notificationsAPI"
import { iconForNotificationType } from "@/lib/notification-display"

function NotificationRow({ notification }: { notification: AppNotification }) {
  const router = useRouter()
  const markAsRead = useMarkNotificationAsRead()
  const deleteNotification = useDeleteNotification()
  const Icon = iconForNotificationType(notification.type)

  const handleOpen = () => {
    if (!notification.isRead) markAsRead.mutate(notification._id)
    if (notification.link) router.push(notification.link)
  }

  return (
    <div
      className={
        "group flex items-start gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent " +
        (notification.isRead ? "" : "bg-semantic-info-bg")
      }
    >
      <button type="button" onClick={handleOpen} className="flex flex-1 items-start gap-3 text-left">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="size-3.5 text-muted-foreground" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-foreground">{notification.text}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </span>
        {!notification.isRead && (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
        )}
      </button>
      <button
        type="button"
        onClick={() => deleteNotification.mutate(notification._id)}
        aria-label="Delete notification"
        className="mt-0.5 shrink-0 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}

export default function NotificationsDropdown() {
  const { data: countData } = useUnreadNotificationsCount()
  const { data, isLoading, isError } = useNotifications()

  const unread = countData?.count ?? 0
  const notifications = data?.data?.data ?? []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-semantic-error" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-semibold">Notifications</p>
        </div>

        <div className="max-h-96 overflow-y-auto p-1.5">
          {isLoading && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</p>
          )}
          {!isLoading && isError && (
            <p className="px-3 py-6 text-center text-sm text-semantic-error-text">
              Couldn&apos;t load notifications.
            </p>
          )}
          {!isLoading && !isError && notifications.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          )}
          {notifications.slice(0, 6).map((notification) => (
            <NotificationRow key={notification._id} notification={notification} />
          ))}
        </div>

        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" className="w-full justify-center">
            <Link href="/organizer/notifications">View All</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
