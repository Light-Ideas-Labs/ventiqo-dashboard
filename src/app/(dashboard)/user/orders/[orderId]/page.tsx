"use client";

import { useEffect, useState } from "react";
import { fetchOrderById } from "@/state/ordersAPI";
import { useParams } from "next/navigation"; // Adjust this import based on your Next.js version
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PaymentMethodForm from "@/components/forms/payments-forms/payment-methods-form"


export default function OrderDetail() {
  const { orderId } = useParams(); // Assuming you're using Next.js 13 dynamic routes
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      // Ensure orderId is a string
      const id = Array.isArray(orderId) ? orderId[0] : orderId;

      const orderData = await fetchOrderById(id);
      setOrder(orderData);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  const handlePaymentFormToggle = () => {
    setShowPaymentForm(!showPaymentForm);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
        <CardDescription>Order Number: {order.orderNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Customer Details</h3>
            <p>{`${order.personalDetail.first_name} ${order.personalDetail.last_name}`}</p>
            <p>{order.personalDetail.email}</p>
            <p>{order.personalDetail.phone_number}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Event Details</h3>
            <p>Event: {order.eventHistory.title}</p>
            <p>Date: {new Date(order.eventHistory.date).toLocaleDateString()}</p>
            <p>Venue: {order.eventHistory.venueName}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Order Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Ticket Type</TableCell>
                  <TableCell>Total Tickets</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.ticketCategory.type}</TableCell>
                    <TableCell>{item.totalTicket}</TableCell>
                    <TableCell>${item.ticketCategory.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-medium">Order Summary</h3>
            <p>Status: <Badge variant={order.status === "Fulfilled" ? "secondary" : "outline"}>{order.status}</Badge></p>
            <p>Total Amount: ${order.totalPay.toFixed(2)}</p>
          </div>
          <Button onClick={handlePaymentFormToggle}>
              {showPaymentForm ? "Close Payment" : "Proceed to Payment"}
            </Button>
        </div>
      </CardContent>
    </Card>
    {showPaymentForm && (
        <PaymentMethodForm
          event={{
            id: order._id,
            title: order.eventHistory.title,
            date: new Date(order.eventHistory.date).toLocaleDateString(),
            time: order.eventHistory.time, // Assuming you have time info
            location: order.eventHistory.venueName,
            price: order.totalPay.toFixed(2),
            coordinates: [0, 0], // Placeholder if no coordinates available
            image: "", // Add image URL if available
          }}
          onClose={handlePaymentFormToggle}
        />
      )}
    </>
  );
}
