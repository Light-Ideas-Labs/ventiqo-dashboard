import React from "react";
import Image from "next/image";

const EventContent: React.FC = () => {
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-10 p-10">
                <div className="flex flex-col w-full md:w-1/2 items-center md:items-start">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Explore Events with Ventiqo
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mt-5">
                        Ventiqo brings you closer to a world of diverse and exciting events. From concerts and sports to arts and cultural festivals, our platform is your gateway to unforgettable experiences.
                    </p>
                    <p className="text-lg md:text-xl text-gray-700 mt-3">
                        Use our advanced search and personalized recommendation features to discover events that match your interests, and enjoy a seamless ticket purchasing experience.
                    </p>
                    <div className="flex gap-5 mt-10">
                        <button className="btn btn-primary">Discover Events</button>
                        <button className="btn btn-secondary">Join Us</button>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <Image
                        src="/images/cards/cards-01.png"
                        alt="events"
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                    />
                </div>
            </div>
        </div>
    );
}

export default EventContent;
