import React, { useEffect, useRef, useState } from "react";
import styles from "./GuruChat.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GREETING = "Namaste 🙏 I'm Guru. Ask me anything about Bhava — our rituals, products, or practices.";

function GuruChat() {
  const [open, setOpen] = useState(false);
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
    window.addEventListener("guru:open", openChat);
    return () => window.removeEventListener("guru:open", openChat);
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
        setError(json.message || "Guru couldn't reply just now.");
      }
    } catch {
      setError("Couldn't reach Guru — check your connection and try again.");
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
                <p className={styles.headerName}>Guru</p>
                <p className={styles.headerSub}>Ask about Bhava</p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
              <span className="material-symbols-outlined">close</span>
            </button>
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
              placeholder="Ask Guru anything about Bhava…"
              className={styles.input}
              disabled={loading}
            />
            <button type="submit" className={styles.sendBtn} disabled={loading || !input.trim()} aria-label="Send">
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default GuruChat;
