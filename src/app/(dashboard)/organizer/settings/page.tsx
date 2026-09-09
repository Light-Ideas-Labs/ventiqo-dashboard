"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Bell, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import CoverImageUpload from "@/components/shared/CoverImageUpload"
import { useMyOrganizer, useUpdateOrganizer, type Organizer } from "@/state/organizersAPI"
import { useCategories } from "@/state/categoriesAPI"
import DataError from "@/components/shared/DataError"

interface ProfileFormState {
  organizerName: string
  logo: string
  description: string
  categories: string[]
  city: string
  website: string
  instagram: string
  facebook: string
}

function buildFormState(organizer: Organizer): ProfileFormState {
  return {
    organizerName: organizer.organizer_name ?? "",
    logo: organizer.organizer_logo ?? "",
    description: organizer.description ?? "",
    categories: organizer.category
      ? String(organizer.category).split(",").map((c: string) => c.trim()).filter(Boolean)
      : [],
    city: organizer.organizer_city ?? organizer.organizer_address ?? "",
    website: organizer.website ?? "",
    instagram: organizer.socialMedia?.instagram ?? "",
    facebook: organizer.socialMedia?.facebook ?? "",
  }
}

function OrganizationProfileForm({ organizer }: { organizer: Organizer }) {
  const { data: categories } = useCategories()
  const updateOrganizer = useUpdateOrganizer()
  const [form, setForm] = useState<ProfileFormState>(() => buildFormState(organizer))

  const toggleCategory = (category: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSave = async () => {
    try {
      await updateOrganizer.mutateAsync({
        organizerId: organizer._id,
        payload: {
          organizer_name: form.organizerName,
          organizer_logo: form.logo,
          description: form.description,
          category: form.categories.join(", "),
          organizer_city: form.city,
          website: form.website,
          socialMedia: { instagram: form.instagram, facebook: form.facebook },
        },
      })
      toast.success("Organization profile updated")
    } catch (error) {
      toast.error("Couldn't save changes", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <h3 className="font-semibold">Organization Profile</h3>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Organizer / Company Name</label>
            <Input
              value={form.organizerName}
              onChange={(e) => setForm((f) => ({ ...f, organizerName: e.target.value }))}
              placeholder="e.g. Nairobi Events Co."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea
              value={form.description}
              maxLength={500}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tell attendees about your events..."
              className="min-h-24"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="Nairobi" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Website</label>
            <Input
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              placeholder="https://yourevents.com"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Logo</label>
            <CoverImageUpload
              value={form.logo}
              onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
              hint="Square image recommended"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Event Categories</label>
            <div className="flex flex-wrap gap-2">
              {(categories ?? []).map((category) => {
                const selected = form.categories.includes(category.name)
                return (
                  <button
                    type="button"
                    key={category._id}
                    onClick={() => toggleCategory(category.name)}
                    className={
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                      (selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-muted-foreground hover:border-primary")
                    }
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-input p-3">
            <label className="mb-2 block text-sm font-medium">Social Media</label>
            <Input
              className="mb-2"
              value={form.instagram}
              onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
              placeholder="Instagram: @yourevents"
            />
            <Input
              value={form.facebook}
              onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))}
              placeholder="Facebook page"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateOrganizer.isPending}>
          {updateOrganizer.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: organizerData, isLoading, isError, refetch } = useMyOrganizer()
  const organizer = organizerData?.data

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Organization profile, team members and account preferences.</p>
      </div>

      {isError && <DataError message="Couldn't load your organizer profile." onRetry={() => refetch()} />}
      {!isError && isLoading && <p className="text-sm text-muted-foreground">Loading your organization profile…</p>}
      {!isError && !isLoading && organizer && <OrganizationProfileForm organizer={organizer} />}

      <div className="space-y-2 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 font-semibold">
          <Users className="size-4 text-muted-foreground" />
          Team Members
        </div>
        <p className="text-sm text-muted-foreground">
          Inviting teammates to help manage your organization isn&apos;t available yet.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 font-semibold">
          <Bell className="size-4 text-muted-foreground" />
          Account Preferences
        </div>
        <p className="text-sm text-muted-foreground">
          Notification and account preferences aren&apos;t available yet. Payout details live under{" "}
          <Link href="/organizer/payments" className="text-primary hover:underline">
            Payment Setup
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
