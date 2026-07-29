import styles from "./Knowledge.module.css";
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
