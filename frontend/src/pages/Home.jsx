import React from "react";
import HomeMain from "../components/HomeMain";
import WhyRituals from "../components/WhyRituals";

import SacredCollection from "../components/SacredCollection";
import ProductSpecification from "../components/ProductSpecification";
import FeaturedRituals from "../components/FeaturedRituals";
import DailySacredRhythm from "../components/DailySacredRhythm";
import StructuredPractices from "../components/StructuredPractices";
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
      <WhyRituals />
      <GitaSlider />
      <SacredCollection />
      <FeaturedRituals />
      <ProductSpecification />

      {/* Phase II — The Daily Practice */}
      <DailySacredRhythm />
      <StructuredPractices />
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
