"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import WizardStepper from "@/components/WizardStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const eventId = searchParams.get("eventId") ?? "";
  const ticketType = searchParams.get("ticketType") ?? "";
  const qty = searchParams.get("qty") ?? "1";

  const [phoneNumber, setPhoneNumber] = useState(session?.user?.phone_number ?? "");
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Sign in to continue</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ll need an account to receive your tickets and order confirmation.
        </p>
        <Button asChild className="mt-6">
          <Link href={`/sign-in?callbackUrl=/chekout/details?${searchParams.toString()}`}>Sign in</Link>
        </Button>
      </div>
    );
  }

  const handleContinue = () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a phone number so we can confirm your M-Pesa payment.");
      return;
    }

    const params = new URLSearchParams({ eventId, ticketType, qty, phoneNumber });
    router.push(`/chekout/payment?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <WizardStepper currentStep={2} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={session?.user?.name ?? ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={session?.user?.email ?? ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number (for M-Pesa payment)</Label>
            <Input
              id="phone"
              placeholder="07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button className="flex-1" size="lg" onClick={handleContinue}>
          Continue to payment
        </Button>
      </div>
    </div>
  );
}
