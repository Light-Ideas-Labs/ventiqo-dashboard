import { getSession, signIn } from 'next-auth/react';
import { VentiqoBackendAPI } from "@/constants/ventiqo-backend-api";
import { Ticket } from "@/types/event";

// Function to get and refresh the access token if needed
const getValidAccessToken = async (): Promise<string | undefined> => {
  const session = await getSession();
  let accessToken: string | undefined = session?.accessToken ?? undefined; // Use nullish coalescing to ensure `undefined` instead of `null`

  return accessToken; // This will always be a string or undefined
};

export interface Event {
  _id: string;
  title: string;
  date: string;
  startTime: string; // Add this
  endTime: string;   // Add this
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
    startTime: string; // Add this
    endTime: string;   // Add this
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

// Interface for the add tickets request body
interface AddTicketsRequestBody {
  tickets: Ticket[];
}

// getting all events api
interface GetAllEventsResponse {
  message: string;
  success: boolean;
  events: {
    data: any[]; // You may define a more specific type if you have a consistent structure
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

// create event details
export const createEvent = async (eventDetails: dataEventDetails) => {
  try {

    const accessToken = await getValidAccessToken();

    const res = await fetch(`${VentiqoBackendAPI}/events/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(eventDetails),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Function to add tickets to an event
export const addTicketsToEvent = async (eventId: string, tickets: Ticket[],): Promise<void> => {
  try {

    const accessToken = await getValidAccessToken();

    const res = await fetch(`${VentiqoBackendAPI}/events/${eventId}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ tickets }),
    });

    if (!res.ok) {
      throw new Error(`Error adding tickets: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Tickets added successfully:", data);
  } catch (error) {
    console.error("Error adding tickets to event:", error);
  }
};

// function to get all events
export const getAllEvents = async (): Promise<GetAllEventsResponse | undefined> => {
  try {
    const res = await fetch(`${VentiqoBackendAPI}/events/all/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching events: ${res.statusText}`);
    }

    const data: GetAllEventsResponse = await res.json();
    console.log("All events fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error fetching all events:", error);
    // Handle error (e.g., show notification to the user)
  }
};

// Function to get event details by ID
export const getEventById = async (eventId: string,): Promise<EventDetailsResponse | undefined> => {
  try {
    const res = await fetch(`${VentiqoBackendAPI}/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching event by ID: ${res.statusText}`);
    }

    const data: EventDetailsResponse = await res.json();
    console.log("Event details fetched successfully:", data);
    
    return data
  } catch (error) {
    console.error("Error fetching event details by ID:", error);
    // Handle error (e.g., show notification to the user)
  }
};

// Function to get events by category
export const getEventsByCategory = async (category: string): Promise<PaginatedEventsResponse | undefined> => {
  try {
    const res = await fetch(`${VentiqoBackendAPI}/events/categories/${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching events by category: ${res.statusText}`);
    }

    const data: PaginatedEventsResponse = await res.json();
    console.log(`Events for category ${category} fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching events by category ${category}:`, error);
    // Handle error (e.g., show notification to the user)
  }
};


// Function to get event ticket summary
export const getEventTicketSummary = async (eventId: string): Promise<TicketSummaryResponse | undefined> => {
  try {
    const res = await fetch(`${VentiqoBackendAPI}/events/${eventId}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching event ticket summary: ${res.statusText}`);
    }

    const data: TicketSummaryResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching event ticket summary:", error);
  }
};
