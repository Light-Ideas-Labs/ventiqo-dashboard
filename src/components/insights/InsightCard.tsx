import { Card, CardContent } from "@/components/ui/card"

export default function InsightCard({
  title,
  value,
  metric,
  trend,
}: {
  title: string
  value: string
  metric: string
  trend: string
}) {
  const isPositive = trend.includes("+")
  const isNegative = trend.includes("-")

  return (
    <Card>
      <CardContent className="p-5 space-y-2">

        <p className="text-xs text-muted-foreground uppercase">
          {title}
        </p>

        <p className="text-lg font-semibold">{value}</p>

        <div className="flex justify-between items-center">

          <span
            className={`text-xs ${
              isPositive
                ? "text-green-500"
                : isNegative
                ? "text-red-500"
                : ""
            }`}
          >
            {trend} change
          </span>

          <span className="text-xl font-bold text-primary">
            {metric}
          </span>

        </div>

      </CardContent>
    </Card>
  )
}