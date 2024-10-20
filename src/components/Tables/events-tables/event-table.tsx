"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // Framer Motion for smooth animation
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAllEvents } from '@/config/eventsAPI';

// Enhanced Loader Component
const EnhancedLoader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center min-h-screen space-y-4"
  >
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    <p className="text-gray-700">Loading events, please wait...</p>
  </motion.div>
);

const EventsTable: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        if (response && response.events && response.events.data) {
          setEvents(response.events.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <EnhancedLoader />
    );
  }

  const handleRowClick = (id: string) => {
    router.push(`/admin/events/${id}`); // Push the _id as the eventId
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">Total Sales</TableHead>
            <TableHead className="hidden md:table-cell">Created at</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event._id} onClick={() => handleRowClick(event._id)} className="cursor-pointer">
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt="Event image"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={event.image || '/images/default-event-image.png'}
                  width="64"
                />
              </TableCell>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{event.status}</Badge>
              </TableCell>
              <TableCell>{event.price ? `$${event.price}` : 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell">
                {event.currentBookings}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(event.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default EventsTable;
