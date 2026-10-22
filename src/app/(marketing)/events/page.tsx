"use client"; // This ensures the component is treated as a client component

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Search, Music, Palette, Dribbble, Cpu, Info } from "lucide-react"; // Icons for event details and categories
import { createRoot } from "react-dom/client";
import Image from "next/image";
import { useAllEvents } from "@/state/eventsAPI";
import { DisplayEvent, EventCategoryType, mapRawEventToDisplay } from "@/lib/event-display";

// Add your Mapbox access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN || "";

// Set Nairobi CBD as the reference location
const nairobiCBD: [number, number] = [36.8219, -1.2921]; // Coordinates for Nairobi CBD

// Icons + colors for map marker pills, keyed by event category
const markerIcons: Record<EventCategoryType, React.ReactNode> = {
  sports: <Dribbble className="h-4 w-4 text-white" />,
  music: <Music className="h-4 w-4 text-white" />,
  arts: <Palette className="h-4 w-4 text-white" />,
  tech: <Cpu className="h-4 w-4 text-white" />,
  default: <MapPin className="h-4 w-4 text-white" />,
};

const markerColors: Record<EventCategoryType, string> = {
  sports: "bg-orange-500",
  music: "bg-teal-500",
  arts: "bg-purple-500",
  tech: "bg-indigo-500",
  default: "bg-gray-500",
};

// Custom Marker React component - a colored pill badge matching the event's category
const CustomMarker = ({ type, distance }: { type: EventCategoryType; distance: string }) => {
  const colorClass = markerColors[type] || markerColors.default;
  return (
    <div className={`flex items-center gap-1.5 rounded-full ${colorClass} px-3 py-1.5 shadow-lg`}>
      {markerIcons[type] || markerIcons.default}
      <span className="whitespace-nowrap text-xs font-semibold text-white">{distance}</span>
    </div>
  );
};

const categoryFilters: { label: string; type: EventCategoryType | "all"; icon: typeof Calendar }[] = [
  { label: "All", type: "all", icon: Calendar },
  { label: "Arts", type: "arts", icon: Palette },
  { label: "Music", type: "music", icon: Music },
  { label: "Sports", type: "sports", icon: Dribbble },
  { label: "Tech", type: "tech", icon: Cpu },
];

export default function ExploreEvents() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Initialize mapRef with null
  const markersRef = useRef<mapboxgl.Marker[]>([]); // Array to store markers
  const [viewport] = useState({
    longitude: 36.819,
    latitude: -1.286,
    zoom: 12,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<EventCategoryType | "all">("all");

  const { data } = useAllEvents();

  const eventsToday = useMemo(() => {
    const rawEvents = data?.events.data;
    if (!Array.isArray(rawEvents) || rawEvents.length === 0) return [] as DisplayEvent[];

    return rawEvents
      .map((event: any) => mapRawEventToDisplay(event, nairobiCBD))
      .filter((event): event is DisplayEvent => event !== null);
  }, [data]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return eventsToday.filter((event) => {
      const matchesQuery =
        !query || event.title.toLowerCase().includes(query) || event.location.toLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" || event.eventType === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [eventsToday, searchQuery, activeCategory]);

  const popularEvents = useMemo(() => filteredEvents.slice(0, 4), [filteredEvents]);

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
      filteredEvents.forEach((event: DisplayEvent) => {
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
              `<h4>${event.title}</h4><p>${event.location}</p><p>${event.dateLabel} · ${event.timeLabel}</p>`,
            ),
          )
          .addTo(mapRef.current!);

        markersRef.current.push(marker); // Store the marker in the array
      });
    }
  }, [filteredEvents]);

  return (
    <div className="relative h-screen w-screen">
      {/* Fullscreen Map Section */}
      <div ref={mapContainerRef} className="absolute left-0 top-0 h-full w-full" />

      <div className="absolute top-6 z-10 mx-auto flex w-11/12 items-center justify-between">
        {/* Floating Search Bar */}
        <div className="ml-4 flex w-1/2 items-center rounded-lg bg-white/70 p-4 shadow-lg backdrop-blur-sm">
          <Search className="mr-3 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search all events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-none px-4 py-2 focus:ring-0"
          />
          <Button className="ml-4 flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white">
            <MapPin className="mr-2 h-5 w-5" />
            Nairobi
          </Button>
        </div>

        {/* Category Filters on the far right */}
        <div className="flex space-x-4 p-2">
          {categoryFilters.map(({ label, type, icon: Icon }) => (
            <Button
              key={label}
              onClick={() => setActiveCategory(type)}
              className={
                activeCategory === type
                  ? "flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white"
                  : "flex items-center rounded-lg bg-gray-100 px-4 py-2 text-black"
              }
            >
              <Icon className="mr-2 h-5 w-5" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Floating Popular Now Section */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white drop-shadow">Popular Now</h2>
          <Link href="/events/all" className="text-sm font-medium text-white/80 drop-shadow hover:text-white">
            See All
          </Link>
        </div>

        {popularEvents.length === 0 ? (
          <p className="text-sm text-white/80 drop-shadow">No events match your search.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularEvents.map((event) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
              >
                <Link href={`/events/${event.id}`} aria-label="View details and reviews" title="View details and reviews" className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80">
                  <Info className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/chekout?eventId=${event.id}`} className="block">
                  <div className="relative h-44 w-full">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {event.dateLabel}
                        {event.timeLabel ? ` · ${event.timeLabel}` : ""}
                      </span>
                    </div>
                    <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <span className="shrink-0 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-600">
                        {event.isFree ? "Free" : event.price !== undefined ? `KES ${event.price}` : "N/A"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
