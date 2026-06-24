const OCCASIONS = ["office", "wedding", "casual", "sports", "vacation", "party", "festive", "winter"];
const STYLES = ["western", "ethnic"];
const GENDERS = ["men", "women"];

export default function ProfilePanel({ profile, onChange }) {
  const handle = (field) => (e) => onChange({ ...profile, [field]: e.target.value });

  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>👤 Your Profile</h3>
      <p style={styles.subtitle}>Fill in details for personalised recommendations</p>

      <label style={styles.label}>Gender</label>
      <div style={styles.chipRow}>
        {GENDERS.map((g) => (
          <button
            key={g}
            style={{ ...styles.chip, ...(profile.gender === g ? styles.chipActive : {}) }}
            onClick={() => onChange({ ...profile, gender: profile.gender === g ? "" : g })}
          >
            {g === "men" ? "👨 Men" : "👩 Women"}
          </button>
        ))}
      </div>

      <label style={styles.label}>Occasion</label>
      <div style={styles.chipRow}>
        {OCCASIONS.map((o) => (
          <button
            key={o}
            style={{ ...styles.chip, ...(profile.occasion === o ? styles.chipActive : {}) }}
            onClick={() => onChange({ ...profile, occasion: profile.occasion === o ? "" : o })}
          >
            {o}
          </button>
        ))}
      </div>

      <label style={styles.label}>Style Preference</label>
      <div style={styles.chipRow}>
        {STYLES.map((s) => (
          <button
            key={s}
            style={{ ...styles.chip, ...(profile.stylePreference === s ? styles.chipActive : {}) }}
            onClick={() => onChange({ ...profile, stylePreference: profile.stylePreference === s ? "" : s })}
          >
            {s}
          </button>
        ))}
      </div>

      <label style={styles.label}>Age</label>
      <input
        type="number"
        placeholder="e.g. 24"
        value={profile.age || ""}
        onChange={handle("age")}
        style={styles.input}
        min={10}
        max={100}
      />

      <label style={styles.label}>Budget (₹)</label>
      <input
        type="number"
        placeholder="e.g. 3000"
        value={profile.budget || ""}
        onChange={handle("budget")}
        style={styles.input}
        min={0}
      />

      <button
        style={styles.clearBtn}
        onClick={() => onChange({ gender: "", occasion: "", stylePreference: "", age: "", budget: "" })}
      >
        Clear Profile
      </button>
    </div>
  );
}

const styles = {
  panel: {
    background: "#faf5ff",
    borderRadius: 16,
    padding: "20px",
    border: "1px solid #e8d5ff",
    height: "fit-content",
  },
  title: {
    margin: "0 0 4px",
    color: "#4a0080",
    fontSize: 16,
  },
  subtitle: {
    color: "#888",
    fontSize: 12,
    margin: "0 0 16px",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#7c3aed",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 14,
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    padding: "5px 12px",
    borderRadius: 20,
    border: "1px solid #ddd6fe",
    background: "#fff",
    color: "#5b21b6",
    fontSize: 12,
    cursor: "pointer",
    textTransform: "capitalize",
    transition: "all 0.15s",
  },
  chipActive: {
    background: "#7c3aed",
    color: "#fff",
    border: "1px solid #7c3aed",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd6fe",
    fontSize: 14,
    color: "#2d1b45",
    boxSizing: "border-box",
    outline: "none",
  },
  clearBtn: {
    marginTop: 18,
    width: "100%",
    padding: "8px",
    background: "transparent",
    border: "1px solid #ddd6fe",
    borderRadius: 8,
    color: "#9c6adf",
    fontSize: 13,
    cursor: "pointer",
  },
};