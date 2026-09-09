"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, CreditCard, Wallet, ChevronDown } from "lucide-react"

function getInitials(name?: string) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")
}

export default function UserMenu() {
  const { data: session } = useSession()
  const fullName =
    [session?.user?.first_name, session?.user?.last_name].filter(Boolean).join(" ") || "Account"
  const email = session?.user?.email ?? ""
  const initials = getInitials(fullName).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-accent">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-left text-sm leading-tight md:block">
            <span className="block font-medium">{fullName}</span>
            <span className="block text-xs text-muted-foreground">{email}</span>
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-sm leading-tight">
              <p className="font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/organizer/settings">
            <User className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/organizer/billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/organizer/payments">
            <Wallet className="mr-2 h-4 w-4" />
            Payment Setup
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-semantic-error focus:text-semantic-error"
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
