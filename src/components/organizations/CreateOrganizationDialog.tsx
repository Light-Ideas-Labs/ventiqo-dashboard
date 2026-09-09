"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateOrganizer } from "@/state/organizersAPI"

const CITIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Other"]

export function CreateOrganizationDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (orgId: string) => void
}) {
  const { data: session } = useSession()
  const [name, setName] = React.useState("")
  const [city, setCity] = React.useState("")
  const createOrganizer = useCreateOrganizer()

  const onCreate = async () => {
    if (!name.trim() || !city) return

    try {
      const res = await createOrganizer.mutateAsync({
        organizer_name: name.trim(),
        organizer_email: session?.user?.email ?? "",
        organizer_phone_number: session?.user?.phone_number ?? "",
        organizer_address: city,
        organizer_country: "Kenya",
        organizer_city: city,
      })

      toast.success(`'${name.trim()}' is ready to go.`)
      setName("")
      setCity("")
      onOpenChange(false)
      onCreated?.(res.data._id)
    } catch (error) {
      toast.error("Couldn't create your organization", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Set up your event organization to start managing events and selling tickets.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <div className="grid gap-5">

          {/* NAME */}
          <div className="grid gap-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ventiqo Events, AfroFest Ltd"
            />
          </div>

          {/* CITY */}
          <div className="grid gap-2">
            <Label htmlFor="org-city">City</Label>
            <select
              id="org-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select city
              </option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* ACTION */}
          <Button
            onClick={onCreate}
            disabled={createOrganizer.isPending || !name.trim() || !city}
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            {createOrganizer.isPending ? "Creating…" : "Create Organization"}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  )
}
