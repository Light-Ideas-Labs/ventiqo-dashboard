import { CalendarDays } from "lucide-react"

const stats = [
  { label: "All Schedules", value: "15" },
  { label: "Event", value: "4" },
  { label: "Meeting", value: "5" },
  { label: "Setup", value: "3" },
]

export default function CalendarStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {stats.map((s, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border bg-card flex justify-between"
        >
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <h2 className="text-lg font-semibold">{s.value}</h2>
          </div>

          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
        </div>
      ))}

    </div>
  )
}