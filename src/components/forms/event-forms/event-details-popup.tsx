// EventDetailsPopup.tsx

import React from "react";
import Image from "next/image";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  CalendarIcon,
  VideoCameraIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/solid";
import { Button } from "@/components/ui/button";

type Ticket = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
};

// Define the type for your event
type Event = {
  id: string; // Ensure this is a string
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

// Define the props for EventDetailsPopup
type EventDetailsPopupProps = {
  event: Event | null; // event can be of type Event or null when no event is selected
  onClose: () => void; // onClose is a function that doesn't return anything
  onGetTicket: (ticketType: string) => void; // Add a new prop for handling ticket selection
};

const EventDetailsPopup: React.FC<EventDetailsPopupProps> = ({
  event,
  onClose,
  onGetTicket,
}) => {
  if (!event) return null; // Return null if no event is selected

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>

      {/* Event details popup */}
      <div className="relative right-0 top-0 z-50 h-full w-1/3 overflow-y-auto bg-white bg-opacity-80 p-4 shadow-lg backdrop-blur-sm ">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          X
        </Button>

        {/* Event Image */}
        <div className="relative">
          <Image
            className="h-60 w-full rounded-md object-cover"
            src={event.image} // Replace with your image path
            alt={event.title}
            width={100}
            height={100}
            layout="responsive"
          />
          <Button className="absolute bottom-4 left-0 flex items-center bg-black bg-opacity-60 px-3 py-1 text-white">
            <VideoCameraIcon className="mr-1 h-5 w-5" />
            Watch Video
          </Button>
        </div>

        {/* Event Content */}
        <CardContent className="mt-4 space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>

          {/* Date and Time */}
          <div className="flex items-center justify-between py-2">
            <div className="text-center">
              <p className="text-3xl font-semibold leading-none">
                {new Date(event.date).toLocaleDateString("en-US", { day: "numeric" })}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
              </p>
            </div>

            <div className="ml-3">
              <p className="font-semibold text-gray-900">{event.startTime} - {event.endTime}</p>
            </div>

            {/* Calendar Button */}
            <Button size="sm" variant="outline" className="rounded-md border-orange-500 text-orange-500 hover:bg-orange-50 p-2">
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Event Description */}
          <div>
            <h3 className="font-bold text-gray-900">About this event</h3>
            <p className="mt-2 text-sm text-gray-600">{event.aboutEvent}</p>
            <Button variant="link" className="mt-2 text-blue-500">
              Show more
            </Button>
          </div>
          {/* Venue Name */}
          <div>
            <h3 className="font-bold text-gray-900">Venue</h3>
            <p className="mt-2 text-sm text-gray-600">{event.venueName}</p>
          </div>

        </CardContent>

        {/* Price and Ticket Button */}
        <CardFooter className="flex items-center justify-between border-t border-gray-200 p-4">
          {/* Tickets */}
          <div>
            <h3 className="font-bold text-gray-900">Tickets</h3>
            {event.tickets.map((ticket) => (
              <div key={ticket.name} className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-900">{ticket.name} - ${ticket.price}</p>
                <Button size="sm" onClick={() => onGetTicket(ticket.name)}>
                  Get a Ticket
                </Button>
              </div>
            ))}
          </div>
        </CardFooter>
      </div>
    </div>
  );
};

export default EventDetailsPopup;
