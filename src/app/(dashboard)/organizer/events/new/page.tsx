"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Info, MapPin, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DataError from "@/components/shared/DataError"
import CoverImageUpload from "@/components/shared/CoverImageUpload"

import { useMyOrganizer } from "@/state/organizersAPI"
import { useCreateEvent, useAddTicketsToEvent } from "@/state/eventsAPI"

interface EventFormState {
  title: string
  date: string
  time: string
  locationType: "in-person" | "virtual"
  venueName: string
  platform: string
  coverImage: string
  description: string
  currency: string
  price: string
  isFree: boolean
  ticketCount: number
}

const INITIAL_STATE: EventFormState = {
  title: "",
  date: "",
  time: "",
  locationType: "in-person",
  venueName: "",
  platform: "Zoom",
  coverImage: "",
  description: "",
  currency: "KES",
  price: "",
  isFree: false,
  ticketCount: 100,
}

export default function CreateEventPage() {
  const router = useRouter()
  const { data: organizerData, isError: organizerError, refetch: refetchOrganizer } = useMyOrganizer()
  const organizer = organizerData?.data

  const [event, setEvent] = useState<EventFormState>(INITIAL_STATE)
  const [savingStatus, setSavingStatus] = useState<"Draft" | "Active" | null>(null)

  const createEventMutation = useCreateEvent()
  const addTicketsMutation = useAddTicketsToEvent()
  const isSaving = createEventMutation.isPending || addTicketsMutation.isPending

  const handleSubmit = async (status: "Draft" | "Active") => {
    if (!event.title || !event.date || !event.time) {
      toast.error("Missing required fields", {
        description: "Event name, date, and time are required.",
      })
      return
    }
    if (event.locationType === "in-person" && !event.venueName) {
      toast.error("Venue name is required for in-person events.")
      return
    }

    setSavingStatus(status)
    try {
      const res = await createEventMutation.mutateAsync({
        title: event.title,
        date: event.date,
        startTime: event.time,
        endTime: event.time,
        timeZone: "Africa/Nairobi",
        aboutEvent: event.description,
        tagline: "",
        keypoint: "",
        venueName: event.locationType === "in-person" ? event.venueName : event.platform,
        categoryName: organizer?.category?.split(",")[0]?.trim() ?? "",
        subcategoryName: "",
        status,
        currentBookings: 0,
        promoCode: "",
        discount: 0,
        featured: false,
        registrationRequired: true,
        subCounty: "",
        county: organizer?.organizer_city ?? "",
        country: "Kenya",
        events_image: event.coverImage,
      })

      const newEventId = res?.data?._id ?? res?._id

      if (newEventId && (event.isFree || event.price)) {
        await addTicketsMutation.mutateAsync({
          eventId: newEventId,
          tickets: [
            {
              name: "General Admission",
              description: event.description,
              price: event.isFree ? 0 : Number(event.price) || 0,
              quantity: event.ticketCount,
              stock: event.ticketCount,
              ticketType: "General Admission",
              salesStartDate: new Date().toISOString(),
              salesEndDate: event.date,
            },
          ],
        })
      }

      toast.success(status === "Draft" ? "Saved as draft" : "Event created", {
        description: event.title,
      })
      router.push(newEventId ? `/organizer/events/${newEventId}` : "/organizer/events")
    } catch (error) {
      toast.error("Couldn't create your event", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setSavingStatus(null)
    }
  }

  if (organizerError) {
    return <DataError message="Couldn't load your organizer profile." onRetry={() => refetchOrganizer()} />
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/organizer/events"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Events
        </Link>
        <h1 className="text-2xl font-semibold">Create Event</h1>
        <p className="text-sm text-muted-foreground">Don&apos;t worry, you can edit this later</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Event Name (Required)</label>
              <Input
                value={event.title}
                onChange={(e) => setEvent((p) => ({ ...p, title: e.target.value }))}
                placeholder="Summer Music Festival"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Date &amp; Time (Required)</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={event.date}
                  onChange={(e) => setEvent((p) => ({ ...p, date: e.target.value }))}
                />
                <Input
                  type="time"
                  value={event.time}
                  onChange={(e) => setEvent((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Location (Required)</label>
              <RadioGroup
                value={event.locationType}
                onValueChange={(v) => setEvent((p) => ({ ...p, locationType: v as "in-person" | "virtual" }))}
                className="grid grid-cols-2 gap-3"
              >
                <label
                  className={
                    "flex cursor-pointer flex-col gap-2 rounded-lg border p-3 " +
                    (event.locationType === "in-person" ? "border-primary bg-primary/5" : "border-input")
                  }
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <RadioGroupItem value="in-person" /> <MapPin className="size-4" /> In-person
                  </span>
                  <Input
                    value={event.venueName}
                    onChange={(e) => setEvent((p) => ({ ...p, venueName: e.target.value }))}
                    placeholder="Venue name"
                    disabled={event.locationType !== "in-person"}
                  />
                </label>
                <label
                  className={
                    "flex cursor-pointer flex-col gap-2 rounded-lg border p-3 " +
                    (event.locationType === "virtual" ? "border-primary bg-primary/5" : "border-input")
                  }
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <RadioGroupItem value="virtual" /> <Video className="size-4" /> Virtual
                  </span>
                  <Select
                    value={event.platform}
                    onValueChange={(v) => setEvent((p) => ({ ...p, platform: v }))}
                  >
                    <SelectTrigger className="w-full" disabled={event.locationType !== "virtual"}>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                      <SelectItem value="Google Meet">Google Meet</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Cover Image (Required)</label>
              <CoverImageUpload
                value={event.coverImage}
                onChange={(url) => setEvent((p) => ({ ...p, coverImage: url }))}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium">Short description (Required)</label>
                <span className="text-xs text-muted-foreground">{event.description.length} / 200</span>
              </div>
              <Textarea
                value={event.description}
                maxLength={200}
                onChange={(e) => setEvent((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your event in a few exciting words..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Ticket Price (Required)</label>
                <div className="flex gap-2">
                  <Select value={event.currency} onValueChange={(v) => setEvent((p) => ({ ...p, currency: v }))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    value={event.price}
                    disabled={event.isFree}
                    onChange={(e) => setEvent((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={event.isFree}
                    onCheckedChange={(checked) => setEvent((p) => ({ ...p, isFree: checked }))}
                  />
                  Free Event
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Tickets available (Required)</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEvent((p) => ({ ...p, ticketCount: Math.max(1, p.ticketCount - 1) }))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    className="text-center"
                    value={event.ticketCount}
                    onChange={(e) => setEvent((p) => ({ ...p, ticketCount: Number(e.target.value) || 1 }))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEvent((p) => ({ ...p, ticketCount: p.ticketCount + 1 }))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 rounded-lg border border-semantic-warning-bg-strong bg-semantic-warning-bg p-3 text-xs text-semantic-warning-text">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>You can add more ticket types, detailed descriptions and photos after setup.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" asChild>
            <Link href="/organizer/events">Cancel</Link>
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline" disabled={isSaving} onClick={() => handleSubmit("Draft")}>
              {savingStatus === "Draft" ? "Saving..." : "Save as Draft"}
            </Button>
            <Button type="button" disabled={isSaving} onClick={() => handleSubmit("Active")}>
              {savingStatus === "Active" ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
