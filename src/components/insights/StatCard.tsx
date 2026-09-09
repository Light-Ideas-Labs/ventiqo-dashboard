import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
  title,
  value,
  change,
}: {
  title: string
  value: string
  change: string
}) {
  return (
    <Card>
      <CardContent className="p-5 space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-xs text-green-500">{change}</p>
      </CardContent>
    </Card>
  )
}