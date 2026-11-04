import React, { useEffect, useRef, useState } from "react";
import styles from "./GuruChat.module.css";
import BhavaVoiceCall from "./BhavaVoiceCall";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GREETING = "Namaste 🙏 I'm Bhagwati. Ask me anything about Bhava: — our rituals, products, or practices.";

function GuruChat() {
  const [open, setOpen] = useState(false);
  const [voiceCallOpen, setVoiceCallOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    const openChat = () => setOpen(true);
    const openVoice = () => setVoiceCallOpen(true);
    window.addEventListener("guru:open", openChat);
    window.addEventListener("guru:voice", openVoice);
    return () => {
      window.removeEventListener("guru:open", openChat);
      window.removeEventListener("guru:voice", openVoice);
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: json.reply }]);
      } else {
        setError(json.message || "Bhagwati couldn't reply just now.");
      }
    } catch {
      setError("Couldn't reach Bhagwati — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <span className={styles.headerIcon}>🕉️</span>
              <div>
                <p className={styles.headerName}>Bhagwati</p>
                <p className={styles.headerSub}>Ask about Bhava:</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                className={styles.closeBtn}
                onClick={() => setVoiceCallOpen(true)}
                title="Start Voice Call"
                aria-label="Start Voice Call"
              >
                <span className="material-symbols-outlined">call</span>
              </button>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? styles.bubbleUser : styles.bubbleAssistant}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className={styles.bubbleAssistant}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            )}
            {error && <div className={styles.errorBubble}>{error}</div>}
          </div>

          <form className={styles.inputRow} onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Bhagwati anything about Bhava:…"
              className={styles.input}
              disabled={loading}
            />
            <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()} aria-label="Send">
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Voice Call UI Modal */}
      <BhavaVoiceCall isOpen={voiceCallOpen} onClose={() => setVoiceCallOpen(false)} />
    </div>
  );
}

export default GuruChat;
