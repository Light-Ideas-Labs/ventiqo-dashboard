// components/landing/Features.tsx

export default function Features() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold text-center mb-12">
        Everything You Need to Run Events
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="p-6 border rounded-xl">
          <h3 className="font-semibold">Ticketing</h3>
          <p className="text-sm text-gray-500 mt-2">
            Sell tickets with ease and manage attendees.
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-gray-500 mt-2">
            Track revenue, engagement, and growth.
          </p>
        </div>

        <div className="p-6 border rounded-xl">
          <h3 className="font-semibold">Payments</h3>
          <p className="text-sm text-gray-500 mt-2">
            Accept payments seamlessly across channels.
          </p>
        </div>

      </div>

    </section>
  )
}