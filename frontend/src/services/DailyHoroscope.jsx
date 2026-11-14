import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DailyHoroscope.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ZODIAC_SIGNS = [
  { key: "aries", name: "Aries", symbol: "♈" },
  { key: "taurus", name: "Taurus", symbol: "♉" },
  { key: "gemini", name: "Gemini", symbol: "♊" },
  { key: "cancer", name: "Cancer", symbol: "♋" },
  { key: "leo", name: "Leo", symbol: "♌" },
  { key: "virgo", name: "Virgo", symbol: "♍" },
  { key: "libra", name: "Libra", symbol: "♎" },
  { key: "scorpio", name: "Scorpio", symbol: "♏" },
  { key: "sagittarius", name: "Sagittarius", symbol: "♐" },
  { key: "capricorn", name: "Capricorn", symbol: "♑" },
  { key: "aquarius", name: "Aquarius", symbol: "♒" },
  { key: "pisces", name: "Pisces", symbol: "♓" },
];

const CATEGORY_META = {
  love: { label: "Love", icon: "favorite", color: "#DB2777" },
  career: { label: "Career", icon: "work", color: "#C0671E" },
  finance: { label: "Finance", icon: "payments", color: "#16A34A" },
  health: { label: "Health", icon: "eco", color: "#2E7D32" },
};

const QUALITY_COLOR = { Great: "#16A34A", Good: "#C6A14A", Average: "#9A6868" };
const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function monthKeyFromDateStr(dateStr) {
  return dateStr.slice(0, 7);
}

function shiftMonthKey(key, delta) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Stars({ rating }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ color: i < rating ? "#C6A14A" : "#E5DCCB" }}
        >
          star
        </span>
      ))}
    </span>
  );
}

function DailyHoroscope() {
  const navigate = useNavigate();
  const [sign, setSign] = useState("aries");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthlyOpen, setMonthlyOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(null);
  const [monthData, setMonthData] = useState(null);
  const [monthLoading, setMonthLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setMonthlyOpen(false);
    setSelectedDate(null);
    setCalendarOpen(false);
    fetch(`${API_BASE}/api/horoscope/daily?sign=${sign}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) setData(json.data);
        else setError(json.message || "Couldn't load today's horoscope.");
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't reach the horoscope service — check your connection.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [sign]);

  useEffect(() => {
    if (!calendarOpen || !calendarMonth) return;
    let cancelled = false;
    setMonthLoading(true);
    fetch(`${API_BASE}/api/horoscope/month?sign=${sign}&month=${calendarMonth}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.success) setMonthData(json.data);
      })
      .finally(() => !cancelled && setMonthLoading(false));
    return () => {
      cancelled = true;
    };
  }, [calendarOpen, calendarMonth, sign]);

  const activeSign = ZODIAC_SIGNS.find((s) => s.key === sign);

  // The real API only gives full horoscope text for today; the ratings/
  // lucky-facts/energy sections are generated per-day, so those alone can
  // switch when a different day in the week strip is picked.
  const viewingDate = selectedDate || data?.date;
  const isToday = data && viewingDate === data.date;
  const selectedDay = data && !isToday ? data.week.find((d) => d.date === viewingDate) : null;
  const shown = selectedDay || data;
  const shownDayLabel = data
    ? isToday
      ? "Today"
      : new Date(viewingDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })
    : "";

  const openCalendar = () => {
    setMonthData(null);
    setCalendarMonth(monthKeyFromDateStr(viewingDate));
    setCalendarOpen(true);
  };

  const handlePickDate = (dateStr) => {
    setSelectedDate(dateStr === data.date ? null : dateStr);
    setCalendarOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${activeSign.name} Daily Horoscope — BHAVA:`,
      text: data?.horoscope || "Check today's horoscope on BHAVA:.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelled — no action needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const todayLabel = data
    ? new Date(data.date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const viewingLabel = data
    ? new Date(viewingDate + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>Daily Horoscope</h1>
          <div className={styles.ornament}>
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentDot} />
            <span className={styles.ornamentLine} />
          </div>
          <p className={styles.subtitle}>Discover what the stars have in store for you today.</p>
          <p className={styles.subtitle}>Guidance for a mindful and purposeful day.</p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.signPickerWrap}>
          <p className={styles.signPickerLabel}>
            <span className={styles.ornamentDotSmall} /> Choose Your Zodiac Sign <span className={styles.ornamentDotSmall} />
          </p>
          <div className={styles.signPicker}>
            {ZODIAC_SIGNS.map((s) => (
              <button
                key={s.key}
                className={s.key === sign ? styles.signBtnActive : styles.signBtn}
                onClick={() => setSign(s.key)}
              >
                <span className={styles.signSymbol}>{s.symbol}</span>
                <span className={styles.signName}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && <p className={styles.statusNote}>Reading the stars…</p>}
        {error && <p className={styles.errorNote}>{error}</p>}

        {data && !loading && (
          <div className={styles.grid}>
            <div className={styles.mainCol}>
              <div className={styles.card}>
                <div className={styles.signHeaderRow}>
                  <div className={styles.signCircle}>
                    <span>{activeSign.symbol}</span>
                  </div>
                  <div className={styles.signHeaderInfo}>
                    <h2 className={styles.signHeaderName}>{data.sign}</h2>
                    <p className={styles.signHeaderDates}>{data.dateRange}</p>
                  </div>
                  <div className={styles.todayRow}>
                    <span className={styles.todayLabel}>{isToday ? "Today" : shownDayLabel} · {viewingLabel}</span>
                    <button className={styles.shareBtn} onClick={handleShare}>
                      <span className="material-symbols-outlined">{linkCopied ? "check" : "ios_share"}</span>
                      {linkCopied ? "Copied!" : "Share"}
                    </button>
                  </div>
                </div>

                <p className={styles.horoscopeText}>{data.horoscope}</p>
                {!isToday && (
                  <p className={styles.dayNote}>
                    <span className="material-symbols-outlined">info</span>
                    Showing the generated outlook for {shownDayLabel}. Full-text reading reflects today only.
                  </p>
                )}

                <p className={styles.sectionLabel}>{shownDayLabel}'s Outlook</p>
                <div className={styles.categoryGrid}>
                  {shown.categories.map((c) => {
                    const meta = CATEGORY_META[c.category];
                    return (
                      <div key={c.category} className={styles.categoryCard}>
                        <span className={`material-symbols-outlined ${styles.categoryIcon}`} style={{ color: meta.color }}>
                          {meta.icon}
                        </span>
                        <p className={styles.categoryLabel}>{meta.label}</p>
                        <Stars rating={c.rating} />
                        <p className={styles.categoryBlurb}>{c.blurb}</p>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.factsRow}>
                  <div className={styles.factItem}>
                    <span className="material-symbols-outlined">star</span>
                    <div><p className={styles.factLabel}>Lucky Number</p><p className={styles.factValue}>{shown.luckyNumber}</p></div>
                  </div>
                  <div className={styles.factItem}>
                    <span className="material-symbols-outlined">palette</span>
                    <div><p className={styles.factLabel}>Lucky Color</p><p className={styles.factValue}>{shown.luckyColor}</p></div>
                  </div>
                  <div className={styles.factItem}>
                    <span className="material-symbols-outlined">schedule</span>
                    <div><p className={styles.factLabel}>Best Time</p><p className={styles.factValue}>{shown.bestTime}</p></div>
                  </div>
                  <div className={styles.factItem}>
                    <span className="material-symbols-outlined">local_fire_department</span>
                    <div><p className={styles.factLabel}>Element</p><p className={styles.factValue}>{data.element}</p></div>
                  </div>
                </div>
              </div>

              <div className={styles.bottomRow}>
                <div className={styles.card}>
                  <p className={styles.cardTitleSm}>
                    <button type="button" className={styles.calendarIconBtn} onClick={openCalendar} aria-label="Open calendar">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </button>
                    This Week's Overview
                  </p>
                  <div className={styles.weekRow}>
                    {data.week.map((d) => {
                      const isSelected = d.date === viewingDate;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          className={isSelected ? styles.weekDayActive : styles.weekDay}
                          onClick={() => setSelectedDate(d.date === data.date ? null : d.date)}
                        >
                          <span className={styles.weekDayLabel}>{d.label}</span>
                          <span className={styles.weekDayDate}>{new Date(d.date + "T00:00:00").getDate()}</span>
                          <span className={styles.weekDot} style={{ background: QUALITY_COLOR[d.quality] }} />
                          <span className={styles.weekQuality}>{d.quality}</span>
                        </button>
                      );
                    })}
                  </div>
                  {!isToday && (
                    <button className={styles.backToTodayBtn} onClick={() => setSelectedDate(null)}>
                      <span className="material-symbols-outlined">arrow_back</span> Back to Today
                    </button>
                  )}
                </div>

                <div className={styles.card}>
                  <p className={styles.cardTitleSm}>
                    <span className="material-symbols-outlined">auto_awesome</span> Monthly Insight
                  </p>
                  <p className={styles.monthlyText}>
                    {monthlyOpen ? data.monthlyHoroscope : data.monthlyHoroscope.slice(0, 140).trim() + "…"}
                  </p>
                  <button className={styles.monthlyLink} onClick={() => setMonthlyOpen((v) => !v)}>
                    {monthlyOpen ? "Show Less" : "View Full Monthly Horoscope"}
                    <span className="material-symbols-outlined">{monthlyOpen ? "expand_less" : "arrow_forward"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.sideCol}>
              <div className={styles.card}>
                <p className={styles.cardTitleSm}>
                  <span className="material-symbols-outlined">insights</span> {shownDayLabel} at a Glance
                </p>
                <div className={styles.energyRing} style={{ "--pct": shown.energyPercent }}>
                  <span className={styles.energyPct}>{shown.energyPercent}%</span>
                  <span className={styles.energyLabel}>Positive Energy</span>
                </div>
                <p className={styles.energyQuote}>"{shown.energyQuote}"</p>
              </div>

              <div className={styles.ritualCard}>
                <p className={styles.cardTitleSm}>
                  <span className="material-symbols-outlined">spa</span> Recommended Ritual
                </p>
                <p className={styles.ritualSub}>Based on today's planetary alignment</p>
                <div className={styles.ritualBox}>
                  <span className={styles.ritualOm}>ॐ</span>
                  <div>
                    <p className={styles.ritualName}>{data.ritualMantra}</p>
                    <p className={styles.ritualReps}>{data.ritualReps} Repetitions</p>
                  </div>
                </div>
                <button className={styles.startBtn} onClick={() => navigate("/knowledge/108-day-sadhana")}>
                  <span className="material-symbols-outlined">play_arrow</span> Start Practice
                </button>
                <button className={styles.reminderLink} onClick={() => navigate("/knowledge/108-day-sadhana")}>
                  <span className="material-symbols-outlined">notifications</span> Set Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {calendarOpen && (
        <div className={styles.calendarOverlay} onClick={() => setCalendarOpen(false)}>
          <div className={styles.calendarPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.calendarHeader}>
              <button
                type="button"
                className={styles.calendarNavBtn}
                onClick={() => setCalendarMonth((m) => shiftMonthKey(m, -1))}
                aria-label="Previous month"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <p className={styles.calendarMonthLabel}>{monthLabel(calendarMonth)}</p>
              <button
                type="button"
                className={styles.calendarNavBtn}
                onClick={() => setCalendarMonth((m) => shiftMonthKey(m, 1))}
                aria-label="Next month"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button
                type="button"
                className={styles.calendarCloseBtn}
                onClick={() => setCalendarOpen(false)}
                aria-label="Close calendar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className={styles.calendarWeekdays}>
              {WEEKDAY_HEADERS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {monthLoading || !monthData ? (
              <p className={styles.calendarLoading}>Loading…</p>
            ) : (
              <div className={styles.calendarGrid}>
                {Array.from({ length: monthData.leadingBlanks }).map((_, i) => (
                  <span key={`blank-${i}`} className={styles.calendarBlank} />
                ))}
                {monthData.days.map((d) => {
                  const isSelected = d.date === viewingDate;
                  const isTodayCell = data && d.date === data.date;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      className={`${styles.calendarDay} ${isSelected ? styles.calendarDaySelected : ""} ${isTodayCell ? styles.calendarDayToday : ""}`}
                      onClick={() => handlePickDate(d.date)}
                    >
                      <span>{d.day}</span>
                      <span className={styles.calendarDot} style={{ background: QUALITY_COLOR[d.quality] }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyHoroscope;
