import Image from "next/image";
import { Button } from "@/components/ui/cta-button";
import { Lightbulb, Heart, Users, ShieldCheck, Star } from "lucide-react"; // Icons from Lucide-react for UI enhancement

const VentiqoValues: React.FC = () => {
  return (
    <section className="bg-blue-50 py-10 mb-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Image Section */}
        <div className="relative w-full md:w-1/2 flex justify-center h-[500px]"> {/* Set a fixed height */}
          {/* Teal Background Container */}
          <div className="bg-teal-500 relative p-6 w-full h-full flex justify-center">
            {/* Centered Image positioned at the bottom */}
            <Image
              src="/Images/org/spot-lights-up.png" // Add path to the image here
              alt="Ventiqo Values Image"
              width={400}
              height={500}
              className="absolute bottom-0 transform translate-y-1/2" // Image at the bottom and centered
            />
          </div>
        </div>

        {/* Right Text Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-[500px]"> {/* Align height with image */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Values</h2>

            {/* Values List */}
            <ul className="space-y-6">
              <li className="flex items-center">
                <Heart className="text-red-500 h-6 w-6 mr-3" />
                <div>
                  <strong>Passion:</strong> Events fuel our passion. We’re driven by the excitement of bringing people together and creating memorable moments.
                </div>
              </li>

              <li className="flex items-center">
                <Lightbulb className="text-yellow-500 h-6 w-6 mr-3" />
                <div>
                  <strong>Innovation:</strong> We’re committed to staying at the forefront of technology to provide innovative solutions for event management and discovery.
                </div>
              </li>

              <li className="flex items-center">
                <Users className="text-green-500 h-6 w-6 mr-3" />
                <div>
                  <strong>Community:</strong> Ventiqo is more than a platform; it’s a community of event enthusiasts, organizers, and partners who share our love for exceptional experiences.
                </div>
              </li>

              <li className="flex items-center">
                <ShieldCheck className="text-blue-500 h-6 w-6 mr-3" />
                <div>
                  <strong>Transparency:</strong> We believe in openness and honesty in everything we do, from pricing to data security.
                </div>
              </li>

              <li className="flex items-center">
                <Star className="text-purple-500 h-6 w-6 mr-3" />
                <div>
                  <strong>Quality:</strong> We’re dedicated to delivering high-quality experiences, from the events we feature to the tools we provide.
                </div>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Button className="bg-yellow-500 text-white px-6 py-3 rounded-lg">
              Get started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VentiqoValues;
