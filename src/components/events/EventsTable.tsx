import Link from "next/link"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/state/eventsAPI"
import {
  ticketsSoldFor,
  ticketsCapacityFor,
  revenueFor,
  eventImageUrl,
  eventDisplayStatus,
  EVENT_STATUS_LABEL,
  EVENT_STATUS_BADGE_CLASS,
} from "@/lib/event-stats"
import EventActionsMenu from "./EventActionsMenu"

export default function EventsTable({ events }: { events: Event[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tickets Sold</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const image = eventImageUrl(event)
            const sold = ticketsSoldFor(event)
            const capacity = ticketsCapacityFor(event)
            const progress = capacity > 0 ? Math.min(100, Math.round((sold / capacity) * 100)) : 0
            const status = eventDisplayStatus(event)
            const date = new Date(event.date)

            return (
              <TableRow key={event._id}>
                <TableCell>
                  <Link href={`/organizer/events/${event._id}`} className="flex items-center gap-3">
                    <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element -- remote host isn't in next.config images
                        <img src={image} alt={event.title} className="size-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{event.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{event.venueName}</p>
                    </div>
                  </Link>
                </TableCell>

                <TableCell>
                  <Badge className={`border-0 ${EVENT_STATUS_BADGE_CLASS[status]}`}>
                    {EVENT_STATUS_LABEL[status]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="w-28 space-y-1">
                    <p className="text-xs">
                      {sold.toLocaleString()} / {capacity.toLocaleString()}
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-medium text-semantic-success-text">
                  KES {revenueFor(event).toLocaleString()}
                </TableCell>

                <TableCell>{(event.currentBookings ?? 0).toLocaleString()}</TableCell>

                <TableCell className="text-muted-foreground">
                  {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>

                <TableCell className="text-right">
                  <EventActionsMenu event={event} status={status} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
