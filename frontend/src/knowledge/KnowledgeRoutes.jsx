import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Seo, { siteOrigin } from "../components/Seo";
import { learningPathRoutes } from "./LearningPaths";
import { wisdomRoutes } from "./ExploreSacredWisdom";
import { commitmentRoutes } from "./SacredCommitments";
import { tigerEyeRoutes } from "./TigerEyeSection";
import { trendingRoutes } from "./TrendingTeachings";
import { dailyPracticeRoutes } from "./DailyPractices";
import TileDetail from "./TileDetail";
import NotFoundPage from "../pages/NotFoundPage";

const allRoutes = [
  ...learningPathRoutes,
  ...wisdomRoutes,
  ...commitmentRoutes,
  ...tigerEyeRoutes,
  ...trendingRoutes,
  ...dailyPracticeRoutes,
];

// "/knowledge/puja-rituals" -> "Puja Rituals"; gives every knowledge sub-page its own title instead of the home title.
const titleFromPath = (pathname) =>
  pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Sacred Knowledge";

function KnowledgeRoutes() {
  const { pathname } = useLocation();
  const known = allRoutes.some((r) => pathname === `/knowledge/${r.path}`) || pathname.startsWith("/knowledge/detail/") || pathname.startsWith("/knowledge/trending/");
  return (
    <>
    {known && (
      <Seo
        title={`${titleFromPath(pathname)} | Sacred Knowledge | Bhava:`}
        description={`${titleFromPath(pathname)} — Vedic teachings, rituals and daily practice guides from Bhava: by The Spiritual Company.`}
        canonical={`${siteOrigin()}${pathname}`}
      />
    )}
    <Routes>
      {allRoutes.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
      {/* Generic tile detail route for dynamically created tiles */}
      <Route path="detail/:id" element={<TileDetail />} />
      {/* Unknown /knowledge/... URLs: show the 404 page instead of a blank body */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

export default KnowledgeRoutes;
