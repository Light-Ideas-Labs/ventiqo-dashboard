// The codebase has two separate, slightly-incompatible types for an Event
// (`Event` in state/eventsAPI.ts for list responses, `EventData` in
// types/event.ts for the single-event response — they even disagree on
// whether `category` is a string or an object). These helpers only touch
// the fields both shapes actually share, typed structurally, so either one
// can be passed in without fighting the mismatch.
type TicketLike = { ticketsSold?: number; quantity?: number; price?: number }
export type EventStatsInput = {
  tickets?: TicketLike[]
  status: string
  date: string
  image?: string | string[]
  currentBookings?: number
}

const UPCOMING_STATUSES = new Set(["Active", "Published"])

export function ticketsSoldFor(event: EventStatsInput): number {
  return (event.tickets ?? []).reduce((sum, t) => sum + (t.ticketsSold ?? 0), 0)
}

export function ticketsCapacityFor(event: EventStatsInput): number {
  return (event.tickets ?? []).reduce((sum, t) => sum + (t.quantity ?? 0), 0)
}

export function revenueFor(event: EventStatsInput): number {
  return (event.tickets ?? []).reduce((sum, t) => sum + (t.ticketsSold ?? 0) * (t.price ?? 0), 0)
}

export function isUpcoming(event: EventStatsInput): boolean {
  if (!UPCOMING_STATUSES.has(event.status)) return false
  const eventDate = new Date(event.date)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return eventDate >= startOfToday
}

export function eventImageUrl(event: EventStatsInput): string | null {
  const image = event.image
  if (Array.isArray(image)) return image[0] ?? null
  return image ?? null
}

// The backend's EVENT_STATUS enum has no "Cancelled" or "Past" value — the
// design calls for both, so they're derived here rather than stored:
// "Cancelled" is our display name for the real "Archived" status, and
// "Past" is any non-draft event whose date has already happened.
export type EventDisplayStatus = "active" | "draft" | "past" | "cancelled"

export function eventDisplayStatus(event: EventStatsInput): EventDisplayStatus {
  if (event.status === "Draft") return "draft"
  if (event.status === "Archived") return "cancelled"

  const eventDate = new Date(event.date)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  if (eventDate < startOfToday || event.status === "Completed") return "past"

  return "active"
}

export const EVENT_STATUS_LABEL: Record<EventDisplayStatus, string> = {
  active: "Active",
  draft: "Draft",
  past: "Past",
  cancelled: "Cancelled",
}

export const EVENT_STATUS_BADGE_CLASS: Record<EventDisplayStatus, string> = {
  active: "bg-semantic-success-bg text-semantic-success-text",
  draft: "bg-semantic-warning-bg text-semantic-warning-text",
  past: "bg-muted text-muted-foreground",
  cancelled: "bg-semantic-error-bg text-semantic-error-text",
}

export interface TicketBreakdownRow {
  name: string
  price: number
  sold: number
  capacity: number
  available: number
  revenue: number
  sharePct: number
}

export function ticketBreakdown(event: { tickets?: (TicketLike & { name?: string })[] }): TicketBreakdownRow[] {
  const tickets = event.tickets ?? []
  const totalRevenue = tickets.reduce((sum, t) => sum + (t.ticketsSold ?? 0) * (t.price ?? 0), 0)

  return tickets.map((t) => {
    const sold = t.ticketsSold ?? 0
    const capacity = t.quantity ?? 0
    const revenue = sold * (t.price ?? 0)
    return {
      name: t.name ?? "Ticket",
      price: t.price ?? 0,
      sold,
      capacity,
      available: Math.max(0, capacity - sold),
      revenue,
      sharePct: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 1000) / 10 : 0,
    }
  })
}
