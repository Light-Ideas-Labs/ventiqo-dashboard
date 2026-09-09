"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { PartyPopper, MapPin, Video, Image as ImageIcon, ShieldCheck, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateOrganizer, useUpdateFinancialInfo } from "@/state/organizersAPI";
import { useCreateEvent, useAddTicketsToEvent } from "@/state/eventsAPI";

const EVENT_CATEGORIES = [
  "Music & Concerts",
  "Nightlife & Parties",
  "Food & Drinks",
  "Workshops & Classes",
  "Sports & Fitness",
  "Business & Networking",
  "Arts & Culture",
  "Family & Kids",
];

const CITIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Other"];
const BANKS = ["KCB", "Equity Bank", "Cooperative Bank", "NCBA", "Absa", "Other"];

const STEP_LABELS = ["Profile", "First Event", "Payment Setup"];

interface ProfileFormState {
  organizerName: string;
  bio: string;
  categories: string[];
  city: string;
  website: string;
  instagram: string;
  facebook: string;
}

interface EventFormState {
  title: string;
  date: string;
  time: string;
  locationType: "in-person" | "virtual";
  venueName: string;
  platform: string;
  coverImage: string;
  description: string;
  currency: string;
  price: string;
  isFree: boolean;
  ticketCount: number;
}

interface PaymentFormState {
  method: "mpesa" | "bank";
  mpesaPhone: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export default function OrgOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [wizardStarted, setWizardStarted] = useState(false);
  const [step, setStep] = useState(0); // 0, 1, 2 => Step 1-3 of 3
  const [organizerId, setOrganizerId] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileFormState>({
    organizerName: "",
    bio: "",
    categories: [],
    city: "",
    website: "",
    instagram: "",
    facebook: "",
  });

  const [event, setEvent] = useState<EventFormState>({
    title: "",
    date: "",
    time: "",
    locationType: "in-person",
    venueName: "",
    platform: "Zoom",
    coverImage: "",
    description: "",
    currency: "KES",
    price: "",
    isFree: false,
    ticketCount: 100,
  });

  const [payment, setPayment] = useState<PaymentFormState>({
    method: "mpesa",
    mpesaPhone: session?.user?.phone_number ?? "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const createOrganizerMutation = useCreateOrganizer();
  const createEventMutation = useCreateEvent();
  const addTicketsMutation = useAddTicketsToEvent();
  const updateFinancialInfoMutation = useUpdateFinancialInfo();

  const toggleCategory = (category: string) => {
    setProfile((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleProfileSubmit = async () => {
    if (!profile.organizerName || profile.categories.length === 0 || !profile.city) {
      toast.error("Missing required fields", {
        description: "Organizer name, at least one category, and location are required.",
      });
      return;
    }

    try {
      const res = await createOrganizerMutation.mutateAsync({
        organizer_name: profile.organizerName,
        organizer_email: session?.user?.email ?? "",
        organizer_phone_number: session?.user?.phone_number ?? "",
        organizer_address: profile.city,
        organizer_country: "Kenya",
        organizer_city: profile.city,
        website: profile.website,
        description: profile.bio,
        category: profile.categories.join(", "),
        socialMedia: {
          instagram: profile.instagram,
          facebook: profile.facebook,
        },
      });
      setOrganizerId(res.data._id);
      setStep(1);
    } catch (error) {
      toast.error("Couldn't save your profile", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const handleEventSubmit = async () => {
    if (!event.title || !event.date || !event.time) {
      toast.error("Missing required fields", {
        description: "Event name, date, and time are required.",
      });
      return;
    }

    try {
      const res = await createEventMutation.mutateAsync({
        title: event.title,
        date: event.date,
        startTime: event.time,
        endTime: event.time,
        timeZone: "Africa/Nairobi",
        aboutEvent: event.description,
        tagline: "",
        keypoint: "",
        venueName: event.locationType === "in-person" ? event.venueName : event.platform,
        categoryName: profile.categories[0] ?? "",
        subcategoryName: "",
        status: "Draft",
        currentBookings: 0,
        promoCode: "",
        discount: 0,
        featured: false,
        registrationRequired: true,
        subCounty: "",
        county: profile.city,
        country: "Kenya",
        events_image: event.coverImage,
      });

      const newEventId = res?.data?._id ?? res?._id;

      if (newEventId && (event.isFree || event.price)) {
        await addTicketsMutation.mutateAsync({
          eventId: newEventId,
          tickets: [
            {
              name: "General Admission",
              description: event.description,
              price: event.isFree ? 0 : Number(event.price) || 0,
              quantity: event.ticketCount,
              stock: event.ticketCount,
              ticketType: "General Admission",
              salesStartDate: new Date().toISOString(),
              salesEndDate: event.date,
            },
          ],
        });
      }

      setStep(2);
    } catch (error) {
      toast.error("Couldn't create your event", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const handlePaymentSubmit = async () => {
    if (payment.method === "mpesa" && !payment.mpesaPhone) {
      toast.error("M-PESA phone number is required.");
      return;
    }
    if (payment.method === "bank" && (!payment.bankName || !payment.accountNumber)) {
      toast.error("Bank name and account number are required.");
      return;
    }

    if (organizerId) {
      try {
        await updateFinancialInfoMutation.mutateAsync({
          organizerId,
          payload:
            payment.method === "bank"
              ? { bankName: payment.bankName, accountNumber: payment.accountNumber }
              : { mpesaNumber: payment.mpesaPhone },
        });
      } catch (error) {
        toast.error("Couldn't save your payout details", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
        return;
      }
    }

    toast.success("You're all set!", {
      description: "Your organizer account is ready to go.",
    });
    router.push("/organizer/dashboard");
  };

  if (!wizardStarted) {
    return <WelcomeScreen name={session?.user?.first_name} onStart={() => setWizardStarted(true)} onSkip={() => router.push("/organizer/dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <StepProgress step={step} />

        {step === 0 && (
          <StepCard title="Complete Your Profile" description="Help attendees know who you are">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full border-2 border-dashed border-input text-center text-xs text-muted-foreground">
                  <ImageIcon className="mb-1 size-5" />
                  Upload Photo
                  <span className="mt-0.5">JPG or PNG · Max 2MB</span>
                </div>

                <div>
                  <label className="mb-1 block">Organizer / Company Name (Required)</label>
                  <Input
                    value={profile.organizerName}
                    onChange={(e) => setProfile((p) => ({ ...p, organizerName: e.target.value }))}
                    placeholder="e.g. Nairobi Events Co."
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label>Bio (Optional)</label>
                    <span className="text-xs text-muted-foreground">{profile.bio.length} / 500</span>
                  </div>
                  <Textarea
                    value={profile.bio}
                    maxLength={500}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell attendees about your events..."
                    className="min-h-28"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tell attendees what makes your events special. (Optional)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-semantic-info-bg-strong bg-semantic-info-bg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-Saved</p>
                    <p className="text-xs text-muted-foreground">Draft auto-saves every 10 seconds</p>
                  </div>
                  <span className="text-xs font-medium text-semantic-success-text">Saved</span>
                </div>

                <div>
                  <label className="mb-2 block">Event Categories you organized (Required)</label>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_CATEGORIES.map((category) => {
                      const selected = profile.categories.includes(category);
                      return (
                        <button
                          type="button"
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={
                            "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                            (selected
                              ? "border-wizard-accent bg-wizard-accent text-wizard-accent-foreground"
                              : "border-semantic-info-bg-strong bg-semantic-info-bg text-semantic-info-text hover:border-wizard-accent")
                          }
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block">Location (Required)</label>
                  <Select value={profile.city} onValueChange={(v) => setProfile((p) => ({ ...p, city: v }))}>
                    <SelectTrigger className="w-full">
                      <MapPin className="mr-1 size-4 text-muted-foreground" />
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block">Website (Optional)</label>
                  <Input
                    value={profile.website}
                    onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://yourevents.com"
                  />
                </div>

                <div className="rounded-lg border border-input p-3">
                  <label className="mb-2 block">Social Media (Optional)</label>
                  <Input
                    className="mb-2"
                    value={profile.instagram}
                    onChange={(e) => setProfile((p) => ({ ...p, instagram: e.target.value }))}
                    placeholder="Instagram: @yourevents"
                  />
                  <Input
                    value={profile.facebook}
                    onChange={(e) => setProfile((p) => ({ ...p, facebook: e.target.value }))}
                    placeholder="Facebook page"
                  />
                </div>
              </div>
            </div>

            <StepFooter
              onBack={() => setWizardStarted(false)}
              onContinue={handleProfileSubmit}
              continueLabel="Continue"
              continueLoading={createOrganizerMutation.isPending}
            />
          </StepCard>
        )}

        {step === 1 && (
          <StepCard title="Create Your First Event" description="Don't worry, you can edit this later">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block">Event Name (Required)</label>
                  <Input
                    value={event.title}
                    onChange={(e) => setEvent((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Summer Music Festival"
                  />
                </div>

                <div>
                  <label className="mb-1 block">Date & Time (Required)</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={event.date}
                      onChange={(e) => setEvent((p) => ({ ...p, date: e.target.value }))}
                    />
                    <Input
                      type="time"
                      value={event.time}
                      onChange={(e) => setEvent((p) => ({ ...p, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block">Location (Required)</label>
                  <RadioGroup
                    value={event.locationType}
                    onValueChange={(v) => setEvent((p) => ({ ...p, locationType: v as "in-person" | "virtual" }))}
                    className="grid grid-cols-2 gap-3"
                  >
                    <label
                      className={
                        "flex cursor-pointer flex-col gap-2 rounded-lg border p-3 " +
                        (event.locationType === "in-person" ? "border-wizard-accent bg-wizard-accent/5" : "border-input")
                      }
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <RadioGroupItem value="in-person" /> <MapPin className="size-4" /> In-person
                      </span>
                      <Input
                        value={event.venueName}
                        onChange={(e) => setEvent((p) => ({ ...p, venueName: e.target.value }))}
                        placeholder="Venue name"
                        disabled={event.locationType !== "in-person"}
                      />
                    </label>
                    <label
                      className={
                        "flex cursor-pointer flex-col gap-2 rounded-lg border p-3 " +
                        (event.locationType === "virtual" ? "border-wizard-accent bg-wizard-accent/5" : "border-input")
                      }
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <RadioGroupItem value="virtual" /> <Video className="size-4" /> Virtual
                      </span>
                      <Select
                        value={event.platform}
                        onValueChange={(v) => setEvent((p) => ({ ...p, platform: v }))}
                      >
                        <SelectTrigger className="w-full" disabled={event.locationType !== "virtual"}>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Zoom">Zoom</SelectItem>
                          <SelectItem value="Google Meet">Google Meet</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block">Cover Image (Required)</label>
                  <div className="flex h-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-input text-center text-xs text-muted-foreground">
                    <ImageIcon className="mb-1 size-5" />
                    <span className="font-medium text-foreground">Upload Photo</span>
                    <span>Recommended: 1200 x 675px (16:9)</span>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label>Short description (Required)</label>
                    <span className="text-xs text-muted-foreground">{event.description.length} / 200</span>
                  </div>
                  <Textarea
                    value={event.description}
                    maxLength={200}
                    onChange={(e) => setEvent((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe your event in a few exciting words..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block">Ticket Price (Required)</label>
                    <div className="flex gap-2">
                      <Select value={event.currency} onValueChange={(v) => setEvent((p) => ({ ...p, currency: v }))}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KES">KES</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min={0}
                        value={event.price}
                        disabled={event.isFree}
                        onChange={(e) => setEvent((p) => ({ ...p, price: e.target.value }))}
                      />
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={event.isFree}
                        onCheckedChange={(checked) => setEvent((p) => ({ ...p, isFree: checked }))}
                      />
                      Free Event
                    </label>
                  </div>

                  <div>
                    <label className="mb-1 block">Tickets available (Required)</label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setEvent((p) => ({ ...p, ticketCount: Math.max(1, p.ticketCount - 1) }))}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        className="text-center"
                        value={event.ticketCount}
                        onChange={(e) => setEvent((p) => ({ ...p, ticketCount: Number(e.target.value) || 1 }))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setEvent((p) => ({ ...p, ticketCount: p.ticketCount + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 rounded-lg border border-semantic-warning-bg-strong bg-semantic-warning-bg p-3 text-xs text-semantic-warning-text">
                  <Info className="mt-0.5 size-4 shrink-0" />
                  <p>You can add more ticket types, detailed descriptions and photos after setup.</p>
                </div>
              </div>
            </div>

            <StepFooter
              onBack={() => setStep(0)}
              onContinue={handleEventSubmit}
              continueLabel="Continue"
              continueLoading={createEventMutation.isPending || addTicketsMutation.isPending}
              showSaveAsDraft
            />
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Set Up Payments" description="Choose how you will receive your earnings — your payout details are encrypted and securely stored">
            <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
              <div>
                <label className="mb-2 block">How would you like to receive payouts?</label>
                <RadioGroup
                  value={payment.method}
                  onValueChange={(v) => setPayment((p) => ({ ...p, method: v as "mpesa" | "bank" }))}
                  className="space-y-3"
                >
                  <div
                    className={
                      "rounded-lg border p-4 " +
                      (payment.method === "mpesa" ? "border-wizard-accent bg-wizard-accent/5" : "border-input")
                    }
                  >
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <RadioGroupItem value="mpesa" /> M-PESA (Recommended)
                    </label>
                    <Input
                      value={payment.mpesaPhone}
                      disabled={payment.method !== "mpesa"}
                      onChange={(e) => setPayment((p) => ({ ...p, mpesaPhone: e.target.value }))}
                      placeholder="+254 712 345 678"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <PayoutBadge>Instant payouts</PayoutBadge>
                      <PayoutBadge>Daily limit: KES 150,000</PayoutBadge>
                      <PayoutBadge>Fee: Free</PayoutBadge>
                    </div>
                  </div>

                  <div
                    className={
                      "rounded-lg border p-4 " +
                      (payment.method === "bank" ? "border-wizard-accent bg-wizard-accent/5" : "border-input")
                    }
                  >
                    <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                      <RadioGroupItem value="bank" /> Bank Transfer
                    </label>
                    <div className="space-y-2">
                      <Select
                        value={payment.bankName}
                        onValueChange={(v) => setPayment((p) => ({ ...p, bankName: v }))}
                      >
                        <SelectTrigger className="w-full" disabled={payment.method !== "bank"}>
                          <SelectValue placeholder="Bank name" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANKS.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={payment.accountName}
                          disabled={payment.method !== "bank"}
                          onChange={(e) => setPayment((p) => ({ ...p, accountName: e.target.value }))}
                          placeholder="Account name"
                        />
                        <Input
                          value={payment.accountNumber}
                          disabled={payment.method !== "bank"}
                          onChange={(e) => setPayment((p) => ({ ...p, accountNumber: e.target.value }))}
                          placeholder="Account number"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <PayoutBadge>Payouts in 1-2 business days</PayoutBadge>
                      <PayoutBadge>No daily limit</PayoutBadge>
                      <PayoutBadge>Fee: Free</PayoutBadge>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-4 flex gap-2 rounded-lg border border-semantic-warning-bg-strong bg-semantic-warning-bg p-3 text-xs text-semantic-warning-text">
                  <Info className="mt-0.5 size-4 shrink-0" />
                  <p>For security, we will verify this information before your first payout. This usually takes 1 business day.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-input p-4">
                  <p className="mb-2 text-sm font-medium">Payout schedule</p>
                  <p className="mb-1 text-xs text-muted-foreground">When do I get paid?</p>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                    <li>Default payouts: 7 days after event</li>
                    <li>Early payout available: 3 days before event (5% fee)</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center gap-1 rounded-full border border-input px-3 py-1 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" /> Encrypted and Secure
                </div>
              </div>
            </div>

            <StepFooter
              onBack={() => setStep(1)}
              onContinue={handlePaymentSubmit}
              continueLabel="Finish"
              showSaveAsDraft
            />
          </StepCard>
        )}
      </div>
    </div>
  );
}

function WelcomeScreen({
  name,
  onStart,
  onSkip,
}: {
  name?: string;
  onStart: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-8 h-64 w-full max-w-sm">
          <div className="absolute left-0 top-0 h-40 w-52 rounded-2xl bg-wizard-track" />
          <div className="absolute right-0 top-4 h-36 w-44 rounded-2xl bg-muted" />
          <div className="absolute inset-x-6 top-6 flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br from-wizard-accent via-purple-500 to-pink-500 shadow-lg">
            <PartyPopper className="size-16 text-white/90" />
          </div>
        </div>

        <h1 className="text-3xl font-bold">
          Welcome to Ventiqo,
          <br />
          <span className="italic">{name || "there"}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">Let&apos;s get you set up to sell tickets in 3 easy steps</p>

        <StepProgress step={0} compact className="mt-6" />

        <Button onClick={onStart} className="mt-6 w-full bg-wizard-accent text-wizard-accent-foreground hover:bg-wizard-accent-hover">
          Get Started
        </Button>
        <button onClick={onSkip} className="mt-3 text-sm text-muted-foreground hover:underline">
          Skip for now
        </button>
      </div>
    </div>
  );
}

function StepProgress({ step, compact = false, className = "" }: { step: number; compact?: boolean; className?: string }) {
  return (
    <div className={"mb-8 " + className}>
      {!compact && (
        <div className="mb-2 flex items-center">
          {STEP_LABELS.map((_, index) => (
            <React.Fragment key={index}>
              <span className={"text-sm font-medium " + (index === step ? "text-foreground" : "text-muted-foreground")}>
                Step {index + 1} of 3
              </span>
              {index < STEP_LABELS.length - 1 && <span className="flex-1" />}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, index) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <span
                className={
                  "flex size-4 items-center justify-center rounded-full border-2 " +
                  (index <= step ? "border-wizard-accent" : "border-wizard-track")
                }
              >
                {index === step && <span className="size-1.5 rounded-full bg-wizard-accent" />}
              </span>
              {compact && <span className="text-xs text-muted-foreground">{label}</span>}
            </div>
            {index < STEP_LABELS.length - 1 && (
              <span className={"h-0.5 flex-1 rounded-full " + (index < step ? "bg-wizard-accent" : "bg-wizard-track")} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">{children}</div>
    </div>
  );
}

function StepFooter({
  onBack,
  onContinue,
  continueLabel,
  continueLoading,
  showSaveAsDraft = false,
}: {
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
  continueLoading?: boolean;
  showSaveAsDraft?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <Button type="button" variant="secondary" onClick={onBack}>
        Back
      </Button>
      <div className="flex gap-3">
        {showSaveAsDraft && (
          <Button type="button" variant="outline" onClick={onBack}>
            Save as Draft
          </Button>
        )}
        <Button
          type="button"
          onClick={onContinue}
          disabled={continueLoading}
          className="bg-wizard-accent text-wizard-accent-foreground hover:bg-wizard-accent-hover"
        >
          {continueLoading ? "Saving..." : continueLabel}
        </Button>
      </div>
    </div>
  );
}

function PayoutBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-semantic-success-bg px-2 py-0.5 text-[11px] font-medium text-semantic-success-text">
      {children}
    </span>
  );
}
