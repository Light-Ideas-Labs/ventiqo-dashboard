// components/landing/CTA.tsx

import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20 text-center bg-primary text-primary-foreground">

      <h2 className="text-3xl font-bold">
        Start Creating Events Today
      </h2>

      <p className="mt-4">
        Join organizers building unforgettable experiences.
      </p>

      <Button className="mt-6 bg-background text-foreground">
        Get Started
      </Button>

    </section>
  )
}