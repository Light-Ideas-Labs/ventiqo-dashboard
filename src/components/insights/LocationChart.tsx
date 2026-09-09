"use client"

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

const data = [
  { name: "Colombo", value: 227 },
  { name: "Kandy", value: 123 },
  { name: "Galle", value: 143 },
  { name: "Jaffna", value: 70 },
  { name: "Intl", value: 52 },
]

export default function LocationChart() {
  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">Attendee Locations</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}