"use client";

import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataError from "@/components/shared/DataError";
import { usePendingKyc, useApproveKyc, useRejectKyc } from "@/state/kycAPI";
import {
  usePendingFinancialVerifications,
  useVerifyFinancialInfo,
  useRejectFinancialInfo,
} from "@/state/organizersAPI";
import { usePendingPayouts, useCompletePayout, useFailPayout, useDisbursePayoutViaVexora } from "@/state/payoutsAPI";

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function PendingKycSection() {
  const { data, isLoading, isError, refetch } = usePendingKyc();
  const approve = useApproveKyc();
  const reject = useRejectKyc();
  const organizers = data?.data ?? [];

  if (isError) return <DataError message="Couldn't load pending KYC submissions." onRetry={() => refetch()} />;

  const handleApprove = async (organizerId: string, name: string) => {
    try {
      await approve.mutateAsync(organizerId);
      toast.success(`Approved ${name}`);
    } catch (error) {
      toast.error("Couldn't approve", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const handleReject = async (organizerId: string, name: string) => {
    const reason = window.prompt(`Reason for rejecting ${name}'s KYC submission:`);
    if (reason === null) return;
    try {
      await reject.mutateAsync({ organizerId, reason });
      toast.success(`Rejected ${name}`);
    } catch (error) {
      toast.error("Couldn't reject", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  return (
    <SectionCard title="Pending KYC Submissions" description="Business verification awaiting review.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organizer</TableHead>
            <TableHead>ID Type</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Loading…</TableCell>
            </TableRow>
          ) : organizers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Nothing pending.</TableCell>
            </TableRow>
          ) : (
            organizers.map((org) => (
              <TableRow key={org._id}>
                <TableCell className="font-medium text-foreground">{org.organizer_name}</TableCell>
                <TableCell>{org.kyc.idType ?? "—"}</TableCell>
                <TableCell>{org.kyc.idNumber ?? "—"}</TableCell>
                <TableCell>{org.kyc.submittedAt ? new Date(org.kyc.submittedAt).toLocaleDateString() : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReject(org._id, org.organizer_name)}>
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(org._id, org.organizer_name)}>
                      Approve
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
}

function PendingFinancialVerificationsSection() {
  const { data, isLoading, isError, refetch } = usePendingFinancialVerifications();
  const verify = useVerifyFinancialInfo();
  const reject = useRejectFinancialInfo();
  const organizers = data?.data ?? [];

  if (isError) return <DataError message="Couldn't load pending settlement-account verifications." onRetry={() => refetch()} />;

  const handleVerify = async (organizerId: string, name: string) => {
    try {
      await verify.mutateAsync(organizerId);
      toast.success(`Verified ${name}'s payout account`);
    } catch (error) {
      toast.error("Couldn't verify", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const handleReject = async (organizerId: string, name: string) => {
    try {
      await reject.mutateAsync(organizerId);
      toast.success(`Rejected ${name}'s payout account`);
    } catch (error) {
      toast.error("Couldn't reject", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  return (
    <SectionCard title="Pending Settlement Accounts" description="Payout destinations awaiting verification.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organizer</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">Loading…</TableCell>
            </TableRow>
          ) : organizers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">Nothing pending.</TableCell>
            </TableRow>
          ) : (
            organizers.map((org) => (
              <TableRow key={org._id}>
                <TableCell className="font-medium text-foreground">{org.organizer_name}</TableCell>
                <TableCell>{org.financialInfo.mpesaNumber ? "M-PESA" : "Bank"}</TableCell>
                <TableCell>
                  {org.financialInfo.mpesaNumber ?? `${org.financialInfo.bankName} · ${org.financialInfo.accountNumber}`}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReject(org._id, org.organizer_name)}>
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleVerify(org._id, org.organizer_name)}>
                      Verify
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
}

const PAYOUT_STATUS_CLASS: Record<string, string> = {
  pending: "bg-semantic-warning-bg text-semantic-warning-text",
  completed: "bg-semantic-success-bg text-semantic-success-text",
  failed: "bg-semantic-error-bg text-semantic-error-text",
};

function PendingPayoutsSection() {
  const { data, isLoading, isError, refetch } = usePendingPayouts();
  const complete = useCompletePayout();
  const fail = useFailPayout();
  const disburse = useDisbursePayoutViaVexora();
  const payouts = data?.data ?? [];

  if (isError) return <DataError message="Couldn't load pending payouts." onRetry={() => refetch()} />;

  const handleComplete = async (payoutId: string) => {
    const externalRef = window.prompt("External transfer reference (optional):") ?? undefined;
    try {
      await complete.mutateAsync({ payoutId, externalRef });
      toast.success("Payout marked completed");
    } catch (error) {
      toast.error("Couldn't complete payout", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const handleFail = async (payoutId: string) => {
    const reason = window.prompt("Reason this payout failed:");
    if (!reason) return;
    try {
      await fail.mutateAsync({ payoutId, reason });
      toast.success("Payout marked failed");
    } catch (error) {
      toast.error("Couldn't mark payout failed", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  const handleDisburse = async (payoutId: string) => {
    try {
      await disburse.mutateAsync(payoutId);
      toast.success("Submitted to Vexora for disbursement");
    } catch (error) {
      toast.error("Couldn't disburse via Vexora", { description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  return (
    <SectionCard title="Pending Payouts" description="Settlements queued for external transfer.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Loading…</TableCell>
            </TableRow>
          ) : payouts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Nothing pending.</TableCell>
            </TableRow>
          ) : (
            payouts.map((payout) => (
              <TableRow key={payout._id}>
                <TableCell className="font-medium text-foreground">KES {payout.amount.toLocaleString()}</TableCell>
                <TableCell className="capitalize">{payout.method}</TableCell>
                <TableCell>
                  {payout.destination.mpesaNumber ??
                    `${payout.destination.bankName ?? ""} · ${payout.destination.accountNumber ?? ""}`}
                </TableCell>
                <TableCell>
                  <Badge className={`border-0 ${PAYOUT_STATUS_CLASS[payout.status] ?? ""}`}>{payout.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleFail(payout._id)}>
                      Fail
                    </Button>
                    {payout.method === "mpesa" && (
                      <Button size="sm" variant="outline" onClick={() => handleDisburse(payout._id)}>
                        Disburse via Vexora
                      </Button>
                    )}
                    <Button size="sm" onClick={() => handleComplete(payout._id)}>
                      Mark Completed
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
}

export default function AdminPayoutsReview() {
  return (
    <div className="space-y-6">
      <PendingKycSection />
      <PendingFinancialVerificationsSection />
      <PendingPayoutsSection />
    </div>
  );
}
