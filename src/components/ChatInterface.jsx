import { useState, useRef, useEffect } from "react";
import { sendChatMessage, getOutfitById, describeApiError } from "../services/api";
import OutfitCard from "./OutfitCard";

const QUICK_PROMPTS = [
  "I need an outfit for a business meeting",
  "Suggest a casual weekend look",
  "Something stylish for a wedding",
  "I need a party outfit for tonight",
  "Recommend a beach vacation outfit",
  "What should I wear to the gym?",
];

let messageId = 0;
const nextId = () => `m${++messageId}`;

export default function ChatInterface({ userProfile }) {
  const [messages, setMessages] = useState([
    {
      id: nextId(),
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI fashion stylist. Tell me about the occasion, your style, or just ask for an outfit recommendation!",
      outfit: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAltFor, setLoadingAltFor] = useState(null); // message id currently fetching an alternative
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg = { id: nextId(), role: "user", content: userText, outfit: null };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        gender: userProfile?.gender || null,
        occasion: userProfile?.occasion || null,
        style_preference: userProfile?.stylePreference || null,
        budget_inr: userProfile?.budget ? Number(userProfile.budget) : null,
      };

      const res = await sendChatMessage(payload);
      const data = res.data;

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: data.reply, outfit: data.outfit || null },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: `⚠️ ${describeApiError(err)}`, outfit: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAlternative = async (outfitId, theme, sourceMessageId) => {
    setLoadingAltFor(sourceMessageId);
    try {
      const res = await getOutfitById(outfitId);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: res.data.llm_explanation || `Here's the "${theme}" look instead:`,
          outfit: res.data,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: `⚠️ ${describeApiError(err)}`, outfit: null },
      ]);
    } finally {
      setLoadingAltFor(null);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{ ...styles.msgRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
          >
            <div style={styles.msgCol}>
              {msg.role === "assistant" && <span style={styles.avatar}>🪡</span>}
              <div
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user" ? styles.userBubble : styles.assistantBubble),
                }}
              >
                {msg.content}
              </div>
              {msg.outfit && (
                <OutfitCard
                  outfit={msg.outfit}
                  loadingAlternative={loadingAltFor === msg.id}
                  onSelectAlternative={(outfitId, theme) => handleSelectAlternative(outfitId, theme, msg.id)}
                />
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, ...styles.assistantBubble }}>
              <span style={styles.dots}>✨ Styling for you...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.quickPrompts}>
        {QUICK_PROMPTS.map((p) => (
          <button key={p} type="button" style={styles.quickBtn} onClick={() => sendMessage(p)} disabled={loading}>
            {p}
          </button>
        ))}
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me anything about fashion..."
          rows={2}
          disabled={loading}
        />
        <button
          type="button"
          style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100%", minHeight: 500 },
  messages: { flex: 1, overflowY: "auto", padding: "16px 0", display: "flex", flexDirection: "column", gap: 12, maxHeight: 560 },
  msgRow: { display: "flex", alignItems: "flex-start", gap: 8 },
  msgCol: { maxWidth: "100%" },
  avatar: { fontSize: 18, marginBottom: 4, display: "block" },
  bubble: { maxWidth: 560, padding: "12px 16px", borderRadius: 16, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" },
  userBubble: { background: "#7c3aed", color: "#fff", borderBottomRightRadius: 4, marginLeft: "auto" },
  assistantBubble: { background: "#f3e8ff", color: "#2d1b45", borderBottomLeftRadius: 4 },
  dots: { color: "#9c6adf", fontStyle: "italic" },
  quickPrompts: { display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 0", borderTop: "1px solid #f0e6ff" },
  quickBtn: { background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#7c3aed", cursor: "pointer", transition: "background 0.15s" },
  inputRow: { display: "flex", gap: 10, paddingTop: 10, borderTop: "1px solid #f0e6ff", alignItems: "flex-end" },
  textarea: { flex: 1, borderRadius: 12, border: "1px solid #ddd6fe", padding: "10px 14px", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", color: "#2d1b45" },
  sendBtn: { background: "#7c3aed", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};