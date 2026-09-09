"use client"

import * as React from "react"
import { IconBuilding } from "@tabler/icons-react"
import { OrgSwitcher, type OrgItem } from "./OrgSwitcher"
import { CreateOrganizationDialog } from "@/components/organizations/CreateOrganizationDialog"
import { useMyOrganizer } from "@/state/organizersAPI"

export function TeamSwitcherContainer() {
  const [createOpen, setCreateOpen] = React.useState(false)
  const { data, isLoading, isError, refetch } = useMyOrganizer()
  const organizer = data?.data ?? null

  const orgs: OrgItem[] = organizer
    ? [
        {
          id: organizer._id,
          name: organizer.organizer_name,
          plan: organizer.kyc?.status === "approved" ? "Verified" : "Unverified",
          logo: IconBuilding,
        },
      ]
    : []

  return (
    <>
      <OrgSwitcher
        orgs={orgs}
        activeOrgId={organizer?._id ?? null}
        onSelect={() => {}}
        onCreateOrg={() => setCreateOpen(true)}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      <CreateOrganizationDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
