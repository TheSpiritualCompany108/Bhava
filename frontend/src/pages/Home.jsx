import React, { lazy } from "react";
import HomeMain from "../components/HomeMain";
import HomeShop from "../shop/HomeShop";
import LazySection from "../components/LazySection";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";

// Everything below the hero + shop is split into its own chunk and only loaded when you scroll near it
// (or shortly after the page is idle), so the first screen is not competing with 10 other sections.
const Community = lazy(() => import("../components/Community"));
const WhyRituals = lazy(() => import("../components/WhyRituals"));
const SacredKnowledge = lazy(() => import("../components/SacredKnowledge"));
const GitaSlider = lazy(() => import("../knowledge/GitaSlider"));
const AstrologyTools = lazy(() => import("../components/AstrologyTools"));
const DailySacredRhythm = lazy(() => import("../components/DailySacredRhythm"));
const LivingWisdom = lazy(() => import("../components/LivingWisdom"));
const SacredMissionSection = lazy(() => import("../components/SacredMissionSection"));
const FundRaiser = lazy(() => import("../components/FundRaiser"));
const SacredJourney = lazy(() => import("../components/SacredJourney"));

// [component, placeholder height] — the order is the order on the page.
const BELOW_THE_FOLD = [
  [Community, 640],
  [WhyRituals, 720],
  [SacredKnowledge, 620],
  [GitaSlider, 560],
  [AstrologyTools, 900],
  [DailySacredRhythm, 640],
  [LivingWisdom, 640],
  [SacredMissionSection, 640],
  [FundRaiser, 520],
  [SacredJourney, 520],
];

function Home() {
  return (
    <>
      <Seo
        title="Bhava: by The Spiritual Company – Incense, Sambrani, Camphor & Sacred Bead Bracelets"
        description={clipDesc("Shop Sacred Notes incense, Pure Ritual, Sacred Ember cones, Guggal Sambrani, ritual camphor and five intention bracelets from Bhava:.")}
        canonical={`${siteOrigin()}/`}
      />
      <HomeMain />
      <HomeShop />
      {BELOW_THE_FOLD.map((item, i) => {
        const Section = item[0];
        return (
          <LazySection key={i} minHeight={item[1]} idleAfterMs={2500 + i * 700}>
            <Section />
          </LazySection>
        );
      })}
    </>
  );
}

export default Home;
