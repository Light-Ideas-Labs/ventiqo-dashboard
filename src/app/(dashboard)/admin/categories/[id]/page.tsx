'use client';

import { useEffect, useState } from 'react';
import { getEventsByCategory, Event } from '@/state/eventsAPI';

export default function CategoryEventsPage({
  params,
}: {
  params: { id: string };
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEventsByCategory(params.id);
        if (response && response.paginatedEvents.data) {
          setEvents(response.paginatedEvents.data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [params.id]);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Events in {params.id}</h1>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h2>{event.title}</h2>
            <p>{event.aboutEvent}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
