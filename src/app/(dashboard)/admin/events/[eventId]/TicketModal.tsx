"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/cta-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { addTicketsToEvent } from "@/state/eventsAPI";
import { fetchCategories, fetchSubcategories } from "@/state/categoriesAPI";
import CustomModal from "@/components/modals/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { closeTicketModal } from "@/state/eventEditorReducer";
import { RootState } from "@/state/store";

import { Ticket } from "@/types/event";

// Ticket Types Enumeration
const TICKET_TYPES = {
  VIP: "VIP",
  GENERAL_ADMISSION: "General Admission",
  BACKSTAGE_PASS: "Backstage Pass",
  BALCONY: "Balcony",
  BOX: "Box",
  EARLY_BIRD: "Early Bird",
  GROUP: "Group",
  STUDENT: "Student",
  SENIOR: "Senior",
  CHILD: "Child",
  MILITARY: "Military",
  STANDING_ROOM_ONLY: "Standing Room Only",
  LAWN: "Lawn",
  PIT: "Pit",
  SEASON_PASS: "Season Pass",
  FAMILY: "Family",
  DAY_PASS: "Day Pass",
  WEEKEND_PASS: "Weekend Pass",
  PLATINUM: "Platinum",
  GALLERY: "Gallery",
};

// Interface for Subcategory
interface Subcategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: Partial<Category>;
}

// Interface for Category
interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

const TicketModal = ({ eventId }: { eventId: string }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.eventEditor.isTicketModalOpen);

    // 🔹 Ticket state
    const [ticket, setTicket] = useState<Ticket>({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      stock: 0,
      ticketType: TICKET_TYPES.GENERAL_ADMISSION,
      salesStartDate: "",
      salesEndDate: "",
      status: "Pending",
      currentBookings: 0, 
      _id: undefined, 
      createdAt: undefined, 
      updatedAt: undefined, 
    });


    // 🔹 Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTicket({ ...ticket, [e.target.name]: e.target.value });
    };


    // 🔹 Handle API Call
    const handleSubmit = async () => {
      try {
      const formattedTicket: Ticket = {
        ...ticket,
        status: ticket.status ?? "Pending",
      };
      const requestBody: Ticket[] = [formattedTicket]; // Ensure it's an array of Ticket objects
      await addTicketsToEvent(eventId, requestBody);
        alert("Ticket added successfully!");
        onClose();
      } catch (error) {
        console.error("Failed to add ticket:", error);
        alert("Error adding ticket.");
      }
    };






  const onClose = () => {
    dispatch(closeTicketModal());
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <main className="ticket-modal__form p-4 sm:px-6 sm:py-0">
        <div className="mx-auto grid w-full gap-4">
          {/* Modal Header */}
          <div className="ticket-modal__header flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={onClose}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="ticket-modal__title flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add Ticket(s)
            </h1>
          </div>

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>Provide details about your ticket.</CardDescription>
            </CardHeader>
            <CardContent className="ticket-modal__fields">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="ticket-modal__label" htmlFor="name">Ticket Name</Label>
                  <Input id="name" name="title" value={ticket.name} onChange={handleChange} placeholder="Enter ticket name" />
                </div>
                <div className="grid gap-3">
                  <Label className="ticket-modal__label" htmlFor="description">Ticket Description</Label>
                  <Textarea id="description" name="aboutEvent" value={ticket.description} onChange={handleChange} placeholder="Ticket description" className="ticket-modal__preview min-h-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="ticket-modal__fields">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="ticket-modal__label" htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" value={ticket.price} placeholder="Enter ticket price" onChange={handleChange} />
                </div>
                <div className="grid gap-3">
                  <Label className="ticket-modal__label" htmlFor="discount">Discount</Label>
                  <Input id="discount" name="discount" type="number" value={ticket.quantity}  placeholder="Enter discount" onChange={handleChange} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" value={ticket.stock} placeholder="Enter stock" onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Sales Timing */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Timing</CardTitle>
            </CardHeader>
            <CardContent className="ticket-modal__fields">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label className="ticket-modal__label" htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" name="startTime" type="datetime-local" value={ticket.salesStartDate} onChange={handleChange} />
                </div>
                <div className="grid gap-3">
                  <Label className="ticket-modal__label" htmlFor="endTime">End Time</Label>
                  <Input id="endTime" name="endTime" type="datetime-local" value={ticket.salesEndDate} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Type</CardTitle>
            </CardHeader>
            <CardContent className="ticket-modal__fields">
                  <Label htmlFor="ticketType">Select Ticket Type</Label>
                  <Select onValueChange={(value) => setTicket({ ...ticket, ticketType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent>
                    {Object.entries(TICKET_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                    </SelectContent>
                  </Select>
            </CardContent>
          </Card>

          {/* Save & Discard Buttons */}
          <div className="ticket-modal__actions flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Discard</Button>
            <Button size="sm" className="bg-yellow-500 px-6 py-2 text-white transition hover:bg-yellow-500">
              Save Ticket
            </Button>
          </div>
        </div>
      </main>
    </CustomModal>
  );
};

export default TicketModal;
