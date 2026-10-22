"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvent } from "@/state/eventsAPI";
import { formatEventDateTime } from "@/lib/event-display";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export default function EventDetailsPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const { data, isLoading, isError } = useEvent(eventId);
  const event = data?.data;

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-muted-foreground">Loading event…</div>;
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Couldn&apos;t load this event</h1>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/events">Back to events</Link>
        </Button>
      </div>
    );
  }

  const { dateLabel, timeLabel } = formatEventDateTime(event.date, event.startTime);
  const image = (event.image as unknown as string[])?.[0] || "/images/placeholder.svg";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      <div className="relative mt-4 h-64 w-full overflow-hidden rounded-xl">
        <Image src={image} alt={event.title} fill className="object-cover" />
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-foreground">{event.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" />
          {dateLabel}
          {timeLabel ? ` · ${timeLabel}` : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" />
          {event.venueName}
        </span>
      </div>

      {event.aboutEvent && <p className="mt-6 text-foreground">{event.aboutEvent}</p>}

      {event.tickets.length > 0 && (
        <div className="mt-8 rounded-xl border bg-card p-5">
          <h2 className="font-semibold">Tickets</h2>
          <div className="mt-3 space-y-3">
            {event.tickets.map((ticket) => (
              <div key={ticket._id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-xs text-muted-foreground">{ticket.description}</p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/chekout?eventId=${event._id}&ticketType=${encodeURIComponent(ticket.name)}`}>
                    KES {ticket.price.toLocaleString()}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <ReviewsSection eventId={event._id} />
      </div>
    </div>
  );
}
