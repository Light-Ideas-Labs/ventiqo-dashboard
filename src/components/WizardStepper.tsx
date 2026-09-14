"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { step: 1, label: "Tickets" },
  { step: 2, label: "Details" },
  { step: 3, label: "Payment" },
  { step: 4, label: "Confirmation" },
] as const

export default function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex w-full items-center">
      {STEPS.map(({ step, label }, index) => {
        const isComplete = step < currentStep
        const isCurrent = step === currentStep

        return (
          <li key={step} className={cn("flex items-center", index < STEPS.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isComplete && !isCurrent && "border-muted text-muted-foreground"
                )}
              >
                {isComplete ? <Check className="size-4" /> : step}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1", isComplete ? "bg-primary" : "bg-muted")} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
