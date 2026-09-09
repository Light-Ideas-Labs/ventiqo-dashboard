// components/landing/Hero.tsx

import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6">

      <h1 className="text-5xl font-bold max-w-3xl leading-tight">
        The Operating System for
        <span className="text-primary"> Modern Events</span>
      </h1>

      <p className="mt-6 text-gray-600 max-w-xl">
        Create, manage, and monetize events effortlessly.
        From ticketing to analytics — Ventiqo powers it all.
      </p>

      <div className="mt-8 flex gap-4">
        <Button className="bg-primary text-primary-foreground">
          Create Event
        </Button>

        <Button variant="outline">
          View Demo
        </Button>
      </div>

    </section>
  )
}