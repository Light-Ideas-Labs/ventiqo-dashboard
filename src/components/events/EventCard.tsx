import Link from "next/link"
import { MapPin, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Event } from "@/state/eventsAPI"
import {
  ticketsSoldFor,
  ticketsCapacityFor,
  eventImageUrl,
  eventDisplayStatus,
  EVENT_STATUS_LABEL,
  EVENT_STATUS_BADGE_CLASS,
} from "@/lib/event-stats"
import EventActionsMenu from "./EventActionsMenu"

function EventDateBadge({ date }: { date: string }) {
  const d = new Date(date)
  return (
    <div className="absolute right-3 top-3 flex w-11 flex-col items-center rounded-lg bg-background/95 py-1 text-center shadow-sm">
      <span className="text-[10px] font-medium uppercase text-muted-foreground">
        {d.toLocaleDateString(undefined, { month: "short" })}
      </span>
      <span className="text-sm font-semibold leading-tight">{d.getDate()}</span>
    </div>
  )
}

export default function EventCard({
  event,
  showActions = false,
}: {
  event: Event
  showActions?: boolean
}) {
  const image = eventImageUrl(event)
  const sold = ticketsSoldFor(event)
  const capacity = ticketsCapacityFor(event)
  const progress = capacity > 0 ? Math.min(100, Math.round((sold / capacity) * 100)) : 0
  const status = eventDisplayStatus(event)

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative h-32 w-full bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote host isn't in next.config images */}
        {image && <img src={image} alt={event.title} className="h-full w-full object-cover" />}
        <EventDateBadge date={event.date} />
        <Badge className={`absolute left-3 top-3 border-0 ${EVENT_STATUS_BADGE_CLASS[status]}`}>
          {EVENT_STATUS_LABEL[status]}
        </Badge>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate font-semibold">{event.title}</h4>
          {showActions && <EventActionsMenu event={event} status={status} />}
        </div>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{event.venueName}</span>
        </p>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3.5 shrink-0" />
          {event.startTime} – {event.endTime}
        </p>

        {capacity > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {sold.toLocaleString()}/{capacity.toLocaleString()} tickets sold
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" variant="outline" className="flex-1 rounded-lg">
            <Link href={`/organizer/events/${event._id}`}>View Dashboard</Link>
          </Button>
          <Button asChild size="sm" className="flex-1 rounded-lg">
            <Link href={`/organizer/events/${event._id}`}>Edit Event</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
