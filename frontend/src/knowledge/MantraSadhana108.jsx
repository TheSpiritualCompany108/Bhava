import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MantraSadhana108.module.css";

const phases = [
  {
    id: 1,
    phase: "Foundation",
    dayRange: "Day 1–27",
    color: "#6E1B21",
    tagline: "Discipline Begins the Journey",
    purpose:
      "Build consistency, correct pronunciation, and mental focus. This phase is about habit formation — the mind may wander, but discipline is more important than depth.",
    universalMessage:
      "Every great sadhana begins with the courage to show up, even when the mind resists.",
    days: [
      { day: 1,  theme: "Sankalpa",                    mantra: "ॐ ॐ",                                 duration: "34 min" },
      { day: 2,  theme: "Inner Peace · Shanti",         mantra: "ॐ शािन्तः शािन्तः शािन्तः",             duration: "34 min" },
      { day: 3,  theme: "Shiva · Panchakshari",         mantra: "ॐ नमः शवाय",                          duration: "34 min" },
      { day: 4,  theme: "Vishnu · Ashtakshari",         mantra: "ॐ नमो नारायणाय",                       duration: "34 min" },
      { day: 5,  theme: "Ganesha · Ganapati",           mantra: "ॐ गं गणपतये नमः",                      duration: "34 min" },
      { day: 6,  theme: "Breath · So Hum",              mantra: "सोऽहम्",                              duration: "34 min" },
      { day: 7,  theme: "Inner Light · Gayatri Seed",   mantra: "ॐ भूभुवः स्वः",                         duration: "34 min" },
      { day: 8,  theme: "Protection · Mahamrityunjaya", mantra: "ॐ त्र्यम्बकं यजामहे",                    duration: "34 min" },
      { day: 9,  theme: "Wisdom · Guru",                mantra: "ॐ श्री गुरुभ्यो नमः",                   duration: "34 min" },
      { day: 10, theme: "Stillness · Tat Sat",          mantra: "ॐ तत्सत्",                             duration: "34 min" },
      { day: 11, theme: "Heart · Hari Om",              mantra: "हर ॐ",                                duration: "34 min" },
      { day: 12, theme: "Awareness · AUM",              mantra: "अ उ म्",                              duration: "34 min" },
      { day: 13, theme: "Shiva · Hara Hara",            mantra: "हर हर महादेव",                          duration: "34 min" },
      { day: 14, theme: "Vishnu · Govinda",             mantra: "गोवन्द गोवन्द",                         duration: "34 min" },
      { day: 15, theme: "Krishna · Gopala",             mantra: "गोपाल गोवन्द राम",                      duration: "34 min" },
      { day: 16, theme: "Rama · Rama Nama",             mantra: "श्री राम जय राम जय जय राम",              duration: "34 min" },
      { day: 17, theme: "Hanuman",                      mantra: "ॐ हनुमते नमः",                         duration: "34 min" },
      { day: 18, theme: "Durga",                        mantra: "ॐ दुं दुगायै नमः",                      duration: "34 min" },
      { day: 19, theme: "Lakshmi",                      mantra: "ॐ श्रीं महालक्ष्म्यै नमः",                duration: "34 min" },
      { day: 20, theme: "Saraswati",                    mantra: "ॐ ऐं सरस्वत्यै नमः",                    duration: "34 min" },
      { day: 21, theme: "Kali",                         mantra: "ॐ क्रीं कालकायै नमः",                   duration: "34 min" },
      { day: 22, theme: "Tripura",                      mantra: "ॐ श्रीं ह्रीं क्लीं",                     duration: "34 min" },
      { day: 23, theme: "Bhuvaneshwari",                mantra: "ॐ ह्रीं नमः",                          duration: "34 min" },
      { day: 24, theme: "Annapurna",                    mantra: "ॐ अन्नपूणायै नमः",                      duration: "34 min" },
      { day: 25, theme: "Surya",                        mantra: "ॐ घृणः सूयाय नमः",                      duration: "34 min" },
      { day: 26, theme: "Chandra · Moon",               mantra: "ॐ सोमाय नमः",                          duration: "34 min" },
      { day: 27, theme: "Agni · Fire",                  mantra: "ॐ अग्नये नमः",                          duration: "34 min" },
    ],
  },
  {
    id: 2,
    phase: "Stabilization",
    dayRange: "Day 28–54",
    color: "#6E1B21",
    tagline: "Breath and Sound Become One",
    purpose:
      "Connect mantra with breath and deepen awareness. The mind starts settling. Chanting becomes rhythmic. Bring mantra into motion — walking, cooking, breathing.",
    universalMessage:
      "Discipline is the bridge between intention and transformation. Action without ego is the secret of peace.",
    days: [
      { day: 28, theme: "Vayu · Wind",              mantra: "ॐ वायवे नमः",              duration: "34 min" },
      { day: 29, theme: "Varuna · Water",           mantra: "ॐ वरुणाय नमः",              duration: "34 min" },
      { day: 30, theme: "Earth · Prithvi",          mantra: "ॐ पृथ्व्यै नमः",             duration: "34 min" },
      { day: 31, theme: "Space · Akasha",           mantra: "ॐ आकाशाय नमः",              duration: "34 min" },
      { day: 32, theme: "Heart · Hridaya",          mantra: "ह्रीं",                     duration: "34 min" },
      { day: 33, theme: "Compassion · Karuna",      mantra: "ॐ करुणायै नमः",             duration: "34 min" },
      { day: 34, theme: "Bliss · Ananda",           mantra: "आनन्दोऽहम्",                duration: "34 min" },
      { day: 35, theme: "Self · Aham Brahmasmi",    mantra: "अहं ब्रह्मािस्म",             duration: "34 min" },
      { day: 36, theme: "Truth · Satyam",           mantra: "सत्यम् शवम् सुन्दरम्",          duration: "34 min" },
      { day: 37, theme: "Consciousness · Chit",     mantra: "चत् आनन्दम्",                duration: "34 min" },
      { day: 38, theme: "Silence · Mauna",          mantra: "ॐ",                        duration: "34 min" },
      { day: 39, theme: "Shiva · Rudra",            mantra: "ॐ रुद्राय नमः",             duration: "34 min" },
      { day: 40, theme: "Shiva · Mahadeva",         mantra: "ॐ महादेवाय नमः",            duration: "34 min" },
      { day: 41, theme: "Vishnu · Vasudeva",        mantra: "ॐ नमो भगवते वासुदेवाय",       duration: "34 min" },
      { day: 42, theme: "Krishna · Radhe Krishna",  mantra: "राधे कृष्ण",                duration: "34 min" },
      { day: 43, theme: "Rama · Sita Ram",          mantra: "सीताराम",                   duration: "34 min" },
      { day: 44, theme: "Hanuman · Bajrang",        mantra: "रामदूताय नमः",              duration: "34 min" },
      { day: 45, theme: "Narasimha · Protection",   mantra: "ॐ क्ष्रौं नमः",              duration: "34 min" },
      { day: 46, theme: "Dattatreya · Guru",        mantra: "ॐ द्राम् दत्तात्रेयाय नमः",     duration: "34 min" },
      { day: 47, theme: "Dakshinamurti · Wisdom",   mantra: "ॐ द णामूतये नमः",            duration: "34 min" },
      { day: 48, theme: "Shiva · Ardhanarishvara",  mantra: "ॐ अधनारीश्वराय नमः",         duration: "34 min" },
      { day: 49, theme: "Ganga · Purity",           mantra: "ॐ गङ्गायै नमः",              duration: "34 min" },
      { day: 50, theme: "Yamuna · Devotion",        mantra: "ॐ यमुनायै नमः",              duration: "34 min" },
      { day: 51, theme: "Tulasi · Bhakti",          mantra: "ॐ तुलस्यै नमः",              duration: "34 min" },
      { day: 52, theme: "Nandi · Service",          mantra: "ॐ नन्दीश्वराय नमः",           duration: "34 min" },
      { day: 53, theme: "Nataraja · Dance",         mantra: "ॐ नटराजाय नमः",              duration: "34 min" },
      { day: 54, theme: "Completion · Shanti",      mantra: "ॐ शािन्तः शािन्तः शािन्तः",     duration: "34 min" },
    ],
  },
  {
    id: 3,
    phase: "Deepening",
    dayRange: "Day 55–81",
    color: "#6E1B21",
    tagline: "Mantra Enters the Heart",
    purpose:
      "Move from verbal chanting to internal repetition. This phase is about internalization — the mantra travels from lips to heart, becoming a living presence.",
    universalMessage:
      "The mantra is a living being. When you repeat it with sincerity, it repeats itself within you.",
    days: [
      { day: 55, theme: "Inner Japa · Om",                    mantra: "ॐ",                       duration: "34 min" },
      { day: 56, theme: "Ajapa · So Hum",                     mantra: "सोऽहम्",                   duration: "34 min" },
      { day: 57, theme: "Prana · Ham Sa",                     mantra: "हंसः",                    duration: "34 min" },
      { day: 58, theme: "Nada · Nada Brahma",                 mantra: "नाद ब्रह्म",                duration: "34 min" },
      { day: 59, theme: "Bindu",                              mantra: "बन्दु",                    duration: "34 min" },
      { day: 60, theme: "Hreem · Heart",                      mantra: "ह्रीं",                    duration: "34 min" },
      { day: 61, theme: "Shreem · Abundance",                 mantra: "श्रीं",                    duration: "34 min" },
      { day: 62, theme: "Kleem · Love",                       mantra: "क्लीं",                    duration: "34 min" },
      { day: 63, theme: "Aim · Knowledge",                    mantra: "ऐं",                      duration: "34 min" },
      { day: 64, theme: "Gam · Ganesha",                      mantra: "गं",                      duration: "34 min" },
      { day: 65, theme: "Dum · Durga",                        mantra: "दु ं",                     duration: "34 min" },
      { day: 66, theme: "Kreem · Kali",                       mantra: "क्रीं",                    duration: "34 min" },
      { day: 67, theme: "Hum · Protection",                   mantra: "हू ं",                     duration: "34 min" },
      { day: 68, theme: "Phat · Purification",                mantra: "फट्",                     duration: "34 min" },
      { day: 69, theme: "Omkara",                             mantra: "ॐकार",                    duration: "34 min" },
      { day: 70, theme: "Pranava",                            mantra: "प्रणवः",                   duration: "34 min" },
      { day: 71, theme: "Mahavakya · Tat Tvam Asi",           mantra: "तत्त्वमस",                  duration: "34 min" },
      { day: 72, theme: "Mahavakya · Prajnanam Brahma",       mantra: "प्रज्ञानं ब्रह्म",            duration: "34 min" },
      { day: 73, theme: "Mahavakya · Ayam Atma Brahma",       mantra: "अयमात्मा ब्रह्म",            duration: "34 min" },
      { day: 74, theme: "Mahavakya · Aham Brahmasmi",         mantra: "अहं ब्रह्मािस्म",             duration: "34 min" },
      { day: 75, theme: "Shiva · Sadashiva",                  mantra: "ॐ सदाशवाय नमः",            duration: "34 min" },
      { day: 76, theme: "Vishnu · Achyuta",                   mantra: "अच्युतानन्त गोवन्द",          duration: "34 min" },
      { day: 77, theme: "Krishna · Madhava",                  mantra: "माधवाय नमः",               duration: "34 min" },
      { day: 78, theme: "Rama · Raghava",                     mantra: "राघवाय नमः",               duration: "34 min" },
      { day: 79, theme: "Devi · Jagadamba",                   mantra: "जय अम्बे",                 duration: "34 min" },
      { day: 80, theme: "Guru · Param Guru",                  mantra: "गुरवे नमः",                duration: "34 min" },
      { day: 81, theme: "Silence · Om Shanti",                mantra: "ॐ शािन्तः",                duration: "34 min" },
    ],
  },
  {
    id: 4,
    phase: "Integration",
    dayRange: "Day 82–108",
    color: "#6E1B21",
    tagline: "Sound Becomes Stillness",
    purpose:
      "Integrate mantra into daily life. Chanting is no longer practice — it becomes presence. The sound dissolves and what remains is silence, devotion, and grace.",
    universalMessage:
      "When the chanting stops and the silence speaks, the sadhana is complete.",
    days: [
      { day: 82,  theme: "Integration · Hari Om",              mantra: "हर ॐ",                                                                          duration: "34 min" },
      { day: 83,  theme: "Shiva · Tryambakam",                 mantra: "ॐ त्र्यम्बकं यजामहे",                                                              duration: "34 min" },
      { day: 84,  theme: "Vishnu · Narayana",                  mantra: "नारायण नारायण",                                                                  duration: "34 min" },
      { day: 85,  theme: "Krishna · Govinda",                  mantra: "गोवन्द हर गोपाल",                                                                 duration: "34 min" },
      { day: 86,  theme: "Rama · Ram",                         mantra: "राम राम",                                                                       duration: "34 min" },
      { day: 87,  theme: "Hanuman · Hanuman Chalisa Seed",     mantra: "जय हनुमान",                                                                      duration: "34 min" },
      { day: 88,  theme: "Lakshmi · Mahalakshmi",              mantra: "श्रीं महालक्ष्म्यै नमः",                                                            duration: "34 min" },
      { day: 89,  theme: "Durga · Mahishasuramardini",         mantra: "जय दुग",                                                                        duration: "34 min" },
      { day: 90,  theme: "Saraswati · Veena",                  mantra: "जय सरस्वत",                                                                      duration: "34 min" },
      { day: 91,  theme: "Shiva · Rudram Seed",                mantra: "नमः शवाय",                                                                       duration: "34 min" },
      { day: 92,  theme: "Shiva · Lingashtakam Seed",          mantra: "ब्रह्ममुरार",                                                                     duration: "34 min" },
      { day: 93,  theme: "Krishna · Maha Mantra",              mantra: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे हरे राम हरे राम राम राम हरे हरे",                  duration: "34 min" },
      { day: 94,  theme: "Rama · Taraka",                      mantra: "श्री राम जय राम जय जय राम",                                                        duration: "34 min" },
      { day: 95,  theme: "Guru · Guru Gita Seed",              mantra: "गुरुब्रह्मा गुरुवष्णुः",                                                            duration: "34 min" },
      { day: 96,  theme: "Gayatri",                            mantra: "ॐ भूभुवः स्वः तत्सवतुवरेण्यं",                                                       duration: "34 min" },
      { day: 97,  theme: "Purusha · Purusha Seed",             mantra: "सहस्रशीषा पुरुषः",                                                                duration: "34 min" },
      { day: 98,  theme: "Narayana · Narayana Sukta Seed",     mantra: "नारायणः परो ज्योतः",                                                              duration: "34 min" },
      { day: 99,  theme: "Devi · Sri Sukta Seed",              mantra: "हरण्यवणा हरणीं",                                                                  duration: "34 min" },
      { day: 100, theme: "Shiva · Shivoham",                   mantra: "शवोऽहम्",                                                                       duration: "34 min" },
      { day: 101, theme: "Self · Soham",                       mantra: "सोऽहम्",                                                                        duration: "34 min" },
      { day: 102, theme: "Silence · Om",                       mantra: "ॐ",                                                                            duration: "34 min" },
      { day: 103, theme: "Gratitude · Guru",                   mantra: "ॐ श्री गुरुभ्यो नमः",                                                              duration: "34 min" },
      { day: 104, theme: "Completion · Purna",                 mantra: "पूणमदः पूणमदम्",                                                                  duration: "34 min" },
      { day: 105, theme: "Offering · Swaha",                   mantra: "स्वाहा",                                                                        duration: "34 min" },
      { day: 106, theme: "Grace · Kripa",                      mantra: "ॐ कृपामयाय नमः",                                                                  duration: "34 min" },
      { day: 107, theme: "Universal Peace · Lokah",            mantra: "लोकाः समस्ताः सुखनो भवन्तु",                                                        duration: "34 min" },
      { day: 108, theme: "Purnahuti · Final Blessing",         mantra: "ॐ शािन्तः शािन्तः शािन्तः",                                                        duration: "34 min" },
    ],
  },
];

const completionBenefits = [
  {
    title: "Unshakeable Discipline",
    description:
      "108 days of consistent practice forges a daily sadhana that becomes second nature.",
  },
  {
    title: "Mental Clarity",
    description:
      "The mind becomes clearer, sharper, and no longer controlled by scattered thoughts.",
  },
  {
    title: "Emotional Mastery",
    description:
      "Reactions soften. You observe feelings instead of being overtaken by them.",
  },
  {
    title: "Spiritual Identity",
    description:
      "Mantra becomes part of who you are — a living, breathing devotion within.",
  },
  {
    title: "Inner Stillness",
    description:
      "Sound becomes silence. Practice becomes presence. Stillness deepens permanently.",
  },
];

const sacredFacts = [
  {
    label: "Mala & Japa Practice",
    heading: "108 Beads, One Complete Round",
    description:
      "A traditional Japa Mala has 108 beads. When chanting any mantra, you complete 108 repetitions — one full round. The 109th bead, the Sumeru or Guru bead, is never crossed. You reverse direction instead, honoring the infinite cycle of devotion.",
  },
  {
    label: "Astronomy & Cosmos",
    heading: "The Universe Encoded in a Number",
    description:
      "The Sun's diameter is approximately 108 times the Earth's diameter. The distance from Earth to the Sun is approximately 108 times the Sun's diameter. The distance from Earth to the Moon is approximately 108 times the Moon's diameter. Ancient Vedic sages calculated this thousands of years ago.",
  },
  {
    label: "Human Body & Chakras",
    heading: "108 Channels of Vital Energy",
    description:
      "There are 108 nadis — energy channels — that converge at the heart chakra, Anahata. There are 108 marma points, vital pressure points in the body similar to acupressure. The Atman, the soul, is said to pass through 108 stages on its spiritual journey.",
  },
  {
    label: "Sanskrit & Sacred Texts",
    heading: "The Language of the Divine",
    description:
      "Sanskrit has 54 letters, each with masculine (Shiva) and feminine (Shakti) forms — 54 multiplied by 2 equals 108. The Rigveda is divided into 10,800 stanzas. There are 108 Upanishads and 108 names each for Vishnu, Shiva, Lakshmi, and Ganesha.",
  },
  {
    label: "Tantra & Yoga",
    heading: "Sacred Sites, Sacred Motion",
    description:
      "There are 108 sacred sites — Shakti Peethas — across India. Bharatanatyam, classical Indian dance, contains 108 forms of movement as listed in the Natya Shastra. In yoga, 108 Sun Salutations are performed on special occasions such as solstices and equinoxes.",
  },
  {
    label: "Time & Astrology",
    heading: "Written in the Stars",
    description:
      "In Vedic astrology, there are 12 zodiac signs and 9 planets — 12 multiplied by 9 equals 108. There are 27 Nakshatras, the lunar mansions, each divided into 4 Padas — 27 multiplied by 4 equals 108.",
  },
  {
    label: "Across Traditions",
    heading: "A Universal Sacred Number",
    description:
      "Beyond Hinduism, the significance of 108 resonates widely. In Buddhism, 108 bells are rung to mark the New Year. In Sikhism, 108 divine names are honored. In Jainism, 108 virtues are recognized as the path to liberation.",
  },
];

function MantraSadhana108() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [playingDay, setPlayingDay] = useState(null);

  const togglePhase = (idx) => {
    setExpandedPhase(expandedPhase === idx ? null : idx);
  };

  const togglePlay = (dayKey, e) => {
    e.stopPropagation();
    setPlayingDay(playingDay === dayKey ? null : dayKey);
  };

  return (
    <div className={styles.page}>

      {/* ── Two-Panel Layout ── */}
      <div className={styles.layout}>

        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>108-Day Mantra Sādhana</h1>

          <div className={styles.imageCard}>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>Progress</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
              </div>
            </div>
            <img
              src="../108-Day Mantra Sadhana.png"
              alt="108-Day Mantra Sādhana"
              className={styles.heroImg}
            />
            <div className={styles.controls}>
              <button className={styles.controlBtn}>
                <span className="material-symbols-outlined">play_arrow</span>
                <span className={styles.controlLabel}>Play</span>
              </button>
              <button className={styles.controlBtn}>
                <span className="material-symbols-outlined">add_circle</span>
                <span className={styles.controlLabel}>Save</span>
              </button>
              <button className={styles.controlBtn}>
                <span className="material-symbols-outlined">share</span>
                <span className={styles.controlLabel}>Share</span>
              </button>
            </div>
          </div>

          <p className={styles.description}>
            Commit to daily mantra and deepen your inner stillness. Chant sacred
            mantras for 108 consecutive days and experience profound inner
            transformation through sound and devotion.
          </p>
        </div>

        {/* Right Side */}
        <div className={styles.rightWrapper}>
          <p className={styles.sessionsCount}>4 Phases · 108 Days</p>

          <div className={styles.rightPanel}>
            {phases.map((item, idx) => (
              <div key={item.id} className={styles.sessionBlock}>

                {/* Phase Header — clickable */}
                <button
                  className={styles.stageHeader}
                  onClick={() => togglePhase(idx)}
                >
                  <span
                    className={styles.stageBadge}
                    style={{ background: item.color }}
                  >
                    Phase {item.id}
                  </span>
                  <div className={styles.stageHeaderInfo}>
                    <span className={styles.stageHeaderName}>{item.phase}</span>
                    <span className={styles.stageHeaderDays}>{item.dayRange}</span>
                  </div>
                  <span className={styles.stageHeaderTagline}>
                    "{item.tagline}"
                  </span>
                  <span className={styles.chevron}>
                    {expandedPhase === idx ? "▲" : "▼"}
                  </span>
                </button>

                {/* Expanded Day-wise Audio List */}
                {expandedPhase === idx && (
                  <div className={styles.dayListWrapper}>
                    <p className={styles.stagePurposeInline}>{item.purpose}</p>

                    <div className={styles.dayList}>
                      {item.days.map((d) => {
                        const key = `${item.id}-${d.day}`;
                        const isPlaying = playingDay === key;
                        return (
                          <div
                            key={d.day}
                            className={`${styles.dayRow} ${isPlaying ? styles.dayRowActive : ""}`}
                          >
                            <span className={styles.dayBadge}>Day {d.day}</span>

                            <div className={styles.dayInfo}>
                              <p className={styles.dayTheme}>{d.theme}</p>
                              <p className={styles.dayVerse}>{d.mantra}</p>
                            </div>

                            <div className={styles.audioRight}>
                              {isPlaying && (
                                <div className={styles.waveBar}>
                                  <span /><span /><span /><span /><span />
                                </div>
                              )}
                              <span className={styles.dayDuration}>{d.duration}</span>
                              <button
                                className={`${styles.playCircleDay} ${isPlaying ? styles.playCircleDayActive : ""}`}
                                onClick={(e) => togglePlay(key, e)}
                              >
                                <span className="material-symbols-outlined">
                                  {isPlaying ? "pause" : "play_arrow"}
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className={styles.universalMsgInline}>
                      "{item.universalMessage}"
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Why 108 is Sacred ── */}
      <section className={styles.sacredSection}>
        <div className={styles.sacredContainer}>
          <h2 className={styles.sacredTitle}>Why 108 is Sacred in Hinduism</h2>
          <p className={styles.sacredSubtitle}>
            108 represents the wholeness of existence — the connection between
            the individual soul and universal consciousness. It is not merely a
            number. In Hindu philosophy, 108 is the numerical representation of
            the universe itself.
          </p>
          <div className={styles.sacredGrid}>
            {sacredFacts.map((fact, i) => (
              <div key={i} className={styles.sacredCard}>
                <p className={styles.sacredLabel}>{fact.label}</p>
                <h3 className={styles.sacredHeading}>{fact.heading}</h3>
                <p className={styles.sacredDesc}>{fact.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.sacredSummary}>
            <p className={styles.sacredSummaryText}>
              108 bridges cosmos, body, sound, and time. Every strand of Vedic
              knowledge — from astronomy to anatomy, from scripture to sacred
              geography — converges on this single number, affirming that the
              universe is not chaotic but ordered, and that the devotee who
              chants 108 times participates consciously in that order.
            </p>
          </div>
        </div>
      </section>

      {/* ── After 108 Days — Benefits ── */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsContainer}>
          <h2 className={styles.benefitsTitle}>
            After <span className={styles.maroon}>108 Days</span>
          </h2>
          <p className={styles.benefitsSubtitle}>
            After completing the 108-Day Mantra Sādhana, you will have undergone
            a complete inner transformation — from discipline to stillness, from
            sound to silence.
          </p>
          <div className={styles.benefitsGrid}>
            {completionBenefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <h3 className={styles.benefitCardTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default MantraSadhana108;
