import mongoose from "mongoose";
import Tile from "../models/Tile.js";
import { uploadToBlob } from "../utils/uploadToBlob.js";

export const createTile = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      badgeText,
      duration,
      summary,
      meta: rawMeta,
      productType,
      category,
      fullDescription,
      lessons,
      status,
    } = req.body;
    const imageUrl = req.file ? await uploadToBlob(req.file) : undefined;

    // Parse lessons if it's a stringified JSON
    let parsedLessons = lessons;
    if (typeof lessons === "string") {
      try {
        parsedLessons = JSON.parse(lessons);
      } catch (e) {
        parsedLessons = [];
      }
    }

    let meta = {};
    if (rawMeta) {
      if (typeof rawMeta === "string") {
        try {
          meta = JSON.parse(rawMeta);
        } catch (e) {
          meta = {};
        }
      } else {
        meta = { ...rawMeta };
      }
    }

    const tileStatus = status && status.toLowerCase() === "draft" ? "draft" : "active";
    meta.status = tileStatus;
    meta.published = tileStatus === "active";

    if (productType) {
      const cleanType = Array.isArray(productType)
        ? String(productType[0] || "").trim()
        : String(productType || "").trim();
      meta.productType = cleanType;
      meta.type = cleanType;
    }

    const tile = await Tile.create({
      title,
      subtitle,
      badgeText,
      duration,
      summary,
      status: tileStatus,
      meta,
      imageUrl,
      category: category || "Products",
      fullDescription,
      lessons: Array.isArray(parsedLessons) ? parsedLessons : [],
    });
    res.status(201).json({ success: true, data: tile });
  } catch (err) {
    next(err);
  }
};

export const listTiles = async (req, res, next) => {
  try {
    const andConditions = [];
    const isAdmin =
      req.baseUrl === "/api/admin" ||
      (req.originalUrl && req.originalUrl.startsWith("/api/admin"));

    if (!isAdmin) {
      // Public requests: ONLY active/published products
      andConditions.push({
        status: { $ne: "draft" },
        "meta.status": { $ne: "draft" },
        "meta.published": { $ne: false },
      });
    } else if (req.query.status) {
      if (req.query.status === "draft") {
        andConditions.push({
          $or: [
            { status: "draft" },
            { "meta.status": "draft" },
            { "meta.published": false },
          ],
        });
      } else if (req.query.status === "active") {
        andConditions.push({
          status: { $ne: "draft" },
          "meta.status": { $ne: "draft" },
          "meta.published": { $ne: false },
        });
      }
    }

    if (req.query.category) {
      if (req.query.category === "Products") {
        andConditions.push({
          category: {
            $nin: [
              "Sacred Wisdom",
              "Daily Sacred",
              "Paths of Dharmic",
              "Living Wisdom",
            ],
          },
        });
        andConditions.push({
          $or: [
            { category: "Products" },
            {
              category: {
                $regex:
                  /^(Aromatic|Ritual|Japa|Pooja|Temple|Intention|Pilgrimage|Astrology|Spiritual)/i,
              },
            },
            {
              category: {
                $regex: /^Sacred (Incense|Resins|Aarti|Offering|Oil)/i,
              },
            },
          ],
        });
      } else {
        andConditions.push({ category: req.query.category });
      }
    }

    const filter = andConditions.length > 0 ? { $and: andConditions } : {};
    const tiles = await Tile.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: tiles });
  } catch (err) {
    next(err);
  }
};

export const getTile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin =
      req.baseUrl === "/api/admin" ||
      (req.originalUrl && req.originalUrl.startsWith("/api/admin"));

    let tile = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      tile = await Tile.findById(id);
    }
    if (!tile) {
      tile = await Tile.findOne({
        $or: [
          { handle: id },
          { "meta.handle": id },
          { title: new RegExp(`^${id}$`, "i") },
        ],
      });
    }
    if (!tile) {
      return res
        .status(404)
        .json({ success: false, message: "Tile not found" });
    }

    // Public users cannot view draft products directly
    if (!isAdmin) {
      const isDraft =
        tile.status === "draft" ||
        tile.meta?.status === "draft" ||
        tile.meta?.published === false;
      if (isDraft) {
        return res
          .status(404)
          .json({ success: false, message: "Tile not found" });
      }
    }

    res.json({ success: true, data: tile });
  } catch (err) {
    next(err);
  }
};

export const updateTile = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // Find existing tile first to preserve meta and other fields
    let tile = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      tile = await Tile.findById(req.params.id);
    }
    if (!tile) {
      tile = await Tile.findOne({
        $or: [{ handle: req.params.id }, { "meta.handle": req.params.id }],
      });
    }
    if (!tile) {
      return res
        .status(404)
        .json({ success: false, message: "Tile not found" });
    }

    // Parse lessons if stringified JSON
    if (updates.lessons && typeof updates.lessons === "string") {
      try {
        updates.lessons = JSON.parse(updates.lessons);
      } catch (e) {
        delete updates.lessons;
      }
    }

    // Parse and merge meta
    let incomingMeta = updates.meta;
    if (incomingMeta && typeof incomingMeta === "string") {
      try {
        incomingMeta = JSON.parse(incomingMeta);
      } catch (e) {
        incomingMeta = {};
      }
    }

    const mergedMeta = { ...(tile.meta || {}), ...(incomingMeta || {}) };
    if (updates.productType) {
      const cleanType = Array.isArray(updates.productType)
        ? String(updates.productType[0] || "").trim()
        : String(updates.productType || "").trim();
      mergedMeta.productType = cleanType;
      mergedMeta.type = cleanType;
    }

    // Status sync
    if (updates.status) {
      const cleanStatus =
        updates.status.toLowerCase() === "draft" ? "draft" : "active";
      tile.status = cleanStatus;
      updates.status = cleanStatus;
      mergedMeta.status = cleanStatus;
      mergedMeta.published = cleanStatus === "active";
    }

    updates.meta = mergedMeta;

    if (req.file) {
      updates.imageUrl = await uploadToBlob(req.file);
    }

    // Apply updates and save
    Object.assign(tile, updates);
    tile.markModified("meta");
    await tile.save();

    res.json({ success: true, data: tile });
  } catch (err) {
    next(err);
  }
};

export const toggleTileStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    let tile = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      tile = await Tile.findById(id);
    }
    if (!tile) {
      tile = await Tile.findOne({
        $or: [{ handle: id }, { "meta.handle": id }],
      });
    }
    if (!tile) {
      return res
        .status(404)
        .json({ success: false, message: "Tile not found" });
    }

    const currentStatus =
      tile.status === "draft" ||
      tile.meta?.status === "draft" ||
      tile.meta?.published === false
        ? "draft"
        : "active";
    const nextStatus =
      req.body?.status || (currentStatus === "active" ? "draft" : "active");

    tile.status = nextStatus;
    tile.meta = {
      ...(tile.meta || {}),
      status: nextStatus,
      published: nextStatus === "active",
    };
    tile.markModified("meta");
    await tile.save();

    res.json({
      success: true,
      message: `Product is now ${nextStatus === "draft" ? "Draft" : "Live"}`,
      data: tile,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTile = async (req, res, next) => {
  try {
    const tile = await Tile.findByIdAndDelete(req.params.id);
    if (!tile)
      return res
        .status(404)
        .json({ success: false, message: "Tile not found" });
    res.json({ success: true, message: "Tile deleted" });
  } catch (err) {
    next(err);
  }
};

// ── CSV Helpers ─────────────────────────────────────────────────────────────
function parseCsv(text) {
  // Strip BOM if present
  const clean = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let inQuotes = false;
  let currentToken = "";

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      row.push(currentToken.trim());
      currentToken = "";
      if (row.length > 0 && row.some((col) => col !== "")) {
        rows.push(row);
      }
      row = [];
    } else {
      currentToken += char;
    }
  }

  if (currentToken || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some((col) => col !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Download Sample Shopify-compatible CSV template
export const downloadSampleCsv = (req, res) => {
  const sampleCsv = `Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Qty,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Status
vedic-incense-series,Vedic Incense Series,"<p>Hand-rolled using 16th-century temple recipes, infused with Himalayan herbs and sacred mantras.</p>",Bhava,Incense & Aromatics,Products,"Incense, Meditation, Sacred, Temple",TRUE,Title,Default Title,BHV-INC-001,150,shopify,100,1299,1499,TRUE,TRUE,,/uploads/Products/Home Page Incense.png,1,Vedic Incense Series,FALSE,Vedic Incense Series,Hand-rolled Vedic incense,active
sacred-sambrani-cups,Sacred Sambrani Cups,"<p>Purified resin sambrani with aromatic woods, perfect for daily pujas and sacred rituals.</p>",Bhava,Sambrani,Products,"Sambrani, Puja, Dhoop",TRUE,Title,Default Title,BHV-SAM-001,200,shopify,80,899,999,TRUE,TRUE,,/uploads/Products/Home Page Sambrani.png,1,Sacred Sambrani Cups,FALSE,Sacred Sambrani Cups,Purified resin sambrani cups,active
rudraksha-japa-mala,Rudraksha Japa Mala,"<p>108 authentic rudraksha beads strung with sacred intention. Perfect for japa and deepening meditation.</p>",Bhava,Prayer Beads,Products,"Mala, Rudraksha, Japa",TRUE,Title,Default Title,BHV-MAL-001,80,shopify,50,749,899,TRUE,TRUE,,/uploads/Products/Home Page mala.png,1,Rudraksha Japa Mala,FALSE,Rudraksha Japa Mala,108 authentic rudraksha prayer beads,active
pooja-brass-thali-set,Pooja Brass Thali Set,"<p>Handcrafted brass thali with traditional design. Essential for temple worship and daily puja rituals.</p>",Bhava,Puja Items,Products,"Thali, Brass, Pooja",TRUE,Title,Default Title,BHV-THL-001,450,shopify,30,1599,1899,TRUE,TRUE,,/uploads/Products/Home Page Brass Thali.png,1,Pooja Brass Thali Set,FALSE,Pooja Brass Thali Set,Handcrafted brass puja thali set,active
sacred-anointing-oil,Sacred Anointing Oil,"<p>Ayurvedic blend of coconut and sacred herbs, traditionally used for temple abhishekam.</p>",Bhava,Sacred Oils,Products,"Oil, Ayurvedic, Abhishekam",TRUE,Title,Default Title,BHV-OIL-001,120,shopify,60,2499,2899,TRUE,TRUE,,/uploads/Products/Home Page Oil.png,1,Sacred Anointing Oil,FALSE,Sacred Anointing Oil,Ayurvedic sacred ritual oil,active
platinum-devotion-box,Platinum Devotion Box,"<p>Limited edition curated selection—offerings from 12 sacred temples across India.</p>",Bhava,Gift Sets,Products,"Gift Box, Devotion, Temple, Luxury",TRUE,Title,Default Title,BHV-BOX-001,1200,shopify,20,4999,5999,TRUE,TRUE,,/uploads/Products/Home Page Devotion Box.png,1,Platinum Devotion Box,FALSE,Platinum Devotion Box,Curated luxury devotion gift box,active`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="products_sample_template.csv"'
  );
  return res.status(200).send(sampleCsv);
};

// Import Products / Tiles from CSV with Overwrite and Publish options
export const importTilesCsv = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a CSV file." });
    }

    const overwrite =
      req.body.overwrite === true ||
      req.body.overwrite === "true" ||
      req.body.overwrite === "1";
    const publishAll =
      req.body.publish === true ||
      req.body.publish === "true" ||
      req.body.publish === "1";
    const targetCategory = req.body.category || "Products";

    const csvContent = req.file.buffer.toString("utf-8");
    const parsedRows = parseCsv(csvContent);

    if (parsedRows.length < 2) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty or missing headers.",
      });
    }

    const headers = parsedRows[0].map((h) =>
      h.toLowerCase().replace(/[\s_-]+/g, "")
    );

    // Map column names flexibly to support standard Shopify exports & custom CSVs
    const findIndex = (...names) => {
      for (const name of names) {
        const cleanName = name.toLowerCase().replace(/[\s_-]+/g, "");
        const idx = headers.findIndex((h) => h === cleanName);
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const handleIdx = findIndex("handle", "slug", "producthandle", "id");
    const titleIdx = findIndex("title", "producttitle", "name", "productname");
    const bodyHtmlIdx = findIndex(
      "body(html)",
      "bodyhtml",
      "body",
      "description",
      "content",
      "fulldescription"
    );
    const subtitleIdx = findIndex(
      "subtitle",
      "summary",
      "shortdescription",
      "tagline"
    );
    const categoryIdx = findIndex(
      "type",
      "productcategory",
      "category",
      "collection"
    );
    const priceIdx = findIndex(
      "variantprice",
      "price",
      "badgetext",
      "badge",
      "mrp"
    );
    const comparePriceIdx = findIndex(
      "variantcompareatprice",
      "compareatprice",
      "regularprice"
    );
    const imageIdx = findIndex(
      "imagesrc",
      "image",
      "imageurl",
      "photo",
      "src"
    );
    const tagsIdx = findIndex("tags", "tag", "keywords");
    const statusIdx = findIndex("status", "published", "ispublished");
    const skuIdx = findIndex("variantsku", "sku");

    if (titleIdx === -1 && handleIdx === -1) {
      return res.status(400).json({
        success: false,
        message:
          'CSV must include at least a "Title" or "Handle" column (Shopify format).',
      });
    }

    // Group Shopify rows by handle (Shopify multi-image products span multiple rows with same Handle)
    const productsMap = new Map();

    for (let i = 1; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      if (!row || row.length === 0) continue;

      const rawHandle = handleIdx !== -1 ? row[handleIdx] : "";
      const rawTitle = titleIdx !== -1 ? row[titleIdx] : "";
      const handle =
        rawHandle?.trim() || (rawTitle ? slugify(rawTitle) : `item-${i}`);

      if (!handle && !rawTitle) continue;

      const imageSrc = imageIdx !== -1 ? row[imageIdx]?.trim() : "";

      if (productsMap.has(handle)) {
        // Additional row for same handle: append secondary images if present
        const existing = productsMap.get(handle);
        if (imageSrc && !existing.images.includes(imageSrc)) {
          existing.images.push(imageSrc);
        }
      } else {
        const bodyHtml = bodyHtmlIdx !== -1 ? row[bodyHtmlIdx] : "";
        const cleanSummary = subtitleIdx !== -1 && row[subtitleIdx]
          ? row[subtitleIdx]
          : stripHtml(bodyHtml).slice(0, 160);
        const fullDesc = stripHtml(bodyHtml) || bodyHtml || cleanSummary;
        const rawCategory = categoryIdx !== -1 && row[categoryIdx]?.trim()
          ? row[categoryIdx].trim()
          : "";
        const finalCategory =
          targetCategory === "Products" || !rawCategory
            ? "Products"
            : rawCategory;
        const rawPrice = priceIdx !== -1 ? row[priceIdx]?.trim() : "";
        const badgeText = rawPrice
          ? rawPrice.startsWith("₹")
            ? rawPrice
            : `₹${rawPrice}`
          : "";
        const rawStatus = statusIdx !== -1 ? row[statusIdx]?.trim() : "";
        const isDraft = rawStatus && (rawStatus.toLowerCase() === "draft" || rawStatus.toLowerCase() === "false");
        const isPublished = !isDraft && (
          publishAll ||
          rawStatus.toLowerCase() === "true" ||
          rawStatus.toLowerCase() === "active" ||
          rawStatus.toLowerCase() === "published" ||
          !rawStatus
        );
        const itemStatus = isPublished ? "active" : "draft";

        productsMap.set(handle, {
          handle,
          title: rawTitle || handle,
          subtitle: cleanSummary || rawCategory || "Sacred Offering",
          category: finalCategory,
          productType: rawCategory,
          badgeText,
          duration: "Premium Quality",
          summary: cleanSummary,
          fullDescription: fullDesc,
          imageUrl: imageSrc || "",
          images: imageSrc ? [imageSrc] : [],
          tags: tagsIdx !== -1 ? row[tagsIdx] : "",
          sku: skuIdx !== -1 ? row[skuIdx] : "",
          compareAtPrice: comparePriceIdx !== -1 ? row[comparePriceIdx] : "",
          published: isPublished,
          status: itemStatus,
        });
      }
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const item of productsMap.values()) {
      // Find existing product by handle or title
      const existing = await Tile.findOne({
        $or: [
          { handle: item.handle },
          { "meta.handle": item.handle },
          { title: item.title, category: item.category },
        ],
      });

      const metaPayload = {
        handle: item.handle,
        sku: item.sku,
        tags: item.tags,
        productType: item.productType,
        type: item.productType,
        compareAtPrice: item.compareAtPrice,
        published: item.published,
        status: item.status,
        additionalImages: item.images.slice(1),
      };

      if (existing) {
        if (overwrite) {
          existing.title = item.title;
          existing.subtitle = item.subtitle || existing.subtitle;
          existing.category = item.category || existing.category;
          if (item.badgeText) existing.badgeText = item.badgeText;
          if (item.summary) existing.summary = item.summary;
          if (item.fullDescription)
            existing.fullDescription = item.fullDescription;
          if (item.imageUrl) existing.imageUrl = item.imageUrl;
          existing.handle = item.handle;
          existing.status = item.status;
          existing.meta = { ...(existing.meta || {}), ...metaPayload };
          existing.markModified("meta");
          await existing.save();
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        await Tile.create({
          title: item.title,
          subtitle: item.subtitle,
          category: item.category,
          badgeText: item.badgeText,
          duration: item.duration,
          summary: item.summary,
          fullDescription: item.fullDescription,
          imageUrl: item.imageUrl,
          handle: item.handle,
          status: item.status,
          meta: metaPayload,
          lessons: [],
        });
        createdCount++;
      }
    }

    return res.json({
      success: true,
      message: `CSV import completed! Created: ${createdCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}`,
      stats: {
        total: productsMap.size,
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

