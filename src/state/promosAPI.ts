import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface PromoCode {
  _id: string;
  name: string;
  discountType: "percentage" | "fixed";
  creditAmount: number;
  organizerId: string;
  selectedEvent?: string | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePromoCodePayload {
  name: string;
  organizerId: string;
  discountType: "percentage" | "fixed";
  creditAmount: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  selectedEvent?: string;
}

interface PromoCodesResponse {
  success: boolean;
  data: PromoCode[];
}

interface PromoCodeResponse {
  success: boolean;
  data: PromoCode;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const promoKeys = {
  all: ["promos"] as const,
  byOrganizer: (organizerId: string) => [...promoKeys.all, "organizer", organizerId] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getPromoCodesByOrganizer = (organizerId: string) =>
  apiFetch<PromoCodesResponse>(`/promos/promo-codes?organizerId=${organizerId}`);

export const createPromoCode = (payload: CreatePromoCodePayload) =>
  // `value` has no effect on the discount actually applied (only
  // creditAmount does — see services/promo.services.ts) but the schema
  // requires it, so it's mirrored from creditAmount here.
  apiFetch<PromoCodeResponse>("/promos/promo-code", {
    method: "POST",
    body: { ...payload, value: payload.creditAmount },
  });

export const activatePromoCode = (id: string) =>
  apiFetch<PromoCodeResponse>(`/promos/promo-code/activate/${id}`, { method: "PATCH" });

export const deactivatePromoCode = (id: string) =>
  apiFetch<PromoCodeResponse>(`/promos/promo-code/deactivate/${id}`, { method: "PATCH" });

export const deletePromoCode = (id: string) =>
  apiFetch<any>(`/promos/promo-code/${id}`, { method: "DELETE" });

// ── Query hooks ─────────────────────────────────────────────────────────
export const usePromoCodesByOrganizer = (organizerId: string | undefined) =>
  useQuery({
    queryKey: promoKeys.byOrganizer(organizerId ?? ""),
    queryFn: () => getPromoCodesByOrganizer(organizerId as string),
    enabled: Boolean(organizerId),
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useCreatePromoCode = (organizerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promoKeys.byOrganizer(organizerId) }),
  });
};

export const useActivatePromoCode = (organizerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activatePromoCode,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promoKeys.byOrganizer(organizerId) }),
  });
};

export const useDeactivatePromoCode = (organizerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivatePromoCode,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promoKeys.byOrganizer(organizerId) }),
  });
};

export const useDeletePromoCode = (organizerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: promoKeys.byOrganizer(organizerId) }),
  });
};
