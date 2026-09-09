"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Check, Building2, AlertTriangle } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export type OrgItem = {
  id: string
  name: string
  plan: string
  logo: React.ElementType
}

type OrgSwitcherProps = {
  orgs: OrgItem[]
  activeOrgId: string | null
  onSelect: (orgId: string) => void | Promise<void>
  onCreateOrg: () => void
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function OrgSwitcher({
  orgs,
  activeOrgId,
  onSelect,
  onCreateOrg,
  isLoading = false,
  isError = false,
  onRetry,
}: OrgSwitcherProps) {
  const { isMobile } = useSidebar()

  const activeOrg =
    orgs.find((o) => o.id === activeOrgId) ?? orgs[0]

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            Loading organizations…
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (isError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={onRetry}
            className="rounded-xl border border-dashed border-semantic-error-bg-strong text-semantic-error-text hover:bg-semantic-error-bg"
          >
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="truncate text-sm font-medium">Couldn&apos;t load — retry</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeOrg) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={onCreateOrg}
            className="rounded-xl border border-dashed border-border/70 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Building2 className="h-5 w-5 shrink-0" />
            <span className="truncate text-sm font-medium">Set up your organization</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>

          {/* TRIGGER */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                rounded-xl border border-border/50
                bg-background
                hover:bg-accent
                transition
                data-[state=open]:bg-accent
              "
            >
              <activeOrg.logo className="h-6 w-6 shrink-0" />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeOrg.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeOrg.plan}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto opacity-60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* DROPDOWN */}
          <DropdownMenuContent
            className="w-[260px] rounded-xl p-2"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={6}
          >

            {/* LABEL */}
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 pb-1">
              Organizations
            </DropdownMenuLabel>

            {/* LIST */}
            <div className="space-y-1">
              {orgs.map((org) => {
                const isActive = org.id === activeOrg.id

                return (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => onSelect(org.id)}
                    className={`
                      flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer
                      ${isActive ? "bg-accent" : "hover:bg-accent"}
                    `}
                  >
                    <org.logo className="h-4 w-4 shrink-0" />

                    <div className="flex-1 truncate">
                      <p className="text-sm">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {org.plan}
                      </p>
                    </div>

                    {isActive && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </div>

            <DropdownMenuSeparator className="my-2" />

            {/* CREATE ORG */}
            <DropdownMenuItem
              onClick={onCreateOrg}
              className="gap-2 rounded-lg px-2 py-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>

              <span className="text-sm font-medium">
                Create organization
              </span>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}