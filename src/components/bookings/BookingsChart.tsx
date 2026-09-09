"use client"

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "Sun", value: 900 },
  { day: "Mon", value: 1100 },
  { day: "Tue", value: 1400 },
  { day: "Wed", value: 800 },
  { day: "Thu", value: 1500 },
  { day: "Fri", value: 1200 },
  { day: "Sat", value: 1700 },
]

export default function BookingsChart() {
  return (
    <div className="p-5 rounded-2xl border bg-card">

      <div className="flex justify-between mb-4">
        <h3 className="text-sm font-medium">Bookings Overview</h3>
        <span className="text-xs text-muted-foreground">This Week</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}