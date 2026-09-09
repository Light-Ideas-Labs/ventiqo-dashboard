"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/events/EventCard"
import type { Event } from "@/state/eventsAPI"
import { isUpcoming } from "@/lib/event-stats"

export default function UpcomingEventsRow({ events, isLoading }: { events: Event[]; isLoading: boolean }) {
  const upcoming = events.filter(isUpcoming).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <Link href="/organizer/events" className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && upcoming.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-sm font-medium">No upcoming events</p>
          <p className="text-xs text-muted-foreground">Create an event to see it here.</p>
          <Button asChild size="sm" className="mt-2 rounded-lg">
            <Link href="/organizer/events/new">Create Event</Link>
          </Button>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {upcoming.map((event) => (
            <div key={event._id} className="w-72 shrink-0">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
