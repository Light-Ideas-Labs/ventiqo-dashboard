"use client"

import { Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useEvent } from "@/state/eventsAPI"
import ComingSoon from "@/components/shared/ComingSoon"
import { Megaphone, ScanLine } from "lucide-react"
import EventWorkspaceHeader from "@/components/events/workspace/EventWorkspaceHeader"
import OverviewTab from "@/components/events/workspace/OverviewTab"
import SettingsTab from "@/components/events/workspace/SettingsTab"
import AttendeesTab from "@/components/events/workspace/AttendeesTab"
import SalesTab from "@/components/events/workspace/SalesTab"

const TABS = ["overview", "attendees", "sales", "marketing", "checkin", "settings"] as const
type TabValue = (typeof TABS)[number]

function EventWorkspaceContent() {
  const params = useParams<{ eventId: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const eventId = params.eventId
  const tabParam = searchParams.get("tab")
  const activeTab: TabValue = TABS.includes(tabParam as TabValue) ? (tabParam as TabValue) : "overview"

  const { data, isLoading, isError } = useEvent(eventId)
  const event = data?.data

  const setTab = (tab: string) => {
    router.push(`/organizer/events/${eventId}?tab=${tab}`, { scroll: false })
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading event…</p>
  }

  if (isError || !event) {
    return (
      <ComingSoon
        title="Event not found"
        description="This event may have been deleted, or the link is incorrect."
      />
    )
  }

  return (
    <div className="space-y-6">
      <EventWorkspaceHeader event={event} onEditClick={() => setTab("settings")} />

      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="checkin">Check-in</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab event={event} onEditClick={() => setTab("settings")} onTabChange={setTab} />
        </TabsContent>

        <TabsContent value="attendees">
          <AttendeesTab eventId={eventId} />
        </TabsContent>

        <TabsContent value="sales">
          <SalesTab event={event} />
        </TabsContent>

        <TabsContent value="marketing">
          <ComingSoon
            title="Marketing"
            description="Discount codes and promotional pushes for this event."
            icon={Megaphone}
            phase="Phase 8"
          />
        </TabsContent>

        <TabsContent value="checkin">
          <ComingSoon
            title="Check-in"
            description="A door-side QR scanner is coming — for now, check attendees in from the Attendees tab."
            icon={ScanLine}
            phase="a later phase"
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab event={event} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function EventWorkspacePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading event…</p>}>
      <EventWorkspaceContent />
    </Suspense>
  )
}
