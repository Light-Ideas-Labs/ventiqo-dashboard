"use client"

import StatsCards from "@/components/cards/StatsCards"
import DataError from "@/components/shared/DataError"
import { useAllEvents } from "@/state/eventsAPI"

export function EventsSectionCards() {
  const { data, isLoading, isError, refetch } = useAllEvents()
  const events = data?.events?.data ?? []

  if (isError) {
    return <DataError message="Couldn't load event stats." onRetry={() => refetch()} />
  }

  return <StatsCards events={events} isLoading={isLoading} />
}
