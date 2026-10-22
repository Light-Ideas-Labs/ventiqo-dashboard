"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Info } from "lucide-react";
import { useAllEvents } from "@/state/eventsAPI";
import { DisplayEvent, mapRawEventToDisplay } from "@/lib/event-display";

export default function AllEventsPage() {
  const { data } = useAllEvents();

  const events = useMemo(() => {
    const rawEvents = data?.events.data;
    if (!Array.isArray(rawEvents) || rawEvents.length === 0) return [] as DisplayEvent[];

    return rawEvents
      .map((event: any) => mapRawEventToDisplay(event))
      .filter((event): event is DisplayEvent => event !== null);
  }, [data]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to map
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-foreground">All Events</h1>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No events found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
            >
              <Link href={`/events/${event.id}`} aria-label="View details and reviews" title="View details and reviews" className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80">
                <Info className="h-3.5 w-3.5" />
              </Link>
              <Link href={`/chekout?eventId=${event.id}`} className="block">
                <div className="relative h-44 w-full">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {event.dateLabel}
                      {event.timeLabel ? ` · ${event.timeLabel}` : ""}
                    </span>
                  </div>
                  <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">{event.title}</h3>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-600">
                      {event.isFree ? "Free" : event.price !== undefined ? `KES ${event.price}` : "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
