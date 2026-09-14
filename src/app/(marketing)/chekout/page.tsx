"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import WizardStepper from "@/components/WizardStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEvent } from "@/state/eventsAPI";

export default function CheckoutTicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") ?? "";

  const { data: eventResponse, isLoading, isError } = useEvent(eventId);
  const event = eventResponse?.data;

  const [ticketType, setTicketType] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const selectedTicket = useMemo(
    () => event?.tickets.find((t) => t.name === (ticketType || event.tickets[0]?.name)),
    [event, ticketType]
  );

  if (!eventId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">No event selected</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose an event to buy tickets for before checking out.
        </p>
        <Button asChild className="mt-6">
          <Link href="/events">Browse events</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-muted-foreground">Loading event…</div>;
  }

  if (isError || !event) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Couldn&apos;t load this event</h1>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/events">Back to events</Link>
        </Button>
      </div>
    );
  }

  const handleContinue = () => {
    const params = new URLSearchParams({
      eventId,
      ticketType: selectedTicket?.name ?? "",
      qty: String(quantity),
    });
    router.push(`/chekout/details?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <WizardStepper currentStep={1} />

      <div className="mt-8 flex items-center gap-4">
        <Image
          src={event.image || "/images/placeholder.svg"}
          alt={event.title}
          width={80}
          height={80}
          className="size-20 shrink-0 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-lg font-semibold">{event.title}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })} · {event.venueName}
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Select tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {event.tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ticket types are available for this event yet.</p>
          ) : (
            <RadioGroup
              value={selectedTicket?.name ?? ""}
              onValueChange={setTicketType}
              className="space-y-3"
            >
              {event.tickets.map((ticket) => (
                <Label
                  key={ticket._id}
                  htmlFor={ticket._id}
                  className="flex items-center justify-between rounded-lg border-2 border-muted p-4 hover:bg-accent [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={ticket.name} id={ticket._id} />
                    <div>
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-xs text-muted-foreground">{ticket.description}</p>
                    </div>
                  </div>
                  <p className="font-semibold">KES {ticket.price.toLocaleString()}</p>
                </Label>
              ))}
            </RadioGroup>
          )}

          {selectedTicket && (
            <div className="flex items-center justify-between border-t pt-4">
              <Label>Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(Math.max(1, selectedTicket.quantity || 10), q + 1))}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        className="mt-6 w-full"
        size="lg"
        disabled={!selectedTicket}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
}
