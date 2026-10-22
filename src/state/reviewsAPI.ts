import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface ReviewReply {
  _id: string;
  user: { _id: string; first_name?: string; last_name?: string } | string;
  text: string;
  at: string;
}

export interface Review {
  _id: string;
  event: string;
  user: { _id: string; first_name?: string; last_name?: string } | string;
  title: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  replies: ReviewReply[];
  replyCount: number;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewListResponse {
  success: boolean;
  data: Review[];
}

interface ReviewResponse {
  success: boolean;
  message?: string;
  data: Review;
}

export interface CreateReviewPayload {
  eventId: string;
  rating: number;
  title: string;
  comment: string;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const reviewKeys = {
  byEvent: (eventId: string) => ["reviews", "event", eventId] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getReviewsByEvent = (eventId: string) =>
  apiFetch<ReviewListResponse>(`/reviews/event/${eventId}`, { auth: false });

// The backend upserts on {event,user} - this doubles as "edit my review".
export const createOrUpdateReview = (payload: CreateReviewPayload) =>
  apiFetch<ReviewResponse>("/reviews/create", { method: "POST", body: payload });

export const deleteReview = (reviewId: string) =>
  apiFetch<ReviewResponse>(`/reviews/${reviewId}`, { method: "DELETE" });

export const replyToReview = (reviewId: string, text: string) =>
  apiFetch<ReviewResponse>(`/reviews/reply/${reviewId}`, { method: "POST", body: { text } });

export const likeReview = (reviewId: string) =>
  apiFetch<ReviewResponse>(`/reviews/like/${reviewId}`, { method: "POST" });

export const unlikeReview = (reviewId: string) =>
  apiFetch<ReviewResponse>(`/reviews/unlike/${reviewId}`, { method: "POST" });

// ── Query hooks ─────────────────────────────────────────────────────────
export const useEventReviews = (eventId: string) =>
  useQuery({
    queryKey: reviewKeys.byEvent(eventId),
    queryFn: () => getReviewsByEvent(eventId),
    enabled: Boolean(eventId),
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrUpdateReview,
    onSuccess: (_data, { eventId }) =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.byEvent(eventId) }),
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; eventId: string }) => deleteReview(reviewId),
    onSuccess: (_data, { eventId }) =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.byEvent(eventId) }),
  });
};

export const useReplyToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, text }: { reviewId: string; text: string; eventId: string }) =>
      replyToReview(reviewId, text),
    onSuccess: (_data, { eventId }) =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.byEvent(eventId) }),
  });
};

export const useToggleReviewLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, liked }: { reviewId: string; liked: boolean; eventId: string }) =>
      liked ? unlikeReview(reviewId) : likeReview(reviewId),
    onSuccess: (_data, { eventId }) =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.byEvent(eventId) }),
  });
};
