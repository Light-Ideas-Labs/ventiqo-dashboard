"use client"

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

const data = [
  { day: "01", age18: 19, age25: 28, age35: 38, age45: 51 },
  { day: "02", age18: 20, age25: 31, age35: 38, age45: 47 },
  { day: "03", age18: 23, age25: 25, age35: 39, age45: 41 },
  { day: "04", age18: 21, age25: 28, age35: 43, age45: 48 },
  { day: "05", age18: 21, age25: 22, age35: 41, age45: 49 },
]

export default function AgeChart() {
  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">Attendee Age</h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <Tooltip />

            <Line type="monotone" dataKey="age18" stroke="#6366f1" />
            <Line type="monotone" dataKey="age25" stroke="#8b5cf6" />
            <Line type="monotone" dataKey="age35" stroke="#111827" />
            <Line type="monotone" dataKey="age45" stroke="#9ca3af" />
          </LineChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}