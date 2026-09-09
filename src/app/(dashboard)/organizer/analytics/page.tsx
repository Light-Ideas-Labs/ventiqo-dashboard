"use client"

import RevenueChart from "@/components/charts/RevenueChart"
import TicketSalesChart from "@/components/charts/TicketSalesChart"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">

      <h1 className="text-xl font-semibold">All Attendee Insights</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT CARDS */}
        <div className="space-y-4">

          <div className="p-4 border rounded-xl">
            <p>Attendee Age</p>
            <h2 className="text-xl font-semibold">18–24 Years</h2>
          </div>

          <div className="p-4 border rounded-xl">
            <p>Gender</p>
            <h2 className="text-xl font-semibold">Male</h2>
          </div>

        </div>

        {/* MAIN CHART */}
        <div className="col-span-2 p-4 border rounded-xl">
          <RevenueChart />
        </div>

      </div>

    </div>
  )
}