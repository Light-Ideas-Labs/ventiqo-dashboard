"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import WizardStepper from "@/components/WizardStepper";
import { Button } from "@/components/ui/button";

export default function CheckoutCompletionPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center">
      <WizardStepper currentStep={4} />

      <div className="mt-10 flex flex-col items-center gap-3">
        <CheckCircle2 className="size-14 text-semantic-success" />
        <h1 className="text-xl font-semibold">Payment confirmed</h1>
        <p className="text-sm text-muted-foreground">
          Your tickets are booked. We&apos;ve sent a confirmation to your email and phone.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {orderId && (
          <Button asChild size="lg">
            <Link href={`/user/orders/${orderId}`}>View my order</Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <Link href="/events">Browse more events</Link>
        </Button>
      </div>
    </div>
  );
}
