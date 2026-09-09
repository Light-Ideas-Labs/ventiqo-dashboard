export default function EventSchedule() {
  const items = [
    { time: "10:00 AM", title: "Gate Opens" },
    { time: "11:00 AM", title: "Pre-Show" },
    { time: "12:00 PM", title: "Opening Ceremony" },
  ]

  return (
    <div className="p-5 rounded-2xl border bg-card space-y-3">

      <h3 className="font-medium">Event Schedule</h3>

      {items.map((item, i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-muted flex justify-between text-sm"
        >
          <span>{item.time}</span>
          <span>{item.title}</span>
        </div>
      ))}

    </div>
  )
}