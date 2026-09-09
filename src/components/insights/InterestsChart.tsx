"use client"

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const data = [
  { name: "Live Music", value: 50 },
  { name: "Innovation", value: 35 },
  { name: "EDM", value: 35 },
  { name: "Food", value: 25 },
]

export default function InterestsChart() {
  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">Attendee Interests</h3>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}