"use client"

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  { name: "18-24", value: 2345 },
  { name: "25-34", value: 1342 },
  { name: "35-44", value: 245 },
  { name: "44+", value: 124 },
]

export default function AgePieChart() {
  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">
          Attendee Ages
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={90} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}