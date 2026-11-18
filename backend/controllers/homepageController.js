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

// Sections that are an admin-managed list of banner images (slides[] + items{})
const BANNER_KEYS = new Set(["productsBanner", "heroBanner", "hero"]);

/** Ensure slides[].image stays in sync with items, and orphan uploads become slides. */
function healBannerSlides(data = {}) {
  const items = data.items && typeof data.items === "object" ? data.items : {};
  let slides = Array.isArray(data.slides) ? data.slides.map((s) => ({ ...s })) : [];

  slides = slides.map((s) => {
    if (!s?.id) return s;
    const fromItem = items[s.id]?.image;
    if ((!s.image || s.image === "") && fromItem) return { ...s, image: fromItem };
    return s;
  });

  const slideIds = new Set(slides.map((s) => s?.id).filter(Boolean));
  // Orphan items = uploads that never made it onto slides[] (legacy image__banner bug).
  // Put them first so the latest intended banner wins on /products.
  const recovered = [];
  for (const [id, item] of Object.entries(items)) {
    if (!item?.image || slideIds.has(id)) continue;
    recovered.push({ id, image: item.image });
    slideIds.add(id);
  }
  if (recovered.length) slides = [...recovered, ...slides];

  if (!slides.length) {
    const legacy = data.bannerImage || data.image || items.banner?.image || "";
    if (legacy) slides = [{ id: "banner", image: legacy }];
  }

  const firstImg = slides[0]?.image || data.bannerImage || data.image || "";
  return {
    ...data,
    slides,
    ...(firstImg ? { bannerImage: firstImg, image: firstImg } : {}),
  };
}

// Public: a single section's overrides. Returns an empty object (not 404)
// when nothing has been saved yet, so the frontend can just fall back to
// its hardcoded defaults.
export const getSection = async (req, res, next) => {
  try {
    const section = await HomepageSection.findOne({ key: req.params.key });
    let data = section?.data || {};
    if (BANNER_KEYS.has(req.params.key)) {
      data = healBannerSlides(data);
    }
    res.json({ success: true, data });
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
      // Section-level fields only — do NOT special-case image__banner here.
      // That fieldname must update slides[] / items (below); previously it set
      // bannerImage then got overwritten back to the stale slides[0].image.
      if (file.fieldname === "image" || file.fieldname === "bannerImage") {
        data.image = url;
        data.bannerImage = url;
      } else if (file.fieldname.startsWith("image__")) {
        const itemKey = file.fieldname.slice("image__".length);
        // "<slideId>__mobile" = the separate phone-size banner for that slide (stored on the slide only)
        if (itemKey.endsWith("__mobile")) {
          const slideId = itemKey.slice(0, -"__mobile".length);
          if (Array.isArray(data.slides)) {
            data.slides = data.slides.map((s) => (s && s.id === slideId ? { ...s, mobileImage: url } : s));
          }
          continue;
        }
        data.items = data.items || {};
        data.items[itemKey] = { ...(data.items[itemKey] || {}), image: url };
        // Keep productsBanner slides[] in sync when admin uploads per-slide images
        if (Array.isArray(data.slides)) {
          data.slides = data.slides.map((s) =>
            s && s.id === itemKey ? { ...s, image: url } : s,
          );
        } else if (itemKey === "banner") {
          data.slides = [{ id: "banner", image: url }];
        }
        if (itemKey === "banner") {
          data.image = url;
          data.bannerImage = url;
        }
      }
    }

    // Admin submitted an explicit slide list: whatever is not in it was removed on purpose.
    // Drop stale per-slide items so healBannerSlides() cannot resurrect them as "orphans".
    if ((key === "productsBanner" || key === "heroBanner") && Array.isArray(data.slides) && data.items && typeof data.items === "object") {
      const keep = new Set(data.slides.map((s) => s?.id).filter(Boolean));
      data.items = Object.fromEntries(Object.entries(data.items).filter(([id]) => keep.has(id)));
    }

    // Prefer first slide as the legacy single-banner fields (older clients)
    if (Array.isArray(data.slides) && data.slides.length) {
      const firstImg =
        data.slides[0]?.image ||
        data.items?.[data.slides[0]?.id]?.image ||
        data.bannerImage ||
        data.image ||
        "";
      if (firstImg) {
        data.slides[0] = { ...(data.slides[0] || { id: "banner" }), image: firstImg };
        data.bannerImage = firstImg;
        data.image = firstImg;
      }
    }

    if (BANNER_KEYS.has(key)) {
      data = healBannerSlides(data);
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
