import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/cta-button";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-b-[3rem] bg-[#2C7873] pt-28 text-white">
      {/* Colorful background image */}
      <Image
        src="/images/logo/dancers-party.png"
        alt="Ventiqo events"
        fill
        priority
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2C7873] via-[#2C7873]/80 to-transparent" />

      <div className="container relative z-10 mx-auto flex flex-col items-center gap-6 px-4 py-20 text-center">
        <h1 className="max-w-3xl text-pretty text-4xl font-bold lg:text-6xl">
          <span className="font-extrabold">Ventiqo:</span> Your Ultimate
          Event Hub
        </h1>
        <p className="text-2xl italic tracking-wide text-white/90 lg:text-3xl">
          Discover . Connect . Experience
        </p>
        <p className="max-w-2xl text-white/90 lg:text-lg">
          Streamline Event Planning &amp; Management, Boost Engagement and
          Elevate Event Experiences.
        </p>
        <div className="mt-4 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Button asChild className="bg-[#F5A623] px-8 py-3 text-white hover:bg-[#F5A623]/90" size="lg">
            <Link href="/sign-up">Organise an Event</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="border border-white/60 bg-transparent px-8 py-3 text-white hover:bg-white/10"
            size="lg"
          >
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
