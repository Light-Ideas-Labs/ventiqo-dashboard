"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  BarChart3,
  Megaphone,
  Wallet,
  CreditCard,
  ClipboardList,
  PlusCircle,
  Sparkles,
  Settings,
  Gift,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { TeamSwitcherContainer } from "./TeamSwitcherContainer"
import { NavMain } from "./NavMain"

const appSidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/organizer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Events",
      url: "/organizer/events",
      icon: Calendar,
      items: [
        { title: "All Events", url: "/organizer/events" },
        { title: "Active Events", url: "/organizer/events?status=active" },
        { title: "Past Events", url: "/organizer/events?status=past" },
        { title: "Drafts", url: "/organizer/events?status=draft" },
        { title: "Cancelled", url: "/organizer/events?status=cancelled" },
        { title: "Bookings", url: "/organizer/bookings" },
      ],
    },
    {
      title: "Attendees",
      url: "/organizer/attendees",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/organizer/analytics",
      icon: BarChart3,
    },
    {
      title: "Calendar",
      url: "/organizer/calendar",
      icon: CalendarDays,
    },
    {
      title: "Marketing",
      url: "/organizer/marketing",
      icon: Megaphone,
    },
    {
      title: "Finances",
      url: "/organizer/invoices",
      icon: Wallet,
      items: [
        { title: "Invoices", url: "/organizer/invoices" },
        { title: "Billing", url: "/organizer/billing" },
        { title: "Payments", url: "/organizer/payments" },
      ],
    },
    {
      title: "Operations",
      url: "/organizer/operations/budget-tracker",
      icon: ClipboardList,
      items: [{ title: "Budget Tracker", url: "/organizer/operations/budget-tracker" }],
    },
    {
      title: "Referrals",
      url: "/organizer/referrals",
      icon: Gift,
    },
    {
      title: "Settings",
      url: "/organizer/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>

      {/* HEADER */}
      <SidebarHeader>
        <TeamSwitcherContainer />

        <Button asChild className="mx-2 mt-2 justify-start gap-2 rounded-xl">
          <Link href="/organizer/events/new">
            <PlusCircle className="size-4" />
            Create Event
          </Link>
        </Button>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <NavMain items={appSidebarData.navMain} />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mx-2 mb-1 space-y-2 rounded-xl border border-border bg-sidebar-accent p-3">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-4 text-primary" />
                Unlock more features
              </div>
              <Button asChild size="sm" variant="outline" className="w-full rounded-lg">
                <Link href="/organizer/billing">Upgrade</Link>
              </Button>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Payment Setup">
              <Link href="/organizer/payments">
                <CreditCard />
                <span>Payment Setup</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 pb-1 text-xs text-muted-foreground">Ventiqo v1.0</div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
