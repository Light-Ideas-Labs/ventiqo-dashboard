"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useAddTicketsToEvent } from "@/state/eventsAPI";
import { useDispatch, useSelector } from "react-redux";
import { closeTicketModal } from "@/state/eventEditorReducer";
import { RootState } from "@/state/store";

import { Ticket } from "@/types/event";

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

const EMPTY_TICKET: Ticket = {
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
};

const TicketModal = ({ eventId }: { eventId: string }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.eventEditor.isTicketModalOpen);
  const addTickets = useAddTicketsToEvent();

  const [ticket, setTicket] = useState<Ticket>(EMPTY_TICKET);

  // Reset to a blank ticket each time the sheet opens, instead of carrying
  // over whatever was left in state from the last time it was open.
  useEffect(() => {
    if (isOpen) {
      setTicket(EMPTY_TICKET);
    }
  }, [isOpen]);

  const onClose = () => {
    dispatch(closeTicketModal());
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTicket((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicket((prev) => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const handleSubmit = async () => {
    if (!ticket.name.trim()) {
      toast.error("Ticket name is required");
      return;
    }
    try {
      await addTickets.mutateAsync({ eventId, tickets: [ticket] });
      toast.success("Ticket added successfully");
      onClose();
    } catch (error) {
      console.error("Failed to add ticket:", error);
      toast.error("Failed to add ticket");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Ticket</SheetTitle>
          <SheetDescription>Provide details about your ticket.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Ticket Name</Label>
            <Input id="name" name="name" value={ticket.name} onChange={handleTextChange} placeholder="Enter ticket name" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Ticket Description</Label>
            <Textarea id="description" name="description" value={ticket.description} onChange={handleTextChange} placeholder="Ticket description" className="min-h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="price">Price (KES)</Label>
              <Input id="price" name="price" type="number" min={0} value={ticket.price} onChange={handleNumberChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min={0} value={ticket.quantity} onChange={handleNumberChange} />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="ticketType">Ticket Type</Label>
            <Select value={ticket.ticketType} onValueChange={(value) => setTicket((prev) => ({ ...prev, ticketType: value }))}>
              <SelectTrigger id="ticketType" className="w-full">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="salesStartDate">Sales Start</Label>
              <Input id="salesStartDate" name="salesStartDate" type="datetime-local" value={ticket.salesStartDate} onChange={handleTextChange} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="salesEndDate">Sales End</Label>
              <Input id="salesEndDate" name="salesEndDate" type="datetime-local" value={ticket.salesEndDate} onChange={handleTextChange} />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          <SheetClose asChild>
            <Button variant="outline">Discard</Button>
          </SheetClose>
          <Button onClick={handleSubmit} disabled={addTickets.isPending}>
            {addTickets.isPending ? "Saving…" : "Save Ticket"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TicketModal;
