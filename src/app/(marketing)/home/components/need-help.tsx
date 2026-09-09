import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/cta-button";

const NeedHelp: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-16 text-white">
      <Image
        src="/images/org/spot-lights-up.png"
        alt="Ventiqo support"
        fill
        className="object-cover opacity-40"
      />
      <div className="container relative z-10 mx-auto flex flex-col items-center gap-4 px-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Need help?</h2>
        <p className="max-w-xl text-white/80">
          Our dedicated support team is ready to assist you with any questions
          or concerns.
        </p>
        <p className="max-w-xl font-medium text-[#F5A623]">
          Let&apos;s make every event unforgettable, together.
        </p>
        <Button asChild className="mt-2 bg-[#F5A623] px-8 py-3 text-white hover:bg-[#F5A623]/90" size="lg">
          <Link href="/#contact-us">Get Help</Link>
        </Button>
      </div>
    </section>
  );
};

export default NeedHelp;
