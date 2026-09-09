import React from "react";
import Image from "next/image";

const SponsoredBy: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto flex flex-col items-center justify-center gap-10 p-10 md:flex-row">
        <div className="flex w-full flex-col items-center md:w-1/2 md:items-start">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Sponsored by
          </h1>
          <p className="mt-5 text-lg text-gray-700 md:text-xl">
            A modern solution for your business needs.
          </p>
          <div className="mt-10 flex gap-5">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/images/cards/cards-01.png"
            alt="hero"
            className="h-full w-full object-cover"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsoredBy;
