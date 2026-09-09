"use client"

import { Ticket, Wallet, CalendarClock, UserCheck, type LucideIcon } from "lucide-react"
import type { Event } from "@/state/eventsAPI"
import { ticketsSoldFor, revenueFor, isUpcoming } from "@/lib/event-stats"

function StatCard({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: LucideIcon
  label: string
  value: string
  caption: string
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <h2 className="text-2xl font-semibold">{value}</h2>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-7 w-16 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}

export default function StatsCards({ events, isLoading }: { events: Event[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const totalTicketsSold = events.reduce((sum, e) => sum + ticketsSoldFor(e), 0)
  const grossRevenue = events.reduce((sum, e) => sum + revenueFor(e), 0)
  const upcomingCount = events.filter(isUpcoming).length
  const checkedInAttendees = events.reduce((sum, e) => sum + (e.currentBookings ?? 0), 0)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Ticket}
        label="Total Tickets Sold"
        value={totalTicketsSold.toLocaleString()}
        caption={`Across ${events.length} event${events.length === 1 ? "" : "s"}`}
      />
      <StatCard
        icon={Wallet}
        label="Gross Revenue"
        value={`KES ${grossRevenue.toLocaleString()}`}
        caption="Before platform fees"
      />
      <StatCard
        icon={CalendarClock}
        label="Upcoming Events"
        value={upcomingCount.toLocaleString()}
        caption="Active events"
      />
      <StatCard
        icon={UserCheck}
        label="Bookings"
        value={checkedInAttendees.toLocaleString()}
        caption="Confirmed bookings across all events"
      />
    </div>
  )
}
