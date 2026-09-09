import type { Event } from "@/state/eventsAPI"
import EventCard from "./EventCard"

export default function EventsGrid({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} showActions />
      ))}
    </div>
  )
}
