import { Ticket, DollarSign, BarChart3 } from "lucide-react"

const stats = [
  {
    label: "Total Bookings",
    value: "55,000",
    icon: BarChart3,
  },
  {
    label: "Total Tickets Sold",
    value: "45,000",
    icon: Ticket,
  },
  {
    label: "Total Earnings",
    value: "$275,450",
    icon: DollarSign,
  },
]

export default function BookingsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border bg-card flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <h2 className="text-xl font-semibold">{stat.value}</h2>
          </div>

          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      ))}

    </div>
  )
}