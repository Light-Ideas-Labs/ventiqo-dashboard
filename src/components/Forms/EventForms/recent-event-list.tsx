"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Ticket, Calendar } from "lucide-react"; // Icons for dollar, tickets, and calendar

import { getAllEvents } from "@/config/eventsAPI"; // Import the API
import { getEventTicketSummary } from "@/config/eventsAPI";

interface TicketSummary {
  ticketName: string;
  totalTickets: number;
  remainingTickets: number;
  soldTickets: number;
}

const RecentEventList: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [ticketSummaries, setTicketSummaries] = useState<Record<string, { totalRemainingTickets: number, totalSoldTickets: number }>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Fetching recent events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        if (response && response.events && response.events.data) {
          setEvents(response.events.data.slice(0, 3)); // Limiting to the 3 most recent events
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

 // Fetching ticket summary for each event
 useEffect(() => {
  const fetchTicketSummaries = async () => {
    const newTicketSummaries: Record<string, { totalRemainingTickets: number, totalSoldTickets: number }> = {};
    await Promise.all(events.map(async (event) => {
      try {
        const summaryData = await getEventTicketSummary(event._id);
        if (summaryData?.success) {
          newTicketSummaries[event._id] = {
            totalRemainingTickets: summaryData.data.totalRemainingTickets,
            totalSoldTickets: summaryData.data.totalSoldTickets,
          };
        }
      } catch (error) {
        console.error(`Failed to fetch ticket summary for event ${event._id}:`, error);
      }
    }));
    setTicketSummaries(newTicketSummaries);
  };

  if (events.length > 0) {
    fetchTicketSummaries();
  }
}, [events]);

  if (loading) {
    return <p>Loading recent events...</p>;
  }

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Recent Event List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
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
                <p className="text-sm"> {ticketSummaries[event._id]?.totalRemainingTickets ?? "Loading..."} pcs left</p>
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
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentEventList;
