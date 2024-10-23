"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/cta-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { createEvent, addTicketsToEvent } from "@/config/eventsAPI";
import { fetchCategories, fetchSubcategories } from "@/config/categoriesAPI";

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

export default function AddeNewEventForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);

  const [event, setEvent] = useState({
    title: "",
    date: "",
    aboutEvent: "",
    tagline: "",
    keypoint: "",
    venueName: "",
    categoryName: "Music",
    subcategoryName: "Festivals",
    promoCode: "",
    discount: 0,
    featured: false,
    registrationRequired: true,
    startTime: "",
    endTime: "",
    timeZone: "",
    subCounty: "",
    county: "",
    country: "",
  });

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

  const handleSubmit = async () => {
    try {
      // Create Event API call
      const eventDetails = {
        title: event.title,
        date: event.date,
        aboutEvent: event.aboutEvent,
        tagline: event.tagline,
        keypoint: event.keypoint,
        venueName: event.venueName,
        categoryName: event.categoryName,
        subcategoryName: event.subcategoryName,
        promoCode: event.promoCode,
        discount: event.discount,
        featured: event.featured,
        registrationRequired: event.registrationRequired,
        startTime: event.startTime,
        endTime: event.endTime,
        timeZone: event.timeZone,
        subCounty: event.subCounty,
        county: event.county,
        country: event.country,
        status: "Draft", 
        currentBookings: 0, 
        events_image: "",  
      };
  
      const response = await createEvent(eventDetails); // Call your API
  
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  return (
    <main className="flex h-screen flex-col p-4 sm:px-6 sm:py-0">
      <div className="mx-auto grid w-full gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Event
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            Draft
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button
              className="bg-yellow-500 px-6 py-2 text-white transition hover:bg-yellow-500"
              size="sm"
              onClick={handleSubmit}
            >
              Save Event
            </Button>
          </div>
        </div>

        Event Details
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Provide details about your event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Event Name</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      placeholder="Enter the event name" // Placeholder added
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Event Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a description for the event" // Placeholder added
                      className="min-h-32"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      name="tagline"
                      type="text"
                      placeholder="The most vibrant event this fall!"
                      value={event.tagline}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="keypoint">Key Points</Label>
                    <Input
                      id="keypoint"
                      name="keypoint"
                      type="text"
                      placeholder="Live music, Gourmet food trucks, Firework finale"
                      value={event.keypoint}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="venueName">Venue</Label>
                    <Input
                      id="venueName"
                      name="venueName"
                      type="text"
                      placeholder="Harvest Field"
                      value={event.venueName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Event Time  */}
            <Card>
              <CardHeader>
                <CardTitle>Event Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      placeholder="Start Time"
                      value={event.startTime}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      placeholder="End Time"
                      value={event.endTime}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="timeZone">Time Zone</Label>
                    <Input
                      id="timeZone"
                      name="timeZone"
                      type="text"
                      placeholder="Africa/Nairobi"
                      value={event.timeZone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
    <CardHeader>
        <CardTitle>Venue and Location</CardTitle>
    </CardHeader>
    <CardContent>
        <div className="grid gap-6">
            <div className="grid gap-3">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                    id="venueName"
                    name="venueName"
                    type="text"
                    placeholder="Harvest Field"
                    value={event.venueName}
                    onChange={handleInputChange}
                    className="w-full"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="subCounty">Sub-County</Label>
                <Input
                    id="subCounty"
                    name="subCounty"
                    type="text"
                    placeholder="CBD"
                    value={event.subCounty}
                    onChange={handleInputChange}
                    className="w-full"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="county">County</Label>
                <Input
                    id="county"
                    name="county"
                    type="text"
                    placeholder="Nairobi"
                    value={event.county}
                    onChange={handleInputChange}
                    className="w-full"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="country">Country</Label>
                <Input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Kenya"
                    value={event.country}
                    onChange={handleInputChange}
                    className="w-full"
                />
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
                    {/* Example ticket rows */}
                    <TableRow>
                      <TableCell className="font-semibold">
                        General Admission
                      </TableCell>
                      <TableCell>$50</TableCell>
                      <TableCell>100</TableCell>
                      <TableCell>50</TableCell>
                    </TableRow>
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



            {/* Category Section */}
            <Card>
              <CardHeader>
                <CardTitle>Event Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setSelectedCategory(value)}>
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
                    <Select onValueChange={(value) => setSelectedSubcategory(value)}>
  <SelectTrigger id="subcategory" aria-label="Select subcategory">
    <SelectValue placeholder="Select a subcategory" />
  </SelectTrigger>
  <SelectContent>
  {subcategories
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
          </div>

          {/* Right Side Content */}
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select event status" />
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
                    height="300"
                    src="/images/placeholder.svg"
                    width="300"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <button>
                      <Image
                        alt="Event image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src="/images/placeholder.svg"
                        width="84"
                      />
                    </button>
                    <button>
                      <Image
                        alt="Event image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src="/images/placeholder.svg"
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

            {/* Archive Event */}
            <Card>
              <CardHeader>
                <CardTitle>Archive Event</CardTitle>
                <CardDescription>
                  Archive this event to hide it from public view.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="secondary">
                  Archive Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile save button */}
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Event</Button>
        </div>
      </div>
    </main>
  );
}
