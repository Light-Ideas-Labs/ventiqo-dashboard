"use client"

import StatsCards from "@/components/cards/StatsCards"
import UpcomingEventsRow from "@/components/dashboard/UpcomingEventsRow"
import RecentActivities from "@/components/dashboard/RecentActivities"
import TipsResources from "@/components/dashboard/TipsResources"
import DataError from "@/components/shared/DataError"
import { useMyOrganizer } from "@/state/organizersAPI"
import { useEventsByOrganizer } from "@/state/eventsAPI"

export default function DashboardPage() {
  const { data: organizerData, isLoading: organizerLoading, isError: organizerError, refetch: refetchOrganizer } = useMyOrganizer()
  const organizerId = organizerData?.data?._id

  const {
    data: eventsData,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useEventsByOrganizer(organizerId)
  const events = eventsData?.paginatedEvents?.data ?? []

  const isLoading = organizerLoading || (Boolean(organizerId) && eventsLoading)

  if (organizerError) {
    return <DataError message="Couldn't load your organizer profile." onRetry={() => refetchOrganizer()} />
  }

  if (eventsError) {
    return <DataError message="Couldn't load your events." onRetry={() => refetchEvents()} />
  }

  return (
    <div className="space-y-6">

      {/* AT A GLANCE */}
      <div>
        <h1 className="text-2xl font-semibold">At a Glance</h1>
        <p className="text-sm text-muted-foreground">Key metrics this month</p>
      </div>

      <StatsCards events={events} isLoading={isLoading} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* LEFT */}
        <div className="space-y-6 xl:col-span-2">
          <UpcomingEventsRow events={events} isLoading={isLoading} />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <RecentActivities />
          <TipsResources />
        </div>

      </div>

    </div>
  )
}
