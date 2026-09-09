"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreatePromoCode } from "@/state/promosAPI"
import type { Event } from "@/state/eventsAPI"

export default function CreatePromoCodeDialog({
  organizerId,
  events,
  open,
  onOpenChange,
}: {
  organizerId: string
  events: Event[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const createPromoCode = useCreatePromoCode(organizerId)
  const [name, setName] = useState("")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [creditAmount, setCreditAmount] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [usageLimit, setUsageLimit] = useState("100")

  const reset = () => {
    setName("")
    setDiscountType("percentage")
    setCreditAmount("")
    setSelectedEvent("all")
    setStartDate("")
    setEndDate("")
    setUsageLimit("100")
  }

  const handleCreate = async () => {
    if (!name || !creditAmount || !startDate || !endDate) {
      toast.error("Code, discount amount, and both dates are required.")
      return
    }

    try {
      await createPromoCode.mutateAsync({
        name: name.toUpperCase(),
        organizerId,
        discountType,
        creditAmount: Number(creditAmount),
        startDate,
        endDate,
        usageLimit: Number(usageLimit) || 1,
        ...(selectedEvent !== "all" ? { selectedEvent } : {}),
      })
      toast.success(`Discount code '${name.toUpperCase()}' created`)
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error("Couldn't create discount code", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Discount Code</DialogTitle>
          <DialogDescription>Give attendees a percentage or fixed discount at checkout.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="promo-name">Code</Label>
            <Input
              id="promo-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. EARLYBIRD20"
              className="uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Discount type</Label>
              <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed amount (KES)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo-amount">{discountType === "percentage" ? "Percent off" : "Amount off (KES)"}</Label>
              <Input
                id="promo-amount"
                type="number"
                min={0}
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Applies to</Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full">
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="promo-start">Start date</Label>
              <Input id="promo-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo-end">End date</Label>
              <Input id="promo-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="promo-limit">Usage limit</Label>
            <Input
              id="promo-limit"
              type="number"
              min={1}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createPromoCode.isPending}>
            {createPromoCode.isPending ? "Creating…" : "Create Code"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
