"use client"

import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { CheckCircle2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
  const { data: session } = useSession()
  const isPaid = session?.user?.isPaid ?? false
  const nextPaymentAmount = session?.user?.nextPaymentAmount
  const nextPaymentDate = session?.user?.nextPaymentDate

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">Your Ventiqo plan and payment status.</p>
      </div>

      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Wallet className="size-5 text-muted-foreground" />
          </span>
          <div>
            <p className="font-medium">{isPaid ? "Paid Plan" : "Free Plan"}</p>
            <p className="text-sm text-muted-foreground">
              {isPaid ? "Your account is on a paid plan." : "You're currently on the free plan."}
            </p>
          </div>
        </div>

        {isPaid && (nextPaymentAmount !== undefined || nextPaymentDate) && (
          <div className="flex items-center gap-2 rounded-lg border border-semantic-info-bg-strong bg-semantic-info-bg px-3 py-2 text-sm text-semantic-info-text">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>
              Next payment
              {nextPaymentAmount !== undefined ? ` of KES ${nextPaymentAmount.toLocaleString()}` : ""}
              {nextPaymentDate ? ` on ${new Date(nextPaymentDate).toLocaleDateString()}` : ""}
            </span>
          </div>
        )}

        {!isPaid && (
          <Button onClick={() => toast("Plan upgrades aren't available yet")}>Upgrade Plan</Button>
        )}
      </div>
    </div>
  )
}
