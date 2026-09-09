import Image from "next/image";
import { Button } from "@/components/ui/cta-button";
import { Target, Eye } from "lucide-react"; // Icons from Lucide-react for UI enhancement

const MissionVisionSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r to-blue-100 py-10 mb-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Text Section */}
        <div className="space-y-10">
          {/* Mission */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg mb-6">
              Our mission is to empower event organizers and attendees alike.
              We&apos;re committed to simplifying event management for organizers
              and making event discovery seamless for attendees. Whether you&apos;re
              planning a small gathering, a cultural festival, or attending a
              concert, Ventiqo is here to elevate every event journey.
            </p>
          </div>

          {/* Vision */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 text-lg mb-6">
              We envision a world where events are accessible to everyone, where the joy of discovery and the thrill of shared experiences are at the heart of every community. We&apos;re on a mission to make event participation effortless and event creation a joyous experience.
            </p>
          </div>

          {/* CTA Button */}
          <Button className="bg-yellow-500 text-white px-6 py-3" size="lg">
            Get started Today
          </Button>
        </div>

        {/* Right Image Section */}
        <div className="relative w-full h-[600px]"> {/* Set the height for the image and overlay */}
          {/* Teal Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-teal-500 opacity-50 z-10 rounded-lg"></div>

          {/* Circles with Icons */}
          <div className="absolute z-20 left-0 top-0 transform -translate-y-1/3 -translate-x-1/3 bg-teal-500 rounded-full p-8">
            <Target className="text-white h-16 w-16" />
          </div>
          <div className="absolute z-20 left-0 top-1/2 transform translate-y-1/2 -translate-x-1/3 bg-teal-500 rounded-full p-8">
            <Eye className="text-white h-16 w-16" />
          </div>

          {/* Image */}
          <Image
            src="/images/org/dance-neon-light-background-image.png" 
            alt="Ventiqo Vision"
            fill
            className="rounded-lg z-0 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
