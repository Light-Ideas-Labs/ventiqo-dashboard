import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const WhyChooseUs: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src="/images/logo/why-us-event-org.PNG" // Add the correct image path here
            alt="Why Choose Us"
            width={500}
            height={500}
            className="object-cover rounded-lg"
          />
        </div>

        {/* Right Text Section */}
        <div className="flex flex-col w-full md:w-1/2 items-start justify-center space-y-5">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why Choose Us?
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Ventiqo is the partner you’ve been waiting for to elevate your events.
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            Whether it&apos;s a small gathering or a large festival, our tools simplify event management and drive ticket sales.
          </p>
          <p className="text-lg md:text-xl text-gray-700">
            Let&apos;s make your events unforgettable.
          </p>
          <Button className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-lg">
            Get started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
