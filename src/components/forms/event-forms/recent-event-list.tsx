"use client";

import React from "react";
import Image from "next/image";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Ticket, Calendar } from "lucide-react";
import { useAllEvents, getEventTicketSummary, eventKeys } from "@/state/eventsAPI";

const RecentEventList: React.FC = () => {
  const { data, isLoading } = useAllEvents();
  const events = (data?.events.data ?? []).slice(0, 3);

  // Dynamic list of ticket-summary queries, one per event on this page.
  const ticketSummaryQueries = useQueries({
    queries: events.map((event: any) => ({
      queryKey: eventKeys.ticketSummary(event._id),
      queryFn: () => getEventTicketSummary(event._id),
      enabled: Boolean(event._id),
    })),
  });

  if (isLoading) {
    return <p>Loading recent events...</p>;
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Recent Event List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event: any, index: number) => {
          const summary = ticketSummaryQueries[index]?.data?.data;

          return (
            <div
              key={event._id}
              className="flex items-center justify-between space-x-4"
            >
              {/* Event Image */}
              <Image
                src={event.image || "/images/events/sample.jpg"} // Use event image or default
                alt={event.title}
                width={100}
                height={80}
                className="rounded-lg"
              />

              {/* Event Details */}
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-blue-600">{event.venueName || "Unknown location"}</p>
                <p className="text-xs text-gray-500">{event.aboutEvent}</p>
              </div>

              {/* Event Stats with Circular Icons */}
              <div className="flex space-x-4">
                {/* Price */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold">$ {event.price || "N/A"}</p>
                </div>

                {/* Tickets Left */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <p className="text-sm"> {summary?.totalRemainingTickets ?? "Loading..."} pcs left</p>
                </div>

                {/* Event Date */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentEventList;
