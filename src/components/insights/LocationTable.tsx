import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Card, CardContent } from "@/components/ui/card"

export default function LocationTable() {
  const data = [
    { name: "Colombo", count: 227 },
    { name: "Kandy", count: 123 },
    { name: "Galle", count: 143 },
    { name: "Jaffna", count: 70 },
    { name: "International", count: 52 },
  ]

  return (
    <Card>
      <CardContent className="p-5">

        <h3 className="font-medium mb-4">Locations</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>

      </CardContent>
    </Card>
  )
}