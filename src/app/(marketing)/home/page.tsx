"use client";

import React from "react";

// components
import Navbar from "../../../components/navbar/navbar";
import Footer from "../../../components/navbar/footer";

// sections
import Hero from "./components/hero";
import About from "./components/about";
import OrganizerKeyFeatures from "./components/organiser-features"
import WhyChooseUs from "./components/why-choose-us"
import EventAttendees from "./components/event-attendees"
import WhyUsCta from "./components/why-us-cta";
import VentiqoCTA from "./components/ventiqo-cta";
import OrganisersToFollow from "./components/organisers-to-follow"
import WorkWithUs from "./components/work-with-us";
import NeedHelp from "./components/need-help";
import Quote from "./components/quote";
import EventContent from "./components/event-content";
import SponsoredBy from "./components/sponsored-by";
import OurStats from "./components/our-stats";
import FAQ from "./components/faq";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <OrganizerKeyFeatures />
      <WhyChooseUs />
      <EventAttendees />
      <WhyUsCta />
      <VentiqoCTA />
      <OrganisersToFollow />
      <WorkWithUs />
      <NeedHelp />
      <Quote />
      {/* <SponsoredBy /> */}
      {/* <OurStats /> */}
      {/* <FAQ /> */}
      <Footer />
    </>
  );
};

export default Home;


// ## Inspiration
// ## What it does
// ## How we built it
// ## Challenges we ran into
// ## Accomplishments that we're proud of
// ## What we learned
// ## What's next for GPAccess
