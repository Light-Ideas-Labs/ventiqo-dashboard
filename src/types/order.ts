export interface CreateOrderPayload {
    eventId: string;
    ticketType: string;
    totalTickets: number;
    phone_number: string;
  }
  
  export interface OrderResponse {
    success: boolean;
    order?: any;
    message?: string;
  }
  