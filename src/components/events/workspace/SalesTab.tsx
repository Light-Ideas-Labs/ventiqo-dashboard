"use client"

import { useMemo, useState } from "react"
import { Search, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useOrdersByEvent } from "@/state/ordersAPI"
import { downloadCsv } from "@/lib/csv-export"
import { ticketBreakdown } from "@/lib/event-stats"
import DataError from "@/components/shared/DataError"
import type { EventData } from "@/types/event"

export default function SalesTab({ event }: { event: EventData }) {
  const { data, isLoading, isError, refetch } = useOrdersByEvent(event._id)
  const orders = useMemo(() => data?.data ?? [], [data])
  const [search, setSearch] = useState("")

  const breakdown = ticketBreakdown(event).sort((a, b) => b.revenue - a.revenue)
  const totalRevenue = breakdown.reduce((sum, row) => sum + row.revenue, 0)

  const filtered = orders.filter((order) => {
    if (!search) return true
    const q = search.toLowerCase()
    const haystack =
      `${order.orderNumber} ${order.personalDetail.first_name} ${order.personalDetail.last_name} ${order.personalDetail.email}`.toLowerCase()
    return haystack.includes(q)
  })

  const exportCsv = () => {
    downloadCsv(
      `sales-${event._id}.csv`,
      ["Order #", "Attendee", "Ticket type", "Quantity", "Amount", "Date", "Status"],
      filtered.map((o) => [
        o.orderNumber,
        `${o.personalDetail.first_name} ${o.personalDetail.last_name}`,
        o.orderItems.map((i) => i.ticketCategory.type).join("; "),
        o.totalOrderTicket,
        o.totalPay,
        new Date(o.date).toLocaleString(),
        o.status,
      ])
    )
  }

  if (isError) {
    return <DataError message="Couldn't load sales for this event." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <h2 className="text-2xl font-semibold">KES {totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Orders</p>
          <h2 className="text-2xl font-semibold">{orders.length.toLocaleString()}</h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <h2 className="text-2xl font-semibold">
            KES {orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}
          </h2>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 font-semibold">Revenue by Ticket Type</h3>
        {breakdown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No ticket categories yet.</p>
        ) : (
          <div className="space-y-3">
            {breakdown.map((row) => (
              <div key={row.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{row.name}</span>
                  <span className="text-muted-foreground">
                    KES {row.revenue.toLocaleString()} ({row.sharePct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${row.sharePct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold">Order History</h3>
            <p className="text-sm text-muted-foreground">Every paid order for this event.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders…"
                className="w-56 pl-9"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
              <Download className="size-4" />
              Export CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Order #</th>
                <th className="px-5 py-3 font-medium">Attendee</th>
                <th className="px-5 py-3 font-medium">Ticket type</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    Loading sales…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                    {orders.length === 0 ? "No orders yet for this event." : "No orders match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((order) => (
                <tr key={order._id} className="border-t border-border">
                  <td className="px-5 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    {order.personalDetail.first_name} {order.personalDetail.last_name}
                    <p className="text-xs text-muted-foreground">{order.personalDetail.email}</p>
                  </td>
                  <td className="px-5 py-3">{order.orderItems.map((i) => i.ticketCategory.type).join(", ")}</td>
                  <td className="px-5 py-3">KES {order.totalPay.toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-semantic-success-bg px-2 py-0.5 text-xs font-medium text-semantic-success-text">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
