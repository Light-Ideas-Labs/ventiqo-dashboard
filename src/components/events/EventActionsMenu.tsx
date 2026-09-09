"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  BarChart3,
  Download,
  Ban,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUpdateEvent, useDeleteEvent, useCreateEvent } from "@/state/eventsAPI"
import { getOrdersByEvent } from "@/state/ordersAPI"
import { downloadCsv } from "@/lib/csv-export"
import { type EventDisplayStatus } from "@/lib/event-stats"

// Accepts either of the codebase's two Event shapes (list vs. detail) —
// only `_id`/`title` are read directly, the rest is spread as-is for duplication.
type EventLike = { _id: string; title: string } & Record<string, any>

export default function EventActionsMenu({
  event,
  status,
}: {
  event: EventLike
  status: EventDisplayStatus
}) {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()
  const createEvent = useCreateEvent()

  const canCancel = status === "active" || status === "draft"
  const canDelete = status === "draft" || status === "cancelled"

  const handleDuplicate = async () => {
    try {
      // The list endpoint returns full Mongoose docs, so every field the
      // create endpoint needs is present even though the typed `Event`
      // shape only declares a subset of them.
      const source = event as unknown as Record<string, any>
      await createEvent.mutateAsync({
        ...source,
        title: `${event.title} (Copy)`,
        status: "Draft",
        currentBookings: 0,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      } as any)
      toast.success("Event duplicated as a draft")
    } catch (error) {
      toast.error("Couldn't duplicate event", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  const handleCancel = async () => {
    try {
      await updateEvent.mutateAsync({ eventId: event._id, eventDetails: { status: "Archived" } })
      toast.success("Event cancelled")
    } catch (error) {
      toast.error("Couldn't cancel event", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  const handleExportAttendees = async () => {
    setIsExporting(true)
    try {
      const res = await getOrdersByEvent(event._id)
      if (res.data.length === 0) {
        toast("No paid orders yet for this event")
        return
      }
      downloadCsv(
        `attendees-${event._id}.csv`,
        ["Name", "Email", "Phone", "Ticket type", "Quantity", "Total paid", "Purchase date", "Checked in"],
        res.data.map((o) => [
          `${o.personalDetail.first_name} ${o.personalDetail.last_name}`,
          o.personalDetail.email,
          o.personalDetail.phone_number,
          o.orderItems.map((i) => i.ticketCategory.type).join("; "),
          o.totalOrderTicket,
          o.totalPay,
          new Date(o.date).toLocaleString(),
          o.checkIn?.status ? "Yes" : "No",
        ])
      )
    } catch (error) {
      toast.error("Couldn't export attendees", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteEvent.mutateAsync(event._id)
      toast.success("Event deleted")
      setConfirmDeleteOpen(false)
    } catch (error) {
      toast.error("Couldn't delete event", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => toast("Public event pages are coming soon")}>
            <Eye className="mr-2 size-4" />
            View event page
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/organizer/events/${event._id}?tab=settings`}>
              <Pencil className="mr-2 size-4" />
              Edit event
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDuplicate} disabled={createEvent.isPending}>
            <Copy className="mr-2 size-4" />
            Duplicate event
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/organizer/analytics">
              <BarChart3 className="mr-2 size-4" />
              View Analytics
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleExportAttendees} disabled={isExporting}>
            <Download className="mr-2 size-4" />
            {isExporting ? "Exporting…" : "Download Attendee List"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {canCancel && (
            <DropdownMenuItem
              variant="destructive"
              onClick={handleCancel}
              disabled={updateEvent.isPending}
            >
              <Ban className="mr-2 size-4" />
              Cancel event
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmDeleteOpen(true)}>
              <Trash2 className="mr-2 size-4" />
              Delete event
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Delete &quot;{event.title}&quot;?</DialogTitle>
            <DialogDescription>
              This can&apos;t be undone. The event and its ticket categories will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-semantic-error text-white hover:bg-semantic-error-hover"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending ? "Deleting…" : "Delete event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
