"use client"

import { toast } from "sonner"
import { Copy, Gift, Info, Mail, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMyReferral } from "@/state/referralsAPI"
import DataError from "@/components/shared/DataError"

export default function ReferralsPage() {
  const { data, isLoading, isError, refetch } = useMyReferral()
  const referralId = data?.data.referralId
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  // referralId identifies a real, server-tracked Referral record - whoever
  // signs up through this link gets recorded as this user's invitee (see
  // POST /referrals/generate and /auth/activate-user-account on the backend)
  const referralLink = referralId && origin ? `${origin}/sign-up?ref=${referralId}` : ""

  const copyLink = () => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink).then(
      () => toast.success("Referral link copied"),
      () => toast.error("Couldn't copy link")
    )
  }

  const shareText = `Come organize events with me on Ventiqo — sign up here: ${referralLink}`

  if (isError) {
    return <DataError message="Couldn't load your referral link." onRetry={() => refetch()} />
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Referrals</h1>
        <p className="text-sm text-muted-foreground">Invite other organizers to Ventiqo with your personal link.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Gift className="size-5 text-muted-foreground" />
          </span>
          <div>
            <p className="font-medium">Your referral link</p>
            <p className="text-sm text-muted-foreground">Share this link — anyone who signs up through it is tagged as referred by you.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Input value={isLoading ? "Loading…" : referralLink} readOnly className="font-mono text-xs" />
          <Button variant="outline" onClick={copyLink} disabled={!referralLink}>
            <Copy className="mr-1.5 size-4" />
            Copy
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!referralLink}
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")}
          >
            <MessageCircle className="mr-1.5 size-4" />
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!referralLink}
            onClick={() =>
              window.open(
                `mailto:?subject=${encodeURIComponent("Join me on Ventiqo")}&body=${encodeURIComponent(shareText)}`,
                "_blank"
              )
            }
          >
            <Mail className="mr-1.5 size-4" />
            Share by Email
          </Button>
        </div>

        <div className="flex gap-2 rounded-lg border border-semantic-info-bg-strong bg-semantic-info-bg p-3 text-xs text-semantic-info-text">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>
            Anyone who signs up through this link and verifies their email is recorded as your referral. A history of who
            signed up through it isn&apos;t shown here yet — that&apos;s coming in a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
