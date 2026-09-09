"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import PageContainer from '@/components/layouts/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { File, Home, LineChart, ListFilter, Package, Package2, PanelLeft, PlusCircle, Search, ShoppingCart, Users2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbWrapper } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventsTable from '@/components/tables/events-tables/event-table'; // Import the separated table component
import { EventsSectionCards } from '@/components/statitiscs/events-sections-cards';

import { createEvent } from '@/state/eventsAPI';

// this for creating events
interface dataEventDetails {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  aboutEvent: string;
  tagline: string;
  keypoint: string;
  venueName: string;
  categoryName: string;
  subcategoryName: string; // Fixing the typo here
  status: string;
  currentBookings: number;
  promoCode: string;
  discount: number;
  featured: boolean;
  registrationRequired: boolean;
  subCounty: string;
  county: string;
  country: string;
  events_image: string; // image
}

export default function Events() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      const newEventData: dataEventDetails = {
        title: "Untitled Event",
        date: new Date().toISOString(), // Current date
        startTime: "12:00 PM",
        endTime: "02:00 PM",
        timeZone: "Africa/Nairobi",
        tagline: "An amazing new event",
        keypoint: "Networking, Entertainment, Food",
        aboutEvent: "This is a newly created event.",
        venueName: "TBD",
        categoryName: "General",
        subcategoryName: "Meetups",
        promoCode: "",
        discount: 0,
        featured: false,
        registrationRequired: true,
        subCounty: "",
        county: "",
        country: "Kenya",
        status: "Draft",
        currentBookings: 0,
        events_image: "", // Placeholder for event image
      };

      const result = await createEvent(newEventData); // Call your API
      router.push(`/admin/events/${result.eventId}`, {
        scroll: false,
      });
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <div className="space-y-2">
        <div className="flex flex-col sm:gap-4">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <BreadcrumbWrapper pageName="Events" />
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </header>
                  {/* Events Overview */}

                  <EventsSectionCards />

          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="draft">Published</TabsTrigger>
                  <TabsTrigger value="draft">Completed</TabsTrigger>
                  <TabsTrigger value="archived" className="hidden sm:flex">
                    Archived
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Filter
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>
                        Active
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Draft
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Archived
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Export
                    </span>
                  </Button>
                  <Button size="sm" className="h-7 gap-1" onClick={handleCreateEvent} disabled={loading}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Create Event
                    </span>
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>
                      Manage your events and view their sales performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventsTable /> {/* Use the separated EventsTable component */}
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                      products
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </PageContainer>
  );
}
