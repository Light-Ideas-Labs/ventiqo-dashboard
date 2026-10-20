"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataError from "@/components/shared/DataError";
import { useAllOrders } from "@/state/ordersAPI";

const STATUS_BADGE_CLASS: Record<string, string> = {
  Paid: "bg-semantic-success-bg text-semantic-success-text",
  Pending: "bg-semantic-warning-bg text-semantic-warning-text",
  Cancelled: "bg-semantic-error-bg text-semantic-error-text",
};

export default function AdminOrdersTable() {
  const { data, isLoading, isError, refetch } = useAllOrders();
  const orders = data?.data?.order ?? [];

  if (isError) {
    return <DataError message="Couldn't load orders." onRetry={() => refetch()} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Tickets</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                Loading orders…
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                No orders yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium text-foreground">{order.orderNumber}</TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">
                    {order.personalDetail?.first_name} {order.personalDetail?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.personalDetail?.email}</p>
                </TableCell>
                <TableCell>{order.eventHistory?.title ?? "—"}</TableCell>
                <TableCell>{order.totalOrderTicket}</TableCell>
                <TableCell>KES {order.totalPay.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={`border-0 ${STATUS_BADGE_CLASS[order.status] ?? ""}`}>{order.status}</Badge>
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
