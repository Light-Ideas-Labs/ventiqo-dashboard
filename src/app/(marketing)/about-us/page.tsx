//

"use client";

import React from "react";

// components
import Navbar from "../../../components/navbar/navbar";
import Footer from "../../../components/navbar/footer";

// sections
import AboutUsHero from "./components/about-us-hero";
import MissionVisionSection from "./components/mission-vision-section";
import VentiqoValues from "./components/ventiqo-values-section";
import TeamSection from "./components/team-section";

const Home = () => {
  return (
    <>
      <Navbar />
      <AboutUsHero />
      <MissionVisionSection />
      <VentiqoValues />
      <TeamSection />
      <Footer />
    </>
  );
};

export default Home;
