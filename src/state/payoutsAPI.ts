import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface Payout {
  _id: string;
  settlementId: string;
  walletId: string;
  organizerId?: string;
  vendorId?: string;
  amount: number;
  method: "bank" | "mpesa";
  destination: { bankName?: string; accountNumber?: string; mpesaNumber?: string };
  status: "pending" | "completed" | "failed";
  externalRef?: string;
  failureReason?: string;
  createdAt: string;
}

interface PayoutsResponse {
  success: boolean;
  data: Payout[];
}

interface PayoutResponse {
  success: boolean;
  message?: string;
  data: Payout;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const payoutKeys = {
  pending: () => ["payouts", "pending"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getPendingPayouts = () => apiFetch<PayoutsResponse>("/payouts/pending");

export const completePayout = (payoutId: string, externalRef?: string) =>
  apiFetch<PayoutResponse>(`/payouts/${payoutId}/complete`, { method: "POST", body: { externalRef } });

export const failPayout = (payoutId: string, reason: string) =>
  apiFetch<PayoutResponse>(`/payouts/${payoutId}/fail`, { method: "POST", body: { reason } });

export const disbursePayoutViaVexora = (payoutId: string) =>
  apiFetch<PayoutResponse>(`/payouts/${payoutId}/disburse`, { method: "POST" });

export const getVexoraPayoutStatus = (payoutId: string) =>
  apiFetch<{ success: boolean; [key: string]: unknown }>(`/payouts/${payoutId}/vexora-status`);

// ── Query hooks ─────────────────────────────────────────────────────────
export const usePendingPayouts = () =>
  useQuery({
    queryKey: payoutKeys.pending(),
    queryFn: getPendingPayouts,
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useCompletePayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutId, externalRef }: { payoutId: string; externalRef?: string }) =>
      completePayout(payoutId, externalRef),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payoutKeys.pending() }),
  });
};

export const useFailPayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutId, reason }: { payoutId: string; reason: string }) => failPayout(payoutId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payoutKeys.pending() }),
  });
};

export const useDisbursePayoutViaVexora = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payoutId: string) => disbursePayoutViaVexora(payoutId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: payoutKeys.pending() }),
  });
};
