import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface Order {
  _id: string;
  userId: string;
  date: string;
  orderNumber: string;
  personalDetail: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  status: "Pending" | "Paid" | "Cancelled";
  totalPay: number;
  totalOrderTicket: number;
  orderItems: { ticketCategory: { type: string; price: number }; totalTicket: number }[];
  qrCodeUrl?: string;
  pdfTicketURL?: string;
  checkIn: { status: boolean; at: string | null; by: string | null };
  event: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersByEventResponse {
  success: boolean;
  data: Order[];
}

interface OrderMutationResponse {
  success: boolean;
  data?: Order;
  message?: string;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const orderKeys = {
  all: ["orders"] as const,
  byEvent: (eventId: string) => [...orderKeys.all, "event", eventId] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
// Attendee's own checkout flow — used by OrderFormPopup and the customer-facing
// /user/orders/[orderId] page. Kept separate from the organizer-facing
// fetchers below, which operate on an already-created order.
export const createOrder = (orderData: {
  eventId: string;
  ticketType: string;
  totalTickets: number;
  phone_number: string;
}) =>
  apiFetch<{ success: boolean; order: Order; message: string }>("/orders/create", {
    method: "POST",
    body: orderData,
  });

export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const res = await apiFetch<{ message: string; data: Order }>(`/orders/${orderId}`);
  return res.data;
};

export const getOrdersByEvent = (eventId: string, status = "Paid") =>
  apiFetch<OrdersByEventResponse>(`/orders/event/${eventId}?status=${status}`);

export const checkInOrder = (orderId: string) =>
  apiFetch<OrderMutationResponse>(`/orders/${orderId}/check-in`, { method: "POST" });

export const undoCheckInOrder = (orderId: string) =>
  apiFetch<OrderMutationResponse>(`/orders/${orderId}/check-in/undo`, { method: "POST" });

export const resendOrderConfirmation = (orderId: string) =>
  apiFetch<OrderMutationResponse>(`/orders/${orderId}/resend`, { method: "POST" });

// ── Query hooks ─────────────────────────────────────────────────────────
export const useOrdersByEvent = (eventId: string | undefined) =>
  useQuery({
    queryKey: orderKeys.byEvent(eventId ?? ""),
    queryFn: () => getOrdersByEvent(eventId as string),
    enabled: Boolean(eventId),
  });

// Fans out one query per event (same queryKey as useOrdersByEvent, so it
// shares cache with any per-event Attendees tab the user has already
// visited) and merges the results — there's no backend endpoint for
// "all orders across an organizer" yet, only per-event.
export const useOrdersByEvents = (eventIds: string[]) => {
  const results = useQueries({
    queries: eventIds.map((eventId) => ({
      queryKey: orderKeys.byEvent(eventId),
      queryFn: () => getOrdersByEvent(eventId),
    })),
  });

  return {
    orders: results.flatMap((r) => r.data?.data ?? []),
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    refetch: () => results.forEach((r) => r.refetch()),
  };
};

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useCheckInOrder = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkInOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.byEvent(eventId) }),
  });
};

export const useUndoCheckInOrder = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: undoCheckInOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.byEvent(eventId) }),
  });
};

export const useResendOrderConfirmation = () => useMutation({ mutationFn: resendOrderConfirmation });
