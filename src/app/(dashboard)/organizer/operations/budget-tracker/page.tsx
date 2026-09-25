"use client"

import { Info, Receipt, RotateCcw, TrendingDown, Wallet } from "lucide-react"
import { useMyOrganizer } from "@/state/organizersAPI"
import { useOrganizerOverview } from "@/state/reportingAPI"
import DataError from "@/components/shared/DataError"

function SpendCard({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: typeof Receipt
  label: string
  value: string
  caption: string
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex size-7 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <h2 className="text-2xl font-semibold">{value}</h2>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </div>
  )
}

function SpendCardSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-7 w-16 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
    </div>
  )
}

const BALANCE_LABELS: Record<string, string> = {
  available: "Available",
  pending: "Pending",
  reserved: "Reserved",
  held: "Held",
  settled: "Settled",
}

export default function BudgetTrackerPage() {
  const { data: organizerData, isLoading: organizerLoading, isError: organizerError } = useMyOrganizer()
  const organizerId = organizerData?.data?._id

  const { data: overviewResponse, isLoading: overviewLoading, isError: overviewError, refetch } =
    useOrganizerOverview(organizerId)
  const overview = overviewResponse?.data

  const isLoading = organizerLoading || (Boolean(organizerId) && overviewLoading)

  if (organizerError || overviewError) {
    return <DataError message="Couldn't load your spend data." onRetry={() => refetch()} />
  }

  const totalOutflow = overview ? overview.platformFeesCharged + overview.refunds : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Budget Tracker</h1>
        <p className="text-sm text-muted-foreground">Actual spend across all your events.</p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-semantic-info-bg-strong bg-semantic-info-bg px-3 py-2 text-sm text-semantic-info-text">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          This shows real platform fees and refunds only — there&apos;s no way to set a budget target yet, so
          there&apos;s nothing to compare actual spend against. A per-event breakdown isn&apos;t available here either.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading || !overview ? (
          Array.from({ length: 3 }).map((_, i) => <SpendCardSkeleton key={i} />)
        ) : (
          <>
            <SpendCard
              icon={Receipt}
              label="Platform Fees Charged"
              value={`KES ${overview.platformFeesCharged.toLocaleString()}`}
              caption="Paid to Ventiqo across all events"
            />
            <SpendCard
              icon={RotateCcw}
              label="Refunds Issued"
              value={`KES ${overview.refunds.toLocaleString()}`}
              caption="Paid back to attendees"
            />
            <SpendCard
              icon={TrendingDown}
              label="Total Outflow"
              value={`KES ${totalOutflow.toLocaleString()}`}
              caption="Fees + refunds combined"
            />
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <Wallet className="size-4 text-muted-foreground" />
          Wallet balances
        </div>
        {isLoading || !overview ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {Object.entries(overview.balances).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-muted-foreground">{BALANCE_LABELS[key] ?? key}</p>
                <p className="text-lg font-semibold">KES {value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
