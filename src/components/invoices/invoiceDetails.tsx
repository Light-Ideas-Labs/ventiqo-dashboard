export default function InvoiceDetails() {
  return (
    <div className="p-6 rounded-2xl border bg-card space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">#INV10012</h2>
        <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
          Unpaid
        </span>
      </div>

      {/* BILL INFO */}
      <div className="grid grid-cols-2 gap-6 text-sm">

        <div>
          <p className="text-muted-foreground mb-1">Bill From</p>
          <p className="font-medium">Event Management Co.</p>
          <p className="text-muted-foreground text-xs">
            Los Angeles, CA
          </p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1">Bill To</p>
          <p className="font-medium">Alicia Smithson</p>
          <p className="text-muted-foreground text-xs">
            Beverly Hills, CA
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="rounded-xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-t">
              <td className="p-3">Platinum</td>
              <td>$120</td>
              <td>1</td>
              <td>$120</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Silver</td>
              <td>$50</td>
              <td>2</td>
              <td>$100</td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* TOTAL */}
      <div className="text-sm space-y-1 text-right">

        <p>Subtotal: $220</p>
        <p>Tax: $22</p>
        <p>Fee: $5</p>

        <p className="font-semibold text-lg">
          Total: $247
        </p>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 justify-end">

        <button className="px-4 py-2 rounded-xl border">
          Edit
        </button>

        <button className="px-4 py-2 rounded-xl border">
          Send
        </button>

        <button className="px-4 py-2 rounded-xl border">
          Hold
        </button>

      </div>

    </div>
  )
}