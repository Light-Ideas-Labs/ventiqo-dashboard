import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export type KycStatus = "unsubmitted" | "pending" | "approved" | "rejected";

export interface OrganizerKyc {
  status: KycStatus;
  country?: string;
  idType?: string;
  idNumber?: string;
  businessType?: string;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface KycSubmitPayload {
  country: string;
  idType: string;
  idNumber: string;
  businessType?: string;
  postalAddress?: string;
  postalCode?: string;
}

interface KycResponse {
  success: boolean;
  message?: string;
  data: OrganizerKyc;
}

export interface PendingKycOrganizer {
  _id: string;
  organizer_name: string;
  organizer_email: string;
  kyc: OrganizerKyc;
  createdAt: string;
}

interface PendingKycResponse {
  success: boolean;
  data: PendingKycOrganizer[];
}

// ── Query keys ──────────────────────────────────────────────────────────
export const kycKeys = {
  status: (organizerId: string) => ["kyc", "organizer", organizerId] as const,
  pending: () => ["kyc", "pending"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const submitKyc = (organizerId: string, payload: KycSubmitPayload) =>
  apiFetch<KycResponse>(`/kyc/organizer/${organizerId}/submit`, { method: "POST", body: payload });

export const getKycStatus = (organizerId: string) =>
  apiFetch<KycResponse>(`/kyc/organizer/${organizerId}`);

export const getPendingKyc = () => apiFetch<PendingKycResponse>("/kyc/pending");

export const approveKyc = (organizerId: string) =>
  apiFetch<KycResponse>(`/kyc/organizer/${organizerId}/approve`, { method: "POST" });

export const rejectKyc = (organizerId: string, reason: string) =>
  apiFetch<KycResponse>(`/kyc/organizer/${organizerId}/reject`, { method: "POST", body: { reason } });

// ── Query hooks ─────────────────────────────────────────────────────────
export const useKycStatus = (organizerId: string | undefined) =>
  useQuery({
    queryKey: kycKeys.status(organizerId ?? ""),
    queryFn: () => getKycStatus(organizerId as string),
    enabled: Boolean(organizerId),
  });

export const usePendingKyc = () =>
  useQuery({
    queryKey: kycKeys.pending(),
    queryFn: getPendingKyc,
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useSubmitKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ organizerId, payload }: { organizerId: string; payload: KycSubmitPayload }) =>
      submitKyc(organizerId, payload),
    onSuccess: (_data, { organizerId }) =>
      queryClient.invalidateQueries({ queryKey: kycKeys.status(organizerId) }),
  });
};

export const useApproveKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizerId: string) => approveKyc(organizerId),
    onSuccess: (_data, organizerId) => {
      queryClient.invalidateQueries({ queryKey: kycKeys.status(organizerId) });
      queryClient.invalidateQueries({ queryKey: kycKeys.pending() });
    },
  });
};

export const useRejectKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ organizerId, reason }: { organizerId: string; reason: string }) => rejectKyc(organizerId, reason),
    onSuccess: (_data, { organizerId }) => {
      queryClient.invalidateQueries({ queryKey: kycKeys.status(organizerId) });
      queryClient.invalidateQueries({ queryKey: kycKeys.pending() });
    },
  });
};
