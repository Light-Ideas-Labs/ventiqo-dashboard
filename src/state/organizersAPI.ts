import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface CreateOrganizerPayload {
  organizer_name: string;
  organizer_email: string;
  organizer_phone_number: string;
  organizer_address: string;
  organizer_country: string;
  organizer_city: string;
  website?: string;
  description?: string;
  category?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
}

// Financial info deliberately isn't part of this payload — see the comment
// on getFinancialInfo/updateFinancialInfo below for why that needs its own
// dedicated endpoint instead of going through the generic PUT here.
export interface UpdateOrganizerPayload {
  organizer_name?: string;
  organizer_logo?: string;
  organizer_city?: string;
  website?: string;
  description?: string;
  category?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
}

export interface Organizer {
  _id: string;
  organizer_name: string;
  organizer_logo?: string;
  organizer_email: string;
  [key: string]: any;
}

interface OrganizerResponse {
  success: boolean;
  message?: string;
  data: Organizer;
}

interface MyOrganizerResponse {
  success: boolean;
  data: Organizer | null;
}

export interface FinancialInfo {
  bankName?: string;
  accountNumber?: string;
  mpesaNumber?: string;
  walletAddress?: string;
  verificationStatus: "unverified" | "pending" | "verified";
  verifiedAt?: string;
  verifiedBy?: string;
}

interface FinancialInfoPayload {
  bankName?: string;
  accountNumber?: string;
  mpesaNumber?: string;
  walletAddress?: string;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const organizerKeys = {
  detail: (organizerId: string) => ["organizers", "detail", organizerId] as const,
  mine: () => ["organizers", "me"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const createOrganizer = (payload: CreateOrganizerPayload) =>
  apiFetch<OrganizerResponse>("/organizers/create", { method: "POST", body: payload });

export const updateOrganizer = (organizerId: string, payload: UpdateOrganizerPayload) =>
  apiFetch<OrganizerResponse>(`/organizers/${organizerId}`, { method: "PUT", body: payload });

export const getMyOrganizer = () => apiFetch<MyOrganizerResponse>("/organizers/me");

// The generic PUT /organizers/:id used by updateOrganizer() above shallow-
// Object.assigns whatever body it's given onto the organizer doc — sending
// financialInfo through it replaces the whole sub-document (silently
// dropping verificationStatus/mpesaNumber/etc.) and skips the
// re-verification-on-change logic. This dedicated endpoint is the correct
// one for financial info specifically.
export const getFinancialInfo = (organizerId: string) =>
  apiFetch<{ success: boolean; organizer: FinancialInfo }>(`/organizers/${organizerId}/financial-info`);

export const updateFinancialInfo = (organizerId: string, payload: FinancialInfoPayload) =>
  apiFetch<{ success: boolean; financialInfo: FinancialInfo }>(`/organizers/${organizerId}/financial-info`, {
    method: "PUT",
    body: payload,
  });

// ── Query hooks ─────────────────────────────────────────────────────────
export const useMyOrganizer = () =>
  useQuery({
    queryKey: organizerKeys.mine(),
    queryFn: getMyOrganizer,
    // Onboarding may not have created an organizer yet — 401s on sign-out
    // shouldn't retry forever either.
    retry: 1,
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useCreateOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrganizer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: organizerKeys.mine() }),
  });
};

export const useUpdateOrganizer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ organizerId, payload }: { organizerId: string; payload: UpdateOrganizerPayload }) =>
      updateOrganizer(organizerId, payload),
    onSuccess: (_data, { organizerId }) =>
      queryClient.invalidateQueries({ queryKey: organizerKeys.detail(organizerId) }),
  });
};

export const useFinancialInfo = (organizerId: string | undefined) =>
  useQuery({
    queryKey: [...organizerKeys.detail(organizerId ?? ""), "financial-info"] as const,
    queryFn: () => getFinancialInfo(organizerId as string),
    enabled: Boolean(organizerId),
  });

export const useUpdateFinancialInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ organizerId, payload }: { organizerId: string; payload: FinancialInfoPayload }) =>
      updateFinancialInfo(organizerId, payload),
    onSuccess: (_data, { organizerId }) =>
      queryClient.invalidateQueries({
        queryKey: [...organizerKeys.detail(organizerId), "financial-info"],
      }),
  });
};
