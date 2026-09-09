"use client"; // This ensures the component is treated as a client component

import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Search, Music, Palette, Dribbble, Heart, } from "lucide-react"; // Icons for event details and categories
import { createRoot } from "react-dom/client";
import Image from "next/image";
import { useAllEvents } from "@/state/eventsAPI";

// Add your Mapbox access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN || "";

// Define the event type for both free and paid events
type Event = {
  title: string;
  location: string;
  time: string;
  image: string;
  isFree?: boolean;
  price?: string;
  coordinates: [number, number]; // [longitude, latitude]
  distance?: string; // Distance to the event
  eventType: keyof typeof eventIcons; // The type of event like "sports", "music", "arts"
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): string => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return `${distance.toFixed(1)} km`;
};

// Set Nairobi CBD as the reference location
const nairobiCBD: [number, number] = [36.8219, -1.2921]; // Coordinates for Nairobi CBD

// Define icons for different event types
const eventIcons = {
  sports: <Dribbble className="h-6 w-6 text-orange-500" />,
  music: <Music className="h-6 w-6 text-purple-500" />,
  arts: <Palette className="h-6 w-6 text-green-500" />,
  tech: <Calendar className="h-6 w-6 text-blue-500" />,
  health: <Heart className="h-6 w-6 text-red-500" />,
  default: <MapPin className="h-6 w-6 text-gray-500" />,
} as const; // Use `as const` to make the keys immutable and readable by TypeScript

// Custom Marker React component
const CustomMarker = ({
  type,
  distance,
}: {
  type: keyof typeof eventIcons;
  distance: string;
}) => {
  return (
    <div
      style={{
        width: "100px",
        height: "40px",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        padding: "5px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {eventIcons[type] || eventIcons["default"]}
        <span
          style={{ marginLeft: "8px", fontSize: "14px", fontWeight: "bold" }}
        >
          {distance}
        </span>
      </div>
    </div>
  );
};

export default function ExploreEvents() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Initialize mapRef with null
  const markersRef = useRef<mapboxgl.Marker[]>([]); // Array to store markers
  const [viewport, setViewport] = useState({
    longitude: 36.819,
    latitude: -1.286,
    zoom: 12,
  });

  const { data } = useAllEvents();

  const eventsToday = useMemo(() => {
    const rawEvents = data?.events.data;
    if (!Array.isArray(rawEvents) || rawEvents.length === 0) return [] as Event[];

    return rawEvents
      .map((event: any) => {
        // Ensure required fields exist in the event data
        const hasCoordinates =
          event.coordinates &&
          event.coordinates.longitude &&
          event.coordinates.latitude;
        const hasRequiredFields =
          event.title &&
          event.venueName &&
          event.startTime &&
          event.endTime;

        if (hasCoordinates && hasRequiredFields) {
          return {
            title: event.title,
            location: event.venueName,
            time: `${event.startTime} - ${event.endTime} ${event.timeZone}`,
            image: event.image?.[0] || "/event_image_placeholder.jpg", // Get the first image from the array, fallback to placeholder
            coordinates: [
              event.coordinates.longitude,
              event.coordinates.latitude,
            ],
            eventType:
              event.categoryName?.toLowerCase() as keyof typeof eventIcons,
            distance: calculateDistance(
              nairobiCBD[1],
              nairobiCBD[0],
              event.coordinates.latitude,
              event.coordinates.longitude,
            ),
            isFree: event.isFree ?? false, // Default to false if isFree is not defined
            price: event.price ?? "Not Available",
          };
        }

        console.warn("Event is missing required data", event);
        return null; // Skip events missing required fields
      })
      .filter((event) => event !== null) as Event[];
  }, [data]);

  // Initialize the map
  useEffect(() => {
    if (mapContainerRef.current && mapRef.current === null) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current, // Reference to the map container div
        style: "mapbox://styles/mapbox/streets-v11", // Mapbox style URL
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom,
      });

      // Add navigation controls (zoom buttons)
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add current location marker (custom location marker)
      const currentLocationMarker = document.createElement("div");
      currentLocationMarker.className = "current-location-marker";
      currentLocationMarker.style.width = "20px";
      currentLocationMarker.style.height = "20px";
      currentLocationMarker.style.borderRadius = "50%";
      currentLocationMarker.style.backgroundColor = "orange";

      // Create a pulsating effect around the marker
      const pulseEffect = document.createElement("div");
      pulseEffect.style.position = "absolute";
      pulseEffect.style.width = "40px";
      pulseEffect.style.height = "40px";
      pulseEffect.style.borderRadius = "50%";
      pulseEffect.style.backgroundColor = "rgba(255, 165, 0, 0.2)";
      pulseEffect.style.top = "-10px";
      pulseEffect.style.left = "-10px";
      pulseEffect.style.animation = "pulse 2s infinite";

      // Append the pulse effect to the marker
      currentLocationMarker.appendChild(pulseEffect);

      // Add the marker to the map at the current location (Nairobi CBD)
      new mapboxgl.Marker(currentLocationMarker)
        .setLngLat(nairobiCBD)
        .addTo(mapRef.current);
    }
  }, [viewport]);

  // Add markers for events using ReactDOM.createRoot
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = []; // Reset markers array

    // Add new markers
    if (mapRef.current) {
      eventsToday.forEach((event: Event) => {
        // Create a custom marker element using ReactDOM.createRoot
        const markerEl = document.createElement("div");
        const root = createRoot(markerEl);
        root.render(
          <CustomMarker
            type={event.eventType}
            distance={event.distance || "0 km"}
          />,
        );

        // Create the Mapbox marker with the custom element
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(event.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h4>${event.title}</h4><p>${event.location}</p><p>${event.time}</p>`,
            ),
          )
          .addTo(mapRef.current!);

        markersRef.current.push(marker); // Store the marker in the array
      });
    }
  }, [eventsToday]);

  return (
    <div className="relative h-screen w-screen">
      {/* Fullscreen Map Section */}
      <div
        ref={mapContainerRef}
        className="absolute left-0 top-0 h-full w-full"
      />{" "}
      {/* Fullscreen map container */}
      <div className="absolute top-6 z-10 mx-auto flex w-11/12 items-center justify-between">
        {/* Floating Search Bar */}
        <div className="ml-4 flex w-1/2 items-center rounded-lg bg-white p-4 shadow-lg">
          {/* Search Bar */}
          <Search className="mr-3 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search all events"
            className="w-full rounded-lg border-none px-4 py-2 focus:ring-0"
          />
          <Button className="ml-4 flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white">
            <MapPin className="mr-2 h-5 w-5" />
            Nairobi
          </Button>
        </div>

        {/* Category Filters on the far right */}
        <div className="flex space-x-4 p-2">
          <Button className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white">
            <Calendar className="mr-2 h-5 w-5" />
            All
          </Button>
          <Button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-black">
            <Palette className="mr-2 h-5 w-5" />
            Arts
          </Button>
          <Button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-black">
            <Music className="mr-2 h-5 w-5" />
            Music
          </Button>
          <Button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-black">
            <Dribbble className="mr-2 h-5 w-5" />
            Sports
          </Button>
          <Button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-black">
            <Dribbble className="mr-2 h-5 w-5" />
            Tech
          </Button>
        </div>
      </div>
      {/* Floating Cards Section */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-6">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventsToday.map((event: Event, idx: number) => (
            <Card key={idx} className="w-64 bg-white p-1 shadow-md">
              {" "}
              {/* Adjusted the card padding and width */}
              <div className="relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={300} // Set the image width
                  height={80} // Set the image height
                  className="h-32 w-full rounded-md object-cover" // Adjusted for a smaller image size
                />
              </div>
              <CardContent className="p-2">
                {" "}
                {/* Adjusted content padding */}
                <CardTitle className="text-md font-semibold">
                  {" "}
                  {/* Adjusted font size */}
                  {event.title}
                </CardTitle>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  {" "}
                  {/* Smaller font size */}
                  <MapPin className="mr-1 h-3 w-3" /> {/* Smaller icon */}
                  <span>{event.location}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {" "}
                  {/* Smaller font size */}
                  <Calendar className="mr-1 h-3 w-3" /> {/* Smaller icon */}
                  {event.time}
                </div>
                <div className="mt-1 text-sm font-semibold text-green-600">
                  {event.isFree ? "Free" : event.price}
                </div>
              </CardContent>
              <CardFooter className="mt-2 flex justify-between px-2">
                {" "}
                {/* Reduced margins */}
                <Button variant="outline" size="sm">
                  RSVP
                </Button>{" "}
                {/* Smaller buttons */}
                <Button variant="outline" size="sm">
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  Save
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
