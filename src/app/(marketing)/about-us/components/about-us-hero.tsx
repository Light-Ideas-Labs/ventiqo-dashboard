import Image from "next/image";
import { Button } from "@/components/ui/cta-button"; // Assuming you have a reusable CTA Button component

const AboutUsHero = () => {
  return (
    <section className="relative bg-blue-50 py-16 mb-20">
      {/* Top Section with Image and Overlay */}
      <div className="relative w-full">
        {/* Full Width Image */}
        <div className="relative w-full">
          {/* Teal Overlay */}
          <div className="absolute inset-0 bg-teal-500 opacity-50 z-10"></div>

          <Image
            src="/images/logo/dancers-party.png" // Replace with your top image path
            alt="Event Crowd"
            layout="responsive"
            width={1600} // Adjusted for full width
            height={600} // Adjusted for appropriate height
            className="object-cover"
          />
        </div>

        {/* CTA Buttons */}
        <div className="absolute top-1/2 right-8 flex gap-4 mt-6 z-30">
          <Button className="bg-yellow-500 text-white px-6 py-3 rounded-lg">
            Organise an Event
          </Button>
          <Button className="bg-yellow-500 text-white px-6 py-3 rounded-lg">
            Explore Events
          </Button>
        </div>
      </div>

      {/* Text and Bottom Image Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Image */}
        <div className="relative w-full flex justify-center">
          <Image
            src="/images/logo/hands-in-air.png" // Replace with your bottom image path
            alt="Celebration Event"
            width={500}
            height={500}
            className="object-cover rounded-md"
          />
        </div>

        {/* Right Text Section */}
        <div className="space-y-6">
        <p className="text-lg">
            At Ventiqo, we’re passionate about events. Our journey began with a
            simple idea: to create a platform that transforms ordinary moments
            into extraordinary experiences.
          </p>
          <p className="text-lg text-gray-700">
            We believe that every event has the potential to inspire, connect,
            and leave a lasting impact on people’s lives.
          </p>
          <Button className="bg-yellow-500 text-white px-6 py-3 rounded-lg">
            Signup Today!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHero;
