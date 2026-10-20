import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { VentiqoBackendAPI } from "@/constants/ventiqo-backend-api";

export interface WalletBalances {
  pending: number;
  available: number;
  reserved: number;
  held: number;
  settled: number;
}

export interface LedgerEntry {
  _id: string;
  walletId: string;
  type: "credit" | "debit";
  amount: number;
  entryType: string;
  state: "Pending" | "Available" | "Reserved" | "Settled" | "Disputed";
  description?: string;
  eventId?: string;
  createdAt: string;
}

export interface Wallet {
  organizer: string;
  balances: WalletBalances;
  transactions: LedgerEntry[];
  commissionRate?: number;
}

interface WalletResponse {
  success: boolean;
  message?: string;
  data: Wallet;
}

export interface Settlement {
  _id: string;
  walletId: string;
  organizerId?: string;
  vendorId?: string;
  requestedBy: string;
  grossAmount: number;
  reserveAmount: number;
  payoutAmount: number;
  reservedUntil?: string;
  status: "completed";
  createdAt: string;
}

interface SettlementsResponse {
  success: boolean;
  message?: string;
  data: Settlement[];
}

interface RequestSettlementResponse {
  success: boolean;
  message?: string;
  data: { settlement: Settlement; payout: { _id: string; amount: number; method: string; status: string } };
}

// ── Query keys ──────────────────────────────────────────────────────────
export const walletKeys = {
  organizer: (organizerId: string) => ["wallets", "organizer", organizerId] as const,
  settlements: (organizerId: string) => ["wallets", "organizer", organizerId, "settlements"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getOrganizerWallet = (organizerId: string) =>
  apiFetch<WalletResponse>(`/wallets/organizer/${organizerId}`);

export const requestSettlement = (organizerId: string) =>
  apiFetch<RequestSettlementResponse>(`/wallets/organizer/${organizerId}/settlements`, { method: "POST" });

export const getOrganizerSettlements = (organizerId: string) =>
  apiFetch<SettlementsResponse>(`/wallets/organizer/${organizerId}/settlements`);

// Not run through apiFetch - the backend only accepts the access token via
// cookie or Authorization header (no query-param support), and the response
// here is a CSV/PDF file, not JSON, so this does its own authenticated fetch
// and triggers the browser download directly rather than returning a URL.
export const downloadStatement = async (organizerId: string, format: "csv" | "pdf") => {
  const session = await getSession();
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new ApiError("No access token found. Please login again.", 401);
  }

  const res = await fetch(`${VentiqoBackendAPI}/wallets/organizer/${organizerId}/statement?format=${format}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new ApiError("Couldn't download statement", res.status);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `statement-${organizerId}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// ── Query hooks ─────────────────────────────────────────────────────────
export const useOrganizerWallet = (organizerId: string | undefined) =>
  useQuery({
    queryKey: walletKeys.organizer(organizerId ?? ""),
    queryFn: () => getOrganizerWallet(organizerId as string),
    enabled: Boolean(organizerId),
  });

export const useOrganizerSettlements = (organizerId: string | undefined) =>
  useQuery({
    queryKey: walletKeys.settlements(organizerId ?? ""),
    queryFn: () => getOrganizerSettlements(organizerId as string),
    enabled: Boolean(organizerId),
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useRequestSettlement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizerId: string) => requestSettlement(organizerId),
    onSuccess: (_data, organizerId) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.organizer(organizerId) });
      queryClient.invalidateQueries({ queryKey: walletKeys.settlements(organizerId) });
    },
  });
};
