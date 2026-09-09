import { Button } from "@/components/ui/button";

const VentiqoCTA = () => {
  return (
    <div className="mt-20 flex flex-col items-center space-y-8">
      <div className="flex space-x-8">
        <div className="relative rounded-lg bg-teal-600 p-8 text-white shadow-lg">
          <div className="absolute inset-0 translate-x-2 translate-y-2 transform rounded-lg border-2 border-teal-600"></div>
          <h2 className="font-indie mb-4 text-2xl">
            Ready to Elevate Your Events?
          </h2>
          <button className="rounded-full bg-orange-400 px-4 py-2 text-white">
            Get started Today!
          </button>
        </div>
        <div className="relative rounded-lg bg-blue-400 p-8 text-white shadow-lg">
          <div className="absolute inset-0 -translate-x-2 -translate-y-2 transform rounded-lg border-2 border-blue-400"></div>
          <h2 className="font-indie mb-4 text-2xl">
            Discover Your Next Adventure
          </h2>
          <button className="rounded-full bg-orange-400 px-4 py-2 text-white">
            Explore events Now!
          </button>
        </div>
      </div>
      <button className="rounded-full bg-orange-400 px-6 py-3 text-white">
        Start Planning your Event Today
      </button>
    </div>
  );
};

export default VentiqoCTA;
