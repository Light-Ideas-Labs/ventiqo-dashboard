"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="font-bold text-lg flex items-center gap-2">
          🎟️ Ventiqo
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#how" className="hover:text-foreground">
            How it works
          </Link>
          <Link href="#events" className="hover:text-foreground">
            Events
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </header>
  )
}