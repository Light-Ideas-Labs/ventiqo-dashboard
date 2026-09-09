import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DataError({
  message = "Something went wrong loading this data.",
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-semantic-error-bg-strong bg-semantic-error-bg px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-background">
        <AlertTriangle className="size-6 text-semantic-error" />
      </span>
      <p className="font-medium text-semantic-error-text">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
