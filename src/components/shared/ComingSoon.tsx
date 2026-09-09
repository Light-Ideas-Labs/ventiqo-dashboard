import { type LucideIcon, Construction } from "lucide-react"

export default function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
  phase,
}: {
  title: string
  description: string
  icon?: LucideIcon
  phase?: string
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
        <p className="font-medium">This section is on its way</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {title} isn&apos;t built out yet{phase ? ` — it's scheduled for ${phase}` : ""}. The
          page is wired up and ready for the real feature.
        </p>
      </div>
    </div>
  )
}
