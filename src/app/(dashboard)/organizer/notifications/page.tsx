"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
  type AppNotification,
} from "@/state/notificationsAPI"
import { iconForNotificationType } from "@/lib/notification-display"
import DataError from "@/components/shared/DataError"

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
        "group flex items-start gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent " +
        (notification.isRead ? "bg-card" : "bg-semantic-info-bg")
      }
    >
      <button type="button" onClick={handleOpen} className="flex flex-1 items-start gap-3 text-left">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{notification.title}</span>
          <span className="block text-sm text-muted-foreground">{notification.text}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </span>
        {!notification.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
      </button>
      <button
        type="button"
        onClick={() => deleteNotification.mutate(notification._id)}
        aria-label="Delete notification"
        className="mt-0.5 shrink-0 text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useNotifications()
  const markAllAsRead = useMarkAllNotificationsAsRead()
  const deleteAll = useDeleteAllNotifications()
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const notifications = data?.data?.data ?? []

  const handleClearAll = async () => {
    await deleteAll.mutateAsync()
    setConfirmClearOpen(false)
  }

  if (isError) {
    return <DataError message="Couldn't load notifications." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay on top of activity across your events.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending || notifications.every((n) => n.isRead)}
          >
            Mark all as read
          </Button>
          <Button
            variant="outline"
            className="text-semantic-error hover:text-semantic-error-hover"
            onClick={() => setConfirmClearOpen(true)}
            disabled={notifications.length === 0}
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Bell className="size-6 text-muted-foreground" />
            </span>
            <p className="font-medium">You&apos;re all caught up</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              New activity on your events — orders, check-ins and updates — will show up here.
            </p>
          </div>
        )}
        {notifications.map((notification) => (
          <NotificationRow key={notification._id} notification={notification} />
        ))}
      </div>

      <Dialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Clear all notifications?</DialogTitle>
            <DialogDescription>This can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClearOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-semantic-error text-white hover:bg-semantic-error-hover"
              onClick={handleClearAll}
              disabled={deleteAll.isPending}
            >
              {deleteAll.isPending ? "Clearing…" : "Clear all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
