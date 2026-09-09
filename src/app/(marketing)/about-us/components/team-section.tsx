import Image from "next/image";

const TeamSection = () => {
  return (
    <section className=" py-10 mt-20">
      <div className="container mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold mb-8 text-blue-800">Our Team</h2>
        <p className="text-lg mb-12 text-gray-700">
          Meet the faces behind Ventiqo. Our diverse team brings together expertise in event management, technology, marketing, and user experience design. 
          Together, we&apos;re shaping the future of events, one click at a time.
        </p>

        {/* Team Members */}
        <div className="flex justify-center gap-10">
          {/* Team Member 1 */}
          <div className="text-center">
            <Image
              src="/images/user/user-01.png" // Add the path to the actual image
              alt="Jordan Muthemba"
              width={150}
              height={150}
              className="rounded-full"
            />
            <h3 className="text-xl font-semibold mt-4">Jordan Muthemba</h3>
          </div>

          {/* Team Member 2 */}
          <div className="text-center">
            <Image
              src="/images/user/user-02.png" // Add the path to the actual image
              alt="Rachael Chege"
              width={150}
              height={150}
              className="rounded-full"
            />
            <h3 className="text-xl font-semibold mt-4">Rachael Chege</h3>
          </div>

          {/* Team Member 3 */}
          <div className="text-center">
            <Image
              src="/images/user/user-03.png" // Add the path to the actual image
              alt="Unknown"
              width={150}
              height={150}
              className="rounded-full"
            />
            <h3 className="text-xl font-semibold mt-4">Unknown</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
