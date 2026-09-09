"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { CustomFormField } from "@/components/modals/CustomFormField";
import PageContainer from "@/components/layouts/page-container";
import { Button } from "@/components/ui/cta-button";
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";

import { eventSchema } from "@/lib/schemas";

import TicketModal from "./TicketModal";
import VenueModal from "./VenueModal";

import { createEvent, getEventById, updateEvent } from "@/state/eventsAPI";
import { fetchCategories, fetchSubcategories } from "@/state/categoriesAPI";
import { openTicketModal, openVenueModal } from "@/state/eventEditorReducer";

// Interface for Subcategory
interface Subcategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: Partial<Category>; // Use Partial to prevent full Category object requirement
}

// Interface for Category
interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: Subcategory[]; // Define that categories have subcategories
}

interface Ticket {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  status: string;
  ticketType: string;
  salesStartTime: string;
  salesStartDate: string;
  salesEndDate: string;
  salesEndTime: string;
  currentBookings: number;
  promoCode: string | null;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

interface dataEventDetails {
  title: string;
  description: string;
  aboutEvent: string;
  tagline: string;
  keypoint: string;
  venueName: string;
  categoryName: string;
  subcategoryName: string;
  price: number;
  status: "Draft" | "Published" | "Completed";
  date: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  currentBookings: number;
  promoCode: string;
  discount: number;
  featured: boolean;
  registrationRequired: boolean;
  subCounty: string;
  county: string;
  country: string;
  events_image: string;
}

export interface EventFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  status: "Draft" | "Published" | "Completed";
  eventImage?: File | undefined;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
}

const EventEditor = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string | undefined;
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [eventStatus, setEventStatus] = useState("Draft");
  const [loading, setLoading] = useState<boolean>(true);


  // ✅ Initialize useForm before using it
  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "Draft",
      eventImage: undefined,
      date: "",
      startTime: "",
      endTime: "",
      venue: "",
    },
  });

  // ✅ Load event data if `eventId` exists
  useEffect(() => {
    if (eventId) {
      getEventById(eventId).then((response) => {
        if (response?.data) {
          methods.reset({
            title: response.data.title,
            description: response.data.aboutEvent,
            category: response.data.categoryName,
            status: response.data.status ? "Published" : "Draft",
            date: response.data.date,
            startTime: response.data.startTime,
            endTime: response.data.endTime,
            venue: response.data.venueName,
          });
          setPreview(response.data.image[0] || null);
          setTickets(
            response.data.tickets.map((ticket: any) => ({
              ...ticket,
              salesStartTime: ticket.salesStartTime || "",
              salesEndTime: ticket.salesEndTime || "",
              promoCode: ticket.promoCode || null,
              discount: ticket.discount || 0,
            })) || []
          );
          setEventStatus(response.data.status || "Draft");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [eventId]);

  // ✅ Handle form submission
  const onSubmit = async (data: EventFormData) => {
    try {
      const formattedData: dataEventDetails = {
        title: data.title,
        description: data.description, // ✅ Ensure aboutEvent is mapped correctly
        aboutEvent: data.description, // ✅ API expects aboutEvent, so we assign description
        tagline: "Exciting Event", // ✅ Add a placeholder or actual value
        keypoint: "Networking, Learning, Fun", // ✅ Placeholder or actual keypoints
        venueName: data.venue,
        categoryName: data.category,
        subcategoryName: "General", // ✅ Provide default or selected subcategory
        price: parseFloat(data.price), // ✅ Convert price to number if needed
        status: data.status, // ✅ Ensure status matches API type
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        timeZone: "Africa/Nairobi", // ✅ Assign a default time zone or make it selectable
        currentBookings: 0, // ✅ Default bookings count
        promoCode: "", // ✅ Default promo code
        discount: 0, // ✅ Default discount
        featured: false, // ✅ Default featured status
        registrationRequired: true, // ✅ Default registration requirement
        subCounty: "Unknown", // ✅ Default subcounty, replace if needed
        county: "Unknown", // ✅ Default county
        country: "Kenya", // ✅ Default country, replace if needed
        events_image: preview || "", // ✅ Ensure image is handled
      };

      if (eventId) {
        await updateEvent(eventId, formattedData);
      } else {
        await createEvent(formattedData);
      }
      router.push("/admin/events");
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const loadCategoriesAndSubcategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        const fetchedSubcategories = await fetchSubcategories();
        setSubcategories(fetchedSubcategories);
      } catch (error) {
        console.error("Error fetching categories or subcategories", error);
      }
    };

    loadCategoriesAndSubcategories();
  }, []);

  return (
    <PageContainer scrollable={true} bgColor="bg-blue-200">
      <div className="flex h-screen flex-col p-4 sm:px-6 sm:py-0">
        <div className="mx-auto grid w-full gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-yellow-500"
              onClick={() => router.push("/admin/events", { scroll: false })}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {methods.watch("title") || "A New Event"}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button
                className="bg-yellow-500 px-6 py-2 text-white transition hover:bg-yellow-500"
                size="sm"
              >
                Save Event
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left Panel */}
          <div className="space-y-4">
            {/* Event Images */}
            <Card>
              <CardHeader>
                <CardTitle>Event Images</CardTitle>
                <CardDescription>Manage your event images.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Image
                    alt="Event image"
                    className="aspect-square w-full rounded-md object-cover"
                    height="200"
                    src={preview || "/images/placeholder.svg"}
                    width="200"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <button>
                      <Image
                        alt="Event image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="24"
                        src="/images/placeholder.svg"
                        width="24"
                      />
                    </button>
                    <button>
                      <Image
                        alt="Event image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="24"
                        src="/images/placeholder.svg"
                        width="24"
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
            <Card>
              <CardHeader>
                <CardTitle>Host(s)</CardTitle>
              </CardHeader>
              <CardContent>
                <p>@jordan (you)</p>
              </CardContent>
            </Card>
          </div>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="space-y-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomFormField name="title" label="Event Title" type="text" placeholder="Enter event title"/>
                  <CustomFormField name="description" label="Event Description" type="textarea" placeholder="Describe your event"/>
                  <CustomFormField name="price" label="Ticket Price" type="number" placeholder="Enter price"/>
                </CardContent>
              </Card>

              {/* Ticket & Venue Modals */}
              <div className="flex flex-col gap-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => dispatch(openVenueModal(null))}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Venue
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500"
              >
                {eventId ? "Update Event" : "Save Event"}
              </Button>
            </form>
          </Form>
          {/* Right Panel */}
          <div className="space-y-4">
            {/* Category Section */}
            <Card>
              <CardHeader>
                <CardTitle>Event Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
                      <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      onValueChange={(value) => setSelectedSubcategory(value)}
                    >
                      <SelectTrigger
                        id="subcategory"
                        aria-label="Select subcategory"
                      >
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories
                          .filter(
                            (subcat) =>
                              subcat.category._id === selectedCategory,
                          ) // Filter by selected category
                          .map((subcat) => (
                            <SelectItem key={subcat._id} value={subcat.name}>
                              {subcat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Section */}
            <Card>
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
                    {tickets.length > 0 ? (
                      tickets.map((ticket, index) => (
                    <TableRow key={ticket._id}>
                      <TableCell>{ticket.name}</TableCell>
                      <TableCell>${ticket.price}</TableCell>
                      <TableCell>{ticket.quantity}</TableCell>
                      <TableCell>{ticket.stock}</TableCell>
                    </TableRow>
                     ))
                    ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No tickets added yet.
                      </TableCell>
                    </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 bg-yellow-500"
                  onClick={() => dispatch(openTicketModal(null))}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Ticket
                </Button>
              </CardFooter>
            </Card>

            {/* Right Side Content */}
            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select value={eventStatus} onValueChange={setEventStatus}>
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select event status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <TicketModal eventId={eventId ?? ""} />
          <VenueModal />
        </div>
      </div>
    </PageContainer>
  );
};

export default EventEditor;
