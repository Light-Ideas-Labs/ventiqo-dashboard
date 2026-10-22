"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StarRating from "@/components/reviews/StarRating";
import {
  useEventReviews,
  useSubmitReview,
  useDeleteReview,
  useToggleReviewLike,
  type Review,
} from "@/state/reviewsAPI";

const reviewerName = (user: Review["user"]) => {
  if (typeof user === "string") return "Ventiqo user";
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || "Ventiqo user";
};

const initials = (user: Review["user"]) => {
  if (typeof user === "string") return "V";
  const letters = [user.first_name?.[0], user.last_name?.[0]].filter(Boolean).join("");
  return letters || "V";
};

const reviewerId = (user: Review["user"]) => (typeof user === "string" ? user : user._id);

function RatingSummary({ reviews }: { reviews: Review[] }) {
  const { average, counts } = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star ... index 4 = 5 stars
    for (const r of reviews) counts[Math.min(5, Math.max(1, r.rating)) - 1]++;
    const total = reviews.length;
    const average = total === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    return { average, counts };
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center">
      <div className="flex shrink-0 flex-col items-center gap-1 sm:border-r sm:pr-6">
        <span className="text-3xl font-bold">{average.toFixed(1)}</span>
        <StarRating value={Math.round(average)} readOnly size="sm" />
        <span className="text-xs text-muted-foreground">{reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star - 1];
          const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-10 text-muted-foreground">{star} star</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewForm({
  eventId,
  existing,
}: {
  eventId: string;
  existing?: Review;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [comment, setComment] = useState(existing?.comment ?? "");
  const submitReview = useSubmitReview();

  const handleSubmit = () => {
    submitReview.mutate({ eventId, rating, title, comment });
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card p-5">
      <h3 className="font-semibold">{existing ? "Edit your review" : "Write a review"}</h3>
      <StarRating value={rating} onChange={setRating} />
      <Input placeholder="Give your review a title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        placeholder="Share your experience at this event…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      {submitReview.isError && (
        <p className="text-sm text-destructive">{(submitReview.error as Error).message}</p>
      )}
      <Button
        onClick={handleSubmit}
        disabled={!rating || !title || !comment || submitReview.isPending}
      >
        {submitReview.isPending ? "Saving…" : existing ? "Update review" : "Submit review"}
      </Button>
    </div>
  );
}

function ReviewCard({ review, eventId, currentUserId }: { review: Review; eventId: string; currentUserId?: string }) {
  const deleteReview = useDeleteReview();
  const toggleLike = useToggleReviewLike();
  const liked = Boolean(currentUserId && review.likes.includes(currentUserId));
  const isOwn = Boolean(currentUserId && reviewerId(review.user) === currentUserId);

  return (
    <div className="space-y-3 rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initials(review.user)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{reviewerName(review.user)}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <StarRating value={review.rating} readOnly size="sm" />
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
              </span>
            </div>
          </div>
        </div>
        {isOwn && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => deleteReview.mutate({ reviewId: review._id, eventId })}
            disabled={deleteReview.isPending}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      <div>
        <p className="font-medium">{review.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground"
        disabled={!currentUserId || toggleLike.isPending}
        onClick={() => toggleLike.mutate({ reviewId: review._id, liked, eventId })}
      >
        <ThumbsUp className={liked ? "size-3.5 fill-primary text-primary" : "size-3.5"} />
        {review.likes.length > 0 ? review.likes.length : "Helpful"}
      </Button>

      {review.replies.length > 0 && (
        <div className="ml-4 space-y-2 border-l-2 border-border pl-4">
          {review.replies.map((reply) => (
            <div key={reply._id} className="text-sm">
              <p className="font-medium text-xs text-muted-foreground">Organizer reply</p>
              <p>{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReviewsSection({ eventId }: { eventId: string }) {
  const { data: session } = useSession();
  const { data, isLoading } = useEventReviews(eventId);
  const reviews = data?.data ?? [];
  const currentUserId = session?.user?.id;

  const ownReview = useMemo(
    () => reviews.find((r) => currentUserId && reviewerId(r.user) === currentUserId),
    [reviews, currentUserId]
  );
  const otherReviews = reviews.filter((r) => r !== ownReview);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Reviews</h2>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews…</p>
      ) : (
        <RatingSummary reviews={reviews} />
      )}

      {currentUserId ? (
        <ReviewForm eventId={eventId} existing={ownReview} />
      ) : (
        <div className="flex items-center justify-between rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">Log in to leave a review for this event.</p>
          <Button asChild size="sm">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {ownReview && <ReviewCard review={ownReview} eventId={eventId} currentUserId={currentUserId} />}
        {otherReviews.map((review) => (
          <ReviewCard key={review._id} review={review} eventId={eventId} currentUserId={currentUserId} />
        ))}
        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
        )}
      </div>
    </div>
  );
}
