// Shared shaping/formatting logic for turning a raw backend event document into
// what the public explore/listing pages render. Used by both the map-based
// /events page and the /events/all listing page, so the two stay in sync.

export type EventCategoryType = "sports" | "music" | "arts" | "tech" | "default";

export type DisplayEvent = {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  image: string;
  isFree?: boolean;
  price?: number;
  coordinates: [number, number]; // [longitude, latitude]
  distance?: string;
  eventType: EventCategoryType;
};

// Real category names in this system are multi-word (e.g. "Arts & Culture",
// "Sports & Wellness", "Science & Technology"), so match by substring rather
// than requiring an exact lowercase match against a short key.
export const mapCategoryToEventType = (categoryName?: string): EventCategoryType => {
  const name = categoryName?.toLowerCase() ?? "";
  if (name.includes("music")) return "music";
  if (name.includes("art")) return "arts";
  if (name.includes("sport")) return "sports";
  if (name.includes("tech") || name.includes("science")) return "tech";
  return "default";
};

// Format an event's date + 24h start time into display labels, e.g. "Mar 29, 2026" / "10:00 PM"
export const formatEventDateTime = (date: string, startTime: string) => {
  const parsedDate = new Date(date);
  const dateLabel = Number.isNaN(parsedDate.getTime())
    ? ""
    : parsedDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

  const [hourStr, minuteStr] = (startTime || "").split(":");
  const hour = parseInt(hourStr, 10);
  let timeLabel = "";
  if (!Number.isNaN(hour)) {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    timeLabel = `${hour12}:${minuteStr ?? "00"} ${period}`;
  }

  return { dateLabel, timeLabel };
};

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return `${(R * c).toFixed(1)} km`;
};

// Shapes one raw event document into a DisplayEvent, or returns null if it's missing
// fields the UI needs (coordinates, title, venue, date/time).
export const mapRawEventToDisplay = (event: any, referencePoint?: [number, number]): DisplayEvent | null => {
  const hasCoordinates = event.coordinates && event.coordinates.longitude && event.coordinates.latitude;
  const hasRequiredFields = event._id && event.title && event.venueName && event.date && event.startTime;

  if (!hasCoordinates || !hasRequiredFields) {
    console.warn("Event is missing required data", event);
    return null;
  }

  const { dateLabel, timeLabel } = formatEventDateTime(event.date, event.startTime);
  const ticketPrices: number[] = Array.isArray(event.tickets)
    ? event.tickets.map((t: any) => t.price).filter((p: any) => typeof p === "number")
    : [];

  return {
    id: event._id,
    title: event.title,
    location: event.venueName,
    dateLabel,
    timeLabel,
    image: event.image?.[0] || "/images/placeholder.svg",
    coordinates: [event.coordinates.longitude, event.coordinates.latitude],
    eventType: mapCategoryToEventType(event.categoryName),
    distance: referencePoint
      ? calculateDistance(referencePoint[1], referencePoint[0], event.coordinates.latitude, event.coordinates.longitude)
      : undefined,
    isFree: event.isFree ?? false,
    price: ticketPrices.length > 0 ? Math.min(...ticketPrices) : undefined,
  };
};
