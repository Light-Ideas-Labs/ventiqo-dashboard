"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataError from "@/components/shared/DataError";
import { useMyOrders } from "@/state/ordersAPI";

const STATUS_BADGE_CLASS: Record<string, string> = {
  Paid: "bg-semantic-success-bg text-semantic-success-text",
  Pending: "bg-semantic-warning-bg text-semantic-warning-text",
  Cancelled: "bg-semantic-error-bg text-semantic-error-text",
};

export function UserOrdersTable() {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const orders = data?.data?.data ?? [];

  if (isError) {
    return <DataError message="Couldn't load your orders." onRetry={() => refetch()} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Tickets</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                Loading your orders…
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                You haven&apos;t ordered any tickets yet.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Link href={`/user/orders/${order._id}`} className="font-medium text-foreground hover:underline">
                    {order.orderNumber}
                  </Link>
                </TableCell>
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
