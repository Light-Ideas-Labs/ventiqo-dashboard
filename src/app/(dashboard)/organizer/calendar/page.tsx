"use client"

import CalendarStats from "@/components/calendar/CalendarStats"
import CalendarGrid from "@/components/calendar/CalendarGrid"
import ScheduleDetails from "@/components/calendar/ScheduleDetails"

export default function CalendarPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Manage your schedules and events
        </p>
      </div>

      {/* STATS */}
      <CalendarStats />

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* CALENDAR */}
        <div className="xl:col-span-3">
          <CalendarGrid />
        </div>

        {/* RIGHT PANEL */}
        <ScheduleDetails />

      </div>

    </div>
  )
}