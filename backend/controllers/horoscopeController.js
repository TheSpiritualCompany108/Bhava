const VALID_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

// Real, fixed astrological facts — not generated.
const ELEMENTS = {
  aries: "Fire", taurus: "Earth", gemini: "Air", cancer: "Water",
  leo: "Fire", virgo: "Earth", libra: "Air", scorpio: "Water",
  sagittarius: "Fire", capricorn: "Earth", aquarius: "Air", pisces: "Water",
};

const DATE_RANGES = {
  aries: "Mar 21 – Apr 19", taurus: "Apr 20 – May 20", gemini: "May 21 – Jun 20",
  cancer: "Jun 21 – Jul 22", leo: "Jul 23 – Aug 22", virgo: "Aug 23 – Sep 22",
  libra: "Sep 23 – Oct 22", scorpio: "Oct 23 – Nov 21", sagittarius: "Nov 22 – Dec 21",
  capricorn: "Dec 22 – Jan 19", aquarius: "Jan 20 – Feb 18", pisces: "Feb 19 – Mar 20",
};

// Traditional Vedic ruling-planet mantra for each sign (Navagraha).
const RULING_MANTRA = {
  aries: "Om Angarakaya Namah", scorpio: "Om Angarakaya Namah",
  taurus: "Om Shukraya Namah", libra: "Om Shukraya Namah",
  gemini: "Om Budhaya Namah", virgo: "Om Budhaya Namah",
  cancer: "Om Chandraya Namah",
  leo: "Om Suryaya Namah",
  sagittarius: "Om Gurave Namah", pisces: "Om Gurave Namah",
  capricorn: "Om Shanaischaraya Namah", aquarius: "Om Shanaischaraya Namah",
};

const LUCKY_COLORS = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Gold", "Turquoise", "Maroon"];
const BEST_TIMES = ["6:00 – 7:30 AM", "8:00 – 9:30 AM", "10:00 – 11:30 AM", "12:00 – 1:30 PM", "3:00 – 4:30 PM", "6:00 – 7:30 PM", "8:00 – 9:30 PM"];
const ENERGY_QUOTES = [
  "Small steps today lead to big changes tomorrow.",
  "Trust the process — the stars are aligning in your favor.",
  "Stillness today creates clarity for tomorrow.",
  "What you focus on today, you strengthen for the future.",
  "A calm mind sees opportunities a restless one misses.",
];
const CATEGORY_BLURBS = {
  love: [
    "Good day for meaningful conversations.",
    "An unexpected message could brighten your day.",
    "Give an old bond a little extra attention today.",
    "Listen more than you speak — it deepens connection.",
  ],
  career: [
    "New opportunities may come your way. Stay focused.",
    "A small decision today shapes a bigger outcome.",
    "Collaboration favors you more than solo effort today.",
    "Patience with a colleague will pay off soon.",
  ],
  finance: [
    "Avoid impulsive spending. Plan wisely.",
    "A good day to review your budget.",
    "Small savings today add up over time.",
    "Avoid lending money impulsively today.",
  ],
  health: [
    "Take care of your energy levels and stay hydrated.",
    "A short walk today will do wonders for your mood.",
    "Prioritize rest — your body is asking for it.",
    "Mindful breathing will ease any tension today.",
  ],
};

const FALLBACK_HOROSCOPES = {
  aries: "Take the lead with patience today. A clear decision and steady action can open a promising path.",
  taurus: "Stay grounded and trust your practical instincts. Small, consistent efforts bring meaningful progress.",
  gemini: "Your curiosity is an asset today. Share your ideas clearly and leave room for a thoughtful response.",
  cancer: "Create space for what restores you. A warm conversation may bring the reassurance you need.",
  leo: "Let your confidence serve your purpose. Recognition follows when you focus on doing your best work.",
  virgo: "Prioritise what matters most instead of perfecting everything. Your careful planning is already paying off.",
  libra: "Balance comes through honest choices today. A calm discussion can help resolve a lingering question.",
  scorpio: "Trust your inner clarity and avoid rushing. Quiet focus will help you notice an important opportunity.",
  sagittarius: "Keep your outlook positive while checking the details. A little preparation will make an exciting step easier.",
  capricorn: "Your discipline gives you an advantage. Set one realistic milestone and follow it through without distraction.",
  aquarius: "An original idea deserves your attention. Explain it simply and you may find an unexpected ally.",
  pisces: "Protect your peace and listen to your intuition. Gentle, deliberate action will serve you better than haste.",
};

function fallbackDailyHoroscope(sign, date = new Date().toISOString().slice(0, 10)) {
  return {
    date,
    horoscope: FALLBACK_HOROSCOPES[sign],
  };
}

function fallbackMonthlyHoroscope(sign) {
  return {
    horoscope: `This month invites ${sign} to move with intention. Focus on steady progress, meaningful connections, and choices that support your long-term wellbeing.`,
  };
}

function seededHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h >>> 0;
}

function mulberry32(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// Deterministic "flavor" data (same sign + date always produces the same
// result) for the parts the horoscope API doesn't provide — clearly
// generated, not astrologically calculated, but stable per day. Since it's
// keyed on the date string, it can be computed for any day in the week, not
// just today, so selecting another day in the UI has something real to show.
function buildExtrasForDate(sign, dateStr) {
  const rng = mulberry32(seededHash(`${sign}-${dateStr}`));
  const ratingFor = () => Math.ceil(rng() * 5);

  const categories = ["love", "career", "finance", "health"].map((cat) => ({
    category: cat,
    rating: ratingFor(),
    blurb: pick(rng, CATEGORY_BLURBS[cat]),
  }));

  const avgRating = categories.reduce((sum, c) => sum + c.rating, 0) / categories.length;
  const quality = avgRating >= 4 ? "Great" : avgRating >= 2.5 ? "Good" : "Average";

  return {
    categories,
    quality,
    luckyNumber: 1 + Math.floor(rng() * 99),
    luckyColor: pick(rng, LUCKY_COLORS),
    bestTime: pick(rng, BEST_TIMES),
    energyPercent: 55 + Math.floor(rng() * 40),
    energyQuote: pick(rng, ENERGY_QUOTES),
  };
}

function buildDailyExtras(sign, dateStr) {
  const base = new Date(dateStr + "T00:00:00Z");
  const dayOfWeek = base.getUTCDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + mondayOffset + i);
    const dStr = d.toISOString().slice(0, 10);
    week.push({
      date: dStr,
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      ...buildExtrasForDate(sign, dStr),
    });
  }

  return {
    element: ELEMENTS[sign],
    dateRange: DATE_RANGES[sign],
    ritualMantra: RULING_MANTRA[sign],
    ritualReps: 108,
    ...buildExtrasForDate(sign, dateStr),
    week,
  };
}

const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

// Full-month grid for the calendar picker — pure deterministic generation
// (same buildExtrasForDate used by the week strip), no upstream calls needed,
// so any day in any month can be previewed without extra cost.
export const getMonthHoroscope = (req, res) => {
  const sign = String(req.query.sign || "").toLowerCase();
  if (!VALID_SIGNS.includes(sign)) {
    return res.status(400).json({ success: false, message: "Invalid or missing zodiac sign" });
  }

  const now = new Date();
  const defaultMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const monthParam = String(req.query.month || defaultMonth);
  const match = MONTH_RE.exec(monthParam);
  if (!match) {
    return res.status(400).json({ success: false, message: "month must be in YYYY-MM format" });
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]); // 1-12
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const firstDow = new Date(Date.UTC(year, monthIndex - 1, 1)).getUTCDay(); // 0=Sun
  const leadingBlanks = firstDow === 0 ? 6 : firstDow - 1; // Monday-start grid

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dStr = `${year}-${String(monthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push({ date: dStr, day, ...buildExtrasForDate(sign, dStr) });
  }

  res.json({
    success: true,
    data: { month: `${year}-${String(monthIndex).padStart(2, "0")}`, leadingBlanks, days },
  });
};

// Daily reading text comes from API Ninjas (real per-sign text, today only —
// the "date" param that would unlock other days is a premium-only feature).
async function fetchDailyHoroscope(sign) {
  const res = await fetch(`https://api.api-ninjas.com/v1/horoscope?zodiac=${sign}`, {
    headers: { "X-Api-Key": process.env.API_NINJAS_KEY },
  });
  if (!res.ok) throw new Error(`API Ninjas daily horoscope failed: ${res.status}`);
  return res.json();
}

// Monthly reading text — API Ninjas has no monthly endpoint, so this still
// comes from the original provider.
async function fetchMonthlyHoroscope(sign) {
  const res = await fetch(`https://freehoroscopeapi.com/api/v1/get-horoscope/monthly?sign=${sign}`);
  if (!res.ok) throw new Error(`Upstream monthly horoscope failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

// Very small in-memory cache — the upstream horoscope is the same for
// everyone requesting a given sign on a given day, so there's no reason
// to hit it on every page load.
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

async function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;
  const value = await loader();
  cache.set(key, { value, at: Date.now() });
  return value;
}

export const getDailyHoroscope = async (req, res, next) => {
  try {
    const sign = String(req.query.sign || "").toLowerCase();
    if (!VALID_SIGNS.includes(sign)) {
      return res.status(400).json({ success: false, message: "Invalid or missing zodiac sign" });
    }

    const [daily, monthly] = await Promise.all([
      cached(`daily-${sign}`, async () => {
        if (!process.env.API_NINJAS_KEY) {
          console.warn("API_NINJAS_KEY is not configured; using the local horoscope fallback.");
          return fallbackDailyHoroscope(sign);
        }
        try {
          return await fetchDailyHoroscope(sign);
        } catch (err) {
          console.warn("Daily horoscope provider unavailable; using the local fallback:", err.message);
          return fallbackDailyHoroscope(sign);
        }
      }),
      cached(`monthly-${sign}`, async () => {
        try {
          return await fetchMonthlyHoroscope(sign);
        } catch (err) {
          console.warn("Monthly horoscope provider unavailable; using the local fallback:", err.message);
          return fallbackMonthlyHoroscope(sign);
        }
      }),
    ]);

    const extras = buildDailyExtras(sign, daily.date);

    res.json({
      success: true,
      data: {
        sign: sign.charAt(0).toUpperCase() + sign.slice(1),
        date: daily.date,
        horoscope: daily.horoscope,
        monthlyHoroscope: monthly.horoscope,
        ...extras,
      },
    });
  } catch (err) {
    next(err);
  }
};
