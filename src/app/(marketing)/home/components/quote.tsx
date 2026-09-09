import React from "react";

const Quote: React.FC = () => {
  return (
    <section className="bg-[#EAF6F6] py-16">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <p className="font-serif text-2xl italic leading-relaxed text-gray-700 md:text-3xl">
          &ldquo;Every event is a story waiting to be told, a memory waiting to
          be made, and a connection waiting to be forged.&rdquo;
        </p>
      </div>
    </section>
  );
};

export default Quote;
