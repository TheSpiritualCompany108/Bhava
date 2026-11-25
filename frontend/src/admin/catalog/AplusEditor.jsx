import React, { useRef, useState } from "react";
import { toast } from "../toast";
import s from "./AdminCatalog.module.css";
import { api, imgUrl, optimizeImage } from "./adminApi";

const aplusBtnSm = { padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: "0.82rem", background: "#e8d8c8", color: "#3b0f1e" };

/**
 * A+ banner editor (Desktop / Mobile tabs, multi-upload, reorder, layout) — used by the product form and the
 * curated-collection form. `value` is the aplusContent array, `onChange(next)` receives the whole new array.
 */
export default function AplusEditor({ value = [], onChange, onError }) {
  const aplusRef = useRef(null);
  const latest = useRef(value);
  latest.current = value;
  const [aplusTab, setAplusTab] = useState("desktop"); // "desktop" | "mobile"
  const [aplusUploading, setAplusUploading] = useState(false);
  const [aplusProgress, setAplusProgress] = useState(null); // { current, total }
  const [isDraggingAplus, setIsDraggingAplus] = useState(false);

  const uploadAplus = async (fileList, targetDevice = aplusTab) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setAplusUploading(true);
    onError?.(null);
    try {
      const added = [];
      const currentInTab = (latest.current || []).filter((m) => (m.device || "desktop") === targetDevice);
      const baseOrder = currentInTab.length;
      for (let i = 0; i < files.length; i++) {
        setAplusProgress({ current: i + 1, total: files.length });
        const file = files[i];
        const fd = new FormData();
        fd.append("image", await optimizeImage(file));
        const { url } = await api("/upload", { method: "POST", form: fd });
        added.push({
          type: "image",
          device: targetDevice,
          layout: "full-width",
          order: baseOrder + i,
          image: url,
        });
      }
      onChange([...(latest.current || []), ...added]);
    } catch (e) {
      onError?.(e);
      toast.error(e.message || "Could not upload the A+ images.");
    } finally {
      setAplusUploading(false);
      setAplusProgress(null);
    }
  };

  return (
    <>
    <div className={s.sect}>A+ Content (Desktop &amp; Mobile Infographics)</div>
    <div className={s.hint} style={{ margin: "-6px 0 14px" }}>
      Desktop banners appear <strong>only on laptops/PCs</strong>. Mobile banners appear <strong>only on phones</strong>.
    </div>

    {/* ── Desktop vs Mobile Tabs ── */}
    <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
      <button
        type="button"
        className={`${s.btn} ${aplusTab === "desktop" ? "" : s.btnGhost}`}
        style={{ flex: 1, padding: "8px 14px", fontWeight: aplusTab === "desktop" ? 700 : 500 }}
        onClick={() => setAplusTab("desktop")}
      >
        🖥️ Desktop Banners ({ (value || []).filter((m) => (m.device || "desktop") !== "mobile").length })
      </button>
      <button
        type="button"
        className={`${s.btn} ${aplusTab === "mobile" ? "" : s.btnGhost}`}
        style={{ flex: 1, padding: "8px 14px", fontWeight: aplusTab === "mobile" ? 700 : 500 }}
        onClick={() => setAplusTab("mobile")}
      >
        📱 Mobile Banners ({ (value || []).filter((m) => m.device === "mobile").length })
      </button>
    </div>

    {/* ── Multi-image Drag & Drop Upload Zone ── */}
    <input
      ref={aplusRef}
      type="file"
      accept="image/*"
      multiple
      hidden
      onChange={(e) => {
        uploadAplus(e.target.files, aplusTab);
        e.target.value = "";
      }}
    />
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDraggingAplus(true); }}
      onDragLeave={() => setIsDraggingAplus(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingAplus(false);
        if (e.dataTransfer.files?.length) {
          uploadAplus(e.dataTransfer.files, aplusTab);
        }
      }}
      onClick={() => aplusRef.current?.click()}
      style={{
        border: isDraggingAplus ? "2px dashed #4A0B1D" : "2px dashed #c9b8a8",
        background: isDraggingAplus ? "#f5ede8" : "#fdfaf7",
        borderRadius: 10,
        padding: "22px 16px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>📁</div>
      <strong style={{ color: "#3b0f1e", fontSize: "0.95rem", display: "block" }}>
        {aplusUploading
          ? aplusProgress
            ? `Uploading ${aplusProgress.current} of ${aplusProgress.total} images…`
            : "Uploading images to cloud…"
          : `Click to select all ${aplusTab === "desktop" ? "Desktop" : "Mobile"} images at once, or drag & drop here`}
      </strong>
      <span style={{ fontSize: "0.82rem", color: "#7a5e66", display: "block", marginTop: 4 }}>
        Select multiple files at once with Ctrl+Click or Ctrl+A (all images will upload in batch)
      </span>
    </div>

    {/* ── Current Tab Banner List ── */}
    {(() => {
      const isDesktop = aplusTab === "desktop";
      const desktopItems = (value || []).filter((m) => (m.device || "desktop") !== "mobile");
      const mobileItems = (value || []).filter((m) => m.device === "mobile");
      const activeList = isDesktop ? desktopItems : mobileItems;

      if (activeList.length === 0) {
        return (
          <div style={{ padding: "16px", textAlign: "center", background: "#fcf8f4", border: "1px solid #ebdcd0", borderRadius: 8, color: "#8a6d73", fontSize: "0.88rem", marginBottom: 12 }}>
            No {isDesktop ? "Desktop" : "Mobile"} banners added yet. Use the upload box above to add images.
          </div>
        );
      }

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {activeList.map((mod, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "#fdf8f3", border: "1px solid #d8c8b8", borderRadius: 10, padding: 10, flexWrap: "wrap" }}>
              <img
                src={imgUrl(mod.image)}
                alt={`${isDesktop ? "Desktop" : "Mobile"} Banner ${i + 1}`}
                style={{ width: 110, height: 64, objectFit: "cover", borderRadius: 6, border: "1px solid #e0d0c0", cursor: "pointer" }}
                onClick={() => window.open(imgUrl(mod.image), "_blank")}
                title="Click to view full image"
              />
              <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#3b0f1e" }}>
                  {isDesktop ? "🖥️ Desktop" : "📱 Mobile"} Banner #{i + 1}
                </span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: "0.8rem", color: "#6b5058" }}>Layout:</label>
                  <select
                    value={mod.layout || "full-width"}
                    onChange={(e) => {
                      onChange((value || []).map((m) => (m === mod ? { ...m, layout: e.target.value } : m)));
                    }}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #c9b8a8", fontSize: "0.82rem", background: "#fff" }}
                  >
                    <option value="full-width">Full Width Banner (100% wide)</option>
                    <option value="contained">Contained / Boxed</option>
                    <option value="2-col">2-Column Grid (Side-by-side)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  type="button"
                  style={aplusBtnSm}
                  disabled={i === 0}
                  onClick={() => {
                    const tabList = isDesktop ? [...desktopItems] : [...mobileItems];
                    const otherList = isDesktop ? [...mobileItems] : [...desktopItems];
                    [tabList[i], tabList[i - 1]] = [tabList[i - 1], tabList[i]];
                    const reindexed = tabList.map((m, j) => ({ ...m, order: j }));
                    onChange(isDesktop ? [...reindexed, ...otherList] : [...otherList, ...reindexed]);
                  }}
                  title="Move Up"
                >
                  ↑ Move Up
                </button>
                <button
                  type="button"
                  style={aplusBtnSm}
                  disabled={i === activeList.length - 1}
                  onClick={() => {
                    const tabList = isDesktop ? [...desktopItems] : [...mobileItems];
                    const otherList = isDesktop ? [...mobileItems] : [...desktopItems];
                    [tabList[i], tabList[i + 1]] = [tabList[i + 1], tabList[i]];
                    const reindexed = tabList.map((m, j) => ({ ...m, order: j }));
                    onChange(isDesktop ? [...reindexed, ...otherList] : [...otherList, ...reindexed]);
                  }}
                  title="Move Down"
                >
                  ↓ Move Down
                </button>
                <button
                  type="button"
                  style={{ ...aplusBtnSm, background: "#a2331f", color: "#fff" }}
                  onClick={() => {
                    onChange((value || []).filter((m) => m !== mod));
                  }}
                  title="Remove Banner"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    })()}
    </>
  );
}
