import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { Ticket } from "@/types/event";

export interface Event {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  aboutEvent: string;
  tagline: string;
  keypoint: string[];
  venueName: string;
  categoryName: string;
  subcatergoryName: string;
  status: string;
  tickets: Ticket[];
  image: string;
  category: string;
  subcatergory: string;
  organizer: string | null;
  currentBookings: number;
  featured: boolean;
  registrationRequired: boolean;
  createdBy: string;
  updatedBy: string;
  deletedBy: string;
  schemaVersion: number;
  tokenizedTickets: any[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  __v: number;
}

// Interface for the event details response
interface EventDetailsResponse {
  success: boolean;
  data: {
    _id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    aboutEvent: string;
    tagline: string;
    keypoint: string[];
    venueName: string;
    categoryName: string;
    subcatergoryName: string;
    status: string;
    tickets: {
      name: string;
      description: string;
      price: number;
      quantity: number;
      stock: number;
      status: string;
      ticketType: string;
      salesStartDate: string;
      salesEndDate: string;
      currentBookings: number;
      _id: string;
      createdAt: string;
      updatedAt: string;
    }[];
    image: string;
    category: {
      _id: string;
      name: string;
      description: string;
      isActive: boolean;
      createdBy: string;
      updatedBy: string;
      deletedBy: string;
      schemaVersion: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      __v: number;
    };
    subcatergory: string;
    organizer: null | string;
    currentBookings: number;
    featured: boolean;
    registrationRequired: boolean;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
    schemaVersion: number;
    tokenizedTickets: any[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    __v: number;
  };
}

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
  subcategoryName: string;
  status: string;
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

// getting all events api
interface GetAllEventsResponse {
  message: string;
  success: boolean;
  events: {
    data: any[];
    _links: any;
    _meta: {
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: any;
      prevPage: any;
    };
  };
}

export interface PaginatedEventsResponse {
  success: boolean;
  message: string;
  paginatedEvents: {
    data: Event[];
    _links: any | null;
    _meta: {
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: any | null;
      prevPage: any | null;
    };
  };
}

interface TicketSummaryResponse {
  success: boolean;
  message: string;
  data: {
    ticketSummary: {
      ticketName: string;
      totalTickets: number;
      remainingTickets: number;
      soldTickets: number;
    }[];
    totalRemainingTickets: number;
    totalSoldTickets: number;
  };
}

interface OrganizerEventsResponse {
  success: boolean;
  count: number;
  paginatedEvents: {
    data: Event[];
    _meta: { total: number; totalPages: number; currentPage: number };
  };
}

// ── Query keys ──────────────────────────────────────────────────────────
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  detail: (eventId: string) => [...eventKeys.all, "detail", eventId] as const,
  byCategory: (category: string) => [...eventKeys.all, "category", category] as const,
  byOrganizer: (organizerId: string) => [...eventKeys.all, "organizer", organizerId] as const,
  ticketSummary: (eventId: string) => [...eventKeys.all, "summary", eventId] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getAllEvents = () =>
  apiFetch<GetAllEventsResponse>("/events/all/events", { auth: false });

export const getEventById = (eventId: string) =>
  apiFetch<EventDetailsResponse>(`/events/${eventId}`, { auth: false });

export const getEventsByCategory = (category: string) =>
  apiFetch<PaginatedEventsResponse>(`/events/categories/${category}`, { auth: false });

export const getEventsByOrganizer = (organizerId: string) =>
  apiFetch<OrganizerEventsResponse>(`/events/organizer/${organizerId}?limit=100`, { auth: false });

export const getEventTicketSummary = (eventId: string) =>
  apiFetch<TicketSummaryResponse>(`/events/${eventId}/summary`, { auth: false });

export const createEvent = (eventDetails: dataEventDetails) =>
  apiFetch<any>("/events/create", { method: "POST", body: eventDetails });

export const addTicketsToEvent = (eventId: string, tickets: Ticket[]) =>
  apiFetch<any>(`/events/${eventId}/tickets`, {
    method: "POST",
    body: { tickets },
  });

// The update endpoint's service reads a different field set than create's
// dataEventDetails (e.g. "about" not "aboutEvent", "categoryId" not
// "categoryName") — see services/events.services.ts#updateEvent. Modeled
// separately here rather than reusing dataEventDetails, which would silently
// no-op for every field whose name doesn't match.
export interface UpdateEventPayload {
  title?: string;
  date?: string;
  about?: string;
  tagline?: string;
  keypoint?: string[];
  venueName?: string;
  status?: string;
  categoryId?: string;
  imageId?: string;
  updateMessage?: string;
}

export const updateEvent = (eventId: string, eventDetails: UpdateEventPayload) =>
  apiFetch<any>(`/events/update/${eventId}`, { method: "PUT", body: eventDetails });

export const deleteEventById = (eventId: string) =>
  apiFetch<any>(`/events/delete/${eventId}`, { method: "DELETE" });

// ── Query hooks ─────────────────────────────────────────────────────────
export const useAllEvents = () =>
  useQuery({ queryKey: eventKeys.lists(), queryFn: getAllEvents });

export const useEvent = (eventId: string) =>
  useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => getEventById(eventId),
    enabled: Boolean(eventId),
  });

export const useEventsByCategory = (category: string) =>
  useQuery({
    queryKey: eventKeys.byCategory(category),
    queryFn: () => getEventsByCategory(category),
    enabled: Boolean(category),
  });

export const useEventsByOrganizer = (organizerId: string | undefined) =>
  useQuery({
    queryKey: eventKeys.byOrganizer(organizerId ?? ""),
    queryFn: () => getEventsByOrganizer(organizerId as string),
    enabled: Boolean(organizerId),
  });

export const useEventTicketSummary = (eventId: string) =>
  useQuery({
    queryKey: eventKeys.ticketSummary(eventId),
    queryFn: () => getEventTicketSummary(eventId),
    enabled: Boolean(eventId),
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    // Invalidate every "events" query, not just lists() — byOrganizer(orgId)
    // is a sibling key (["events","organizer",orgId]), not a descendant of
    // ["events","list"], so a narrower invalidation would leave the
    // organizer's events list (and the dashboard's event queries) stale
    // after creating an event.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  });
};

export const useAddTicketsToEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, tickets }: { eventId: string; tickets: Ticket[] }) =>
      addTicketsToEvent(eventId, tickets),
    onSuccess: (_data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.ticketSummary(eventId) });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, eventDetails }: { eventId: string; eventDetails: UpdateEventPayload }) =>
      updateEvent(eventId, eventDetails),
    onSuccess: (_data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEventById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.lists() }),
  });
};
