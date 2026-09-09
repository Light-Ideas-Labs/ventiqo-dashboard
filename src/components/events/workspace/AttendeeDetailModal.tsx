"use client"

import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { Copy, CheckCircle2, RotateCcw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Order } from "@/state/ordersAPI"
import { useCheckInOrder, useUndoCheckInOrder, useResendOrderConfirmation } from "@/state/ordersAPI"

function copy(value: string, label: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.error(`Couldn't copy ${label.toLowerCase()}`)
  )
}

export default function AttendeeDetailModal({
  order,
  eventId,
  open,
  onOpenChange,
}: {
  order: Order | null
  eventId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const checkIn = useCheckInOrder(eventId)
  const undoCheckIn = useUndoCheckInOrder(eventId)
  const resend = useResendOrderConfirmation()
  const [refundReason, setRefundReason] = useState("changed-mind")

  if (!order) return null

  const fullName = `${order.personalDetail.first_name} ${order.personalDetail.last_name}`
  const ticketTypes = order.orderItems.map((item) => item.ticketCategory.type).join(", ")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attendee Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 1. PERSONAL INFO */}
          <section className="space-y-3 rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-muted-foreground">1. Personal information</h4>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback>
                  {order.personalDetail.first_name[0]}
                  {order.personalDetail.last_name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1 text-sm">
              <p>Name: {fullName}</p>
              <p className="flex items-center gap-1.5">
                Email: {order.personalDetail.email}
                <button onClick={() => copy(order.personalDetail.email, "Email")} aria-label="Copy email">
                  <Copy className="size-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </p>
              <p className="flex items-center gap-1.5">
                Phone number: {order.personalDetail.phone_number}
                <button onClick={() => copy(order.personalDetail.phone_number, "Phone number")} aria-label="Copy phone">
                  <Copy className="size-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </p>
            </div>
          </section>

          {/* 2. ORDER INFO */}
          <section className="space-y-2 rounded-xl border border-border p-4 text-sm">
            <h4 className="text-sm font-semibold text-muted-foreground">2. Order information</h4>
            <p>Order ID: {order.orderNumber}</p>
            <p>Purchase date: {new Date(order.date).toLocaleString()}</p>
            <p>Ticket type: {ticketTypes || "—"}</p>
            <p>Quantity: {order.totalOrderTicket}</p>
            <p>Total paid: KES {order.totalPay.toLocaleString()}</p>
          </section>

          {/* 3. TICKET STATUS */}
          <section className="space-y-3 rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-muted-foreground">3. Ticket Status</h4>
            {order.qrCodeUrl ? (
              <Image src={order.qrCodeUrl} alt="Ticket QR code" width={96} height={96} className="rounded-md border border-border" unoptimized />
            ) : (
              <p className="text-xs text-muted-foreground">No QR code generated for this order yet.</p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!order.pdfTicketURL}
                onClick={() => order.pdfTicketURL && window.open(order.pdfTicketURL, "_blank")}
              >
                Download ticket
              </Button>
              <Button size="sm" onClick={() => resend.mutate(order._id)} disabled={resend.isPending}>
                {resend.isPending ? "Sending…" : "Resend ticket"}
              </Button>
            </div>
          </section>

          {/* 4. CHECK-IN */}
          <section className="space-y-2 rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-muted-foreground">4. Check-in</h4>
            {order.checkIn?.status ? (
              <>
                <span className="inline-flex items-center gap-1 rounded-full bg-semantic-success-bg px-2 py-0.5 text-xs font-medium text-semantic-success-text">
                  <CheckCircle2 className="size-3.5" /> Checked-in
                </span>
                {order.checkIn.at && (
                  <p className="text-xs text-muted-foreground">
                    Checked in on {new Date(order.checkIn.at).toLocaleString()}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 gap-1.5"
                  onClick={() => undoCheckIn.mutate(order._id)}
                  disabled={undoCheckIn.isPending}
                >
                  <RotateCcw className="size-3.5" />
                  Undo check-in
                </Button>
              </>
            ) : (
              <>
                <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Not checked-in
                </span>
                <div>
                  <Button size="sm" className="mt-1" onClick={() => checkIn.mutate(order._id)} disabled={checkIn.isPending}>
                    {checkIn.isPending ? "Checking in…" : "Mark as checked-in"}
                  </Button>
                </div>
              </>
            )}
          </section>

          {/* 5. COMMUNICATION */}
          <section className="space-y-2 rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-muted-foreground">5. Communication</h4>
            <p className="text-xs text-muted-foreground">Custom messaging and message history are coming in Phase 8.</p>
            <Button size="sm" variant="outline" onClick={() => toast("Custom messaging is coming in Phase 8")}>
              Send Email
            </Button>
          </section>

          {/* 6. REFUND */}
          <section className="space-y-2 rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-muted-foreground">6. Refund</h4>
            <Input placeholder="Refund amount" disabled />
            <Select value={refundReason} onValueChange={setRefundReason}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="changed-mind">Changed mind</SelectItem>
                <SelectItem value="event-rescheduled">Event rescheduled</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Notes" disabled className="min-h-16" />
            <Button
              size="sm"
              className="bg-semantic-error text-white hover:bg-semantic-error-hover"
              onClick={() => toast("Refunds aren't wired to a payment provider yet")}
            >
              Process refund
            </Button>
            <p className="text-xs text-muted-foreground">
              Refunds need a payment-provider integration that isn&apos;t built yet.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
