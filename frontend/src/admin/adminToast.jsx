import React, { useEffect, useState } from "react";

import { listeners } from "./toast";

const STYLE = `
.adm-toasts { position: fixed; top: 16px; right: 16px; z-index: 5000; display: flex; flex-direction: column; gap: 10px; width: min(420px, calc(100vw - 32px)); pointer-events: none; }
.adm-toast { pointer-events: auto; display: flex; align-items: flex-start; gap: 10px; padding: 12px 12px 12px 14px; border-radius: 12px; color: #fff; font: 600 14px/1.4 "Neue Haas Grotesk", Inter, system-ui, sans-serif; box-shadow: 0 12px 32px rgba(74, 11, 29, 0.28); animation: admToastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1); position: relative; overflow: hidden; }
.adm-toast--success { background: #4A0B1D; box-shadow: 0 12px 32px rgba(74, 11, 29, 0.35), inset 4px 0 0 #E07B39; }
.adm-toast--error { background: #a8321f; }
.adm-toast--info { background: #B5581A; }
.adm-toast__icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex: 0 0 auto; background: rgba(255, 255, 255, 0.2); }
.adm-toast--success .adm-toast__icon { background: #E07B39; }
.adm-toast__msg { flex: 1; word-break: break-word; }
.adm-toast__x { flex: 0 0 auto; width: 24px; height: 24px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, 0.18); color: #fff; font-size: 11px; cursor: pointer; }
.adm-toast__x:hover { background: rgba(255, 255, 255, 0.32); }
.adm-toast__bar { position: absolute; left: 0; bottom: 0; height: 3px; background: rgba(255, 255, 255, 0.55); animation-name: admToastBar; animation-timing-function: linear; animation-fill-mode: forwards; }
.adm-toast--success .adm-toast__bar { background: #E07B39; }
@keyframes admToastIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes admToastBar { from { width: 100%; } to { width: 0; } }
@media (max-width: 600px) { .adm-toasts { left: 16px; right: 16px; width: auto; } }
`;

const ICON = { success: "✓", error: "⚠", info: "ℹ" };

export function AdminToaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (item) => {
      setItems((prev) => [...prev.slice(-3), item]); // keep at most 4 on screen
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== item.id)), item.ms);
    };
    listeners.add(onToast);
    return () => { listeners.delete(onToast); };
  }, []);

  return (
    <>
      <style>{STYLE}</style>
      <div className="adm-toasts" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`adm-toast adm-toast--${t.type}`} role={t.type === "error" ? "alert" : "status"}>
            <span className="adm-toast__icon" aria-hidden="true">{ICON[t.type]}</span>
            <span className="adm-toast__msg">{t.message}</span>
            <button type="button" className="adm-toast__x" aria-label="Dismiss" onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}>✕</button>
            <span className="adm-toast__bar" style={{ animationDuration: `${t.ms}ms` }} />
          </div>
        ))}
      </div>
    </>
  );
}
