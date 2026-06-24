    import { useEffect, useState } from "react";
    import { getProducts, resolveImageUrl, describeApiError } from "../services/api";

    const OCCASIONS = ["office", "wedding", "casual", "sports", "vacation", "party", "festive", "winter"];

    export default function CatalogView() {
    const [filters, setFilters] = useState({ gender: "", occasion: "", category: "" });
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");

        const handle = setTimeout(() => {
        getProducts({
            gender: filters.gender || undefined,
            occasion: filters.occasion || undefined,
            category: filters.category || undefined,
            limit: 60,
        })
            .then((res) => {
            if (cancelled) return;
            setProducts(res.data);
            setStatus("ready");
            })
            .catch((err) => {
            if (cancelled) return;
            setErrorMsg(describeApiError(err));
            setStatus("error");
            });
        }, 250); // debounce the free-text category field

        return () => {
        cancelled = true;
        clearTimeout(handle);
        };
    }, [filters.gender, filters.occasion, filters.category]);

    return (
        <div style={styles.wrap}>
        <div style={styles.filterBar}>
            <div style={styles.chipGroup}>
            {["", "men", "women"].map((g) => (
                <button
                key={g || "any"}
                type="button"
                style={{ ...styles.chip, ...(filters.gender === g ? styles.chipActive : {}) }}
                onClick={() => setFilters((f) => ({ ...f, gender: g }))}
                >
                {g === "" ? "All genders" : g === "men" ? "👨 Men" : "👩 Women"}
                </button>
            ))}
            </div>

            <select
            value={filters.occasion}
            onChange={(e) => setFilters((f) => ({ ...f, occasion: e.target.value }))}
            style={styles.select}
            >
            <option value="">All occasions</option>
            {OCCASIONS.map((o) => (
                <option key={o} value={o}>
                {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
            ))}
            </select>

            <input
            type="text"
            placeholder="Search category, e.g. shirt, kurta, sneakers..."
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            style={styles.search}
            />
        </div>

        {status === "loading" && <p style={styles.status}>Loading the catalog…</p>}
        {status === "error" && <p style={styles.statusError}>⚠️ {errorMsg}</p>}
        {status === "ready" && products.length === 0 && (
            <p style={styles.status}>No products match those filters — try widening your search.</p>
        )}

        {status === "ready" && products.length > 0 && (
            <div style={styles.grid}>
            {products.map((p) => (
                <a
                key={p.id}
                href={p.product_url || undefined}
                target={p.product_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={styles.card}
                >
                <div style={styles.imgWrap}>
                    {p.image_url ? (
                    <img src={resolveImageUrl(p.image_url)} alt={p.name} style={styles.img} loading="lazy" />
                    ) : (
                    <div style={styles.imgPlaceholder}>🧵</div>
                    )}
                </div>
                <div style={styles.cardBody}>
                    <span style={styles.name}>{p.name}</span>
                    <span style={styles.meta}>
                    {p.brand}
                    {p.brand && p.price_inr != null ? " · " : ""}
                    {p.price_inr != null ? `₹${Number(p.price_inr).toLocaleString("en-IN")}` : ""}
                    </span>
                    {p.rating != null && <span style={styles.rating}>⭐ {p.rating}</span>}
                </div>
                </a>
            ))}
            </div>
        )}
        </div>
    );
    }

    const styles = {
    wrap: { width: "100%" },
    filterBar: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 20 },
    chipGroup: { display: "flex", gap: 6 },
    chip: { padding: "7px 14px", borderRadius: 20, border: "1px solid #ddd6fe", background: "#fff", color: "#5b21b6", fontSize: 13, cursor: "pointer" },
    chipActive: { background: "#7c3aed", color: "#fff", border: "1px solid #7c3aed" },
    select: { padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd6fe", fontSize: 13, color: "#2d1b45", background: "#fff" },
    search: { flex: 1, minWidth: 200, padding: "8px 14px", borderRadius: 10, border: "1px solid #ddd6fe", fontSize: 13, color: "#2d1b45", outline: "none" },
    status: { color: "#888", fontSize: 14, padding: "32px 0", textAlign: "center" },
    statusError: { color: "#b91c1c", fontSize: 14, padding: "32px 0", textAlign: "center" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 },
    card: { background: "#fff", border: "1px solid #e8e0f0", borderRadius: 14, overflow: "hidden", textDecoration: "none", display: "flex", flexDirection: "column", boxShadow: "0 2px 10px rgba(120,80,160,0.06)", transition: "transform 0.15s, box-shadow 0.15s" },
    imgWrap: { width: "100%", aspectRatio: "1 / 1", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
    img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    imgPlaceholder: { fontSize: 28 },
    cardBody: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 },
    name: { fontSize: 13, fontWeight: 600, color: "#2d1b45", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
    meta: { fontSize: 12, color: "#888" },
    rating: { fontSize: 12, color: "#b8860b" },
    };