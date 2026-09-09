import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/cta-button";

const About: React.FC = () => {
  return (
    <div className="bg-[#2C7873] py-16 text-white">
      <div className="container mx-auto flex flex-col items-center gap-10 md:flex-row md:items-start">
        {/* Sidebar "ABOUT US" Text */}
        <div className="hidden shrink-0 items-center justify-center md:flex">
          <h2
            className="text-4xl font-bold tracking-widest text-white/80"
            style={{ writingMode: "vertical-lr", textOrientation: "upright" }}
          >
            ABOUT US
          </h2>
        </div>

        {/* Text Section */}
        <div className="flex w-full flex-col items-start md:w-1/2">
          <p className="text-md mb-4 leading-relaxed md:text-lg">
            Welcome to <strong>Ventiqo</strong>, your all-in-one destination for
            unlocking the full potential of events! Whether you&apos;re an
            event organizer looking to craft unforgettable experiences or an
            event enthusiast seeking thrilling adventures, Ventiqo is here to
            make your event journey extraordinary.
          </p>
          <p className="text-md mb-6 leading-relaxed md:text-lg">
            Join us on this journey of discovery, connection, and experience.
            Together, we&apos;ll create and enjoy events that make life more
            vibrant.
          </p>
          <Button className="bg-[#F5A623] px-6 py-2 text-white hover:bg-[#F5A623]/90" size="lg">
            Signup Today!
          </Button>
        </div>

        {/* Image Section */}
        <div className="flex w-full justify-center md:w-1/3">
          <Image
            src="/images/logo/vibes.png"
            alt="Event Vibes"
            width={420}
            height={500}
            className="h-auto w-full max-w-xs object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
