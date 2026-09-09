import React from 'react';
import { Music, Camera, Star, Calendar } from 'lucide-react'; // Import other icons as needed

// Define the prop types for MapMarker
interface MapMarkerProps {
  distance: number;
  Icon: React.ComponentType<any>; // Correct type for Lucide icons
}

const MapMarker: React.FC<MapMarkerProps> = ({ distance, Icon }) => {
  return (
    <div className="flex items-center px-2 py-1 bg-white shadow-md rounded-full">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white">
        <Icon className="w-4 h-4" /> {/* Dynamic icon */}
      </div>
      <span className="ml-2 text-sm font-semibold text-gray-800">{distance} km</span>
    </div>
  );
};

// Usage with different icons
const ExampleUsage = () => {
  return (
    <div>
      {/* Music Event Marker */}
      <MapMarker distance={15} Icon={Music} />
      
      {/* Camera Event Marker */}
      <MapMarker distance={10} Icon={Camera} />

      {/* Star Event Marker */}
      <MapMarker distance={5} Icon={Star} />
      
      {/* Calendar Event Marker */}
      <MapMarker distance={20} Icon={Calendar} />
    </div>
  );
};

export default MapMarker;
