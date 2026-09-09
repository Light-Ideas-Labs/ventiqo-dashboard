import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

interface MpesaPaymentPayload {
  orderId: string;
  paymentType: string; // e.g. "Mpesa"
}

interface MpesaPaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const paymentKeys = {
  mpesaStatus: (checkoutRequestId: string) => ["payments", "mpesa", checkoutRequestId] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const initiateMpesaPayment = (payload: MpesaPaymentPayload) =>
  apiFetch<MpesaPaymentResponse>("/payments/mpesa/stkpush", { method: "POST", body: payload });

export const confirmMpesaPayment = (checkoutRequestId: string) =>
  apiFetch<MpesaPaymentResponse>(`/confirmPayment/${checkoutRequestId}`);

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useInitiateMpesaPayment = () =>
  useMutation({ mutationFn: initiateMpesaPayment });

// ── Query hooks ─────────────────────────────────────────────────────────
// Pass `refetchInterval` (e.g. 5000) to poll for completion the way the old
// setInterval-based confirmMpesaPayment loop did.
export const useMpesaPaymentStatus = (
  checkoutRequestId: string | undefined,
  options?: { refetchInterval?: number | false },
) =>
  useQuery({
    queryKey: paymentKeys.mpesaStatus(checkoutRequestId ?? ""),
    queryFn: () => confirmMpesaPayment(checkoutRequestId as string),
    enabled: Boolean(checkoutRequestId),
    refetchInterval: options?.refetchInterval ?? false,
  });
