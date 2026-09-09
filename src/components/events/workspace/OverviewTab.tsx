"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckCircle2, Ticket, Wallet, UserCheck, Download, Mail, Tag, Rocket, ScanLine } from "lucide-react"
import type { EventData } from "@/types/event"
import AddTicketDialog from "@/components/events/workspace/AddTicketDialog"
import {
  ticketsSoldFor,
  ticketsCapacityFor,
  revenueFor,
  eventDisplayStatus,
  ticketBreakdown,
} from "@/lib/event-stats"

type QuickAction =
  | { icon: typeof Ticket; label: string; kind: "tab"; tab: string }
  | { icon: typeof Ticket; label: string; kind: "link"; href: string }
  | { icon: typeof Ticket; label: string; kind: "toast"; note: string }

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Download, label: "Download Attendee List", kind: "tab", tab: "attendees" },
  { icon: ScanLine, label: "Check-in Attendees", kind: "tab", tab: "attendees" },
  { icon: Tag, label: "Create Discount Code", kind: "link", href: "/organizer/marketing" },
  { icon: Mail, label: "Send email to attendees", kind: "toast", note: "Coming in Phase 8" },
  { icon: Rocket, label: "Boost this event", kind: "toast", note: "Coming in Phase 8" },
]

function StatCard({ icon: Icon, label, value, caption }: { icon: typeof Ticket; label: string; value: string; caption?: string }) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <h2 className="text-2xl font-semibold">{value}</h2>
      {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
    </div>
  )
}

export default function OverviewTab({
  event,
  onEditClick,
  onTabChange,
}: {
  event: EventData
  onEditClick: () => void
  onTabChange: (tab: string) => void
}) {
  const router = useRouter()
  const sold = ticketsSoldFor(event)
  const capacity = ticketsCapacityFor(event)
  const revenue = revenueFor(event)
  const status = eventDisplayStatus(event)
  const breakdown = ticketBreakdown(event).sort((a, b) => b.revenue - a.revenue)

  const statusCopy: Record<string, { title: string; body: string; tone: string }> = {
    active: {
      title: "Event is Live",
      body: "Your event is visible to attendees.",
      tone: "border-semantic-success-bg-strong bg-semantic-success-bg text-semantic-success-text",
    },
    draft: {
      title: "Event is a Draft",
      body: "Publish it to make it visible to attendees.",
      tone: "border-semantic-warning-bg-strong bg-semantic-warning-bg text-semantic-warning-text",
    },
    past: {
      title: "Event has ended",
      body: "This event's date has already passed.",
      tone: "border-border bg-muted text-muted-foreground",
    },
    cancelled: {
      title: "Event is Cancelled",
      body: "This event is no longer visible to attendees.",
      tone: "border-semantic-error-bg-strong bg-semantic-error-bg text-semantic-error-text",
    },
  }
  const statusInfo = statusCopy[status]

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Ticket}
          label="Total Tickets Sold"
          value={`${sold.toLocaleString()}/${capacity.toLocaleString()}`}
          caption={capacity > 0 ? `${Math.round((sold / capacity) * 100)}% sold` : undefined}
        />
        <StatCard icon={Wallet} label="Gross Revenue" value={`KES ${revenue.toLocaleString()}`} />
        <StatCard icon={UserCheck} label="Bookings" value={(event.currentBookings ?? 0).toLocaleString()} />

        <div className={`space-y-1 rounded-2xl border p-5 ${statusInfo.tone}`}>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="size-4" />
            {statusInfo.title}
          </div>
          <p className="text-sm opacity-90">{statusInfo.body}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold">Revenue Breakdown</h3>
            {breakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ticket categories yet.</p>
            ) : (
              <div className="space-y-3">
                {breakdown.map((row) => (
                  <div key={row.name} className="flex items-center justify-between text-sm">
                    <span>{row.name}</span>
                    <span className="text-muted-foreground">{row.sharePct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="font-semibold">Ticket by Type</h3>
              <AddTicketDialog eventId={event._id} eventDate={event.date} />
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="px-5 py-2 font-medium">Ticket Type</th>
                  <th className="px-5 py-2 font-medium">Price</th>
                  <th className="px-5 py-2 font-medium">Sold</th>
                  <th className="px-5 py-2 font-medium">Available</th>
                  <th className="px-5 py-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <td className="px-5 py-3">{row.name}</td>
                    <td className="px-5 py-3">KES {row.price.toLocaleString()}</td>
                    <td className="px-5 py-3">{row.sold.toLocaleString()}</td>
                    <td className="px-5 py-3">{row.available.toLocaleString()}</td>
                    <td className="px-5 py-3">KES {row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
                {breakdown.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-muted-foreground">
                      No ticket categories yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold">Quick Actions</h3>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    if (action.kind === "tab") onTabChange(action.tab)
                    else if (action.kind === "link") router.push(action.href)
                    else toast(`${action.label} — ${action.note}`)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                >
                  <action.icon className="size-4 text-muted-foreground" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold">Event Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(event.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last edited</dt>
                <dd>{new Date(event.updatedAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Event ID</dt>
                <dd className="truncate font-mono text-xs">{event._id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd>{event.categoryName || event.category?.name || "—"}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={onEditClick}
              className="mt-3 text-xs font-medium text-primary hover:underline"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
