"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const invoices = [
  { id: "INV10011", amount: "$100", status: "Paid" },
  { id: "INV10012", amount: "$220", status: "Unpaid", active: true },
  { id: "INV10013", amount: "$240", status: "Paid" },
  { id: "INV10015", amount: "$50", status: "Paid" },
]

export default function InvoiceList() {
  return (
    <div className="p-5 rounded-2xl border bg-card space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Invoice List</h3>
        <Button size="sm">Add</Button>
      </div>

      {/* SEARCH */}
      <Input placeholder="Search invoice..." />

      {/* LIST */}
      <div className="space-y-3">

        {invoices.map((inv) => (
          <div
            key={inv.id}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              inv.active
                ? "border-primary bg-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex justify-between">

              <div>
                <p className="font-medium">{inv.id}</p>
                <p className="text-xs text-muted-foreground">
                  Feb 16, 2029
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">{inv.amount}</p>
                <span className={`text-xs ${
                  inv.status === "Paid"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}>
                  {inv.status}
                </span>
              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  )
}