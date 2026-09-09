"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Music", value: 14172, color: "#a855f7" },
  { name: "Sport", value: 12476, color: "#1e293b" },
  { name: "Fashion", value: 9806, color: "#c4b5fd" },
  { name: "Art", value: 7661, color: "#e5e7eb" },
]

export default function BookingsCategory() {
  const total = data.reduce((a, b) => a + b.value, 0)

  return (
    <div className="p-5 rounded-2xl border bg-card space-y-4">

      <h3 className="text-sm font-medium">Bookings Category</h3>

      {/* DONUT */}
      <div className="h-40">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={70}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LIST */}
      <div className="space-y-2 text-sm">
        {data.map((item) => {
          const percent = Math.round((item.value / total) * 100)

          return (
            <div key={item.name} className="space-y-1">

              <div className="flex justify-between text-muted-foreground">
                <span>{item.name}</span>
                <span>{item.value}</span>
              </div>

              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}