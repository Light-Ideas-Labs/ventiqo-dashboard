"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const submit = () => {
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(`/organizer/events?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="relative w-full min-w-0 max-w-[320px]">

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Search events, attendees.."
        className="
          pr-10
          h-10
          rounded-xl
          bg-muted/50
          border
          border-border
          focus-visible:ring-1
          focus-visible:ring-primary/40
        "
      />

      {/* ICON RIGHT */}
      <button
        type="button"
        onClick={submit}
        aria-label="Search"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <Search className="w-4 h-4" />
      </button>

    </div>
  )
}
