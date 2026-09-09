import React from "react";
import Image from "next/image"; 
import { DollarSign, MessagesSquare, PersonStanding, Timer, Zap, ZoomIn, } from 'lucide-react';

const features = [
  {
    title: 'Performance',
    description:
      'Optimized for speed and efficiency, ensuring smooth event management experiences.',
    icon: <Timer className="size-4 md:size-6" />,
  },
  {
    title: 'Innovation',
    description:
      'Cutting-edge technology that makes managing events seamless and innovative.',
    icon: <Zap className="size-4 md:size-6" />,
  },
  {
    title: 'Quality',
    description:
      'Top-notch user experience with high-quality standards across the platform.',
    icon: <ZoomIn className="size-4 md:size-6" />,
  },
  {
    title: 'Accessibility',
    description:
      'Fully accessible to all users, ensuring inclusivity and ease of use for everyone.',
    icon: <PersonStanding className="size-4 md:size-6" />,
  },
  {
    title: 'Affordability',
    description:
      'Offering cost-effective solutions to host and manage events at any scale.',
    icon: <DollarSign className="size-4 md:size-6" />,
  },
  {
    title: 'Customer Support',
    description:
      'Dedicated 24/7 customer support to ensure all your event needs are met.',
    icon: <MessagesSquare className="size-4 md:size-6" />,
  },
];

const Features: React.FC = () => {
  return (
    <div className="bg-gray-100 py-16">
      {/* Features Introduction */}
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col w-full md:w-1/2 items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Features
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Ventiqo offers a modern, all-in-one solution for event management. 
            Streamline your workflow, enhance collaboration, and improve efficiency 
            with our innovative platform.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="btn btn-primary px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300">
              Get Started
            </button>
            <button className="btn btn-secondary px-6 py-3 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition duration-300">
              Learn More
            </button>
          </div>
        </div>
        Features Image
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/cards/cards-01.png"
            alt="Ventiqo platform"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            width={500}
            height={500}
          />
        </div>
      </div>

      {/* Features Icons Section */}
      <div className="container mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
