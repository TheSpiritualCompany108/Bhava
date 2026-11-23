import styles from "./Knowledge.module.css";
import Seo, { siteOrigin } from "../components/Seo";
import KnowledgeHero from "./KnowledgeHero";
import SacredCommitments from "./SacredCommitments";
import ExploreSacredWisdom from "./ExploreSacredWisdom";
import TigerEyeSection from "./TigerEyeSection";
import GitaSlider from "./GitaSlider";
import TrendingTeachings from "./TrendingTeachings";
import DailyPractices from "./DailyPractices";
import LearningPaths from "./LearningPaths";
import LatestTeachings from "./LatestTeachings";
import StructuredPractices from "../components/StructuredPractices";

function Knowledge() {
  return (
    <div className={styles.knowledgePagesWrapper}>
      <Seo
        title="Sacred Knowledge & Vedic Teachings | Bhava:"
        description="Explore India's timeless spiritual wisdom, structured sadhana paths, Gita reflections and mindful daily practices."
        canonical={`${siteOrigin()}/knowledge`}
      />
      <KnowledgeHero />
      <SacredCommitments />
      <ExploreSacredWisdom />
      <TigerEyeSection />
      <StructuredPractices />
      <GitaSlider />
      <TrendingTeachings />
      <DailyPractices />
      <LearningPaths />
      <LatestTeachings />
    </div>
  );
}

export default Knowledge;
