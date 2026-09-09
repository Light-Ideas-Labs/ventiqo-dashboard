"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrder } from "@/state/ordersAPI"; // Import the createOrder function

type Ticket = {
  name: string;
  price: number;
};

type OrderFormProps = {
  eventId: string;
  tickets: Ticket[];
  onClose: () => void; // Function to close the popup
};

const OrderFormPopup: React.FC<OrderFormProps> = ({ eventId, tickets, onClose }) => {
  const [ticketType, setTicketType] = useState<string>(tickets[0]?.name || "");
  const [totalTickets, setTotalTickets] = useState<number>(1);
  const { data: session } = useSession();
  const router = useRouter(); // Move useRouter out of any condition

  useEffect(() => {
    console.log("Session data:", session); // Inspect the session data to verify if phone_number exists
  }, [session]);

  const handleOrder = async () => {
    const phone_number = session?.user?.phone_number;
    console.log(
      "Ordering tickets for event:",
      eventId,
      "with ticket type:",
      ticketType,
      "and total tickets:",
      totalTickets,
      phone_number
    )

    if (!phone_number) {
      toast.error("Phone Number Missing", {
        description: "Your phone number is not found. Please update your profile.",
      });
      return;
    }



    const orderData = {
      eventId,
      ticketType,
      totalTickets,
      phone_number,
    };



    try {
      const result = await createOrder(orderData); // Use the createOrder function

      toast.success("Order Success", {
        description: result.message,
      });

      // Redirect to the order page
      router.push(`/user/orders/${result.order._id}`);
    } catch (error) {
      toast.error("Order Failed", {
        description: error instanceof Error ? error.message : "There was an error processing your order.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>

      {/* Popup Content */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-96">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Order Tickets</h2>
        <div className="mb-4">
          <label className="block mb-2">Select Ticket Type:</label>
          <select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {tickets.map((ticket) => (
              <option key={ticket.name} value={ticket.name}>
                {ticket.name} - ${ticket.price}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Total Tickets:</label>
          <Input
            type="number"
            value={totalTickets}
            onChange={(e) => setTotalTickets(Number(e.target.value))}
            min={1}
            className="w-full"
          />
        </div>
        <Button onClick={handleOrder} className="bg-orange-500 text-white w-full">
          Order Now
        </Button>
      </div>
    </div>
  );
};

export default OrderFormPopup;
