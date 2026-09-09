"use client"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export function Search() {
  return (
    <Button
      variant="outline"
      className="relative h-9 w-full justify-start rounded-md text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
    >
      <SearchIcon className="h-4 w-4 xl:mr-2" />
      <span className="hidden xl:inline-flex">Search...</span>
      <span className="sr-only">Search</span>
      <Kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden sm:flex">
        Ctrl+K
      </Kbd>
    </Button>
  )
}
