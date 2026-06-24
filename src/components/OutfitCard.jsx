import { resolveImageUrl } from "../services/api";

export default function OutfitCard({ outfit, onSelectAlternative, loadingAlternative }) {
  if (!outfit) return null;

  const items = outfit.items || [];
  const alternatives = outfit.alternatives || [];

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.theme}>{outfit.theme}</span>
        {outfit.occasion && <span style={styles.badge}>{outfit.occasion}</span>}
      </div>

      {outfit.palette && <p style={styles.palette}>🎨 Palette: {outfit.palette}</p>}

      <div style={styles.itemsGrid}>
        {items.map((item) => {
          const img = resolveImageUrl(item.image_url);
          const Wrapper = item.product_url ? "a" : "div";
          const wrapperProps = item.product_url
            ? { href: item.product_url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Wrapper
              key={`${item.slot}-${item.product_id || item.name}`}
              style={styles.item}
              {...wrapperProps}
            >
              <div style={styles.thumbWrap}>
                {img ? (
                  <img src={img} alt={item.name} style={styles.thumb} loading="lazy" />
                ) : (
                  <div style={styles.thumbPlaceholder}>🧵</div>
                )}
              </div>
              <div style={styles.itemBody}>
                <span style={styles.itemLabel}>{item.label}</span>
                <span style={styles.itemValue}>{item.name}</span>
                <span style={styles.itemMeta}>
                  {item.brand && <>{item.brand}</>}
                  {item.brand && item.price_inr != null && " · "}
                  {item.price_inr != null && <>₹{Number(item.price_inr).toLocaleString("en-IN")}</>}
                  {item.rating != null && <> · ⭐ {item.rating}</>}
                </span>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {outfit.total_price_inr != null && (
        <p style={styles.price}>
          💰 Estimated Total: ₹{Number(outfit.total_price_inr).toLocaleString("en-IN")}
        </p>
      )}

      {alternatives.length > 0 && (
        <div style={styles.altRow}>
          <span style={styles.altLabel}>Other options for you:</span>
          <div style={styles.altChips}>
            {alternatives.map((alt) => (
              <button
                key={alt.outfit_id}
                type="button"
                style={styles.altChip}
                disabled={loadingAlternative}
                onClick={() => onSelectAlternative && onSelectAlternative(alt.outfit_id, alt.theme)}
              >
                {alt.theme}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #e8e0f0", borderRadius: 16, padding: "20px 24px", marginTop: 12, boxShadow: "0 4px 20px rgba(120,80,160,0.08)" },
  header: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" },
  theme: { fontSize: 18, fontWeight: 700, color: "#4a0080", textTransform: "capitalize" },
  badge: { background: "#f3e8ff", color: "#7c3aed", borderRadius: 20, padding: "2px 12px", fontSize: 12, fontWeight: 600, textTransform: "capitalize" },
  palette: { color: "#888", fontSize: 13, marginBottom: 14 },
  itemsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 12 },
  item: { background: "#faf5ff", borderRadius: 12, padding: 10, display: "flex", gap: 10, alignItems: "center", textDecoration: "none", cursor: "default" },
  thumbWrap: { width: 56, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0e6ff", display: "flex", alignItems: "center", justifyContent: "center" },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  thumbPlaceholder: { fontSize: 20 },
  itemBody: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  itemLabel: { fontSize: 11, color: "#9c6adf", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  itemValue: { fontSize: 13, color: "#2d1b45", fontWeight: 500, lineHeight: 1.3 },
  itemMeta: { fontSize: 12, color: "#888" },
  price: { color: "#059669", fontWeight: 600, fontSize: 14, marginTop: 6 },
  altRow: { marginTop: 14, paddingTop: 12, borderTop: "1px dashed #e8d5ff" },
  altLabel: { fontSize: 12, color: "#9c6adf", fontWeight: 600, display: "block", marginBottom: 6 },
  altChips: { display: "flex", flexWrap: "wrap", gap: 6 },
  altChip: { background: "#fff", border: "1px solid #ddd6fe", color: "#7c3aed", borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", textTransform: "capitalize" },
};