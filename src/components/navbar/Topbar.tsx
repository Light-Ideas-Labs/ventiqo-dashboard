"use client"

import Link from "next/link"
import SearchBar from "./SearchBar"
import UserMenu from "./UserMenu"
import NotificationsDropdown from "./NotificationsDropdown"
import { HelpCircle } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-xl px-6 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex min-w-0 flex-1 items-center gap-3">

        {/* Sidebar Toggle */}
        <SidebarTrigger className="mr-2 shrink-0" />

        {/* Search */}
        <SearchBar />

      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-3">

        <NotificationsDropdown />

        <Button asChild variant="ghost" size="icon">
          <Link href="/organizer/help" aria-label="Help">
            <HelpCircle className="w-5 h-5" />
          </Link>
        </Button>

        <UserMenu />

      </div>
    </header>
  )
}
