// components/landing/EventsPreview.tsx

export default function EventsPreview() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-10">
        Discover Events
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="border rounded-xl p-4">
          <p className="font-semibold">Afro Music Festival</p>
          <p className="text-sm text-gray-500">Nairobi</p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="font-semibold">Tech Conference</p>
          <p className="text-sm text-gray-500">Lagos</p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="font-semibold">Startup Meetup</p>
          <p className="text-sm text-gray-500">Cape Town</p>
        </div>

      </div>

    </section>
  )
}