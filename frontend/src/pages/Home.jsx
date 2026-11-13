import React from "react";
import HomeMain from "../components/HomeMain";
import WhyRituals from "../components/WhyRituals";
import SacredKnowledge from "../components/SacredKnowledge";
import AstrologyTools from "../components/AstrologyTools";

import HomeShop from "../shop/HomeShop";
import DailySacredRhythm from "../components/DailySacredRhythm";
import LivingWisdom from "../components/LivingWisdom";
import SacredMissionSection from "../components/SacredMissionSection";
import FundRaiser from "../components/FundRaiser";
import Community from "../components/Community";
import AppSection from "../components/AppSection";
import FAQ from "../components/FAQ";
import SacredJourney from "../components/SacredJourney";
import GitaSlider from "../knowledge/GitaSlider";

function Home() {
  return (
    <>
      {/* Phase I — The Awakening */}
      <HomeMain />
      {/* Shop modules in playbook order: format → fragrances → start → collections → beads → complete → info */}
      <HomeShop />
      <WhyRituals />
      <SacredKnowledge />
      <GitaSlider />
      <AstrologyTools />

      {/* Phase II — The Daily Practice */}
      <DailySacredRhythm />
      <LivingWisdom />
      <Community />

      {/* Phase III — Deeper Connection */}
      <SacredMissionSection />
      <FundRaiser />
      {/* <AppSection /> */}
      {/* <FAQ /> */}
      <SacredJourney />
    </>
  );
}

export default Home;
