"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  Search,
  Download,
  CheckCircle2,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Undo2,
  Ban,
  MessageSquare,
} from "lucide-react"
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
import { useMyOrganizer } from "@/state/organizersAPI"
import { useEventsByOrganizer } from "@/state/eventsAPI"
import {
  useOrdersByEvents,
  useCheckInOrder,
  useUndoCheckInOrder,
  useResendOrderConfirmation,
  type Order,
} from "@/state/ordersAPI"
import { downloadCsv } from "@/lib/csv-export"
import DataError from "@/components/shared/DataError"
import AttendeeDetailModal from "@/components/events/workspace/AttendeeDetailModal"

function AttendeeRow({
  order,
  eventTitle,
  onView,
}: {
  order: Order
  eventTitle: string
  onView: () => void
}) {
  const checkIn = useCheckInOrder(order.event)
  const undoCheckIn = useUndoCheckInOrder(order.event)
  const resend = useResendOrderConfirmation()

  return (
    <tr className="border-t border-border">
      <td className="px-5 py-3">
        <button className="flex items-center gap-3 text-left" onClick={onView}>
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
      <td className="px-5 py-3 text-muted-foreground">{eventTitle}</td>
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
      <td className="px-5 py-3">
        {order.totalOrderTicket} ticket{order.totalOrderTicket === 1 ? "" : "s"}
      </td>
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
            <DropdownMenuItem onClick={onView}>
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
  )
}

export default function AttendeesPage() {
  const { data: organizerData, isError: organizerError, refetch: refetchOrganizer } = useMyOrganizer()
  const organizerId = organizerData?.data?._id

  const {
    data: eventsData,
    isError: eventsError,
    refetch: refetchEvents,
  } = useEventsByOrganizer(organizerId)
  const events = useMemo(() => eventsData?.paginatedEvents?.data ?? [], [eventsData])
  const eventIds = useMemo(() => events.map((e) => e._id), [events])
  const eventsById = useMemo(() => new Map(events.map((e) => [e._id, e])), [events])

  const { orders, isLoading, isError: ordersError, refetch: refetchOrders } = useOrdersByEvents(eventIds)

  const [search, setSearch] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [ticketType, setTicketType] = useState("all")
  const [checkInFilter, setCheckInFilter] = useState<"all" | "checked-in" | "not-checked-in">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const ticketTypes = useMemo(
    () => Array.from(new Set(orders.flatMap((o) => o.orderItems.map((i) => i.ticketCategory.type)))),
    [orders]
  )

  const filtered = orders.filter((order) => {
    if (search) {
      const q = search.toLowerCase()
      const haystack =
        `${order.personalDetail.first_name} ${order.personalDetail.last_name} ${order.personalDetail.email} ${order.personalDetail.phone_number}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (eventFilter !== "all" && order.event !== eventFilter) return false
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
      "attendees.csv",
      ["Name", "Email", "Phone", "Event", "Ticket type", "Quantity", "Total paid", "Purchase date", "Checked in"],
      filtered.map((o) => [
        `${o.personalDetail.first_name} ${o.personalDetail.last_name}`,
        o.personalDetail.email,
        o.personalDetail.phone_number,
        eventsById.get(o.event)?.title ?? "",
        o.orderItems.map((i) => i.ticketCategory.type).join("; "),
        o.totalOrderTicket,
        o.totalPay,
        new Date(o.date).toLocaleString(),
        o.checkIn?.status ? "Yes" : "No",
      ])
    )
  }

  if (organizerError) {
    return <DataError message="Couldn't load your organizer profile." onRetry={() => refetchOrganizer()} />
  }
  if (eventsError) {
    return <DataError message="Couldn't load your events." onRetry={() => refetchEvents()} />
  }
  if (ordersError) {
    return <DataError message="Couldn't load attendees." onRetry={refetchOrders} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendees</h1>
        <p className="text-sm text-muted-foreground">Everyone who has booked a ticket, across all your events</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="pl-9"
          />
        </div>

        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All events</SelectItem>
            {events.map((event) => (
              <SelectItem key={event._id} value={event._id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Attendee</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Ticket type</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Purchase date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    Loading attendees…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    {orders.length === 0 ? "No paid orders yet." : "No attendees match your filters."}
                  </td>
                </tr>
              )}
              {filtered.map((order) => (
                <AttendeeRow
                  key={order._id}
                  order={order}
                  eventTitle={eventsById.get(order.event)?.title ?? "—"}
                  onView={() => openDetails(order)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AttendeeDetailModal
        order={selectedOrder}
        eventId={selectedOrder?.event ?? ""}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
