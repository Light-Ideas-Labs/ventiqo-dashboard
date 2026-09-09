"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Sold Out", value: 1251, color: "#d946ef" },   // pink
  { name: "Fully Booked", value: 834, color: "#1e293b" }, // dark
  { name: "Available", value: 695, color: "#e5e7eb" },    // gray
]

const total = data.reduce((acc, item) => acc + item.value, 0)

export default function TicketSalesChart() {
  return (
    <div className="flex flex-col items-center gap-4">

      {/* DONUT */}
      <div className="relative h-48 w-48">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-muted-foreground">Total Ticket</p>
          <h3 className="text-lg font-semibold">{total.toLocaleString()}</h3>
        </div>

      </div>

      {/* LEGEND */}
      <div className="w-full space-y-2 text-sm">

        {data.map((item) => {
          const percentage = Math.round((item.value / total) * 100)

          return (
            <div key={item.name} className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span>{item.value}</span>
                <span className="text-muted-foreground text-xs">
                  {percentage}%
                </span>
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}