export type EventDetailsResponse = {
  success: boolean;
  data: EventData;
};

export type EventData = {
  _id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  aboutEvent: string;
  tagline: string;
  keypoint: string[];
  venueName: string;
  categoryName: string;
  subcatergoryName: string;
  status: string;
  tickets: Ticket[];
  image: string;
  category: Category;
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

export type Ticket = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  ticketsSold?: number;
  ticketType: string;
  salesStartDate: string;
  salesEndDate: string;
  status?: string;
  currentBookings?: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
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
