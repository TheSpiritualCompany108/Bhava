const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_NAMES_SANSKRIT = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const PLANET_META = {
  Sun: { abbr: "Su", color: "#EA8C1E" },
  Moon: { abbr: "Mo", color: "#2563EB" },
  Mars: { abbr: "Ma", color: "#DC2626" },
  Mercury: { abbr: "Me", color: "#16A34A" },
  Jupiter: { abbr: "Ju", color: "#EA8C1E" },
  Venus: { abbr: "Ve", color: "#DB2777" },
  Saturn: { abbr: "Sa", color: "#2563EB" },
  Rahu: { abbr: "Ra", color: "#0D9488" },
  Ketu: { abbr: "Ke", color: "#C0671E" },
};

function formatDegree(normDegree) {
  const deg = Math.floor(normDegree);
  const min = Math.round((normDegree - deg) * 60);
  return `${String(deg).padStart(2, "0")}°${String(min).padStart(2, "0")}'`;
}

// Numeric UTC offset (e.g. 5.5 for IST) for an IANA timezone on a given date,
// so DST is accounted for correctly at that historical date.
function tzOffsetHours(ianaTimeZone, date) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimeZone,
    timeZoneName: "longOffset",
  }).format(date);
  const match = formatted.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = match[3] ? Number(match[3]) : 0;
  return sign * (hours + minutes / 60);
}

async function fetchDasha(payload) {
  const res = await fetch("https://json.freeastrologyapi.com/vimsottari/maha-dasas-and-antar-dasas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.FREEASTROLOGY_API_KEY,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  const json = await res.json();
  let parsed;
  try {
    parsed = typeof json.output === "string" ? JSON.parse(json.output) : json.output;
  } catch {
    return null;
  }
  if (!parsed) return null;

  const now = new Date();
  const mahaDashas = Object.entries(parsed).map(([lord, antarDashas]) => {
    const antars = Object.entries(antarDashas).map(([antarLord, period]) => ({
      lord: antarLord,
      start: period.start_time,
      end: period.end_time,
    }));
    return {
      lord,
      start: antars[0].start,
      end: antars[antars.length - 1].end,
      antarDashas: antars,
    };
  });

  const current = mahaDashas.find(
    (m) => new Date(m.start) <= now && now <= new Date(m.end),
  );

  return { mahaDashas, currentLord: current?.lord || null };
}

async function generateReport({ ascendant, rashi, moonSign, nakshatra, planetaryPositions, currentDashaLord }) {
  if (!process.env.GROQ_API_KEY) return null;

  const placements = planetaryPositions
    .map((p) => `${p.planet} in ${p.sign} (house ${p.house})`)
    .join(", ");

  const prompt = `You are a warm, insightful Vedic astrologer writing a short personality report from a birth chart. Given:
- Ascendant (Lagna): ${ascendant} (${rashi})
- Moon Sign (Rashi): ${moonSign}
- Birth Nakshatra: ${nakshatra}
- Planetary placements: ${placements}
- Current Mahadasha: ${currentDashaLord || "unknown"}

Write a report as strict JSON only (no markdown, no code fences), with this exact shape:
{"personality":"2-3 sentences","strengths":"2-3 sentences","career":"2-3 sentences","relationships":"2-3 sentences","currentPhase":"2-3 sentences about what the current Mahadasha period tends to bring"}

Keep it warm, encouraging, and grounded in the placements given. Do not mention that you are an AI.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.error("Groq report error:", res.status, await res.text());
      return null;
    }
    const json = await res.json();
    const text = json.choices?.[0]?.message?.content;
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Groq report exception:", err);
    return null;
  }
}

async function geocodePlace(place) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding service unavailable");
  const json = await res.json();
  const result = json.results?.[0];
  if (!result) return null;
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

export const generateKundli = async (req, res, next) => {
  try {
    const { fullName, dob, time, placeOfBirth } = req.body;

    if (!dob || !time || !placeOfBirth) {
      return res.status(400).json({
        success: false,
        message: "Date of birth, time of birth, and place of birth are required",
      });
    }
    if (!process.env.FREEASTROLOGY_API_KEY) {
      return res
        .status(500)
        .json({ success: false, message: "Kundli generator isn't configured yet" });
    }

    const [year, month, date] = dob.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    const location = await geocodePlace(placeOfBirth);
    if (!location) {
      return res
        .status(400)
        .json({ success: false, message: `Couldn't find "${placeOfBirth}" — try a nearby major city` });
    }

    const birthDateUtc = new Date(Date.UTC(year, month - 1, date, hours, minutes));
    const timezone = tzOffsetHours(location.timezone, birthDateUtc);

    const astroPayload = {
      year,
      month,
      date,
      hours,
      minutes,
      seconds: 0,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone,
      settings: { observation_point: "topocentric", ayanamsha: "lahiri" },
    };

    const [astroRes, dasha] = await Promise.all([
      fetch("https://json.freeastrologyapi.com/planets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.FREEASTROLOGY_API_KEY,
        },
        body: JSON.stringify(astroPayload),
      }),
      fetchDasha(astroPayload),
    ]);

    if (!astroRes.ok) {
      const errText = await astroRes.text();
      console.error("freeastrologyapi.com error:", astroRes.status, errText);
      return res
        .status(502)
        .json({ success: false, message: "Kundli service is unavailable right now" });
    }

    const astroJson = await astroRes.json();
    const named = astroJson.output?.[1];
    if (!named?.Ascendant) {
      return res
        .status(502)
        .json({ success: false, message: "Kundli service returned an unexpected response" });
    }

    const ascSignIdx = named.Ascendant.current_sign; // 1-12
    // A North Indian chart's 12 diamond positions are FIXED to zodiac signs
    // (Aries is always the top-center diamond, Taurus always the next one
    // counter-clockwise, and so on) — they never move regardless of which
    // sign is rising. So the ascendant marker and every planet are placed by
    // their `current_sign` (fixed position), not by `house_number` (which
    // is relative to the ascendant and only used for the table's House column).
    const houses = {
      [ascSignIdx]: { asc: { degree: formatDegree(named.Ascendant.normDegree) }, planets: [] },
    };
    const planetaryPositions = [];

    for (const [name, meta] of Object.entries(PLANET_META)) {
      const p = named[name];
      if (!p) continue;
      const degree = formatDegree(p.normDegree);
      const signName = SIGN_NAMES[p.current_sign - 1];
      if (!houses[p.current_sign]) houses[p.current_sign] = { planets: [] };
      houses[p.current_sign].planets.push({ planet: meta.abbr, name, degree, color: meta.color });
      planetaryPositions.push({
        planet: `${name} (${meta.abbr})`,
        sign: signName,
        degree,
        house: p.house_number,
        color: meta.color,
      });
    }

    const moon = named.Moon;
    const nakshatraIndex = Math.floor(moon.fullDegree / (360 / 27));
    const ascendant = SIGN_NAMES[ascSignIdx - 1];
    const rashi = SIGN_NAMES_SANSKRIT[ascSignIdx - 1];
    const moonSign = SIGN_NAMES[moon.current_sign - 1];
    const nakshatra = NAKSHATRAS[nakshatraIndex];

    const report = await generateReport({
      ascendant,
      rashi,
      moonSign,
      nakshatra,
      planetaryPositions,
      currentDashaLord: dasha?.currentLord,
    });

    res.json({
      success: true,
      data: {
        fullName: fullName || "",
        houses,
        planetaryPositions,
        ascendant,
        rashi,
        moonSign,
        nakshatra,
        dasha,
        report,
      },
    });
  } catch (err) {
    next(err);
  }
};
