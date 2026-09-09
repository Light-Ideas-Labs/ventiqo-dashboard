"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, Camera, Zap } from "lucide-react"

const DISMISS_KEY = "ventiqo:dashboard-tips-dismissed"

const TIPS = [
  {
    icon: Camera,
    title: "Add Event Photos",
    description: "Events with photos sell 3x more tickets",
    cta: "Add Photos",
    href: "/organizer/events",
  },
  {
    icon: Zap,
    title: "Enable Early Bird Pricing",
    description: "Create urgency with limited-time discounts",
    cta: "Set Up Discount",
    href: "/organizer/marketing",
  },
]

export default function TipsResources() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
  }, [])

  if (dismissed) return null

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1")
    setDismissed(true)
  }

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-semibold">Tips & Resources</h3>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss tips"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        A couple of quick wins for new organizers.
      </p>

      <div className="space-y-3">
        {TIPS.map((tip) => (
          <div key={tip.title} className="rounded-xl border border-border p-3">
            <tip.icon className="mb-2 size-4 text-primary" />
            <p className="text-sm font-medium">{tip.title}</p>
            <p className="mb-2 text-xs text-muted-foreground">{tip.description}</p>
            <Link href={tip.href} className="text-xs font-medium text-primary hover:underline">
              {tip.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
