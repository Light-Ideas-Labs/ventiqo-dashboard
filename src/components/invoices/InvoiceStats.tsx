import { CheckCircle, Clock, AlertCircle } from "lucide-react"

const stats = [
  {
    label: "Paid",
    value: "1,805",
    icon: CheckCircle,
  },
  {
    label: "Unpaid",
    value: "535",
    icon: Clock,
  },
  {
    label: "Overdue",
    value: "80",
    icon: AlertCircle,
  },
]

export default function InvoiceStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {stats.map((s, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl border bg-card flex justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <h2 className="text-xl font-semibold">{s.value}</h2>
          </div>

          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <s.icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      ))}

    </div>
  )
}