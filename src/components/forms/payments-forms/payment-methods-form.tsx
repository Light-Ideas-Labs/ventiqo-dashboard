import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useInitiateMpesaPayment, useMpesaPaymentStatus } from "@/state/paymentAPI";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  coordinates: [number, number];
  image: string;
};

type PaymentMethodFormProps = {
  event: Event;
  onClose: () => void;
};

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ event, onClose }) => {
  const { data: session } = useSession();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState<string>(""); // For storing Mpesa phone number
  const [error, setError] = useState<string | null>(null); // For error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For success messages
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | undefined>(undefined);

  const initiateMpesaMutation = useInitiateMpesaPayment();
  const { data: paymentStatus } = useMpesaPaymentStatus(checkoutRequestId, {
    refetchInterval: checkoutRequestId ? 5000 : false,
  });

  // Set the phone number from session when available
  useEffect(() => {
    if (session?.user && session.user.phone_number) {
      setMpesaPhoneNumber(session.user.phone_number);
    }
  }, [session]);

  // React to the polled Mpesa payment status
  useEffect(() => {
    if (!paymentStatus?.success) return;

    if (paymentStatus.data.ResultCode === 0) {
      setCheckoutRequestId(undefined); // stop polling
      // Redirect to success page
      // router.push("/payment-success");
    } else {
      setCheckoutRequestId(undefined); // stop polling
      setError("Payment was not successful. Please try again.");
    }
  }, [paymentStatus]);

  // Handle Mpesa Payment Submission
  const handleMpesaPayment = async () => {
    setError(null);
    setSuccessMessage(null);

    const payload = {
      orderId: event.id, // Assuming event ID is used as the order ID
      paymentType: "Mpesa",
    };

    try {
      const response = await initiateMpesaMutation.mutateAsync(payload);
      setSuccessMessage("Mpesa payment initiated successfully.");

      // Extract the CheckoutRequestID from the response
      const newCheckoutRequestId = response.data.body.CheckoutRequestID;

      if (newCheckoutRequestId) {
        // Start polling to confirm payment status
        setCheckoutRequestId(newCheckoutRequestId);
      } else {
        setError("Failed to retrieve CheckoutRequestID. Please try again.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to initiate Mpesa payment.");
    }
  };

const handleContinue = () => {
  if (selectedPaymentMethod === "mpesa") {
    if (!mpesaPhoneNumber) {
      setError("Please provide a valid Mpesa phone number.");
      return;
    }
    handleMpesaPayment();
  } else {
    // Handle other payment methods here
    console.log("Proceeding with payment method:", selectedPaymentMethod);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
        <h2 className="text-xl font-semibold">Payment for {event.title}</h2>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Select a payment method and provide the required details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="grid grid-cols-5 gap-4"
            >
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="card" id="card" className="sr-only" />
                <CreditCard className="mb-3 h-6 w-6" />
                Card
              </Label>
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                <Icons.paypal className="mb-3 h-6 w-6" />
                Paypal
              </Label>
              <Label
                htmlFor="apple"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="apple" id="apple" className="sr-only" />
                <Icons.apple className="mb-3 h-6 w-6" />
                Apple
              </Label>
              {/* Mpesa */}
              <Label
                htmlFor="mpesa"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
                <Icons.mpesa className="mb-3 h-6 w-6" /> {/* Use the appropriate Mpesa icon */}
                Mpesa
              </Label>
              {/* USDT */}
              <Label
                htmlFor="usdt"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="usdt" id="usdt" className="sr-only" />
                <Icons.usdt className="mb-3 h-6 w-6" /> {/* Use the appropriate USDT icon */}
                USDT
              </Label>
            </RadioGroup>

            {/* Conditionally render form fields based on selected payment method */}
            {selectedPaymentMethod === "card" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="First Last" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Card number</Label>
                  <Input id="number" placeholder="Card number" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="month">Expires</Label>
                    <Select>
                      <SelectTrigger id="month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">January</SelectItem>
                        <SelectItem value="2">February</SelectItem>
                        <SelectItem value="3">March</SelectItem>
                        <SelectItem value="4">April</SelectItem>
                        <SelectItem value="5">May</SelectItem>
                        <SelectItem value="6">June</SelectItem>
                        <SelectItem value="7">July</SelectItem>
                        <SelectItem value="8">August</SelectItem>
                        <SelectItem value="9">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Select>
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                            {new Date().getFullYear() + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="CVC" />
                  </div>
                </div>
              </>
            )}

            {/* Conditionally render form fields based on selected payment method */}
            {selectedPaymentMethod === "mpesa" && (
              <div className="grid gap-2">
                <Label htmlFor="mpesa-number">Mpesa Phone Number</Label>
                <Input
                  id="mpesa-number"
                  placeholder="Enter your Mpesa phone number"
                  value={mpesaPhoneNumber}
                  onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                />
              </div>
            )}

            {selectedPaymentMethod === "usdt" && (
              <div className="grid gap-2">
                <Label htmlFor="usdt-address">USDT Wallet Address</Label>
                <Input id="usdt-address" placeholder="Enter your USDT wallet address" />
              </div>
            )}
          </CardContent>
          <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={initiateMpesaMutation.isPending}>
              {initiateMpesaMutation.isPending ? "Processing..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
        <button onClick={onClose} className="mt-4 text-red-500">Close</button>
      </div>
    </div>
  );
}

export default PaymentMethodForm;
