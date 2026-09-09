"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Plus, MoreHorizontal, Power, PowerOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useMyOrganizer } from "@/state/organizersAPI"
import { useEventsByOrganizer } from "@/state/eventsAPI"
import {
  usePromoCodesByOrganizer,
  useActivatePromoCode,
  useDeactivatePromoCode,
  useDeletePromoCode,
} from "@/state/promosAPI"
import CreatePromoCodeDialog from "@/components/marketing/CreatePromoCodeDialog"
import DataError from "@/components/shared/DataError"

export default function MarketingPage() {
  const { data: organizerData, isError: organizerError, refetch: refetchOrganizer } = useMyOrganizer()
  const organizerId = organizerData?.data?._id

  const { data: eventsData } = useEventsByOrganizer(organizerId)
  const events = useMemo(() => eventsData?.paginatedEvents?.data ?? [], [eventsData])
  const eventTitleById = useMemo(() => new Map(events.map((e) => [e._id, e.title])), [events])

  const { data, isLoading, isError: promoError, refetch: refetchPromoCodes } = usePromoCodesByOrganizer(organizerId)
  const promoCodes = data?.data ?? []

  const activate = useActivatePromoCode(organizerId ?? "")
  const deactivate = useDeactivatePromoCode(organizerId ?? "")
  const remove = useDeletePromoCode(organizerId ?? "")

  const [createOpen, setCreateOpen] = useState(false)

  if (organizerError) {
    return <DataError message="Couldn't load your organizer profile." onRetry={() => refetchOrganizer()} />
  }

  if (promoError) {
    return <DataError message="Couldn't load your discount codes." onRetry={() => refetchPromoCodes()} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Marketing</h1>
          <p className="text-sm text-muted-foreground">Create and manage discount codes for your events.</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)} disabled={!organizerId}>
          <Plus className="size-4" />
          Create Discount Code
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Discount</th>
              <th className="px-5 py-3 font-medium">Applies to</th>
              <th className="px-5 py-3 font-medium">Usage</th>
              <th className="px-5 py-3 font-medium">Valid until</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  Loading discount codes…
                </td>
              </tr>
            )}
            {!isLoading && promoCodes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                  No discount codes yet.
                </td>
              </tr>
            )}
            {promoCodes.map((code) => (
              <tr key={code._id} className="border-t border-border">
                <td className="px-5 py-3 font-mono font-medium">{code.name}</td>
                <td className="px-5 py-3">
                  {code.discountType === "percentage" ? `${code.creditAmount}%` : `KES ${code.creditAmount}`} off
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {code.selectedEvent ? eventTitleById.get(code.selectedEvent) ?? "One event" : "All events"}
                </td>
                <td className="px-5 py-3">
                  {code.usedCount}/{code.usageLimit}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(code.endDate).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <Badge
                    className={`border-0 ${
                      code.isActive
                        ? "bg-semantic-success-bg text-semantic-success-text"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {code.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {code.isActive ? (
                        <DropdownMenuItem onClick={() => deactivate.mutate(code._id)}>
                          <PowerOff className="mr-2 size-4" />
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => activate.mutate(code._id)}>
                          <Power className="mr-2 size-4" />
                          Activate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          remove.mutate(code._id, {
                            onSuccess: () => toast.success(`Deleted ${code.name}`),
                          })
                        }
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {organizerId && (
        <CreatePromoCodeDialog
          organizerId={organizerId}
          events={events}
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      )}
    </div>
  )
}
