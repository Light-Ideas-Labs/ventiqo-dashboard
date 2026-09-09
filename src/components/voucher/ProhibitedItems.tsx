export default function ProhibitedItems() {
  const items = [
    "Weapons",
    "Drugs",
    "Alcohol",
    "Recording Gear",
    "Pets",
    "Bicycles",
  ]

  return (
    <div className="p-5 rounded-2xl border bg-card space-y-4">

      <h3 className="font-medium">Prohibited Items</h3>

      <div className="grid grid-cols-3 gap-4">

        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 text-xs"
          >
            <div className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary">
              🚫
            </div>
            {item}
          </div>
        ))}

      </div>

    </div>
  )
}