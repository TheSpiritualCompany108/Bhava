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
import SacredJourney from "../components/SacredJourney";
import GitaSlider from "../knowledge/GitaSlider";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";

function Home() {
  return (
    <>
      <Seo
        title="Bhava: by The Spiritual Company – Incense, Sambrani, Camphor & Sacred Bead Bracelets"
        description={clipDesc("Shop Sacred Notes incense, Pure Ritual, Sacred Ember cones, Guggal Sambrani, ritual camphor and six intention bracelets from Bhava:.")}
        canonical={`${siteOrigin()}/`}
      />
      <HomeMain />
      <HomeShop />
      <Community />
      <WhyRituals />
      <SacredKnowledge />
      <GitaSlider />
      <AstrologyTools />
      <DailySacredRhythm />
      <LivingWisdom />
      <SacredMissionSection />
      <FundRaiser />
      <SacredJourney />
    </>
  );
}

export default Home;
