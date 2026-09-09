"use client"

import BookingsStats from "@/components/bookings/BookingsStats"
import BookingsChart from "@/components/bookings/BookingsChart"
import BookingsCategory from "@/components/bookings/BookingsCategory"
import BookingsTable from "@/components/bookings/BookingsTable"

export default function BookingsPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage and analyze your bookings
        </p>
      </div>

      {/* STATS */}
      <BookingsStats />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2">
          <BookingsChart />
        </div>

        {/* RIGHT */}
        <BookingsCategory />

      </div>

      {/* TABLE */}
      <BookingsTable />

    </div>
  )
}