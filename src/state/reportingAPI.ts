import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface OrganizerOverview {
  grossTicketSales: number;
  netRevenue: number;
  platformFeesCharged: number;
  refunds: number;
  balances: {
    pending: number;
    available: number;
    reserved: number;
    held: number;
    settled: number;
  };
}

interface OrganizerOverviewResponse {
  success: boolean;
  data: OrganizerOverview;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const reportingKeys = {
  organizerOverview: (organizerId: string, from?: string, to?: string) =>
    ["reporting", "organizer", organizerId, "overview", from ?? null, to ?? null] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getOrganizerOverview = (organizerId: string, from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString();
  return apiFetch<OrganizerOverviewResponse>(
    `/reporting/organizer/${organizerId}/overview${query ? `?${query}` : ""}`
  );
};

// ── Query hooks ─────────────────────────────────────────────────────────
export const useOrganizerOverview = (organizerId: string | undefined, from?: string, to?: string) =>
  useQuery({
    queryKey: reportingKeys.organizerOverview(organizerId ?? "", from, to),
    queryFn: () => getOrganizerOverview(organizerId as string, from, to),
    enabled: Boolean(organizerId),
  });
