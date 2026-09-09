"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useAddTicketsToEvent } from "@/state/eventsAPI"

interface TicketFormState {
  name: string
  description: string
  price: string
  quantity: number
  isFree: boolean
  salesStartDate: string
  salesEndDate: string
}

const INITIAL_STATE: TicketFormState = {
  name: "",
  description: "",
  price: "",
  quantity: 100,
  isFree: false,
  salesStartDate: new Date().toISOString().slice(0, 10),
  salesEndDate: "",
}

export default function AddTicketDialog({ eventId, eventDate }: { eventId: string; eventDate: string }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TicketFormState>(INITIAL_STATE)
  const addTickets = useAddTicketsToEvent()

  const handleSubmit = async () => {
    if (!form.name || !form.quantity || (!form.isFree && !form.price)) {
      toast.error("Missing required fields", {
        description: "Ticket name, quantity, and price (or mark as free) are required.",
      })
      return
    }

    try {
      await addTickets.mutateAsync({
        eventId,
        tickets: [
          {
            name: form.name,
            description: form.description,
            price: form.isFree ? 0 : Number(form.price) || 0,
            quantity: form.quantity,
            stock: form.quantity,
            ticketType: form.name,
            salesStartDate: new Date(form.salesStartDate).toISOString(),
            salesEndDate: form.salesEndDate ? new Date(form.salesEndDate).toISOString() : eventDate,
          },
        ],
      })
      toast.success("Ticket type added")
      setForm(INITIAL_STATE)
      setOpen(false)
    } catch (error) {
      toast.error("Couldn't add ticket type", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-1.5 size-4" />
          Add Ticket Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add Ticket Type</DialogTitle>
          <DialogDescription>Create a new ticket category for this event.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Ticket Name (Required)</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VIP, General Admission..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What's included with this ticket..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Price (KES)</label>
              <Input
                type="number"
                min={0}
                value={form.price}
                disabled={form.isFree}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox
                  checked={form.isFree}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, isFree: checked }))}
                />
                Free
              </label>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Quantity (Required)</label>
              <Input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Sales Start</label>
              <Input
                type="date"
                value={form.salesStartDate}
                onChange={(e) => setForm((f) => ({ ...f, salesStartDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sales End</label>
              <Input
                type="date"
                value={form.salesEndDate}
                onChange={(e) => setForm((f) => ({ ...f, salesEndDate: e.target.value }))}
                placeholder="Defaults to event date"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={addTickets.isPending}>
            {addTickets.isPending ? "Adding…" : "Add Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
