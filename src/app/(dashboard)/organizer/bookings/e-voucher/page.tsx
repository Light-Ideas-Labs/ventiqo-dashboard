"use client"

import VoucherCard from "@/components/voucher/VoucherCard"
import EventSchedule from "@/components/voucher/EventSchedule"
import VenueMap from "@/components/voucher/VenueMap"
import Terms from "@/components/voucher/Terms"
import ProhibitedItems from "@/components/voucher/ProhibitedItems"

export default function EVoucherPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">E-Voucher</h1>
        <p className="text-sm text-muted-foreground">
          Ticket details and entry pass
        </p>
      </div>

      {/* TICKET */}
      <VoucherCard />

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2 space-y-6">
          <EventSchedule />
          <Terms />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <VenueMap />
          <ProhibitedItems />
        </div>

      </div>

    </div>
  )
}