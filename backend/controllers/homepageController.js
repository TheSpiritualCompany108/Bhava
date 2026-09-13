import HomepageSection from "../models/HomepageSection.js";
import { uploadToBlob } from "../utils/uploadToBlob.js";

// Public: every section's overrides, keyed by section key, so the homepage
// can fetch everything it needs in one request.
export const getAllSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.find();
    const map = {};
    sections.forEach((s) => { map[s.key] = s.data || {}; });
    res.json({ success: true, data: map });
  } catch (err) {
    next(err);
  }
};

// Public: a single section's overrides. Returns an empty object (not 404)
// when nothing has been saved yet, so the frontend can just fall back to
// its hardcoded defaults.
export const getSection = async (req, res, next) => {
  try {
    const section = await HomepageSection.findOne({ key: req.params.key });
    res.json({ success: true, data: section?.data || {} });
  } catch (err) {
    next(err);
  }
};

// Admin: replace a section's overrides. The admin form always submits the
// full current state of `data` as a JSON string; per-item images arrive as
// separate files named "image__<itemKey>" (or plain "image" for a
// section-level image) and get merged into `data` after upload.
export const upsertSection = async (req, res, next) => {
  try {
    const { key } = req.params;
    let data = {};
    if (typeof req.body.data === "string") {
      try {
        data = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid data JSON" });
      }
    } else if (req.body.data && typeof req.body.data === "object") {
      data = req.body.data;
    }

    const files = req.files || [];
    for (const file of files) {
      const url = await uploadToBlob(file, `homepage/${key}`);
      if (file.fieldname === "image") {
        data.image = url;
      } else if (file.fieldname.startsWith("image__")) {
        const itemKey = file.fieldname.slice("image__".length);
        data.items = data.items || {};
        data.items[itemKey] = { ...(data.items[itemKey] || {}), image: url };
      }
    }

    const section = await HomepageSection.findOneAndUpdate(
      { key },
      { key, data },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    );
    res.json({ success: true, data: section.data });
  } catch (err) {
    next(err);
  }
};
