export default function ScheduleDetails() {
  return (
    <div className="p-5 rounded-2xl border bg-card space-y-4">

      <h3 className="font-medium">Schedule Details</h3>

      {/* IMAGE */}
      <div className="h-40 rounded-xl bg-muted" />

      {/* TITLE */}
      <div>
        <h4 className="font-semibold">
          Echo Beats Festival Main Performance
        </h4>
        <p className="text-xs text-muted-foreground">Event</p>
      </div>

      {/* DETAILS */}
      <div className="text-sm space-y-2">

        <p>📅 May 24, 2029 — 7:00 PM</p>
        <p>📍 Los Angeles, CA</p>

      </div>

      {/* PIC */}
      <div className="p-3 border rounded-xl text-sm">
        <p className="font-medium">Michael Taylor</p>
        <p className="text-xs text-muted-foreground">
          Event Coordinator
        </p>
      </div>

      {/* TEAM */}
      <div>
        <p className="text-sm mb-1">Team</p>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-muted" />
          <div className="w-6 h-6 rounded-full bg-muted" />
          <div className="w-6 h-6 rounded-full bg-muted" />
        </div>
      </div>

      {/* NOTE */}
      <div className="text-xs text-muted-foreground">
        This is the headline performance of the Echo Beats Festival.
      </div>

    </div>
  )
}