import Quote from "../models/Quote.js";

export const createQuote = async (req, res, next) => {
  try {
    const { reflection, text, reference, isActive } = req.body;
    const quote = await Quote.create({ reflection, text, reference, isActive: !!isActive });
    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

export const listQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json({ success: true, data: quotes });
  } catch (err) {
    next(err);
  }
};

export const getQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote)
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    res.json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

export const updateQuote = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    const quote = await Quote.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!quote)
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    res.json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
};

export const deleteQuote = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote)
      return res
        .status(404)
        .json({ success: false, message: "Quote not found" });
    res.json({ success: true, message: "Quote deleted" });
  } catch (err) {
    next(err);
  }
};

// Public: quotes marked "Live" for the homepage rotation, falling back to all quotes
export const getLiveQuotes = async (req, res, next) => {
  try {
    let quotes = await Quote.find({ isActive: true }).sort({ createdAt: 1 });
    if (quotes.length === 0) quotes = await Quote.find().sort({ createdAt: 1 });
    res.json({ success: true, data: quotes });
  } catch (err) {
    next(err);
  }
};
