export default function BookingsTable() {
  const rows = [
    {
      id: "INV1001",
      name: "Jackson Moore",
      event: "Symphony Under the Stars",
      amount: "$100",
      status: "Confirmed",
    },
    {
      id: "INV1002",
      name: "Alicia Smithson",
      event: "Runway Revolution",
      amount: "$120",
      status: "Pending",
    },
  ]

  return (
    <div className="p-5 rounded-2xl border bg-card">

      <h3 className="text-sm font-medium mb-4">
        Recent Bookings
      </h3>

      <table className="w-full text-sm">

        <thead className="text-muted-foreground">
          <tr>
            <th className="text-left">Invoice</th>
            <th>Name</th>
            <th>Event</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.event}</td>
              <td>{row.amount}</td>
              <td>
                <span className="text-primary">{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}