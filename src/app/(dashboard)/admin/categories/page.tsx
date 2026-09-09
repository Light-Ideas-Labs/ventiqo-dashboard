'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getEventsByCategory, Event } from '@/state/eventsAPI'; // Import your API function

const EventsByCategoryPage = () => {
  const pathname = usePathname(); // Get the current pathname
  const category = pathname.split('/').pop(); // Extract category from the pathname
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      const fetchEvents = async () => {
        try {
          const response = await getEventsByCategory(category);
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
    }
  }, [category]);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Events in {category}</h1>
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
};

export default EventsByCategoryPage;
