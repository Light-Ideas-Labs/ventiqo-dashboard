import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/solid";

const OrganisersToFollow = () => {
  // Sample organizers data
  const organizers = [
    {
      id: 1,
      name: "Millaz Productions",
      logo: "/images/org/millaz-logo.png", // Update with actual image path
    },
    {
      id: 2,
      name: "Phil-it Productions",
      logo: "/images/org/phil-it-logo.png",
    },
    {
      id: 3,
      name: "Polkadot",
      logo: "/images/org/polkadot-logo.png",
    },
    {
      id: 4,
      name: "Mara Foundation",
      logo: "/images/org/mara-logo.png",
    },
  ];

  return (
    <section className="py-16 bg-blue-50 mt-20">
      <div className="container mx-auto">
        <div className="bg-blue-200 text-center rounded-t-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900">Organisers to follow</h2>
        </div>
        
        <div className="relative flex justify-center items-center space-x-4">
          {/* Left Arrow */}
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
            <ArrowLeftIcon className="w-5 h-5 text-blue-500" />
          </button>

          {/* Organizers Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {organizers.map((organizer) => (
              <div key={organizer.id} className="bg-white rounded-lg shadow-md p-4 text-center">
                <Image src={organizer.logo} alt={organizer.name} className="mx-auto mb-4 w-20 h-20 object-cover rounded-full" width={80} height={80} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{organizer.name}</h3>
                <Button variant="outline" className="px-6 py-2 rounded-full">Follow</Button>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
            <ArrowRightIcon className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrganisersToFollow;
