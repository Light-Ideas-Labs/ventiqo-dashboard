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
  { name: "Colombo", value: 853 },
  { name: "Kandy", value: 743 },
  { name: "Galle", value: 763 },
  { name: "Jaffna", value: 934 },
  { name: "Matara", value: 783 },
  { name: "Negombo", value: 643 },
  { name: "Kurunegala", value: 687 },
  { name: "Anuradhapura", value: 936 },
  { name: "Batticaloa", value: 573 },
  { name: "Trinco", value: 345 },
]

export default function LocationsBarChart() {
  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">
          All Attendee Locations
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}