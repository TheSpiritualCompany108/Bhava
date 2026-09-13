import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Tile images may be an absolute Vercel Blob URL (new uploads) or a
// relative /uploads path (legacy files bundled with the backend).
const resolveImageUrl = (url) => (url?.startsWith("http") ? url : API_BASE + url);

// ── Homepage content editor config ──────────────────────────────────────
// These mirror the hardcoded defaults in the frontend components so the
// admin form can show meaningful placeholders. Leaving a field blank keeps
// the site's default for that field.
const SACRED_KNOWLEDGE_ITEMS = [
  { id: "texts-temples", label: "Sacred Texts + Temples", defaultTitle: "Sacred Texts + Temples", defaultDescription: "Explore timeless scriptures, sacred temples and profound teachings.", defaultCta: "Explore" },
  { id: "stories-mythology", label: "Stories (Mythology)", defaultTitle: "Stories (Mythology)", defaultDescription: "Dive into inspiring stories from our rich heritage and ancient wisdom.", defaultCta: "Explore" },
  { id: "thought-of-day", label: "Thought of the Day", defaultTitle: "Thought of the Day", defaultDescription: "18 Gita reflections to guide and inspire your day with clarity and purpose.", defaultCta: "Read Today's Thought" },
];

const ASTROLOGY_TOOLS_ITEMS = [
  { id: "kundli-generator", label: "Kundli Generator", defaultTitle: "Kundli Generator", defaultDescription: "Generate your detailed birth chart and explore the positions of planets in your life.", defaultCta: "Generate Now" },
  { id: "astrology-calculator", label: "Astrology Calculator", defaultTitle: "Astrology Calculator", defaultDescription: "Calculate your sun sign, moon sign, ascendant and more with accurate insights.", defaultCta: "Calculate Now" },
  { id: "kundli-matching", label: "Kundli Matching", defaultTitle: "Kundli Matching", defaultDescription: "Check compatibility with detailed Ashtakoot matching for a strong bond.", defaultCta: "Match Now" },
  { id: "numerology-calculator", label: "Numerology Calculator", defaultTitle: "Numerology Calculator", defaultDescription: "Discover your life path, destiny number and hidden patterns in your life.", defaultCta: "Calculate Now" },
];

const HERO_SLIDES = [
  {
    id: "slide-0",
    label: "Slide 1 (main hero)",
    type: "hero",
    defaultHeadline: "Awaken Bhava : Live Divine",
    defaultHighlight: "Every Day",
    defaultDescription: "A Simple Daily Ritual System For Modern Homes.",
    defaultDescription1: "Ritual is not reserved for special occasions. It is the quiet return to yourself, every single day.",
    defaultPrimaryCta: "Begin With Bhava",
    defaultSecondaryCta: "Explore the System",
  },
  {
    id: "slide-1",
    label: "Slide 2",
    type: "slide",
    defaultTitle0: "A Daily Ritual.",
    defaultTitle1: "A Different Life.",
    defaultDescription: "Eleven intentional minutes each day can create remarkable clarity over time. Bhava helps you build a practice that quietly becomes part of who you are.",
    defaultCta: "Begin Your Ritual",
  },
  {
    id: "slide-2",
    label: "Slide 3",
    type: "slide",
    defaultTitle0: "Objects Made",
    defaultTitle1: "For Practice.",
    defaultDescription: "Every Bhava object has one purpose: to support your daily rhythm with simplicity, beauty, and intention.",
    defaultCta: "Explore Ritual Systems",
  },
  {
    id: "slide-3",
    label: "Slide 4",
    type: "slide",
    defaultTitle0: "Stay With",
    defaultTitle1: "The Practice.",
    defaultDescription: "Guided journeys, reflections, and structured challenges help transform occasional devotion into lasting habits.",
    defaultCta: "Explore Bhakti",
  },
  {
    id: "slide-4",
    label: "Slide 5",
    type: "slide",
    defaultTitle0: "Ancient Wisdom.",
    defaultTitle1: "Daily Life.",
    defaultDescription: "Short reflections, timeless teachings, and practical guidance designed to accompany modern living.",
    defaultCta: "Read Today's Reflection",
  },
  {
    id: "slide-5",
    label: "Slide 6",
    type: "slide",
    defaultTitle0: "Your Ritual,",
    defaultTitle1: "Supported Daily.",
    defaultDescription: "Gentle reminders, progress tracking, and guided experiences that encourage consistency without distraction.",
    defaultCta: "Explore the App",
  },
];

const HOMEPAGE_TABS = [
  {
    key: "hero",
    label: "Hero / Top Banner",
    hint: "The big rotating banner at the very top of the homepage — the first thing every visitor sees.",
  },
  {
    key: "sacredKnowledge",
    label: "Sacred Knowledge",
    hint: "The 2nd section on the homepage: the 3-card \"Timeless Wisdom for Everyday Life\" row (Sacred Texts + Temples, Stories, Thought of the Day).",
    defaultKicker: "Sacred Knowledge",
    defaultTitle: "Timeless Wisdom for Everyday Life",
    defaultSubtitle: "Explore ancient scriptures, inspiring stories, and daily reflections to nourish your mind and soul.",
  },
  {
    key: "astrologyTools",
    label: "Astrology Tools",
    hint: "Further down the homepage: the 4-card \"Discover Your Cosmic Blueprint\" row (Kundli Generator, Astrology Calculator, Kundli Matching, Numerology Calculator).",
    defaultKicker: "Astrology & Spiritual Tools",
    defaultTitle: "Discover Your Cosmic Blueprint",
    defaultSubtitle: "Powerful astrology tools to understand yourself, make better decisions and live with clarity.",
  },
  {
    key: "community",
    label: "Community",
    hint: "Near the bottom of the homepage: the \"Living with Bhava\" testimonials row.",
    defaultKicker: "Community Stories",
    defaultTitle: "Living with Bhava :",
  },
];

// A text field that shows the site's default text (dimmed) when no admin
// override has been saved, instead of an empty box next to a placeholder
// that only hints at the default — so what you see here matches what's
// live on the homepage. Typing anything saves it as your override.
function HomepageField({ label, value, defaultValue, onChange, placeholder, textarea }) {
  const hasValue = value !== undefined && value !== null && value !== "";
  const shared = {
    placeholder: placeholder || label,
    value: value ?? defaultValue ?? "",
    onChange: (e) => onChange(e.target.value),
    style: {
      width: "100%",
      padding: 10,
      borderRadius: 4,
      border: "1px solid #ddd",
      fontSize: 13,
      color: hasValue ? "#000" : "#888",
      ...(textarea ? { minHeight: 50, resize: "vertical" } : {}),
    },
  };
  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, fontSize: 11, fontWeight: 600, color: hasValue ? "#4A0B1D" : "#999" }}>
        {label} {!hasValue && "(showing default — edit to override)"}
      </label>
      {textarea ? <textarea {...shared} /> : <input {...shared} />}
    </div>
  );
}

export default function AdminPage() {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const categories = [
    "Sacred Wisdom",
    "Daily Sacred",
    "Paths of Dharmic",
    "Living Wisdom",
    "Products"
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [section, setSection] = useState("tiles"); // "tiles" | "quotes" | "mantraAudio" | "dhyanAudio" | "homepage"
  const [homepageTab, setHomepageTab] = useState("sacredKnowledge");
  const [homepageData, setHomepageData] = useState({});
  const [homepageLoading, setHomepageLoading] = useState(false);
  const [homepageError, setHomepageError] = useState("");
  const [homepageSaving, setHomepageSaving] = useState(false);
  const [homepageSaved, setHomepageSaved] = useState(false);
  const [homepageImages, setHomepageImages] = useState({});
  const [homepageImagePreviews, setHomepageImagePreviews] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [quotesError, setQuotesError] = useState("");
  const [quoteForm, setQuoteForm] = useState({ reflection: "", text: "", reference: "", isActive: false });
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [mantraAudioMap, setMantraAudioMap] = useState({});
  const [mantraAudioLoading, setMantraAudioLoading] = useState(true);
  const [mantraAudioError, setMantraAudioError] = useState("");
  const [uploadingDay, setUploadingDay] = useState(null);
  const [mantraDraft, setMantraDraft] = useState({});
  const [savingContentDay, setSavingContentDay] = useState(null);
  const [dhyanAudioMap, setDhyanAudioMap] = useState({});
  const [dhyanAudioLoading, setDhyanAudioLoading] = useState(true);
  const [dhyanAudioError, setDhyanAudioError] = useState("");
  const [uploadingDhyanDay, setUploadingDhyanDay] = useState(null);
  const [dhyanDraft, setDhyanDraft] = useState({});
  const [savingDhyanContentDay, setSavingDhyanContentDay] = useState(null);
  const [form, setForm] = useState({ 
    title: "", 
    subtitle: "", 
    badgeText: "", 
    duration: "", 
    summary: "", 
    fullDescription: "",
    lessons: [],
    category: categories[0] 
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: "", duration: "" });
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [currentSessionData, setCurrentSessionData] = useState({
    num: 1,
    title: "",
    duration: ""
  });
  const [editingSessionIndex, setEditingSessionIndex] = useState(null);
  const [sessionImage, setSessionImage] = useState(null);
  const [sessionImagePreview, setSessionImagePreview] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("bhava_token");
    if (!token) { navigate("/admin/login"); return; }
    // fetch tiles for active category
    fetchTiles();
  }, [activeCategory]);

  useEffect(() => {
    const token = localStorage.getItem("bhava_token");
    if (!token) { navigate("/admin/login"); return; }
    if (section === "quotes") fetchQuotes();
    if (section === "mantraAudio") fetchMantraAudio();
    if (section === "dhyanAudio") fetchDhyanAudio();
  }, [section]);

  useEffect(() => {
    if (section !== "homepage") return;
    setHomepageLoading(true);
    setHomepageError("");
    setHomepageImages({});
    setHomepageImagePreviews({});
    setHomepageSaved(false);
    fetch(`${API_BASE}/api/homepage/${homepageTab}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setHomepageData(json.data || {});
        else setHomepageError(json.message || "Failed to load homepage content");
      })
      .catch((err) => setHomepageError(err.message || "Network error"))
      .finally(() => setHomepageLoading(false));
  }, [section, homepageTab]);

  const handleHomepageFieldChange = (field, value) => {
    setHomepageSaved(false);
    setHomepageData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHomepageItemChange = (itemId, field, value) => {
    setHomepageSaved(false);
    setHomepageData((prev) => ({
      ...prev,
      items: { ...(prev.items || {}), [itemId]: { ...((prev.items || {})[itemId] || {}), [field]: value } },
    }));
  };

  const handleHomepageImageSelect = (itemId, file) => {
    if (!file) return;
    setHomepageSaved(false);
    setHomepageImages((prev) => ({ ...prev, [itemId]: file }));
    const reader = new FileReader();
    reader.onloadend = () => setHomepageImagePreviews((prev) => ({ ...prev, [itemId]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleHomepageTestimonialChange = (idx, field, value) => {
    setHomepageSaved(false);
    setHomepageData((prev) => {
      const list = Array.isArray(prev.testimonials) ? [...prev.testimonials] : [];
      list[idx] = { ...(list[idx] || {}), [field]: value };
      return { ...prev, testimonials: list };
    });
  };

  const addHomepageTestimonial = () => {
    setHomepageSaved(false);
    setHomepageData((prev) => ({
      ...prev,
      testimonials: [...(Array.isArray(prev.testimonials) ? prev.testimonials : []), { text: "", author: "", location: "" }],
    }));
  };

  const removeHomepageTestimonial = (idx) => {
    setHomepageSaved(false);
    setHomepageData((prev) => ({ ...prev, testimonials: (prev.testimonials || []).filter((_, i) => i !== idx) }));
  };

  const clearHomepagePendingImage = (id) => {
    setHomepageImages((prev) => { const next = { ...prev }; delete next[id]; return next; });
    setHomepageImagePreviews((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  // Cards — used by both Sacred Knowledge and Astrology Tools, which share
  // the same items/hiddenIds/extraIds shape.
  const addHomepageCard = () => {
    setHomepageSaved(false);
    const id = `custom-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    setHomepageData((prev) => ({
      ...prev,
      extraIds: [...(Array.isArray(prev.extraIds) ? prev.extraIds : []), id],
      items: { ...(prev.items || {}), [id]: { title: "", description: "", cta: "" } },
    }));
  };

  const removeHomepageCard = (id, isExtra) => {
    setHomepageSaved(false);
    clearHomepagePendingImage(id);
    setHomepageData((prev) => {
      if (isExtra) {
        const items = { ...(prev.items || {}) };
        delete items[id];
        return { ...prev, extraIds: (prev.extraIds || []).filter((x) => x !== id), items };
      }
      return { ...prev, hiddenIds: [...(prev.hiddenIds || []), id] };
    });
  };

  const restoreHomepageCard = (id) => {
    setHomepageSaved(false);
    setHomepageData((prev) => ({ ...prev, hiddenIds: (prev.hiddenIds || []).filter((x) => x !== id) }));
  };

  // Hero slides — same idea, separate keys since a slide's fields differ
  // from a card's (title0/title1 vs title, plus its own hidden/extra lists).
  const addHomepageSlide = () => {
    setHomepageSaved(false);
    const id = `custom-slide-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    setHomepageData((prev) => ({
      ...prev,
      extraSlideIds: [...(Array.isArray(prev.extraSlideIds) ? prev.extraSlideIds : []), id],
      items: { ...(prev.items || {}), [id]: { title0: "", title1: "", description: "", cta: "" } },
    }));
  };

  const removeHomepageSlide = (id, isExtra) => {
    setHomepageSaved(false);
    clearHomepagePendingImage(id);
    setHomepageData((prev) => {
      if (isExtra) {
        const items = { ...(prev.items || {}) };
        delete items[id];
        return { ...prev, extraSlideIds: (prev.extraSlideIds || []).filter((x) => x !== id), items };
      }
      return { ...prev, hiddenSlideIds: [...(prev.hiddenSlideIds || []), id] };
    });
  };

  const restoreHomepageSlide = (id) => {
    setHomepageSaved(false);
    setHomepageData((prev) => ({ ...prev, hiddenSlideIds: (prev.hiddenSlideIds || []).filter((x) => x !== id) }));
  };

  const saveHomepageSection = async () => {
    setHomepageSaving(true);
    setHomepageError("");
    setHomepageSaved(false);
    const token = localStorage.getItem("bhava_token");
    const fd = new FormData();
    fd.append("data", JSON.stringify(homepageData));
    Object.entries(homepageImages).forEach(([itemId, file]) => {
      fd.append(`image__${itemId}`, file);
    });
    try {
      const res = await fetch(`${API_BASE}/api/admin/homepage/${homepageTab}`, {
        method: "PUT",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setHomepageData(json.data || {});
        setHomepageImages({});
        setHomepageImagePreviews({});
        setHomepageSaved(true);
      } else {
        setHomepageError(json.message || `Error ${res.status}`);
      }
    } catch (err) {
      setHomepageError(err.message || "Network error");
    } finally {
      setHomepageSaving(false);
    }
  };

  const fetchQuotes = async () => {
    setQuotesLoading(true);
    setQuotesError("");
    try {
      const token = localStorage.getItem("bhava_token");
      const res = await fetch(`${API_BASE}/api/admin/quotes`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && json.success) {
        setQuotes(json.data || []);
      } else if (res.status === 401 || res.status === 403) {
        navigate("/admin/login");
      } else {
        setQuotesError(json.message || "Failed to load quotes");
      }
    } catch (err) {
      setQuotesError(err.message || "Network error");
    } finally {
      setQuotesLoading(false);
    }
  };

  const handleQuoteChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuoteForm({ ...quoteForm, [name]: type === "checkbox" ? checked : value });
  };

  const resetQuoteForm = () => {
    setQuoteForm({ reflection: "", text: "", reference: "", isActive: false });
    setEditingQuoteId(null);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("bhava_token");
    try {
      const url = editingQuoteId ? `${API_BASE}/api/admin/quotes/${editingQuoteId}` : `${API_BASE}/api/admin/quotes`;
      const method = editingQuoteId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(quoteForm),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        resetQuoteForm();
        setShowQuoteForm(false);
        fetchQuotes();
      } else {
        setQuotesError(json.message || `Error ${res.status}`);
      }
    } catch (err) {
      setQuotesError(err.message || "Network error");
    }
  };

  const handleQuoteEdit = (q) => {
    setEditingQuoteId(q._id);
    setQuoteForm({ reflection: q.reflection || "", text: q.text || "", reference: q.reference || q.ref || "", isActive: !!q.isActive });
    setShowQuoteForm(true);
  };

  const handleQuoteDelete = async (id) => {
    if (!confirm("Delete this quote?")) return;
    const token = localStorage.getItem("bhava_token");
    const res = await fetch(`${API_BASE}/api/admin/quotes/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const json = await res.json();
    if (json.success) fetchQuotes(); else alert(json.message || "Error");
  };

  const fetchMantraAudio = async () => {
    setMantraAudioLoading(true);
    setMantraAudioError("");
    try {
      const token = localStorage.getItem("bhava_token");
      const res = await fetch(`${API_BASE}/api/admin/mantra-audio`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && json.success) {
        const map = {};
        const drafts = {};
        (json.data || []).forEach((item) => {
          map[item.day] = item;
          drafts[item.day] = { theme: item.theme || "", mantra: item.mantra || "", note: item.note || "" };
        });
        setMantraAudioMap(map);
        setMantraDraft((prev) => ({ ...drafts, ...prev }));
      } else if (res.status === 401 || res.status === 403) {
        navigate("/admin/login");
      } else {
        setMantraAudioError(json.message || "Failed to load mantra audio");
      }
    } catch (err) {
      setMantraAudioError(err.message || "Network error");
    } finally {
      setMantraAudioLoading(false);
    }
  };

  const handleMantraAudioUpload = async (day, file) => {
    if (!file) return;
    setUploadingDay(day);
    setMantraAudioError("");
    const token = localStorage.getItem("bhava_token");
    const fd = new FormData();
    fd.append("audio", file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/mantra-audio/${day}`, {
        method: "PUT",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMantraAudioMap((prev) => ({ ...prev, [day]: json.data }));
      } else {
        setMantraAudioError(json.message || `Error ${res.status}`);
      }
    } catch (err) {
      setMantraAudioError(err.message || "Network error");
    } finally {
      setUploadingDay(null);
    }
  };

  const handleMantraAudioDelete = async (day) => {
    if (!confirm(`Delete the audio for Day ${day}?`)) return;
    const token = localStorage.getItem("bhava_token");
    const res = await fetch(`${API_BASE}/api/admin/mantra-audio/${day}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const json = await res.json();
    if (json.success) {
      setMantraAudioMap((prev) => { const next = { ...prev }; delete next[day]; return next; });
    } else {
      alert(json.message || "Error");
    }
  };

  const handleMantraDraftChange = (day, field, value) => {
    setMantraDraft((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleMantraContentSave = async (day) => {
    const draft = mantraDraft[day] || { theme: "", mantra: "", note: "" };
    setSavingContentDay(day);
    setMantraAudioError("");
    const token = localStorage.getItem("bhava_token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/mantra-audio/${day}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ theme: draft.theme || "", mantra: draft.mantra || "", note: draft.note || "" }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMantraAudioMap((prev) => ({ ...prev, [day]: json.data }));
      } else {
        setMantraAudioError(json.message || `Error ${res.status}`);
      }
    } catch (err) {
      setMantraAudioError(err.message || "Network error");
    } finally {
      setSavingContentDay(null);
    }
  };

  const fetchDhyanAudio = async () => {
    setDhyanAudioLoading(true);
    setDhyanAudioError("");
    try {
      const token = localStorage.getItem("bhava_token");
      const res = await fetch(`${API_BASE}/api/admin/dhyan-audio`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && json.success) {
        const map = {};
        const drafts = {};
        (json.data || []).forEach((item) => {
          map[item.day] = item;
          drafts[item.day] = { name: item.name || "", deity: item.deity || "" };
        });
        setDhyanAudioMap(map);
        setDhyanDraft((prev) => ({ ...drafts, ...prev }));
      } else if (res.status === 401 || res.status === 403) {
        navigate("/admin/login");
      } else {
        setDhyanAudioError(json.message || "Failed to load dhyan audio");
      }
    } catch (err) {
      setDhyanAudioError(err.message || "Network error");
    } finally {
      setDhyanAudioLoading(false);
    }
  };

  const handleDhyanAudioUpload = async (day, file) => {
    if (!file) return;
    setUploadingDhyanDay(day);
    setDhyanAudioError("");
    const token = localStorage.getItem("bhava_token");
    const fd = new FormData();
    fd.append("audio", file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/dhyan-audio/${day}`, {
        method: "PUT",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setDhyanAudioMap((prev) => ({ ...prev, [day]: json.data }));
      } else {
        setDhyanAudioError(json.message || `Error ${res.status}`);
      }
    } catch (err) {
      setDhyanAudioError(err.message || "Network error");
    } finally {
      setUploadingDhyanDay(null);
    }
  };

  const handleDhyanAudioDelete = async (day) => {
    if (!confirm(`Delete the audio for Day ${day}?`)) return;
    const token = localStorage.getItem("bhava_token");
    const res = await fetch(`${API_BASE}/api/admin/dhyan-audio/${day}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const json = await res.json();
    if (json.success) {
      setDhyanAudioMap((prev) => { const next = { ...prev }; delete next[day]; return next; });
    } else {
      alert(json.message || "Error");
    }
  };

  const handleDhyanDraftChange = (day, field, value) => {
    setDhyanDraft((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleDhyanContentSave = async (day) => {
    const draft = dhyanDraft[day] || { name: "", deity: "" };
    setSavingDhyanContentDay(day);
    setDhyanAudioError("");
    const token = localStorage.getItem("bhava_token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/dhyan-audio/${day}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ name: draft.name || "", deity: draft.deity || "" }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setDhyanAudioMap((prev) => ({ ...prev, [day]: json.data }));
      } else {
        setDhyanAudioError(json.message || `Error ${res.status}`);
      }
    } catch (err) {
      setDhyanAudioError(err.message || "Network error");
    } finally {
      setSavingDhyanContentDay(null);
    }
  };

  const fetchTiles = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("bhava_token");
      const url = `${API_BASE}/api/admin/tiles${activeCategory ? `?category=${encodeURIComponent(activeCategory)}` : ""}`;
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && json.success) {
        setTiles(json.data || []);
      } else if (res.status === 401 || res.status === 403) {
        navigate("/admin/login");
      } else {
        console.error("Failed to load tiles", res.status, json);
        setError(json.message || "Failed to load tiles");
      }
    } catch (err) {
      console.error("Error fetching tiles:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSessionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSessionImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSessionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data - handle FormData with image upload
    let body;
    let headers = {};
    const token = localStorage.getItem("bhava_token");
    
    if (image) {
      // Use FormData for image upload
      const fd = new FormData();
      Object.keys(form).forEach(k => {
        if (k === 'lessons') {
          fd.append(k, JSON.stringify(form[k]));
        } else {
          fd.append(k, form[k]);
        }
      });
      fd.append("image", image);
      body = fd;
    } else {
      // Use JSON for no image
      body = JSON.stringify(form);
      headers['Content-Type'] = 'application/json';
    }

    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const url = editingId ? `${API_BASE}/api/admin/tiles/${editingId}` : `${API_BASE}/api/admin/tiles`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body, headers });
      const json = await res.json();
      if (res.ok && json.success) {
        setForm({ 
          title: "", 
          subtitle: "", 
          badgeText: "", 
          duration: "", 
          summary: "",
          fullDescription: "",
          lessons: [],
          category: activeCategory 
        });
        setImage(null);
        setImagePreview(null);
        setEditingId(null);
        setSelectedTile(null);
        setNewLesson({ title: "", duration: "" });
        fetchTiles();
      } else {
        const msg = json.message || `Error ${res.status}`;
        console.error("Submit error:", msg, json);
        setError(msg);
      }
    } catch (err) {
      console.error("Submit exception:", err);
      setError(err.message || "Network error");
    }
  };

  const handleEdit = (tile) => {
    setSelectedTile(tile);
    setEditingId(tile._id);
    setForm({ 
      title: tile.title || "", 
      subtitle: tile.subtitle || "", 
      badgeText: tile.badgeText || "", 
      duration: tile.duration || "", 
      summary: tile.summary || "", 
      fullDescription: tile.fullDescription || "",
      lessons: Array.isArray(tile.lessons) ? [...tile.lessons] : [],
      category: tile.category || activeCategory 
    });
    setNewLesson({ title: "", duration: "" });
    setImage(null);
    setImagePreview(null);
  };

  const addLesson = () => {
    if (!newLesson.title || !newLesson.duration) {
      alert("Please fill in lesson title and duration");
      return;
    }
    const num = (form.lessons?.length || 0) + 1;
    setForm({
      ...form,
      lessons: [...(form.lessons || []), { num, title: newLesson.title, duration: newLesson.duration }]
    });
    setNewLesson({ title: "", duration: "" });
  };

  const openSessionModal = (index = null) => {
    if (index !== null) {
      // Edit existing session
      const session = form.lessons[index];
      setCurrentSessionData({
        num: session.num,
        title: session.title,
        duration: session.duration
      });
      setEditingSessionIndex(index);
      setSessionImage(null);
      setSessionImagePreview(null);
    } else {
      // Add new session
      const num = (form.lessons?.length || 0) + 1;
      setCurrentSessionData({
        num,
        title: "",
        duration: ""
      });
      setEditingSessionIndex(null);
      setSessionImage(null);
      setSessionImagePreview(null);
    }
    setShowSessionModal(true);
  };

  const saveSession = () => {
    if (!currentSessionData.title || !currentSessionData.duration) {
      alert("Please fill in session title and duration");
      return;
    }

    let updatedLessons;
    if (editingSessionIndex !== null) {
      // Update existing session
      updatedLessons = [...form.lessons];
      updatedLessons[editingSessionIndex] = { ...currentSessionData, num: editingSessionIndex + 1 };
    } else {
      // Add new session
      updatedLessons = [...(form.lessons || []), currentSessionData];
    }

    setForm({ ...form, lessons: updatedLessons });
    setShowSessionModal(false);
    setEditingSessionIndex(null);
    setCurrentSessionData({
      num: 1,
      title: "",
      duration: ""
    });
  };

  const deleteSession = (index) => {
    const updated = form.lessons.filter((_, i) => i !== index);
    const renumbered = updated.map((lesson, i) => ({ ...lesson, num: i + 1 }));
    setForm({ ...form, lessons: renumbered });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this tile?")) return;
    const token = localStorage.getItem("bhava_token");
    const res = await fetch(`${API_BASE}/api/admin/tiles/${id}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const json = await res.json();
    if (json.success) fetchTiles(); else alert(json.message || "Error");
  };

  const logout = () => { localStorage.removeItem("bhava_token"); navigate("/admin/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f4f0" }}>
      {/* TOP NAV */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "12px 20px", zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, color: "#4A0B1D" }}>Admin Dashboard - {section === "homepage" ? "Homepage" : section === "quotes" ? "Quotes" : section === "mantraAudio" ? "108-Day Mantra" : section === "dhyanAudio" ? "21-Day Dhyān" : activeCategory}</h2>
        <button onClick={logout} style={{ padding: "8px 16px", background: "#E07B39", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Logout</button>
      </div>

      {/* LEFT SIDEBAR - CATEGORIES */}
      <aside style={{ width: 200, background: "#f7f4f0", padding: "80px 12px 20px", borderRight: "1px solid #e0e0e0", overflowY: "auto", maxHeight: "100vh" }}>
        <h3 style={{ marginTop: 0, color: "#4A0B1D", fontSize: 14 }}>Categories</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {categories.map(c => (
            <li key={c} onClick={() => { setSection("tiles"); setActiveCategory(c); setSelectedTile(null); setEditingId(null); }} style={{ cursor: 'pointer', padding: "10px 12px", background: section === "tiles" && c === activeCategory ? "#E07B39" : 'transparent', color: section === "tiles" && c === activeCategory ? '#fff' : '#000', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>{c}</li>
          ))}
        </ul>

        <h3 style={{ marginTop: 20, color: "#4A0B1D", fontSize: 14, borderTop: "1px solid #e0e0e0", paddingTop: 16 }}>Content</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li onClick={() => setSection("homepage")} style={{ cursor: 'pointer', padding: "10px 12px", background: section === "homepage" ? "#E07B39" : 'transparent', color: section === "homepage" ? '#fff' : '#000', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>🏠 Homepage</li>
          <li onClick={() => setSection("quotes")} style={{ cursor: 'pointer', padding: "10px 12px", background: section === "quotes" ? "#E07B39" : 'transparent', color: section === "quotes" ? '#fff' : '#000', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>📜 Quotes</li>
          <li onClick={() => setSection("mantraAudio")} style={{ cursor: 'pointer', padding: "10px 12px", background: section === "mantraAudio" ? "#E07B39" : 'transparent', color: section === "mantraAudio" ? '#fff' : '#000', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>🎵 108-Day Mantra</li>
          <li onClick={() => setSection("dhyanAudio")} style={{ cursor: 'pointer', padding: "10px 12px", background: section === "dhyanAudio" ? "#E07B39" : 'transparent', color: section === "dhyanAudio" ? '#fff' : '#000', borderRadius: 8, marginBottom: 6, fontSize: 13 }}>🧘 21-Day Dhyān</li>
        </ul>
      </aside>

      {section === "quotes" ? (
      /* CENTER - QUOTES */
      <main style={{ flex: 1, padding: "80px 20px 20px", overflowY: "auto", maxHeight: "100vh" }}>
        {quotesLoading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, marginBottom: 12 }}>Loading quotes…</div>}
        {quotesError && <div style={{ padding: 12, background: '#ffe6e6', color: '#900', borderRadius: 6, marginBottom: 12 }}>{quotesError}</div>}

        <div style={{ background: "#fff", padding: 20, borderRadius: 8, marginBottom: 20, border: "2px solid #E07B39" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showQuoteForm ? 16 : 0 }}>
            <h3 style={{ margin: 0, color: "#4A0B1D", fontSize: 16 }}>{editingQuoteId ? "✏️ Edit Quote" : "➕ Add New Quote"}</h3>
            <button onClick={() => { if (showQuoteForm) resetQuoteForm(); setShowQuoteForm(!showQuoteForm); }} style={{ background: "#E07B39", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>
              {showQuoteForm ? "✕ Close" : "✏️ Open Form"}
            </button>
          </div>

          {showQuoteForm && (
            <form onSubmit={handleQuoteSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Today's Reflection</label>
                <textarea name="reflection" value={quoteForm.reflection} onChange={handleQuoteChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 50, resize: "vertical" }} placeholder="A short reflection shown below the TODAY'S REFLECTION heading..." />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Quote *</label>
                <textarea name="text" value={quoteForm.text} onChange={handleQuoteChange} required style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 80, resize: "vertical" }} placeholder="Abandoning without exception all the desires born of volition..." />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Page Number *</label>
                <input name="reference" value={quoteForm.reference} onChange={handleQuoteChange} required style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} placeholder="Bhagavad Gita 6:24" />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#4A0B1D" }}>
                <input type="checkbox" name="isActive" checked={quoteForm.isActive} onChange={handleQuoteChange} />
                Show on homepage (Today's Reflection)
              </label>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: 12, background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>{editingQuoteId ? "✓ Save Quote" : "✓ Create Quote"}</button>
                <button type="button" onClick={() => { resetQuoteForm(); setShowQuoteForm(false); }} style={{ flex: 1, padding: 12, background: "#f0f0f0", color: "#333", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        <h3 style={{ marginTop: 0, color: "#4A0B1D" }}>All Quotes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {quotes.map(q => (
            <div key={q._id} style={{ background: "#fff", padding: 16, borderRadius: 8, border: q.isActive ? "2px solid #4CAF50" : "1px solid #ddd" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: 10, color: "#999", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>TODAY'S REFLECTION</p>
              {q.reflection && <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "#666" }}>{q.reflection}</p>}
              <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#333", fontStyle: "italic" }}>&ldquo;{q.text}&rdquo;</p>
              <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "#9B3A2A", fontWeight: 700, textTransform: "uppercase" }}>{q.reference || q.ref || "—"}</p>
              {q.isActive && <span style={{ fontSize: 11, color: "#4CAF50", fontWeight: 600 }}>● Live on homepage</span>}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={() => handleQuoteEdit(q)} style={{ padding: "6px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Edit</button>
                <button onClick={() => handleQuoteDelete(q._id)} style={{ padding: "6px 12px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Delete</button>
              </div>
            </div>
          ))}
          {!quotesLoading && quotes.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>No quotes yet. Add one above.</p>}
        </div>
      </main>
      ) : section === "mantraAudio" ? (
      /* CENTER - 108-DAY MANTRA AUDIO */
      <main style={{ flex: 1, padding: "80px 20px 20px", overflowY: "auto", maxHeight: "100vh" }}>
        {mantraAudioLoading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, marginBottom: 12 }}>Loading mantra audio…</div>}
        {mantraAudioError && <div style={{ padding: 12, background: '#ffe6e6', color: '#900', borderRadius: 6, marginBottom: 12 }}>{mantraAudioError}</div>}

        <h3 style={{ marginTop: 0, color: "#4A0B1D" }}>108-Day Mantra Sādhana — Audio</h3>
        <p style={{ color: "#666", fontSize: 13, marginTop: -8, marginBottom: 16 }}>Upload one audio file per day. Uploading a new file for a day replaces the existing one.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 108 }, (_, i) => i + 1).map((day) => {
            const entry = mantraAudioMap[day];
            const isUploading = uploadingDay === day;
            const draft = mantraDraft[day] || { theme: entry?.theme || "", mantra: entry?.mantra || "", note: entry?.note || "" };
            const isSaving = savingContentDay === day;
            return (
              <div key={day} style={{ background: "#fff", padding: 14, borderRadius: 8, border: entry ? "1px solid #4CAF50" : "1px solid #ddd", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ minWidth: 60, fontWeight: 700, color: "#4A0B1D", fontSize: 13 }}>Day {day}</span>

                  {entry?.audioUrl ? (
                    <>
                      <audio controls src={resolveImageUrl(entry.audioUrl)} style={{ height: 34, flex: "1 1 260px" }} />
                      <label style={{ padding: "6px 12px", background: "#2196F3", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        {isUploading ? "Uploading…" : "Replace"}
                        <input type="file" accept="audio/*" style={{ display: "none" }} disabled={isUploading} onChange={(e) => handleMantraAudioUpload(day, e.target.files[0])} />
                      </label>
                      <button onClick={() => handleMantraAudioDelete(day)} style={{ padding: "6px 12px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Delete</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: "1 1 260px", color: "#999", fontSize: 12 }}>No audio uploaded</span>
                      <label style={{ padding: "6px 12px", background: "#E07B39", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        {isUploading ? "Uploading…" : "Upload"}
                        <input type="file" accept="audio/*" style={{ display: "none" }} disabled={isUploading} onChange={(e) => handleMantraAudioUpload(day, e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", paddingTop: 10, borderTop: "1px solid #f0f0f0" }}>
                  <input
                    value={draft.theme}
                    onChange={(e) => handleMantraDraftChange(day, "theme", e.target.value)}
                    placeholder="Theme (e.g. Shiva · Panchakshari)"
                    style={{ flex: "1 1 220px", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 12 }}
                  />
                  <input
                    value={draft.mantra}
                    onChange={(e) => handleMantraDraftChange(day, "mantra", e.target.value)}
                    placeholder="Mantra text (e.g. ॐ नमः शिवाय)"
                    style={{ flex: "1 1 260px", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 12 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    value={draft.note}
                    onChange={(e) => handleMantraDraftChange(day, "note", e.target.value)}
                    placeholder="Note / description shown below the mantra (does not change Theme or Mantra text)"
                    style={{ flex: "1 1 400px", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 12 }}
                  />
                  <button
                    onClick={() => handleMantraContentSave(day)}
                    disabled={isSaving}
                    style={{ padding: "8px 14px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                  >
                    {isSaving ? "Saving…" : "Save Content"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      ) : section === "dhyanAudio" ? (
      /* CENTER - 21-DAY DHYAN AUDIO */
      <main style={{ flex: 1, padding: "80px 20px 20px", overflowY: "auto", maxHeight: "100vh" }}>
        {dhyanAudioLoading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, marginBottom: 12 }}>Loading dhyan audio…</div>}
        {dhyanAudioError && <div style={{ padding: 12, background: '#ffe6e6', color: '#900', borderRadius: 6, marginBottom: 12 }}>{dhyanAudioError}</div>}

        <h3 style={{ marginTop: 0, color: "#4A0B1D" }}>21-Day Dhyān Challenge — Audio</h3>
        <p style={{ color: "#666", fontSize: 13, marginTop: -8, marginBottom: 16 }}>Upload one audio file per day. Uploading a new file for a day replaces the existing one.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
            const entry = dhyanAudioMap[day];
            const isUploading = uploadingDhyanDay === day;
            const draft = dhyanDraft[day] || { name: entry?.name || "", deity: entry?.deity || "" };
            const isSaving = savingDhyanContentDay === day;
            return (
              <div key={day} style={{ background: "#fff", padding: 14, borderRadius: 8, border: entry ? "1px solid #4CAF50" : "1px solid #ddd", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ minWidth: 60, fontWeight: 700, color: "#4A0B1D", fontSize: 13 }}>Day {day}</span>

                  {entry?.audioUrl ? (
                    <>
                      <audio controls src={resolveImageUrl(entry.audioUrl)} style={{ height: 34, flex: "1 1 260px" }} />
                      <label style={{ padding: "6px 12px", background: "#2196F3", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        {isUploading ? "Uploading…" : "Replace"}
                        <input type="file" accept="audio/*" style={{ display: "none" }} disabled={isUploading} onChange={(e) => handleDhyanAudioUpload(day, e.target.files[0])} />
                      </label>
                      <button onClick={() => handleDhyanAudioDelete(day)} style={{ padding: "6px 12px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Delete</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: "1 1 260px", color: "#999", fontSize: 12 }}>No audio uploaded</span>
                      <label style={{ padding: "6px 12px", background: "#E07B39", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        {isUploading ? "Uploading…" : "Upload"}
                        <input type="file" accept="audio/*" style={{ display: "none" }} disabled={isUploading} onChange={(e) => handleDhyanAudioUpload(day, e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", paddingTop: 10, borderTop: "1px solid #f0f0f0" }}>
                  <input
                    value={draft.name}
                    onChange={(e) => handleDhyanDraftChange(day, "name", e.target.value)}
                    placeholder="Mantra name (e.g. Gayatri Mantra)"
                    style={{ flex: "1 1 220px", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 12 }}
                  />
                  <input
                    value={draft.deity}
                    onChange={(e) => handleDhyanDraftChange(day, "deity", e.target.value)}
                    placeholder="Deity / Source (e.g. Savitr)"
                    style={{ flex: "1 1 220px", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 12 }}
                  />
                  <button
                    onClick={() => handleDhyanContentSave(day)}
                    disabled={isSaving}
                    style={{ padding: "8px 14px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                  >
                    {isSaving ? "Saving…" : "Save Content"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      ) : section === "homepage" ? (
      /* CENTER - HOMEPAGE CONTENT EDITOR */
      <main style={{ flex: 1, padding: "80px 20px 20px", overflowY: "auto", maxHeight: "100vh" }}>
        <h3 style={{ marginTop: 0, color: "#4A0B1D" }}>Homepage Content</h3>
        <p style={{ color: "#666", fontSize: 13, marginTop: -8, marginBottom: 16 }}>
          Edit the text and images shown on the homepage. Leave a field blank to keep the site's default.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {HOMEPAGE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setHomepageTab(t.key)}
              style={{
                padding: "8px 16px",
                background: homepageTab === t.key ? "#4A0B1D" : "#fff",
                color: homepageTab === t.key ? "#fff" : "#4A0B1D",
                border: "1px solid #4A0B1D",
                borderRadius: 999,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {(() => {
          const activeTab = HOMEPAGE_TABS.find((t) => t.key === homepageTab);
          return (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: "#FBF6EE", border: "1px solid #eee", borderRadius: 8, padding: "10px 14px", marginBottom: 16, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#5a4a3a" }}>
                📍 <strong>Where this shows:</strong> {activeTab?.hint}
              </p>
              <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: "#E07B39", whiteSpace: "nowrap", textDecoration: "none" }}>
                View Homepage ↗
              </a>
            </div>
          );
        })()}

        {homepageLoading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, marginBottom: 12 }}>Loading…</div>}
        {homepageError && <div style={{ padding: 12, background: '#ffe6e6', color: '#900', borderRadius: 6, marginBottom: 12 }}>{homepageError}</div>}
        {homepageSaved && (
          <div style={{ padding: 12, background: '#e8f7ec', color: '#1e7a3a', borderRadius: 6, marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            ✓ Saved — this change is now live in the {HOMEPAGE_TABS.find((t) => t.key === homepageTab)?.label} section of the homepage.
          </div>
        )}

        <div style={{ background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #eee", maxWidth: 760 }}>
          {(homepageTab === "sacredKnowledge" || homepageTab === "astrologyTools" || homepageTab === "community") && (() => {
            const activeTab = HOMEPAGE_TABS.find((t) => t.key === homepageTab);
            return (
              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f0f0f0" }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#4A0B1D", fontSize: 14 }}>Section Header</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <HomepageField
                    label="Kicker label"
                    value={homepageData.kicker}
                    defaultValue={activeTab?.defaultKicker}
                    onChange={(v) => handleHomepageFieldChange("kicker", v)}
                  />
                  <HomepageField
                    label="Title"
                    value={homepageData.title}
                    defaultValue={activeTab?.defaultTitle}
                    onChange={(v) => handleHomepageFieldChange("title", v)}
                  />
                  {homepageTab !== "community" && (
                    <HomepageField
                      label="Subtitle"
                      value={homepageData.subtitle}
                      defaultValue={activeTab?.defaultSubtitle}
                      onChange={(v) => handleHomepageFieldChange("subtitle", v)}
                      textarea
                    />
                  )}
                </div>
              </div>
            );
          })()}

          {(homepageTab === "sacredKnowledge" || homepageTab === "astrologyTools") &&
            (() => {
              const baseItems = homepageTab === "sacredKnowledge" ? SACRED_KNOWLEDGE_ITEMS : ASTROLOGY_TOOLS_ITEMS;
              const hiddenIds = homepageData.hiddenIds || [];
              const extraIds = Array.isArray(homepageData.extraIds) ? homepageData.extraIds : [];
              const visibleBase = baseItems.filter((item) => !hiddenIds.includes(item.id));
              const hiddenBase = baseItems.filter((item) => hiddenIds.includes(item.id));
              const allCards = [
                ...visibleBase.map((item) => ({ ...item, isExtra: false })),
                ...extraIds.map((id) => ({ id, label: "New Card", defaultTitle: "", defaultDescription: "", defaultCta: "Explore", isExtra: true })),
              ];

              return (
                <>
                  {allCards.map((item, idx) => {
                    const o = (homepageData.items || {})[item.id] || {};
                    const preview = homepageImagePreviews[item.id];
                    return (
                      <div key={item.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <h4 style={{ margin: 0, color: "#4A0B1D", fontSize: 14 }}>
                            {item.label} <span style={{ color: "#999", fontWeight: 400, fontSize: 12 }}>(card {idx + 1} of {allCards.length}, left to right)</span>
                          </h4>
                          <button
                            onClick={() => removeHomepageCard(item.id, item.isExtra)}
                            style={{ padding: "4px 10px", background: "#fff", color: "#ff6b6b", border: "1px solid #ff6b6b", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                          >
                            {item.isExtra ? "🗑 Delete Card" : "Hide This Card"}
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <HomepageField
                            label="Title"
                            value={o.title}
                            defaultValue={item.defaultTitle}
                            onChange={(v) => handleHomepageItemChange(item.id, "title", v)}
                          />
                          <HomepageField
                            label="Description"
                            value={o.description}
                            defaultValue={item.defaultDescription}
                            onChange={(v) => handleHomepageItemChange(item.id, "description", v)}
                            textarea
                          />
                          <HomepageField
                            label="Button text"
                            value={o.cta}
                            defaultValue={item.defaultCta}
                            onChange={(v) => handleHomepageItemChange(item.id, "cta", v)}
                          />
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {(preview || o.image) && (
                              <img src={preview || resolveImageUrl(o.image)} alt="" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6 }} />
                            )}
                            <label style={{ padding: "8px 14px", background: "#E07B39", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              {o.image || preview ? "Replace Image" : "Upload Image"}
                              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleHomepageImageSelect(item.id, e.target.files[0])} />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button onClick={addHomepageCard} style={{ display: "block", padding: "10px 16px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                    + Add New Card
                  </button>

                  {hiddenBase.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ margin: "0 0 6px 0", fontSize: 12, color: "#999" }}>Hidden cards:</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {hiddenBase.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => restoreHomepageCard(item.id)}
                            style={{ padding: "4px 10px", background: "#fff", color: "#4A0B1D", border: "1px solid #ddd", borderRadius: 999, cursor: "pointer", fontSize: 12 }}
                          >
                            ↺ Restore "{item.label}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

          {homepageTab === "community" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ margin: 0, color: "#4A0B1D", fontSize: 14 }}>Testimonials</h4>
                <button onClick={addHomepageTestimonial} style={{ padding: "6px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  + Add Testimonial
                </button>
              </div>
              {(Array.isArray(homepageData.testimonials) ? homepageData.testimonials : []).map((t, idx) => (
                <div key={idx} style={{ marginBottom: 14, padding: 12, border: "1px solid #eee", borderRadius: 6, display: "flex", flexDirection: "column", gap: 8 }}>
                  <textarea
                    placeholder="Testimonial text"
                    value={t.text || ""}
                    onChange={(e) => handleHomepageTestimonialChange(idx, "text", e.target.value)}
                    style={{ padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 50, resize: "vertical" }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      placeholder="Author"
                      value={t.author || ""}
                      onChange={(e) => handleHomepageTestimonialChange(idx, "author", e.target.value)}
                      style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }}
                    />
                    <input
                      placeholder="Location"
                      value={t.location || ""}
                      onChange={(e) => handleHomepageTestimonialChange(idx, "location", e.target.value)}
                      style={{ flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }}
                    />
                    <button onClick={() => removeHomepageTestimonial(idx)} style={{ padding: "8px 12px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>×</button>
                  </div>
                </div>
              ))}
              {(!homepageData.testimonials || homepageData.testimonials.length === 0) && (
                <p style={{ color: "#999", fontSize: 13 }}>No overrides yet — the site is showing its default testimonials. Add one to replace them.</p>
              )}
            </div>
          )}

          {homepageTab === "hero" && (
            <p style={{ margin: "0 0 16px 0", fontSize: 12, color: "#999" }}>
              These slides rotate automatically on the homepage banner (one at a time, every few seconds) — they don't show side by side. Use the dots at the bottom of the banner on the live site to jump to a specific slide and check your changes.
            </p>
          )}
          {homepageTab === "hero" &&
            (() => {
              const hiddenSlideIds = homepageData.hiddenSlideIds || [];
              const extraSlideIds = Array.isArray(homepageData.extraSlideIds) ? homepageData.extraSlideIds : [];
              const visibleBase = HERO_SLIDES.filter((s) => !hiddenSlideIds.includes(s.id));
              const hiddenBase = HERO_SLIDES.filter((s) => hiddenSlideIds.includes(s.id));
              const allSlides = [
                ...visibleBase.map((s) => ({ ...s, isExtra: false })),
                ...extraSlideIds.map((id, i) => ({ id, label: `New Slide ${i + 1}`, type: "slide", isExtra: true })),
              ];

              return (
                <>
                  {allSlides.map((s) => {
                    const o = (homepageData.items || {})[s.id] || {};
                    const preview = homepageImagePreviews[s.id];
                    return (
                      <div key={s.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <h4 style={{ margin: 0, color: "#4A0B1D", fontSize: 14 }}>{s.label}</h4>
                          <button
                            onClick={() => removeHomepageSlide(s.id, s.isExtra)}
                            style={{ padding: "4px 10px", background: "#fff", color: "#ff6b6b", border: "1px solid #ff6b6b", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 600 }}
                          >
                            {s.isExtra ? "🗑 Delete Slide" : "Hide This Slide"}
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {s.type === "hero" ? (
                            <>
                              <HomepageField label="Headline" value={o.headline} defaultValue={s.defaultHeadline} onChange={(v) => handleHomepageItemChange(s.id, "headline", v)} />
                              <HomepageField label="Highlighted word(s)" value={o.highlight} defaultValue={s.defaultHighlight} onChange={(v) => handleHomepageItemChange(s.id, "highlight", v)} />
                              <HomepageField label="Description line" value={o.description} defaultValue={s.defaultDescription} onChange={(v) => handleHomepageItemChange(s.id, "description", v)} />
                              <HomepageField label="Second description line" value={o.description1} defaultValue={s.defaultDescription1} onChange={(v) => handleHomepageItemChange(s.id, "description1", v)} />
                              <HomepageField label="Primary button text" value={o.primaryCta} defaultValue={s.defaultPrimaryCta} onChange={(v) => handleHomepageItemChange(s.id, "primaryCta", v)} />
                              <HomepageField label="Secondary button text" value={o.secondaryCta} defaultValue={s.defaultSecondaryCta} onChange={(v) => handleHomepageItemChange(s.id, "secondaryCta", v)} />
                            </>
                          ) : (
                            <>
                              <HomepageField label="Title line 1" value={o.title0} defaultValue={s.defaultTitle0} onChange={(v) => handleHomepageItemChange(s.id, "title0", v)} />
                              <HomepageField label="Title line 2" value={o.title1} defaultValue={s.defaultTitle1} onChange={(v) => handleHomepageItemChange(s.id, "title1", v)} />
                              <HomepageField label="Description" value={o.description} defaultValue={s.defaultDescription} onChange={(v) => handleHomepageItemChange(s.id, "description", v)} textarea />
                              <HomepageField label="Button text" value={o.cta} defaultValue={s.defaultCta} onChange={(v) => handleHomepageItemChange(s.id, "cta", v)} />
                            </>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {(preview || o.image) && (
                              <img src={preview || resolveImageUrl(o.image)} alt="" style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 6 }} />
                            )}
                            <label style={{ padding: "8px 14px", background: "#E07B39", color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              {o.image || preview ? "Replace Background Image" : "Upload Background Image"}
                              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleHomepageImageSelect(s.id, e.target.files[0])} />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button onClick={addHomepageSlide} style={{ display: "block", padding: "10px 16px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                    + Add New Slide
                  </button>

                  {hiddenBase.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ margin: "0 0 6px 0", fontSize: 12, color: "#999" }}>Hidden slides:</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {hiddenBase.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => restoreHomepageSlide(s.id)}
                            style={{ padding: "4px 10px", background: "#fff", color: "#4A0B1D", border: "1px solid #ddd", borderRadius: 999, cursor: "pointer", fontSize: 12 }}
                          >
                            ↺ Restore "{s.label}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

          <button
            onClick={saveHomepageSection}
            disabled={homepageSaving}
            style={{ display: "block", marginTop: 20, padding: "12px 24px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
          >
            {homepageSaving ? "Saving…" : "✓ Save Changes"}
          </button>
        </div>
      </main>
      ) : (
      /* CENTER - TILE GRID */
      <main style={{ flex: 1, padding: "80px 20px 20px", overflowY: "auto", maxHeight: "100vh" }}>
        {loading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, marginBottom: 12 }}>Loading tiles…</div>}
        {error && <div style={{ padding: 12, background: '#ffe6e6', color: '#900', borderRadius: 6, marginBottom: 12 }}>{error}</div>}

        {/* ADD NEW CONTENT SECTION */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 8, marginBottom: 20, border: "2px solid #E07B39" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: "#4A0B1D", fontSize: 16 }}>➕ Add New Content</h3>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#E07B39", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>
              {showAddForm ? "✕ Close" : "✏️ Open Form"}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
              setShowAddForm(false);
            }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Category */}
              <div style={{ gridColumn: "1 / span 2" }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Title */}
              <div style={{ gridColumn: "1 / span 2" }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} placeholder="Content title" />
              </div>

              {/* Subtitle */}
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Subtitle</label>
                <input name="subtitle" value={form.subtitle} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} placeholder="Short description" />
              </div>

              {/* Badge */}
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Badge Text</label>
                <input name="badgeText" value={form.badgeText} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} placeholder="e.g., 6 sessions" />
              </div>

              {/* Duration */}
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} placeholder="e.g., 8 min" />
              </div>

              {/* Summary */}
              <div style={{ gridColumn: "1 / span 2" }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Summary</label>
                <textarea name="summary" value={form.summary} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 60, resize: "vertical" }} placeholder="Quick overview" />
              </div>

              {/* Full Description */}
              <div style={{ gridColumn: "1 / span 2" }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>Full Description</label>
                <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 80, resize: "vertical" }} placeholder="Rich detailed content..." />
              </div>

              {/* Image Upload */}
              <div style={{ gridColumn: "1 / span 2" }}>
                <label style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>📸 Tile Image</label>
                <div style={{ background: "#f5f5f5", border: "2px dashed #ddd", borderRadius: 8, padding: 12, marginBottom: 12, textAlign: "center" }}>
                  {imagePreview ? (
                    <>
                      <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "#666" }}>New Image Preview:</p>
                      <img src={imagePreview} alt="preview" style={{ maxWidth: "100%", maxHeight: 120, borderRadius: 6 }} />
                    </>
                  ) : (
                    <p style={{ margin: 0, fontSize: 12, color: "#999" }}>No image selected</p>
                  )}
                </div>
                <label style={{ 
                  display: "block", 
                  background: "#E07B39", 
                  color: "#fff", 
                  padding: "10px 16px", 
                  borderRadius: 6, 
                  cursor: "pointer", 
                  textAlign: "center", 
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 12
                }}>
                  🖼️ Click to Upload Image
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
                {image && <p style={{ margin: 0, fontSize: 11, color: "#E07B39", fontWeight: 600 }}>✓ Image selected: {image.name}</p>}
              </div>

              {/* Submit Button */}
              <div style={{ gridColumn: "1 / span 2", display: "flex", gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: 12, background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>✓ Create Content</button>
                <button type="button" onClick={() => {
                  setShowAddForm(false);
                  setForm({ title: "", subtitle: "", badgeText: "", duration: "", summary: "", fullDescription: "", lessons: [], category: activeCategory });
                  setImage(null);
                  setImagePreview(null);
                }} style={{ flex: 1, padding: 12, background: "#f0f0f0", color: "#333", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
              </div>

              {/* Sessions Section */}
              <div style={{ gridColumn: "1 / span 2", borderTop: "2px solid #f0f0f0", paddingTop: 16, marginTop: 16 }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: 13, color: "#4A0B1D", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Sessions ({form.lessons?.length || 0})
                  <button type="button" onClick={() => openSessionModal()} style={{ padding: "6px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>+ Add Session</button>
                </h4>
                
                <div style={{ maxHeight: 250, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 4, padding: 8, background: "#fafafa" }}>
                  {form.lessons?.length === 0 ? (
                    <p style={{ margin: 0, fontSize: 12, color: "#999", textAlign: "center", padding: 12 }}>No sessions yet</p>
                  ) : (
                    form.lessons.map((lesson, idx) => (
                      <div key={idx} style={{ background: "#fff", padding: 10, marginBottom: 8, borderRadius: 4, border: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>
                            {lesson.num}. {lesson.title}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: "#666" }}>⏱️ {lesson.duration}</p>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button type="button" onClick={() => openSessionModal(idx)} style={{ padding: "4px 8px", background: "#2196F3", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 10, fontWeight: 600 }}>Edit</button>
                          <button type="button" onClick={() => deleteSession(idx)} style={{ padding: "4px 8px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 11 }}>×</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        <h3 style={{ marginTop: 0, color: "#4A0B1D" }}>Click image to edit content</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
          {tiles.map(t => (
            <div key={t._id} onClick={() => handleEdit(t)} style={{ 
              border: editingId === t._id ? "3px solid #E07B39" : "1px solid #ddd", 
              padding: 12, 
              borderRadius: 8, 
              cursor: "pointer", 
              transition: "all 0.2s",
              background: editingId === t._id ? "#fff3e8" : "#fff",
              boxShadow: editingId === t._id ? "0 4px 12px rgba(224,123,57,0.2)" : "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              {t.imageUrl && <img src={resolveImageUrl(t.imageUrl)} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} />}
              <h4 style={{ margin: "8px 0 4px 0", fontSize: 14 }}>{t.title}</h4>
              <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{t.subtitle}</p>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }} style={{ marginTop: 8, padding: "6px 12px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Delete</button>
            </div>
          ))}
        </div>
      </main>
      )}

      {/* RIGHT PANEL - DETAIL EDITOR */}
      {section === "tiles" && editingId && (
        <aside style={{ width: 400, background: "#fff", borderLeft: "1px solid #e0e0e0", overflowY: "auto", maxHeight: "100vh", padding: "80px 16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "#4A0B1D" }}>Edit Content</h3>
            <button onClick={() => { setEditingId(null); setSelectedTile(null); setForm({ ...form, title: "", subtitle: "", badgeText: "", duration: "", summary: "", fullDescription: "", lessons: [] }); setImage(null); setImagePreview(null); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Badge Text</label>
              <input name="badgeText" value={form.badgeText} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13 }} />
            </div>

             <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Summary</label>
              <textarea name="summary" value={form.summary} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 60, resize: "vertical" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 4, fontSize: 12, fontWeight: 600 }}>Full Description</label>
              <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd", fontSize: 13, minHeight: 80, resize: "vertical" }} placeholder="Rich detailed content for this tile..." />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 600, color: "#4A0B1D" }}>📸 Tile Image</label>
              
              {/* Current Image Preview */}
              <div style={{ background: "#f5f5f5", border: "2px dashed #ddd", borderRadius: 8, padding: 12, marginBottom: 12, textAlign: "center" }}>
                {imagePreview ? (
                  <>
                    <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "#666" }}>New Image Preview:</p>
                    <img src={imagePreview} alt="preview" style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 6 }} />
                  </>
                ) : selectedTile?.imageUrl ? (
                  <>
                    <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "#666" }}>Current Image:</p>
                    <img src={resolveImageUrl(selectedTile.imageUrl)} alt="current" style={{ maxWidth: "100%", maxHeight: 140, borderRadius: 6 }} />
                  </>
                ) : (
                  <p style={{ margin: 0, fontSize: 12, color: "#999" }}>No image yet</p>
                )}
              </div>

              {/* Upload Button - BIG AND CLEAR */}
              <label style={{ 
                display: "block", 
                background: "#E07B39", 
                color: "#fff", 
                padding: "12px 16px", 
                borderRadius: 6, 
                cursor: "pointer", 
                textAlign: "center", 
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.2s",
                border: "2px solid #E07B39"
              }} 
              onMouseEnter={(e) => { e.currentTarget.style.background = "#c86020"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#E07B39"; }}>
                🖼️ Click to Upload/Change Image
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
              
              {image && <p style={{ margin: "8px 0 0 0", fontSize: 11, color: "#E07B39", fontWeight: 600 }}>✓ New image selected: {image.name}</p>}
            </div>

            <hr style={{ margin: "8px 0", borderColor: "#e0e0e0" }} />

            <div>
              <h4 style={{ margin: "8px 0 12px 0", fontSize: 13, color: "#4A0B1D" }}>Sessions ({form.lessons?.length || 0})</h4>
              <div style={{ maxHeight: 250, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 4, padding: 8, marginBottom: 12, background: "#fafafa" }}>
                {form.lessons?.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 12, color: "#999", textAlign: "center", padding: 16 }}>No sessions yet. Click add below.</p>
                ) : (
                  form.lessons.map((lesson, idx) => (
                    <div key={idx} style={{ background: "#fff", padding: 10, marginBottom: 10, borderRadius: 4, border: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: 13, fontWeight: 600, color: "#4A0B1D" }}>
                          {lesson.num}. {lesson.title}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "#666" }}>⏱️ {lesson.duration}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button type="button" onClick={() => openSessionModal(idx)} style={{ padding: "6px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Edit</button>
                        <button type="button" onClick={() => deleteSession(idx)} style={{ padding: "6px 10px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontSize: 11 }}>×</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button type="button" onClick={() => openSessionModal()} style={{ width: "100%", padding: 12, background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, marginBottom: 12, fontWeight: 600, transition: "all 0.2s" }} 
              onMouseEnter={(e) => e.target.style.background = "#45a049"}
              onMouseLeave={(e) => e.target.style.background = "#4CAF50"}>
                ✏️ + Add New Session
              </button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ flex: 1, padding: 10, background: "#E07B39", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>Save Content</button>
            </div>
          </form>
        </aside>
      )}

      {/* SESSION MODAL */}
      {showSessionModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: 8, width: "90%", maxWidth: 500, padding: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: "#4A0B1D" }}>
                {editingSessionIndex !== null ? `Edit Session ${currentSessionData.num}` : `Add New Session`}
              </h2>
              <button onClick={() => setShowSessionModal(false)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: "#999" }}>✕</button>
            </div>

            <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Title */}
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#4A0B1D" }}>Session Title *</label>
                <input 
                  type="text"
                  value={currentSessionData.title}
                  onChange={(e) => setCurrentSessionData({ ...currentSessionData, title: e.target.value })}
                  style={{ width: "100%", padding: 12, borderRadius: 4, border: "1px solid #ddd", fontSize: 14 }}
                  placeholder="e.g., What is Bhakti?"
                  autoFocus
                />
              </div>

              {/* Duration */}
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#4A0B1D" }}>Duration *</label>
                <input 
                  type="text"
                  value={currentSessionData.duration}
                  onChange={(e) => setCurrentSessionData({ ...currentSessionData, duration: e.target.value })}
                  style={{ width: "100%", padding: 12, borderRadius: 4, border: "1px solid #ddd", fontSize: 14 }}
                  placeholder="e.g., 12 min"
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button 
                  type="button"
                  onClick={saveSession}
                  style={{ flex: 1, padding: 12, background: "#4CAF50", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                >
                  ✓ Save Session
                </button>
                <button 
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  style={{ flex: 1, padding: 12, background: "#f0f0f0", color: "#333", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
