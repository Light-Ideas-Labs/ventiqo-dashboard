"use client"

import InvoiceStats from "@/components/invoices/InvoiceStats"
import InvoiceList from "@/components/invoices/InvoiceList"
import InvoiceDetails from "@/components/invoices/invoiceDetails"

export default function InvoicesPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Manage invoices and payments
        </p>
      </div>

      {/* STATS */}
      <InvoiceStats />

      {/* MAIN */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT LIST */}
        <div className="xl:col-span-1">
          <InvoiceList />
        </div>

        {/* RIGHT DETAILS */}
        <div className="xl:col-span-2">
          <InvoiceDetails />
        </div>

      </div>

    </div>
  )
}