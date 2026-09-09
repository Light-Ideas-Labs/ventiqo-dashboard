"use client"

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  { name: "A", value: 212 },
  { name: "B", value: 123 },
  { name: "C", value: 218 },
  { name: "D", value: 234 },
  { name: "E", value: 265 },
]

export default function InterestsDonut() {
  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">
          Attendee Interests
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}