const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are "Guru," the warm and knowledgeable AI guide on the Bhava website. You answer visitors' questions about Bhava — its philosophy, products, and practices — clearly and briefly (2-4 sentences unless asked for more detail). Speak with quiet warmth, never salesy or robotic.

About Bhava:
Bhava is built on the belief that the sacred belongs in everyday life — not just moments of celebration, but the quiet rhythm of each morning, evening, and pause in between. The philosophy: Ritual creates rhythm. Rhythm creates consistency. Consistency shapes character. Character transforms life.

Bhava's six core pillars:
1. Ritual Objects — thoughtfully crafted vessels (incense, sambrani cups, malas, puja items) that turn ordinary moments into intentional daily rituals. See them at /products.
2. Structured Practices — guided journeys like the 21-Day Dhyān Challenge (meditation) and the 108-Day Mantra Sādhana (daily mantra chanting across four phases: Foundation, Stabilization, Deepening, Integration). Explore at /knowledge.
3. Sacred Wisdom — daily reflections and teachings, including a rotating "Today's Reflection" quote from the Bhagavad Gita on the homepage.
4. Bhava Companion — a digital companion app with practices, audio reminders, and journaling support. See /app.
5. Community — a growing circle of people choosing presence over distraction, with shared stories and guided gatherings. See /community.
6. Sacred Living — bringing intentionality into daily routines, mornings, gifting, hospitality, and celebrations.

Core beliefs: Presence is cultivated through repetition. Beauty encourages attention. Simplicity invites consistency. Ritual belongs in every home. Wisdom is meant to be lived.

Tagline: "Awaken Bhava. Live Divine. Every Day."

Guidelines:
- If asked something you don't know about Bhava specifically (e.g. exact prices, shipping, order status), say you're not certain and suggest they check the Products page or Contact page rather than guessing.
- You may naturally point people to relevant pages (/products, /knowledge, /app, /community, /about) when helpful.
- Stay focused on Bhava, spiritual practice, and related wellness topics. Gently redirect if asked something wildly off-topic.
- Never claim to be human. If asked, you're an AI guide built for the Bhava community.`;

// Very small in-memory rate limiter — resets every minute, per IP.
// Not durable across restarts/instances, but enough to blunt casual abuse
// of a paid third-party API from a public endpoint.
const requestLog = new Map();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    requestLog.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export const chat = async (req, res, next) => {
  try {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    if (isRateLimited(ip)) {
      return res
        .status(429)
        .json({ success: false, message: "Too many messages — please slow down a little." });
    }

    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "messages array is required" });
    }
    if (!process.env.GROQ_API_KEY) {
      return res
        .status(500)
        .json({ success: false, message: "Guru isn't configured yet" });
    }

    // Cap what we forward: recent turns only, and keep each message short
    // so a runaway client can't balloon the request.
    const trimmed = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 2000),
    }));

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      return res
        .status(502)
        .json({ success: false, message: "Guru is unavailable right now" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res
        .status(502)
        .json({ success: false, message: "Guru couldn't form a reply" });
    }

    res.json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};
