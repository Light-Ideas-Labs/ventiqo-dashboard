"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Smartphone } from "lucide-react";
import WizardStepper from "@/components/WizardStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createOrder } from "@/state/ordersAPI";
import { useInitiateMpesaPayment, useMpesaPaymentStatus } from "@/state/paymentAPI";

type Stage = "review" | "creating-order" | "awaiting-mpesa";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId") ?? "";
  const ticketType = searchParams.get("ticketType") ?? "";
  const qty = Number(searchParams.get("qty") ?? "1");
  const phoneNumber = searchParams.get("phoneNumber") ?? "";

  const [stage, setStage] = useState<Stage>("review");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | undefined>(undefined);

  const initiateMpesaMutation = useInitiateMpesaPayment();
  const { data: paymentStatus } = useMpesaPaymentStatus(checkoutRequestId, {
    refetchInterval: checkoutRequestId ? 5000 : false,
  });

  useEffect(() => {
    if (!paymentStatus?.success || !orderId) return;

    if (paymentStatus.data?.ResultCode === 0) {
      setCheckoutRequestId(undefined);
      router.push(`/chekout/completion?orderId=${orderId}`);
    } else if (paymentStatus.data?.ResultCode !== undefined) {
      setCheckoutRequestId(undefined);
      setStage("review");
      setError("Payment wasn't completed. Please try again.");
    }
  }, [paymentStatus, orderId, router]);

  const handlePay = async () => {
    setError(null);
    setStage("creating-order");

    try {
      const orderResult = await createOrder({ eventId, ticketType, totalTickets: qty, phone_number: phoneNumber });
      setOrderId(orderResult.order._id);

      setStage("awaiting-mpesa");
      const mpesaResponse = await initiateMpesaMutation.mutateAsync({
        orderId: orderResult.order._id,
        paymentType: "Mpesa",
      });

      const newCheckoutRequestId = mpesaResponse.data?.body?.CheckoutRequestID;
      if (!newCheckoutRequestId) {
        throw new Error("Couldn't start the M-Pesa payment. Please try again.");
      }

      setCheckoutRequestId(newCheckoutRequestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong processing your payment.");
      setStage("review");
    }
  };

  const isProcessing = stage !== "review";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <WizardStepper currentStep={3} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pay with M-Pesa</CardTitle>
          <CardDescription>
            You&apos;ll receive an STK push on {phoneNumber || "your phone"} to complete this payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4">
            <Smartphone className="size-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">{qty} × {ticketType || "Ticket"}</p>
              <p className="text-muted-foreground">Confirmation will be sent to {phoneNumber}</p>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {stage === "awaiting-mpesa" && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Waiting for you to approve the STK push on your phone…
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => router.back()} disabled={isProcessing}>
          Back
        </Button>
        <Button className="flex-1" size="lg" onClick={handlePay} disabled={isProcessing || !phoneNumber}>
          {isProcessing ? <Loader2 className="size-4 animate-spin" /> : "Pay now"}
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Having trouble? <Link href="/chekout/details" className="underline">Go back to your details</Link>.
      </p>
    </div>
  );
}
