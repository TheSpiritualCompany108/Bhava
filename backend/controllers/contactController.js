import Contact from "../models/Contact.js";

const LIMITS = { name: 80, email: 120, description: 1000, service: 120 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Coerce to a clean single-line/plain string: blocks objects ({"$gt":""} style injection), control chars and oversize input. */
const clean = (v, max, { multiline = false } = {}) => {
  if (typeof v !== "string") return "";
  let s = v.normalize("NFKC").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  if (!multiline) s = s.replace(/[\r\n\t]+/g, " ");
  return s.replace(/<[^>]*>/g, "").trim().slice(0, max); // strip any HTML tags
};

// Small in-memory limiter for the public form (per IP): 5 submissions / 10 minutes.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const tooMany = (ip) => {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_HITS) { hits.set(ip, arr); return true; }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
};

// POST /api/contact  — submit a contact message or a service booking request (public)
export const submitContact = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
    if (typeof body.website === "string" && body.website.trim()) {
      return res.status(201).json({ success: true, message: "Thank you for reaching out. We will get back to you soon." });
    }

    if (tooMany(req.ip || req.headers["x-forwarded-for"] || "unknown")) {
      return res.status(429).json({ success: false, message: "Too many requests. Please try again in a few minutes." });
    }

    const name = clean(body.name, LIMITS.name);
    const mobile = clean(body.mobile, 15).replace(/\s+/g, "");
    const email = clean(body.email, LIMITS.email).toLowerCase();
    const description = clean(body.description, LIMITS.description, { multiline: true });
    const service = clean(body.service, LIMITS.service);

    if (!name || !mobile || !description) {
      return res.status(400).json({ success: false, message: "Name, mobile, and description are required." });
    }
    if (name.length < 2) {
      return res.status(400).json({ success: false, message: "Please enter your full name." });
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit Indian mobile number." });
    }
    if (email && !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }
    if (description.length < 10) {
      return res.status(400).json({ success: false, message: "Message must be at least 10 characters." });
    }

    const contact = await Contact.create({
      name,
      mobile,
      email,
      description,
      ...(service ? { type: "booking", service } : {}),
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out. We will get back to you soon.",
      id: contact._id,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};

// GET /api/contact  — list all enquiries (admin only)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(1000);
    res.status(200).json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// PATCH /api/contact/:id/status  — admin: mark an enquiry new / read / replied
export const updateContactStatus = async (req, res) => {
  try {
    const status = typeof req.body?.status === "string" ? req.body.status : "";
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Enquiry not found." });
    res.json({ success: true, contact });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ success: false, message: "Invalid enquiry id." });
    res.status(500).json({ success: false, message: "Server error." });
  }
};
