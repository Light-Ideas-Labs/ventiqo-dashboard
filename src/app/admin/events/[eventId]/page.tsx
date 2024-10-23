'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { EventDetailsResponse } from '@/types/event';
import { getEventById } from '@/config/eventsAPI';
import { ChevronLeft, Home, LineChart, Package, Package2, PanelLeft, PlusCircle, Search, Settings, ShoppingCart, Upload, Users2, } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import PageContainer from '@/components/Layouts/page-container';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";


export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const eventId = params.eventId;
  const [event, setEvent] = useState<EventDetailsResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      getEventById(eventId)
        .then((response) => {
          if (response) {
            setEvent(response.data);
          } else {
            setError('Failed to fetch event details.');
          }
        })
        .catch((error) => {
          console.error('Failed to fetch event details:', error);
          setError('Failed to fetch event details.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError('No event ID provided.');
    }
  }, [eventId]);

  if (loading) {
    return (
    <div className="flex justify-center items-center h-full">
            <Loader />
    </div>)
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>No event found.</div>;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex flex-col sm:gap-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Events</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{event.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
        </header>
        <main className=" flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {event.title}
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {event.status}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm">Save Event</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>
                      {event.aboutEvent}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          defaultValue={event.title}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          defaultValue={event.aboutEvent}
                          className="min-h-32"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                    <CardDescription>
                      Manage ticket types and availability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Ticket Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {event.tickets.map((ticket) => (
                          <TableRow key={ticket._id}>
                            <TableCell className="font-semibold">
                              {ticket.name}
                            </TableCell>
                            <TableCell>
                              {`$${ticket.price}`}
                            </TableCell>
                            <TableCell>
                              {ticket.quantity}
                            </TableCell>
                            <TableCell>
                              {ticket.stock}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button size="sm" variant="ghost" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Ticket
                    </Button>
                  </CardFooter>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>Event Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger
                            id="category"
                            aria-label="Select category"
                          >
                            <SelectValue placeholder={event.categoryName} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="subcategory">Subcategory (optional)</Label>
                        <Select>
                          <SelectTrigger
                            id="subcategory"
                            aria-label="Select subcategory"
                          >
                            <SelectValue placeholder={event.subcatergoryName} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concert">Concert</SelectItem>
                            <SelectItem value="festival">Festival</SelectItem>
                            <SelectItem value="meetup">Meetup</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Event Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select>
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder={event.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                  <CardHeader>
                    <CardTitle>Event Images</CardTitle>
                    <CardDescription>
                      Manage your event images.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Event image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="300"
                        src={event.image || '/placeholder.svg'}
                        width="300"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <button>
                          <Image
                            alt="Event image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={event.image || '/placeholder.svg'}
                            width="84"
                          />
                        </button>
                        <button>
                          <Image
                            alt="Event image"
                            className="aspect-square w-full rounded-md object-cover"
                            height="84"
                            src={event.image || '/placeholder.svg'}
                            width="84"
                          />
                        </button>
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Archive Event</CardTitle>
                    <CardDescription>
                      Archive this event to hide it from public view.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Event
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Event</Button>
            </div>
          </div>
        </main>
      </div>
      </div>
    </PageContainer>
  );
}
