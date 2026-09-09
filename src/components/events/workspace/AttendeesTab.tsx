"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Search, Download, Mail, CheckCircle2, MoreHorizontal, Eye, RotateCcw, MessageSquare, Undo2, Ban } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useOrdersByEvent, useCheckInOrder, useUndoCheckInOrder, useResendOrderConfirmation, type Order } from "@/state/ordersAPI"
import { downloadCsv } from "@/lib/csv-export"
import DataError from "@/components/shared/DataError"
import AttendeeDetailModal from "./AttendeeDetailModal"

export default function AttendeesTab({ eventId }: { eventId: string }) {
  const { data, isLoading, isError, refetch } = useOrdersByEvent(eventId)
  const orders = useMemo(() => data?.data ?? [], [data])

  const [search, setSearch] = useState("")
  const [ticketType, setTicketType] = useState("all")
  const [checkInFilter, setCheckInFilter] = useState<"all" | "checked-in" | "not-checked-in">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const checkIn = useCheckInOrder(eventId)
  const undoCheckIn = useUndoCheckInOrder(eventId)
  const resend = useResendOrderConfirmation()

  const ticketTypes = useMemo(
    () => Array.from(new Set(orders.flatMap((o) => o.orderItems.map((i) => i.ticketCategory.type)))),
    [orders]
  )

  const filtered = orders.filter((order) => {
    if (search) {
      const q = search.toLowerCase()
      const haystack = `${order.personalDetail.first_name} ${order.personalDetail.last_name} ${order.personalDetail.email} ${order.personalDetail.phone_number}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (ticketType !== "all" && !order.orderItems.some((i) => i.ticketCategory.type === ticketType)) return false
    if (checkInFilter === "checked-in" && !order.checkIn?.status) return false
    if (checkInFilter === "not-checked-in" && order.checkIn?.status) return false
    return true
  })

  const openDetails = (order: Order) => {
    setSelectedOrder(order)
    setModalOpen(true)
  }

  const exportCsv = () => {
    downloadCsv(
      `attendees-${eventId}.csv`,
      ["Name", "Email", "Phone", "Ticket type", "Quantity", "Total paid", "Purchase date", "Checked in"],
      filtered.map((o) => [
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
  }

  if (isError) {
    return <DataError message="Couldn't load attendees for this event." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Attendees</h3>
        <p className="text-sm text-muted-foreground">Manage ticket buyers, check-ins and attendee communication.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="pl-9"
          />
        </div>

        <Select value={ticketType} onValueChange={setTicketType}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ticket types</SelectItem>
            {ticketTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={checkInFilter} onValueChange={(v) => setCheckInFilter(v as typeof checkInFilter)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All check-in status</SelectItem>
            <SelectItem value="checked-in">Checked-in</SelectItem>
            <SelectItem value="not-checked-in">Not checked-in</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Export list
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportCsv}>Export CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Excel export is coming soon")}>Export Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("PDF export is coming soon")}>Export PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Coming soon")}>Email to me</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="gap-2" onClick={() => toast("Custom messaging is coming in Phase 8")}>
          <Mail className="size-4" />
          Send email
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Attendee</th>
              <th className="px-5 py-3 font-medium">Ticket type</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Purchase date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  Loading attendees…
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                  {orders.length === 0 ? "No paid orders yet for this event." : "No attendees match your filters."}
                </td>
              </tr>
            )}
            {filtered.map((order) => (
              <tr key={order._id} className="border-t border-border">
                <td className="px-5 py-3">
                  <button className="flex items-center gap-3 text-left" onClick={() => openDetails(order)}>
                    <Avatar className="size-9">
                      <AvatarFallback>
                        {order.personalDetail.first_name[0]}
                        {order.personalDetail.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {order.personalDetail.first_name} {order.personalDetail.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.personalDetail.email}</p>
                    </div>
                  </button>
                </td>
                <td className="px-5 py-3">
                  {order.orderItems.map((item) => (
                    <span
                      key={item.ticketCategory.type}
                      className="mr-1 inline-block rounded-full bg-semantic-info-bg px-2 py-0.5 text-xs font-medium text-semantic-info-text"
                    >
                      {item.ticketCategory.type}
                    </span>
                  ))}
                </td>
                <td className="px-5 py-3">{order.totalOrderTicket} ticket{order.totalOrderTicket === 1 ? "" : "s"}</td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  {order.checkIn?.status ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-semantic-success-bg px-2 py-0.5 text-xs font-medium text-semantic-success-text">
                      <CheckCircle2 className="size-3.5" /> Checked-in
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Not checked-in
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetails(order)}>
                        <Eye className="mr-2 size-4" />
                        View order details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => resend.mutate(order._id)}>
                        <RotateCcw className="mr-2 size-4" />
                        Resend ticket
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast("Custom messaging is coming in Phase 8")}>
                        <MessageSquare className="mr-2 size-4" />
                        Send message
                      </DropdownMenuItem>
                      {order.checkIn?.status ? (
                        <DropdownMenuItem onClick={() => undoCheckIn.mutate(order._id)}>
                          <Undo2 className="mr-2 size-4" />
                          Undo check-in
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => checkIn.mutate(order._id)}>
                          <CheckCircle2 className="mr-2 size-4" />
                          Mark as checked-in
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => toast("Refunds aren't wired to a payment provider yet")}
                      >
                        <Ban className="mr-2 size-4" />
                        Issue refund
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

      <AttendeeDetailModal order={selectedOrder} eventId={eventId} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
