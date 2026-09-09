"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Calendar, CreditCard, LifeBuoy, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const QUICK_LINKS = [
  { icon: Calendar, label: "Create an event", href: "/organizer/events/new" },
  { icon: Tag, label: "Create a discount code", href: "/organizer/marketing" },
  { icon: CreditCard, label: "Set up payouts", href: "/organizer/payments" },
  { icon: Users, label: "Manage attendees", href: "/organizer/attendees" },
]

const FAQS = [
  {
    question: "How do I create an event?",
    answer:
      "Go to Events and click \"Create Event\", or use the Create Event button in the sidebar. Fill in the name, date, location, cover image and ticket details, then save as a draft or publish it right away.",
  },
  {
    question: "How do I edit an event after it's published?",
    answer:
      "Open the event from your Events list, then go to its Settings tab. You can update the title, description, venue, date, category and cover image at any time.",
  },
  {
    question: "How do I add more ticket types to an event?",
    answer:
      "Open the event and go to the Overview tab — the \"Ticket by Type\" panel has an \"Add Ticket Type\" button for creating new ticket categories alongside the ones you started with.",
  },
  {
    question: "How do I create a discount code?",
    answer:
      "Go to Marketing to create, activate, deactivate or delete promo codes for your events.",
  },
  {
    question: "How do attendees get checked in at the door?",
    answer:
      "Open an event and go to its Attendees tab. Search for the attendee and mark them as checked-in from the row menu, or open their order details to check them in from there.",
  },
  {
    question: "When do I get paid?",
    answer:
      "Payouts are sent by default 7 days after your event ends. An early payout is available starting 3 days before the event, for a 5% fee. Set up how you receive payouts under Payment Setup.",
  },
  {
    question: "How do I export my attendee list?",
    answer:
      "From an event's Attendees tab, or from the org-wide Attendees page, use the \"Export list\" button to download a CSV of everyone who booked a ticket.",
  },
]

export default function HelpPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Guides, FAQs and a way to reach the Ventiqo team.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center text-sm hover:border-primary/50"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <link.icon className="size-4 text-muted-foreground" />
            </span>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-2 font-semibold">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible>
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <LifeBuoy className="size-5 text-muted-foreground" />
          </span>
          <div>
            <p className="font-medium">Still need help?</p>
            <p className="text-sm text-muted-foreground">Reach the Ventiqo team directly.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => toast("Live support isn't available yet — check back soon")}>
          Contact Support
        </Button>
      </div>
    </div>
  )
}
