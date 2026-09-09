export default function VenueMap() {
  return (
    <div className="p-5 rounded-2xl border bg-card space-y-3">

      <h3 className="font-medium">Venue Map</h3>

      <div className="h-40 rounded-xl bg-muted" />

      {/* LEGEND */}
      <div className="grid grid-cols-2 gap-2 text-xs">

        <span>🟣 VIP</span>
        <span>🟡 Food</span>
        <span>🔵 Parking</span>
        <span>🟢 Entrance</span>

      </div>

    </div>
  )
}