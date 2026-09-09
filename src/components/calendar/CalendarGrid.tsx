"use client"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CalendarGrid() {
  const dates = Array.from({ length: 35 }, (_, i) => i + 1)

  return (
    <div className="p-5 rounded-2xl border bg-card space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">May 2029</h3>

        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full border text-sm">
            Filter
          </button>
          <button className="px-3 py-1 rounded-full border text-sm">
            Month
          </button>
          <button className="px-3 py-1 rounded-full bg-primary text-white text-sm">
            + New Agenda
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 text-xs text-muted-foreground">
        {days.map((d) => (
          <div key={d} className="p-2">{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">

        {dates.map((date) => (
          <div
            key={date}
            className="h-28 border rounded-xl p-2 relative hover:bg-muted transition"
          >
            <span className="text-xs">{date}</span>

            {/* SAMPLE EVENT */}
            {date === 23 && (
              <div className="mt-2 p-1 text-xs rounded-md bg-primary/10 text-primary">
                Echo Beats Festival
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}