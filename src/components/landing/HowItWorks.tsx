

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 px-6">

      <h2 className="text-3xl font-bold text-center mb-12">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">

        <div>
          <h3 className="font-semibold">1. Create Event</h3>
          <p className="text-gray-500 text-sm mt-2">
            Set up your event in minutes.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">2. Sell Tickets</h3>
          <p className="text-gray-500 text-sm mt-2">
            Share your event and start selling.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">3. Track Growth</h3>
          <p className="text-gray-500 text-sm mt-2">
            Monitor performance in real-time.
          </p>
        </div>

      </div>

    </section>
  )
}