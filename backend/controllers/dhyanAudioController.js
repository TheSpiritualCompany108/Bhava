import DhyanAudio from "../models/DhyanAudio.js";
import { uploadToBlob } from "../utils/uploadToBlob.js";

export const upsertDhyanAudio = async (req, res, next) => {
  try {
    const day = Number(req.params.day);
    if (!day || day < 1 || day > 21) {
      return res
        .status(400)
        .json({ success: false, message: "Day must be between 1 and 21" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Audio file is required" });
    }

    const audioUrl = await uploadToBlob(req.file, "dhyan-audio");
    const entry = await DhyanAudio.findOneAndUpdate(
      { day },
      { day, audioUrl },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true },
    );
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

export const listDhyanAudio = async (req, res, next) => {
  try {
    const items = await DhyanAudio.find().sort({ day: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

export const deleteDhyanAudio = async (req, res, next) => {
  try {
    const day = Number(req.params.day);
    const entry = await DhyanAudio.findOneAndDelete({ day });
    if (!entry)
      return res
        .status(404)
        .json({ success: false, message: "No audio found for that day" });
    res.json({ success: true, message: "Audio deleted" });
  } catch (err) {
    next(err);
  }
};
