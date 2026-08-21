import { useState } from "react";
import styles from "./KundliGenerator.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TABS = ["Lagna Chart", "Navamsa Chart", "Planetary Positions", "Dasha", "Report"];

// Example chart used to preview the page before a real Kundli is generated.
const demoHouses = {
  1: { asc: { degree: "12°30'" }, planets: [] },
  2: { planets: [{ planet: "Mo", name: "Moon", degree: "18°45'", color: "#2563EB" }] },
  3: { planets: [{ planet: "Ve", name: "Venus", degree: "05°20'", color: "#DB2777" }] },
  4: { planets: [{ planet: "Sa", name: "Saturn", degree: "15°30'", color: "#2563EB" }] },
  5: { planets: [] },
  6: { planets: [{ planet: "Me", name: "Mercury", degree: "02°15'", color: "#16A34A" }] },
  7: { planets: [{ planet: "Ju", name: "Jupiter", degree: "10°25'", color: "#EA8C1E" }] },
  8: { planets: [] },
  9: { planets: [{ planet: "Ke", name: "Ketu", degree: "17°50'", color: "#C0671E" }] },
  10: { planets: [{ planet: "Ra", name: "Rahu", degree: "17°50'", color: "#0D9488" }] },
  11: { planets: [{ planet: "Su", name: "Sun", degree: "29°40'", color: "#EA8C1E" }] },
  12: { planets: [{ planet: "Ma", name: "Mars", degree: "22°10'", color: "#DC2626" }] },
};

const planetaryPositions = [
  { planet: "Sun (Su)", sign: "Cancer", degree: "29°40'", house: 11, color: "#EA8C1E" },
  { planet: "Moon (Mo)", sign: "Taurus", degree: "18°45'", house: 2, color: "#2563EB" },
  { planet: "Mars (Ma)", sign: "Gemini", degree: "22°10'", house: 12, color: "#DC2626" },
  { planet: "Mercury (Me)", sign: "Virgo", degree: "02°15'", house: 6, color: "#16A34A" },
  { planet: "Jupiter (Ju)", sign: "Libra", degree: "10°25'", house: 7, color: "#EA8C1E" },
  { planet: "Venus (Ve)", sign: "Cancer", degree: "05°20'", house: 3, color: "#DB2777" },
  { planet: "Saturn (Sa)", sign: "Taurus", degree: "15°30'", house: 4, color: "#2563EB" },
  { planet: "Rahu (Ra)", sign: "Pisces", degree: "17°50'", house: 10, color: "#0D9488" },
  { planet: "Ketu (Ke)", sign: "Virgo", degree: "17°50'", house: 9, color: "#C0671E" },
];

// House label anchor points on a 400x400 grid (see KundliChart)
const housePos = {
  1: [200, 108], 2: [100, 40], 3: [40, 100], 4: [108, 200],
  5: [40, 300], 6: [100, 360], 7: [200, 292], 8: [300, 360],
  9: [360, 300], 10: [292, 200], 11: [360, 100], 12: [300, 40],
};
const houseNumPos = {
  1: [200, 60], 2: [55, 20], 3: [20, 55], 4: [55, 200],
  5: [20, 345], 6: [55, 382], 7: [200, 342], 8: [345, 382],
  9: [382, 345], 10: [345, 200], 11: [382, 55], 12: [345, 20],
};

function KundliChart({ houses }) {
  return (
    <svg viewBox="0 0 400 400" className={styles.chartSvg} role="img" aria-label="Lagna chart">
      <rect x="1" y="1" width="398" height="398" fill="#FBF3E6" stroke="#C6A14A" strokeWidth="2" />
      <line x1="0" y1="0" x2="400" y2="400" stroke="#C6A14A" strokeWidth="1.5" />
      <line x1="400" y1="0" x2="0" y2="400" stroke="#C6A14A" strokeWidth="1.5" />
      <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#C6A14A" strokeWidth="1.5" />

      {Object.entries(houseNumPos).map(([house, [x, y]]) => (
        <text key={`n${house}`} x={x} y={y} className={styles.houseNumber}>{house}</text>
      ))}

      {Object.entries(housePos).map(([house, [x, y]]) => {
        const h = houses[house];
        if (!h) return null;
        const rows = [
          ...(h.asc ? [{ label: "Asc", degree: h.asc.degree, color: "#C0671E", isAsc: true }] : []),
          ...(h.planets || []).map((p) => ({ label: p.planet, degree: p.degree, color: p.color })),
        ];
        if (rows.length === 0) return null;
        const rowHeight = 22;
        const startY = y - ((rows.length - 1) * rowHeight) / 2;
        return (
          <g key={house}>
            {rows.map((row, i) => (
              <g key={i}>
                <text
                  x={x}
                  y={startY + i * rowHeight - 2}
                  className={row.isAsc ? styles.ascLabel : styles.planetLabel}
                  fill={row.color}
                >
                  {row.label}
                </text>
                <text x={x} y={startY + i * rowHeight + 12} className={styles.degreeLabel}>
                  {row.degree}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function to24Hour(time12, ampm) {
  const [hStr, mStr] = time12.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDate(str) {
  const d = new Date(str.replace(" ", "T"));
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function DashaPanel({ dasha }) {
  const [expandedLord, setExpandedLord] = useState(dasha?.currentLord || null);

  if (!dasha?.mahaDashas?.length) {
    return <p className={styles.comingSoon}>Dasha periods will appear here once you generate a Kundli.</p>;
  }

  return (
    <div className={styles.dashaList}>
      {dasha.mahaDashas.map((m) => {
        const isCurrent = m.lord === dasha.currentLord;
        const isOpen = m.lord === expandedLord;
        return (
          <div key={m.lord} className={`${styles.dashaRow} ${isCurrent ? styles.dashaRowCurrent : ""}`}>
            <button
              type="button"
              className={styles.dashaHeader}
              onClick={() => setExpandedLord(isOpen ? null : m.lord)}
            >
              <span className={styles.dashaLord}>
                {m.lord} {isCurrent && <span className={styles.dashaCurrentTag}>Current</span>}
              </span>
              <span className={styles.dashaRange}>{formatDate(m.start)} – {formatDate(m.end)}</span>
              <span className="material-symbols-outlined">{isOpen ? "expand_less" : "expand_more"}</span>
            </button>
            {isOpen && (
              <div className={styles.antarList}>
                {m.antarDashas.map((a) => (
                  <div key={a.lord + a.start} className={styles.antarRow}>
                    <span>{a.lord}</span>
                    <span>{formatDate(a.start)} – {formatDate(a.end)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReportPanel({ report }) {
  if (!report) {
    return <p className={styles.comingSoon}>Your personalised report will appear here once you generate a Kundli.</p>;
  }
  const sections = [
    ["Personality", report.personality],
    ["Strengths", report.strengths],
    ["Career", report.career],
    ["Relationships", report.relationships],
    ["Current Phase", report.currentPhase],
  ];
  return (
    <div className={styles.reportList}>
      {sections.map(([title, text]) => (
        <div key={title} className={styles.reportSection}>
          <h4 className={styles.reportSectionTitle}>{title}</h4>
          <p className={styles.reportSectionText}>{text}</p>
        </div>
      ))}
    </div>
  );
}

function KundliGenerator() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [useTimeRange, setUseTimeRange] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    dob: "2000-08-15",
    time: "10:30",
    ampm: "AM",
    pob: "New Delhi, India",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const time24 = to24Hour(form.time, form.ampm);
    if (!time24) {
      setError('Enter a valid time of birth, e.g. "10:30"');
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/kundli/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          dob: form.dob,
          time: time24,
          placeOfBirth: form.pob,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setResult(json.data);
        setSubmitted(true);
      } else {
        setError(json.message || "Couldn't generate your Kundli — please try again.");
      }
    } catch {
      setError("Couldn't reach the Kundli service — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const src = result;
    if (!src) return;
    const lines = [
      `KUNDLI — ${src.fullName || "Untitled"}`,
      `Date of Birth: ${form.dob}`,
      `Time of Birth: ${form.time} ${form.ampm}`,
      `Place of Birth: ${form.pob}`,
      "",
      `Ascendant: ${src.ascendant}  |  Rashi: ${src.rashi}  |  Moon Sign: ${src.moonSign}  |  Nakshatra: ${src.nakshatra}`,
      "",
      "PLANETARY POSITIONS",
      ...src.planetaryPositions.map((p) => `  ${p.planet.padEnd(14)} ${p.sign.padEnd(12)} ${p.degree.padEnd(8)} House ${p.house}`),
      "",
      src.dasha?.currentLord ? `CURRENT MAHADASHA: ${src.dasha.currentLord}` : "",
      "",
      src.report ? "REPORT" : "",
      ...(src.report
        ? [
            `Personality: ${src.report.personality}`,
            `Strengths: ${src.report.strengths}`,
            `Career: ${src.report.career}`,
            `Relationships: ${src.report.relationships}`,
            `Current Phase: ${src.report.currentPhase}`,
          ]
        : []),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kundli - ${src.fullName || "Report"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const src = result;
    const shareData = {
      title: "My Kundli — BHAVA",
      text: src
        ? `My Kundli: Ascendant ${src.ascendant} (${src.rashi}), Moon Sign ${src.moonSign}, Nakshatra ${src.nakshatra}.`
        : "Generate your Kundli on BHAVA.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no action needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Link copied to clipboard!");
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  };

  const houses = result?.houses || demoHouses;
  const positions = result?.planetaryPositions || planetaryPositions;
  const facts = result
    ? { ascendant: result.ascendant, nakshatra: result.nakshatra, rashi: result.rashi, moonSign: result.moonSign }
    : { ascendant: "Leo", nakshatra: "Magha", rashi: "Simha", moonSign: "Aries" };

  return (
    <div className={styles.page}>
      <div className={styles.bgTemple} />

      <header className={styles.header}>
        <span className={`material-symbols-outlined ${styles.lotusIcon}`}>spa</span>
        <h1 className={styles.title}>Kundli Generator</h1>
        <p className={styles.subtitle}>
          Generate your detailed Kundli and explore the positions of planets
          to gain deeper insights about your life.
        </p>
        <div className={styles.ornament}>
          <span className={styles.ornamentLine} />
          <span className={styles.ornamentDot} />
          <span className={styles.ornamentLine} />
        </div>
      </header>

      <div className={styles.layout}>
        {/* Left — form */}
        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <span className={styles.formIcon}>
              <span className="material-symbols-outlined">person</span>
            </span>
            <div>
              <h2 className={styles.formTitle}>Enter Your Details</h2>
              <p className={styles.formSubtitle}>Accurate birth details generate accurate Kundli.</p>
            </div>
          </div>

          <label className={styles.label}>Full Name</label>
          <input
            className={styles.input}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

          <label className={styles.label}>Date of Birth</label>
          <input
            type="date"
            className={styles.input}
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <label className={styles.label}>Time of Birth</label>
          <div className={styles.timeRow}>
            <input
              type="text"
              className={styles.input}
              name="time"
              value={form.time}
              onChange={handleChange}
              disabled={useTimeRange}
              placeholder="10:30"
              inputMode="numeric"
            />
            <div className={styles.ampmToggle}>
              <button
                type="button"
                className={form.ampm === "AM" ? styles.ampmActive : styles.ampmBtn}
                onClick={() => setForm({ ...form, ampm: "AM" })}
              >
                AM
              </button>
              <button
                type="button"
                className={form.ampm === "PM" ? styles.ampmActive : styles.ampmBtn}
                onClick={() => setForm({ ...form, ampm: "PM" })}
              >
                PM
              </button>
            </div>
          </div>

          <label className={styles.label}>Place of Birth</label>
          <div className={styles.inputWithIcon}>
            <input
              className={styles.input}
              name="pob"
              value={form.pob}
              onChange={handleChange}
              placeholder="City, Country"
            />
            <span className="material-symbols-outlined">location_on</span>
          </div>

          <button
            type="button"
            className={styles.timeRangeLink}
            onClick={() => setUseTimeRange((v) => !v)}
          >
            <span className="material-symbols-outlined">schedule</span>
            Don't know your exact time? {useTimeRange ? "Use Exact Time" : "Use Time Range"}
          </button>

          <button type="submit" className={styles.generateBtn} disabled={loading}>
            {loading ? "Generating…" : "Generate Kundli"}
            {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>

          <p className={styles.secureNote}>
            <span className="material-symbols-outlined">lock</span>
            Your data is 100% secure and private
          </p>
        </form>

        {/* Right — results */}
        <div className={styles.resultsCard}>
          <div className={styles.tabRow}>
            <div className={styles.tabs}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={tab === activeTab ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className={styles.resultActions}>
              <button type="button" className={styles.actionBtn} onClick={handleDownload} disabled={!result}>
                <span className="material-symbols-outlined">download</span> Download
              </button>
              <button type="button" className={styles.actionBtn} onClick={handleShare}>
                <span className="material-symbols-outlined">ios_share</span> Share
              </button>
            </div>
          </div>

          {error && <p className={styles.errorNote}>{error}</p>}
          {!submitted && !error && (
            <p className={styles.previewNote}>
              Showing an example chart — fill in your details and generate your own.
            </p>
          )}

          <div className={styles.resultsBody}>
            <div className={styles.chartCol}>
              {(activeTab === "Lagna Chart" || activeTab === "Navamsa Chart") && (
                <KundliChart houses={houses} />
              )}
              {activeTab === "Dasha" && <DashaPanel dasha={result?.dasha} />}
              {activeTab === "Report" && <ReportPanel report={result?.report} />}

              <div className={styles.factsRow}>
                <div className={styles.factItem}>
                  <span className="material-symbols-outlined">spa</span>
                  <div>
                    <p className={styles.factLabel}>Ascendant</p>
                    <p className={styles.factValue}>{facts.ascendant}</p>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <span className="material-symbols-outlined">spa</span>
                  <div>
                    <p className={styles.factLabel}>Nakshatra</p>
                    <p className={styles.factValue}>{facts.nakshatra}</p>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <span className="material-symbols-outlined">spa</span>
                  <div>
                    <p className={styles.factLabel}>Rashi</p>
                    <p className={styles.factValue}>{facts.rashi}</p>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <span className="material-symbols-outlined">spa</span>
                  <div>
                    <p className={styles.factLabel}>Moon Sign</p>
                    <p className={styles.factValue}>{facts.moonSign}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.tableCol}>
              <h3 className={styles.tableTitle}>Planetary Positions</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Planet</th>
                    <th>Sign</th>
                    <th>Degree</th>
                    <th>House</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p) => (
                    <tr key={p.planet}>
                      <td style={{ color: p.color, fontWeight: 700 }}>{p.planet}</td>
                      <td>{p.sign}</td>
                      <td>{p.degree}</td>
                      <td>{p.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.insightsBox}>
                <span className={`material-symbols-outlined ${styles.insightsIcon}`}>spa</span>
                <div>
                  <h4 className={styles.insightsTitle}>Kundli Insights</h4>
                  <p className={styles.insightsText}>
                    {result?.report?.personality ||
                      "Your Kundli reveals a strong willpower and leadership qualities. You have the potential to achieve great success with determination and hard work."}
                  </p>
                </div>
                <button
                  type="button"
                  className={`material-symbols-outlined ${styles.insightsArrow}`}
                  onClick={() => setActiveTab("Report")}
                  aria-label="View full report"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  arrow_forward
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KundliGenerator;
