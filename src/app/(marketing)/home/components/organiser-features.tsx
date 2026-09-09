import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const OrganizerKeyFeatures: React.FC = () => {
  return (
    <section className="bg-gradient-to-r to-blue-100 py-16 relative">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        {/* Left Text Section */}
        <div className="flex flex-col w-full md:w-1/2 items-start justify-center space-y-5">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Event Organizers
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Welcome to <strong>Ventiqo</strong> – Your Ultimate Event Partner!
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            As an event organizer, you&apos;re in for a treat. Whether it&apos;s a small
            gathering or a massive festival, we&apos;ve got you covered.
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            Ventiqo is here to simplify every aspect of event management, from
            promotion and ticketing to attendee engagement.
          </p>
          <Button className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-lg">
            Get started Today
          </Button>
        </div>

        {/* Right Key Features Section */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center">
          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20"  style={{ marginRight: "65px" }}>
            <div className="bg-green-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Effortless Event Creation
              </h3>
            </div>
            <div className="bg-blue-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Powerful Promotion Tools
              </h3>
            </div>
            <div className="bg-blue-200 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Real-time Ticket Sales Analytics and Insights
              </h3>
            </div>
            <div className="bg-teal-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Attendee Engagement Insights
              </h3>
            </div>
            <div className="bg-green-200 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Integrated Ticketing and Secure Payment Processing
              </h3>
            </div>
            <div className="bg-purple-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Customizable Registration Forms
              </h3>
            </div>
          </div>

          {/* Background Image Positioned */}
          <div className="absolute right-0 top-10 z-30  flex justify-center items-center h-full w-auto">
            <Image
              src="/images/logo/event_org.png" // Replace with the correct image path
              alt="Event Organiser Key Features"
              width={600} // Adjust width
              height={600} // Adjust height
              className="object-cover"
              style={{
                transform: "translate(30%, 10%)", // Fine-tune for hand and head placement
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizerKeyFeatures;
