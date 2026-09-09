"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ShieldCheck, Info, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMyOrganizer, useFinancialInfo, useUpdateFinancialInfo } from "@/state/organizersAPI"
import DataError from "@/components/shared/DataError"

const STATUS_META = {
  unverified: { label: "Unverified", icon: AlertCircle, className: "bg-semantic-warning-bg text-semantic-warning-text" },
  pending: { label: "Pending review", icon: Clock, className: "bg-semantic-info-bg text-semantic-info-text" },
  verified: { label: "Verified", icon: CheckCircle2, className: "bg-semantic-success-bg text-semantic-success-text" },
}

export default function PaymentsPage() {
  const { data: organizerData } = useMyOrganizer()
  const organizerId = organizerData?.data?._id

  const { data, isLoading, isError, refetch } = useFinancialInfo(organizerId)
  const updateFinancialInfo = useUpdateFinancialInfo()
  const financialInfo = data?.organizer

  const [method, setMethod] = useState<"mpesa" | "bank">("mpesa")
  const [mpesaNumber, setMpesaNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  useEffect(() => {
    if (!financialInfo) return
    if (financialInfo.bankName || financialInfo.accountNumber) setMethod("bank")
    setMpesaNumber(financialInfo.mpesaNumber ?? "")
    setBankName(financialInfo.bankName ?? "")
    setAccountNumber(financialInfo.accountNumber ?? "")
  }, [financialInfo])

  const handleSave = async () => {
    if (!organizerId) return
    if (method === "mpesa" && !mpesaNumber) {
      toast.error("M-PESA phone number is required.")
      return
    }
    if (method === "bank" && (!bankName || !accountNumber)) {
      toast.error("Bank name and account number are required.")
      return
    }

    try {
      await updateFinancialInfo.mutateAsync({
        organizerId,
        payload: method === "mpesa" ? { mpesaNumber } : { bankName, accountNumber },
      })
      toast.success("Payout details saved", {
        description: "Any change resets verification — we'll re-verify before your next payout.",
      })
    } catch (error) {
      toast.error("Couldn't save payout details", {
        description: error instanceof Error ? error.message : "Please try again.",
      })
    }
  }

  const status = financialInfo?.verificationStatus ?? "unverified"
  const statusMeta = STATUS_META[status]

  if (isError) {
    return (
      <DataError
        message="Couldn't load your payout details. Only the organizer's owner can view this."
        onRetry={() => refetch()}
      />
    )
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading payout details…</p>
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payment Setup</h1>
          <p className="text-sm text-muted-foreground">Choose how you receive payouts from ticket sales.</p>
        </div>
        <Badge className={`gap-1 border-0 ${statusMeta.className}`}>
          <statusMeta.icon className="size-3.5" />
          {statusMeta.label}
        </Badge>
      </div>

      <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-[2fr_1fr]">
        <div>
          <label className="mb-2 block text-sm font-medium">How would you like to receive payouts?</label>
          <RadioGroup value={method} onValueChange={(v) => setMethod(v as "mpesa" | "bank")} className="space-y-3">
            <div
              className={
                "rounded-lg border p-4 " + (method === "mpesa" ? "border-wizard-accent bg-wizard-accent/5" : "border-input")
              }
            >
              <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                <RadioGroupItem value="mpesa" /> M-PESA
              </label>
              <Input
                value={mpesaNumber}
                disabled={method !== "mpesa"}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="+254 712 345 678"
              />
            </div>

            <div
              className={
                "rounded-lg border p-4 " + (method === "bank" ? "border-wizard-accent bg-wizard-accent/5" : "border-input")
              }
            >
              <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                <RadioGroupItem value="bank" /> Bank Transfer
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={bankName}
                  disabled={method !== "bank"}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank name"
                />
                <Input
                  value={accountNumber}
                  disabled={method !== "bank"}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account number"
                />
              </div>
            </div>
          </RadioGroup>

          <div className="mt-4 flex gap-2 rounded-lg border border-semantic-warning-bg-strong bg-semantic-warning-bg p-3 text-xs text-semantic-warning-text">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>Changing your payout details resets verification — we&apos;ll need to re-verify before your next payout.</p>
          </div>

          <Button onClick={handleSave} disabled={updateFinancialInfo.isPending} className="mt-4">
            {updateFinancialInfo.isPending ? "Saving…" : "Save payout details"}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-input p-4 text-xs text-muted-foreground">
            <p className="mb-1 text-sm font-medium text-foreground">Payout schedule</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Default payouts: 7 days after event</li>
              <li>Early payout available: 3 days before event (5% fee)</li>
            </ul>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full border border-input px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" /> Encrypted and Secure
          </div>
        </div>
      </div>
    </div>
  )
}
