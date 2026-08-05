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
      meta,
      category,
      fullDescription,
      lessons,
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

    const tile = await Tile.create({
      title,
      subtitle,
      badgeText,
      duration,
      summary,
      meta,
      imageUrl,
      category,
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
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const tiles = await Tile.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: tiles });
  } catch (err) {
    next(err);
  }
};

export const getTile = async (req, res, next) => {
  try {
    const tile = await Tile.findById(req.params.id);
    if (!tile)
      return res
        .status(404)
        .json({ success: false, message: "Tile not found" });
    res.json({ success: true, data: tile });
  } catch (err) {
    next(err);
  }
};

export const updateTile = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // Parse lessons if it's a stringified JSON
    if (updates.lessons && typeof updates.lessons === "string") {
      try {
        updates.lessons = JSON.parse(updates.lessons);
      } catch (e) {
        updates.lessons = [];
      }
    }

    if (req.file) updates.imageUrl = await uploadToBlob(req.file);
    const tile = await Tile.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!tile)
      return res
        .status(404)
        .json({ success: false, message: "Tile not found" });
    res.json({ success: true, data: tile });
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
