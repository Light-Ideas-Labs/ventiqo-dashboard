'use client';

import { useEffect, useState } from 'react';
import { getEventById } from '@/state/eventsAPI';

export default function EventDetailsPage({
  params,
}: {
  params: { eventId: string };
}) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(params.eventId);
        if (response && response.data) {
          setEvent(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setError('Failed to fetch event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId]);

  if (loading) return <div>Loading event...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
      <p className="text-sm text-muted-foreground">{event.venueName}</p>
      <p className="text-sm text-muted-foreground">
        {new Date(event.date).toLocaleDateString()} · {event.startTime} - {event.endTime}
      </p>
      <p className="text-foreground">{event.aboutEvent}</p>
    </div>
  );
}
