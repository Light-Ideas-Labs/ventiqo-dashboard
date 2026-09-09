"use client"

import { Search, Filter, LayoutGrid, List, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { EVENT_STATUS_LABEL, type EventDisplayStatus } from "@/lib/event-stats"

export type TimeFilterValue = "all" | "today" | "week" | "month" | "next30"

const ALL_STATUSES: EventDisplayStatus[] = ["active", "draft", "past", "cancelled"]

const TIME_LABELS: Record<TimeFilterValue, string> = {
  all: "All Time",
  today: "Today",
  week: "This Week",
  month: "This Month",
  next30: "Next 30 Days",
}

export interface EventsFiltersState {
  search: string
  statuses: Set<EventDisplayStatus>
  time: TimeFilterValue
  view: "list" | "grid"
}

export default function EventsFilters({
  state,
  onChange,
}: {
  state: EventsFiltersState
  onChange: (next: EventsFiltersState) => void
}) {
  const { search, statuses, time, view } = state

  const toggleStatus = (status: EventDisplayStatus) => {
    const next = new Set(statuses)
    next.has(status) ? next.delete(status) : next.add(status)
    onChange({ ...state, statuses: next })
  }

  const clearAll = () => onChange({ search: "", statuses: new Set(), time: "all", view })

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (search) {
    chips.push({ key: "search", label: `"${search}"`, onRemove: () => onChange({ ...state, search: "" }) })
  }
  for (const status of statuses) {
    chips.push({
      key: `status-${status}`,
      label: EVENT_STATUS_LABEL[status],
      onRemove: () => toggleStatus(status),
    })
  }
  if (time !== "all") {
    chips.push({ key: "time", label: TIME_LABELS[time], onRemove: () => onChange({ ...state, time: "all" }) })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onChange({ ...state, search: e.target.value })}
            placeholder="Search by event name, venue…"
            className="pl-9"
          />
        </div>

        {/* STATUS FILTER */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              {statuses.size === 0 ? "All Events" : `${statuses.size} status${statuses.size > 1 ? "es" : ""}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statuses.has(status)}
                onCheckedChange={() => toggleStatus(status)}
                onSelect={(e) => e.preventDefault()}
              >
                {EVENT_STATUS_LABEL[status]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* TIME FILTER */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{TIME_LABELS[time]}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuRadioGroup
              value={time}
              onValueChange={(v) => onChange({ ...state, time: v as TimeFilterValue })}
            >
              {(Object.keys(TIME_LABELS) as TimeFilterValue[]).map((value) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {TIME_LABELS[value]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* VIEW TOGGLE */}
        <div className="flex overflow-hidden rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onChange({ ...state, view: "list" })}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            <List className="size-4" /> List
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...state, view: "grid" })}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            <LayoutGrid className="size-4" /> Grid
          </button>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground hover:bg-muted/70"
            >
              {chip.label}
              <X className="size-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
