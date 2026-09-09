"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import EventsFilters, { type EventsFiltersState, type TimeFilterValue } from "@/components/events/EventsFilters"
import EventsTable from "@/components/events/EventsTable"
import EventsGrid from "@/components/events/EventsGrid"
import EventsPagination from "@/components/events/EventsPagination"
import DataError from "@/components/shared/DataError"
import { useMyOrganizer } from "@/state/organizersAPI"
import { useEventsByOrganizer, type Event } from "@/state/eventsAPI"
import { eventDisplayStatus, type EventDisplayStatus } from "@/lib/event-stats"

const VALID_STATUSES = new Set<EventDisplayStatus>(["active", "draft", "past", "cancelled"])

function withinTimeFilter(event: Event, filter: TimeFilterValue): boolean {
  if (filter === "all") return true

  const date = new Date(event.date)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  if (filter === "today") {
    const endOfToday = new Date(startOfToday)
    endOfToday.setDate(endOfToday.getDate() + 1)
    return date >= startOfToday && date < endOfToday
  }

  if (filter === "week") {
    const weekEnd = new Date(startOfToday)
    weekEnd.setDate(weekEnd.getDate() + 7)
    return date >= startOfToday && date < weekEnd
  }

  if (filter === "month") {
    const monthEnd = new Date(startOfToday.getFullYear(), startOfToday.getMonth() + 1, 1)
    return date >= startOfToday && date < monthEnd
  }

  // next30
  const in30 = new Date(startOfToday)
  in30.setDate(in30.getDate() + 30)
  return date >= startOfToday && date < in30
}

function EventsPageContent() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status")
  const initialQuery = searchParams.get("q")

  const { data: organizerData, isError: organizerError, refetch: refetchOrganizer } = useMyOrganizer()
  const organizerId = organizerData?.data?._id

  const {
    data: eventsData,
    isLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useEventsByOrganizer(organizerId)
  const events = useMemo(() => eventsData?.paginatedEvents?.data ?? [], [eventsData])

  const [filters, setFilters] = useState<EventsFiltersState>({
    search: initialQuery ?? "",
    statuses:
      initialStatus && VALID_STATUSES.has(initialStatus as EventDisplayStatus)
        ? new Set([initialStatus as EventDisplayStatus])
        : new Set(),
    time: "all",
    view: "list",
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredEvents = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    return events.filter((event) => {
      if (query) {
        const haystack = `${event.title} ${event.venueName}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      if (filters.statuses.size > 0 && !filters.statuses.has(eventDisplayStatus(event))) {
        return false
      }
      if (!withinTimeFilter(event, filters.time)) return false
      return true
    })
  }, [events, filters])

  const sortedEvents = useMemo(
    () => [...filteredEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [filteredEvents]
  )

  const pageStart = (page - 1) * pageSize
  const pagedEvents = sortedEvents.slice(pageStart, pageStart + pageSize)

  const handleFiltersChange = (next: EventsFiltersState) => {
    setFilters(next)
    setPage(1)
  }

  if (organizerError) {
    return <DataError message="Couldn't load your organizer profile." onRetry={() => refetchOrganizer()} />
  }

  if (eventsError) {
    return <DataError message="Couldn't load your events." onRetry={() => refetchEvents()} />
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-sm text-muted-foreground">Manage all your events in one place</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/organizer/events/new">Create Event</Link>
        </Button>
      </div>

      <EventsFilters state={filters} onChange={handleFiltersChange} />

      {isLoading && <p className="text-sm text-muted-foreground">Loading events…</p>}

      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
          <p className="font-medium">No events yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first event to start selling tickets.
          </p>
          <Button asChild className="mt-2 rounded-xl">
            <Link href="/organizer/events/new">Create Event</Link>
          </Button>
        </div>
      )}

      {!isLoading && events.length > 0 && filteredEvents.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">
          No events match your filters.
        </div>
      )}

      {!isLoading && pagedEvents.length > 0 && (
        <>
          {filters.view === "list" ? <EventsTable events={pagedEvents} /> : <EventsGrid events={pagedEvents} />}

          <EventsPagination
            page={page}
            pageSize={pageSize}
            total={sortedEvents.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </>
      )}
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading events…</p>}>
      <EventsPageContent />
    </Suspense>
  )
}
