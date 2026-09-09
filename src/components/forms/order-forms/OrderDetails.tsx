import React, { useState } from "react";
import PaymentMethodForm from "../payments-forms/payment-methods-form"; // Make sure to import your PaymentMethodForm component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type OrderDetailsProps = {
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerName: string;
  address: string;
  email: string;
  phone: string;
  onClose: () => void;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  orderDate,
  items,
  subtotal,
  shipping,
  tax,
  total,
  customerName,
  address,
  email,
  phone,
  onClose,
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentFormToggle = () => {
    setShowPaymentForm(!showPaymentForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* Order Details Card */}
      <Card className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-lg">
        <CardHeader>
          <CardTitle>Order {orderId}</CardTitle>
          <CardDescription>Date: {orderDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-md font-semibold">Order Details</h3>
          <div className="mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mb-4 border-t pt-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-md font-semibold">Shipping Information</h3>
            <p>{customerName}</p>
            <p>{address}</p>
            <h3 className="text-md font-semibold mt-2">Customer Information</h3>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePaymentFormToggle}>
            {showPaymentForm ? "Hide Payment Form" : "Proceed to Payment"}
          </Button>
        </CardFooter>
      </Card>

      {/* Payment Method Form */}
      {showPaymentForm && <PaymentMethodForm event={{ id: orderId, title: 'Order Payment', date: orderDate, time: '', location: '', price: total.toFixed(2), coordinates: [0, 0], image: '' }} onClose={handlePaymentFormToggle} />}
    </div>
  );
};

export default OrderDetails;
