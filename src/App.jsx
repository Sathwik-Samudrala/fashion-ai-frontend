import { useEffect, useState } from "react";
import ProfilePanel from "./components/catalogView";
import ChatInterface from "./components/ChatInterface";
import CatalogView from "./components/CatalogView";
import { checkHealth, API_BASE } from "./services/api";

const EMPTY_PROFILE = { gender: "", occasion: "", stylePreference: "", age: "", budget: "" };

export default function App() {
  const [tab, setTab] = useState("chat"); // "chat" | "catalog"
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [backendStatus, setBackendStatus] = useState("checking"); // checking | ok | down
  const [geminiConfigured, setGeminiConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;
    checkHealth()
      .then((res) => {
        if (cancelled) return;
        setBackendStatus("ok");
        setGeminiConfigured(Boolean(res.data?.gemini_configured));
      })
      .catch(() => {
        if (!cancelled) setBackendStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <span style={styles.logoMark} aria-hidden="true">
            🪡
          </span>
          <div>
            <h1 style={styles.logoText}>StyleSense AI</h1>
            <p style={styles.tagline}>Your AI fashion stylist, dressed for the occasion</p>
          </div>
        </div>

        <nav style={styles.tabs}>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(tab === "chat" ? styles.tabBtnActive : {}) }}
            onClick={() => setTab("chat")}
          >
            💬 Stylist Chat
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(tab === "catalog" ? styles.tabBtnActive : {}) }}
            onClick={() => setTab("catalog")}
          >
            🧵 Browse Catalog
          </button>
        </nav>
      </header>

      <StitchDivider />

      {backendStatus === "down" && (
        <div style={styles.bannerError}>
          ⚠️ Can't reach the backend at <code style={styles.code}>{API_BASE}</code>. Start the FastAPI
          server (see README) and refresh this page.
        </div>
      )}
      {backendStatus === "ok" && !geminiConfigured && (
        <div style={styles.bannerInfo}>
          ℹ️ The backend is running, but <code style={styles.code}>GEMINI_API_KEY</code> isn't set —
          you'll still get full outfit picks, just with template explanations instead of AI-generated ones.
        </div>
      )}

      <main style={styles.main}>
        {tab === "chat" ? (
          <div className="chat-layout">
            <ProfilePanel profile={profile} onChange={setProfile} />
            <div style={styles.chatColumn}>
              <ChatInterface userProfile={profile} />
            </div>
          </div>
        ) : (
          <CatalogView />
        )}
      </main>

      <footer style={styles.footer}>
        Built for the Dare XAI ML/AI Engineer Intern assignment · Recommendations powered by a curated
        Myntra / Ajio / Nykaa dataset + Gemini
      </footer>
    </div>
  );
}

function StitchDivider() {
  return (
    <svg width="100%" height="8" viewBox="0 0 1200 8" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block" }}>
      <line x1="0" y1="4" x2="1200" y2="4" stroke="#ddd6fe" strokeWidth="2" strokeDasharray="10 8" strokeLinecap="round" />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#fbf8ff",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 32px",
    background: "#fff",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logoMark: {
    fontSize: 30,
    background: "#f3e8ff",
    borderRadius: 14,
    width: 52,
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    margin: 0,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#4a0080",
    letterSpacing: 0.2,
  },
  tagline: {
    margin: "2px 0 0",
    fontSize: 13,
    color: "#9c6adf",
  },
  tabs: {
    display: "flex",
    gap: 8,
    background: "#faf5ff",
    padding: 6,
    borderRadius: 14,
  },
  tabBtn: {
    border: "none",
    background: "transparent",
    color: "#7c3aed",
    fontSize: 14,
    fontWeight: 600,
    padding: "9px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },
  tabBtnActive: {
    background: "#7c3aed",
    color: "#fff",
  },
  bannerError: {
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: 13,
    padding: "10px 32px",
    borderBottom: "1px solid #fecaca",
  },
  bannerInfo: {
    background: "#fffbeb",
    color: "#92400e",
    fontSize: 13,
    padding: "10px 32px",
    borderBottom: "1px solid #fde68a",
  },
  code: {
    background: "rgba(0,0,0,0.06)",
    borderRadius: 4,
    padding: "1px 6px",
    fontSize: 12,
  },
  main: {
    flex: 1,
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
    padding: "28px 32px 48px",
    boxSizing: "border-box",
  },
  chatColumn: {
    background: "#fff",
    border: "1px solid #efe5fb",
    borderRadius: 18,
    padding: "20px 24px",
    boxShadow: "0 6px 24px rgba(120,80,160,0.06)",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#a78bcf",
    padding: "16px 32px 28px",
  },
};