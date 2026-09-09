"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/insights/StatCard"
import AgeChart from "@/components/insights/AgeChart"
import LocationChart from "@/components/insights/LocationChart"
import InterestsChart from "@/components/insights/InterestsChart"
import EngagementCard from "@/components/insights/EngagementCard"
import LocationTable from "@/components/insights/LocationTable"

export default function AttendeeInsightsPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            Attendee Insights – PRAUDA THE 2ND EDITION
          </h1>

          <div className="text-sm text-muted-foreground mt-1">
            • Venue: Museum Auditorium <br />
            • Date: 2025-07-12 <br />
            • Time: 19:00
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input placeholder="Search..." className="w-[250px]" />

          <Button variant="outline">
            Attendees: 7523
          </Button>

          <Button variant="outline">
            Filter
          </Button>
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">

          <AgeChart />

          <div className="grid md:grid-cols-2 gap-6">
            <InterestsChart />
            <LocationChart />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <EngagementCard />
          <LocationTable />

        </div>

      </div>

    </div>
  )
}