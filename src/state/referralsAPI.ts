import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

interface ReferralLinkResponse {
  success: boolean;
  message?: string;
  data: {
    referralId: string;
    referralLink: string;
  };
}

// Idempotent on the backend - returns the caller's existing active referral
// if one exists, otherwise creates one. Safe to call on every page load.
// Mounted at /referral (singular) on the backend, not /referrals
export const generateReferral = () =>
  apiFetch<ReferralLinkResponse>("/referral/generate", { method: "POST" });

export const useMyReferral = () =>
  useQuery({
    queryKey: ["referrals", "mine"],
    queryFn: generateReferral,
  });
