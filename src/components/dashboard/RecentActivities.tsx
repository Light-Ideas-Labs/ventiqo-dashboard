"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/state/notificationsAPI"
import { iconForNotificationType } from "@/lib/notification-display"

const PAGE_SIZE = 5

export default function RecentActivities() {
  const [limit, setLimit] = useState(PAGE_SIZE)
  const { data, isLoading, isError } = useNotifications(limit)

  const notifications = data?.data?.data ?? []
  const total = data?.data?._meta?.total ?? notifications.length
  const canLoadMore = notifications.length < total

  return (
    <div className="rounded-2xl border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold">Recent Activities</h3>
      </div>

      <div className="divide-y divide-border">
        {isLoading && (
          <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
        )}
        {!isLoading && isError && (
          <p className="px-5 py-6 text-sm text-semantic-error-text">Couldn&apos;t load recent activity.</p>
        )}
        {!isLoading && !isError && notifications.length === 0 && (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            No activity yet — updates on your events will show up here.
          </p>
        )}
        {notifications.map((notification) => {
          const Icon = iconForNotificationType(notification.type)
          return (
            <div key={notification._id} className="flex items-start gap-3 px-5 py-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
                <p className="text-sm text-foreground">{notification.text}</p>
              </div>
            </div>
          )
        })}
      </div>

      {canLoadMore && (
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
