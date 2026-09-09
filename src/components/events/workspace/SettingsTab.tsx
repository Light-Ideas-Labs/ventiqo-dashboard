"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateEvent } from "@/state/eventsAPI"
import { useCategories } from "@/state/categoriesAPI"
import CoverImageUpload from "@/components/shared/CoverImageUpload"
import type { EventData } from "@/types/event"

const STATUS_OPTIONS = ["Draft", "Published", "Active", "Private", "Completed", "Archived"]

export default function SettingsTab({ event }: { event: EventData }) {
  const { data: categories } = useCategories()
  const updateEvent = useUpdateEvent()

  const [form, setForm] = useState({
    title: event.title,
    about: event.aboutEvent ?? "",
    tagline: event.tagline ?? "",
    venueName: event.venueName ?? "",
    date: event.date ? new Date(event.date).toISOString().slice(0, 10) : "",
    categoryId: event.category?._id ?? "",
    status: event.status,
    image: event.image ?? "",
  })

  const handleSave = async () => {
    try {
      await updateEvent.mutateAsync({
        eventId: event._id,
        eventDetails: {
          title: form.title,
          about: form.about,
          tagline: form.tagline,
          venueName: form.venueName,
          date: form.date,
          categoryId: form.categoryId || undefined,
          status: form.status,
          imageId: form.image || undefined,
        },
      })
      toast.success("Event updated")
    } catch (error) {
      toast.error("Couldn't save changes", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <div className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Event Name</label>
        <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Cover Image</label>
        <CoverImageUpload value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tagline</label>
        <Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <Textarea
          className="min-h-28"
          value={form.about}
          onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Venue</label>
          <Input value={form.venueName} onChange={(e) => setForm((f) => ({ ...f, venueName: e.target.value }))} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Date</label>
          <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateEvent.isPending}>
          {updateEvent.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
