import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const EventAttendees: React.FC = () => {
  return (
    <section className="bg-gradient-to-r to-blue-100 py-16 relative mb-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        {/* Left Text Section */}
        <div className="flex flex-col w-full md:w-1/2 items-start justify-center space-y-5">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Event Attendees
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Join the fun with <strong>Ventiqo</strong>! Whether you&apos;re into concerts, workshops, or networking, Ventiqo is your go-to platform to discover and experience the best events in town!
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            From rocking out at concerts to learning something new, we&apos;ve got it all!
          </p>
          <Button className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-lg">
            Explore Events Today!
          </Button>
        </div>

        {/* Right Key Features Section */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center">
          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20">
            <div className="bg-purple-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Event Registration & Ticketing
              </h3>
            </div>
            <div className="bg-green-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Attendee Check-In & Badge Printing
              </h3>
            </div>
            <div className="bg-green-200 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Analytics & Reporting
              </h3>
            </div>
            <div className="bg-blue-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Networking & Interaction Tools
              </h3>
            </div>
            <div className="bg-red-100 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Live Streaming & Virtual Event Hosting
              </h3>
            </div>
            <div className="bg-blue-200 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700">
                Event Website Builder
              </h3>
            </div>
          </div>

          {/* Background Image Positioned */}
          <div className="absolute right-0 top-0  flex justify-end items-center h-full w-auto">
            <Image
              src="/images/logo/event-attendees.png" // Replace with the correct image path
              alt="Event Attendees Having Fun"
              width={600}
              height={600}
              className="object-cover"
              style={{
                transform: "translate(30%, 10%)", // Adjust placement of image
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventAttendees;
