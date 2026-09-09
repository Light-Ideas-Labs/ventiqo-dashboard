import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/cta-button";

const WhyUsCta: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
          Why Choose Us?
        </h2>
        <p className="max-w-2xl text-lg text-gray-700 md:text-xl">
          Why settle for the ordinary when you can have{" "}
          <strong>extraordinary</strong> event experiences with Ventiqo?
        </p>
        <p className="max-w-2xl text-lg text-gray-700 md:text-xl">
          Discover the hottest events in your city, <strong>book tickets</strong>{" "}
          in seconds, and <strong>connect</strong> with fellow attendees. Your
          next adventure starts here.
        </p>

        <div className="relative mt-4 w-full max-w-3xl overflow-hidden rounded-3xl">
          <Image
            src="/images/org/dance-neon-light-background-image.png"
            alt="Why choose Ventiqo"
            width={900}
            height={500}
            className="h-64 w-full object-cover md:h-96"
          />
        </div>

        <Button asChild className="mt-4 bg-[#F5A623] px-8 py-3 text-white hover:bg-[#F5A623]/90" size="lg">
          <Link href="/events">Explore events Now!</Link>
        </Button>
      </div>
    </section>
  );
};

export default WhyUsCta;
