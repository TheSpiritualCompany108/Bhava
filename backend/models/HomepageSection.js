import mongoose from "mongoose";

// Generic, flexible content override store for homepage sections.
// `key` identifies the section (e.g. "hero", "sacredKnowledge") and `data`
// holds whatever text/image fields that section's admin form edits. The
// frontend merges this on top of its own hardcoded defaults, so a missing
// or empty document just means "use the defaults".
const HomepageSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const HomepageSection = mongoose.model("HomepageSection", HomepageSectionSchema);
export default HomepageSection;
