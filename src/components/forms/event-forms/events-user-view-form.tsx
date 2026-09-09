"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventDetailsPopup from "@/components/forms/event-forms/event-details-popup";
import OrderFormPopup from "../order-forms/OrderFormPopup";
import { useAllEvents } from "@/state/eventsAPI";

type Ticket = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  startTime: string;
  endTime: string;
  aboutEvent: string;
  venueName: string;
  tickets: Ticket[];
  coordinates: [number, number];
  image: string;
};

export default function EventsUserViewForm() {
  const { data, isLoading: loading } = useAllEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  const [selectedEventForOrder, setSelectedEventForOrder] = useState<Event | null>(null);

  const events: Event[] = (data?.events.data ?? []).map((event: any) => {
    const longitude = event.coordinates?.longitude ?? 0;
    const latitude = event.coordinates?.latitude ?? 0;

    return {
      id: event._id,
      title: event.title,
      date: new Date(event.date).toLocaleDateString(),
      startTime: event.startTime,
      endTime: event.endTime,
      aboutEvent: event.aboutEvent,
      venueName: event.venueName,
      location: `${event.venueName}, ${event.subCounty}, ${event.county}, ${event.country}`,
      price: event.tickets && event.tickets.length > 0
        ? `$${event.tickets[0].price}`
        : "N/A",
      tickets: event.tickets,
      coordinates: [longitude, latitude] as [number, number],
      image: event.image || '/images/default-event-image.png',
    };
  });

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  const handleGetTicketClick = (event: Event, ticketType: string) => {
    setSelectedEventForOrder(event);
    setSelectedTicketType(ticketType);
    setShowOrderForm(true);
  };

  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-4">
      <h2 className="mb-2 text-lg font-semibold">Popular Now</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {events.map((event) => (
          <Card className="bg-white shadow-lg" key={event.id} onClick={() => handleCardClick(event)}>
            <div className="relative">
              <Image
                className="h-28 w-full rounded-t-lg object-cover"
                src={event.image}
                alt={event.title}
                width={50}
                height={50}
                layout="responsive"
              />
            </div>
            <CardContent className="px-2 py-1">
              <div className="flex items-center justify-between text-xs">
                <p>{event.date}</p>
                <p>{event.startTime} - {event.endTime}</p>
              </div>
              <CardTitle className="mt-1 text-sm font-semibold text-gray-900">
                {event.title}
              </CardTitle>
              <div className="mt-1 flex items-center text-xs">
                <MapPin className="mr-1 h-3 w-3" />
                <p>{event.location}</p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-2 py-1">
              <div className="text-xs font-semibold text-orange-500">
                {event.price}
              </div>
              <Button size="sm" className="rounded-md bg-orange-500 text-white px-2 py-1" onClick={(e) => {e.stopPropagation(); handleGetTicketClick(event, event.tickets[0].name); }}>
                Get a Ticket
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedEvent && (
        <EventDetailsPopup event={selectedEvent} onClose={handleClosePopup} onGetTicket={(ticketType) => handleGetTicketClick(selectedEvent, ticketType)} />
      )}
      {showOrderForm && selectedEventForOrder && (
        <OrderFormPopup
          eventId={selectedEventForOrder.id}
          tickets={selectedEventForOrder.tickets}
          onClose={handleCloseOrderForm}
        />
      )}
    </div>
  );
}
