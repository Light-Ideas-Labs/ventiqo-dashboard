"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import InsightCard from "@/components/insights/InsightCard"
import LocationsBarChart from "@/components/insights/LocationsBarChart"
import InterestsDonut from "@/components/insights/InterestsDonut"
import AgePieChart from "@/components/insights/AgePieChart"

export default function AllInsightsPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-muted/40 p-4 rounded-2xl">

        <h1 className="text-xl font-semibold">
          All Attendee Insights
        </h1>

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

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT CARDS */}
        <div className="space-y-6">

          <InsightCard
            title="Attendee Age"
            value="18 – 24 Years"
            metric="2345"
            trend="+30%"
          />

          <InsightCard
            title="Attendee Gender"
            value="Male"
            metric="3345"
            trend="+18%"
          />

          <InsightCard
            title="Attendee Location"
            value="Colombo"
            metric="845"
            trend="-15%"
          />

          <InsightCard
            title="Attendee Interests"
            value="EDM Music"
            metric="123"
            trend="+63%"
          />

          <InsightCard
            title="Total Engagement"
            value="Facebook Ads"
            metric="21"
            trend="-21%"
          />

        </div>

        {/* RIGHT */}
        <div className="xl:col-span-2 space-y-6">

          <LocationsBarChart />

          <div className="grid md:grid-cols-2 gap-6">
            <InterestsDonut />
            <AgePieChart />
          </div>

        </div>

      </div>

    </div>
  )
}