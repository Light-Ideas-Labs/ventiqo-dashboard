"use client"

import Link from "next/link"
import { toast } from "sonner"
import { MapPin, Eye, Pencil, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { EventData } from "@/types/event"
import { eventImageUrl, eventDisplayStatus, EVENT_STATUS_LABEL, EVENT_STATUS_BADGE_CLASS } from "@/lib/event-stats"
import ShareEventMenu from "./ShareEventMenu"
import EventActionsMenu from "@/components/events/EventActionsMenu"

export default function EventWorkspaceHeader({
  event,
  onEditClick,
}: {
  event: EventData
  onEditClick: () => void
}) {
  const image = eventImageUrl(event)
  const status = eventDisplayStatus(event)
  const date = new Date(event.date)
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venueName)}`

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/organizer/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/organizer/events">Events</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{event.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element -- remote host isn't in next.config images
              <img src={image} alt={event.title} className="size-full object-cover" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <button onClick={onEditClick} aria-label="Edit title" className="text-muted-foreground hover:text-foreground">
                <Pencil className="size-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </span>
              {(event.startTime || event.endTime) && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {event.startTime} {event.endTime ? `– ${event.endTime}` : ""}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {event.venueName}
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Get directions
                </a>
              </span>
            </div>
            <Badge variant="outline">{event.categoryName || event.category?.name}</Badge>
            <Badge className={`ml-2 border-0 ${EVENT_STATUS_BADGE_CLASS[status]}`}>
              {EVENT_STATUS_LABEL[status]}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast("Public event pages are coming soon")}>
            <Eye className="size-4" />
            View event page
          </Button>
          <ShareEventMenu eventId={event._id} />
          <Button className="gap-2" onClick={onEditClick}>
            <Pencil className="size-4" />
            Edit event
          </Button>
          <EventActionsMenu event={event} status={status} />
        </div>
      </div>
    </div>
  )
}
