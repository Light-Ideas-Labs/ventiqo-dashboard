"use client";

import CustomModal from "@/components/modals/CustomModal";
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

interface EventsDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onGetTicket: (ticketType: string) => void;
}

const EventsDetailsModal: React.FC<EventsDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onGetTicket,
}) => {
  if (!event) return null;

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Event Image */}
        <div className="relative mb-4">
          <Image
            className="h-60 w-full rounded-md object-cover"
            src={event.image}
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

        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>

          {/* Date and Time */}
          <div className="flex items-center justify-between py-2">
            <div className="text-center">
              <p className="text-3xl font-semibold leading-none">
                {new Date(event.date).toLocaleDateString("en-US", {
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                })}
              </p>
            </div>

            <div className="ml-3">
              <p className="font-semibold text-gray-900">
                {event.startTime} - {event.endTime}
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="rounded-md border-orange-500 text-orange-500 hover:bg-orange-50 p-2"
            >
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
          <div>
            <h3 className="font-bold text-gray-900">Tickets</h3>
            {event.tickets.map((ticket) => (
              <div
                key={ticket.name}
                className="flex items-center justify-between mt-2"
              >
                <p className="text-sm text-gray-900">
                  {ticket.name} - ${ticket.price}
                </p>
                <Button size="sm" onClick={() => onGetTicket(ticket.name)}>
                  Get a Ticket
                </Button>
              </div>
            ))}
          </div>
        </CardFooter>
      </div>
    </CustomModal>
  );
};

export default EventsDetailsModal;
