"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import StarRating from "@/components/reviews/StarRating"
import DataError from "@/components/shared/DataError"
import { useEventReviews, useReplyToReview, type Review } from "@/state/reviewsAPI"
import type { EventData } from "@/types/event"

const reviewerName = (user: Review["user"]) => {
  if (typeof user === "string") return "Ventiqo user"
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
  return name || "Ventiqo user"
}

function ReplyBox({ eventId, reviewId }: { eventId: string; reviewId: string }) {
  const [text, setText] = useState("")
  const replyToReview = useReplyToReview()

  const submit = () => {
    if (!text.trim()) return
    replyToReview.mutate(
      { eventId, reviewId, text },
      { onSuccess: () => setText("") }
    )
  }

  return (
    <div className="mt-3 flex items-start gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Reply as the organizer…"
        rows={2}
        className="flex-1"
      />
      <Button size="sm" onClick={submit} disabled={!text.trim() || replyToReview.isPending}>
        {replyToReview.isPending ? "Posting…" : "Reply"}
      </Button>
    </div>
  )
}

export default function ReviewsTab({ event }: { event: EventData }) {
  const { data, isLoading, isError, refetch } = useEventReviews(event._id)
  const reviews = data?.data ?? []

  if (isError) {
    return <DataError message="Couldn't load reviews for this event." onRetry={() => refetch()} />
  }

  const average = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <div className="mt-1 flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{average.toFixed(1)}</h2>
            <StarRating value={Math.round(average)} readOnly size="sm" />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <h2 className="text-2xl font-semibold">{reviews.length}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading reviews…</p>}
        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet for this event.</p>
        )}
        {reviews.map((review) => (
          <div key={review._id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Avatar size="sm">
                <AvatarFallback>{reviewerName(review.user)[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{reviewerName(review.user)}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </span>
                </div>
                <StarRating value={review.rating} readOnly size="sm" />
                <p className="mt-1 font-medium">{review.title}</p>
                <p className="text-sm text-muted-foreground">{review.comment}</p>

                {review.replies.map((reply) => (
                  <div key={reply._id} className="mt-3 ml-4 border-l-2 border-border pl-4 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">Your reply</p>
                    <p>{reply.text}</p>
                  </div>
                ))}

                <ReplyBox eventId={event._id} reviewId={review._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
