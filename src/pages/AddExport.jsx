import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function AddExport() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    originCountry: "",
    rating: "",
    price: "",
    availableQty: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function updateField(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!user) {
      setMsg("You must be logged in to add a product.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      imageUrl: form.imageUrl.trim(),
      originCountry: form.originCountry.trim(),
      rating: form.rating ? Number(form.rating) : undefined,
      price: Number(form.price),
      availableQty: Number(form.availableQty),
    };

    try {
      setLoading(true);
      const res = await api.post("/products", payload);

      if (res?.status === 201 && res?.data?._id) {
        setMsg("✅ Product added successfully!");
        setForm({
          name: "",
          imageUrl: "",
          originCountry: "",
          rating: "",
          price: "",
          availableQty: "",
        });
      } else {
        setMsg("❌ Failed to add product (unexpected response)");
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message;
      setMsg(`❌ Failed to add product. ${serverMsg || ""}`.trim());
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: {
      maxWidth: 760,
      margin: "0 auto",
      padding: "28px 16px",
    },
    card: {
      background: "rgba(255, 255, 255, 0.06)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: 16,
      padding: 22,
      boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
    },
    title: {
      fontSize: 26,
      fontWeight: 800,
      marginBottom: 14,
      color: "#fff",
      letterSpacing: 0.2,
    },
    sub: {
      marginTop: -6,
      marginBottom: 18,
      color: "rgba(255,255,255,0.75)",
      fontSize: 14,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 14,
    },
    full: { gridColumn: "1 / -1" },
    label: {
      display: "block",
      marginBottom: 6,
      color: "rgba(255,255,255,0.85)",
      fontSize: 13,
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      outline: "none",
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(0,0,0,0.35)",
      color: "#fff",
      fontSize: 14,
    },
    select: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      outline: "none",
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(0,0,0,0.35)",
      color: "#fff",
      fontSize: 14,
      appearance: "none",
    },
    hint: {
      marginTop: 6,
      color: "rgba(255,255,255,0.6)",
      fontSize: 12,
    },
    previewWrap: {
      marginTop: 10,
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(0,0,0,0.25)",
    },
    previewImg: {
      width: "100%",
      height: 220,
      objectFit: "cover",
      display: "block",
    },
    actions: {
      display: "flex",
      gap: 12,
      marginTop: 8,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    button: {
      padding: "12px 16px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    msg: {
      marginTop: 14,
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(0,0,0,0.25)",
      color: "#fff",
      fontSize: 14,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Add Export (Product)</div>
        <div style={styles.sub}>
          Add a product with optional image, origin country, and rating. Only name, price, and quantity are required.
        </div>

        <form onSubmit={onSubmit}>
          <div style={styles.grid}>
            <div style={styles.full}>
              <label style={styles.label}>Product name *</label>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="e.g. Potato"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.full}>
              <label style={styles.label}>Image URL (optional)</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={updateField}
                placeholder="https://..."
                style={styles.input}
              />
              <div style={styles.hint}>Tip: Use a direct image link (jpg/png/webp).</div>

              {form.imageUrl && (
                <div style={styles.previewWrap}>
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={styles.previewImg}
                    onError={(e) => {
                      // hide broken previews
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={styles.label}>Country of origin (optional)</label>
              <input
                name="originCountry"
                value={form.originCountry}
                onChange={updateField}
                placeholder="e.g. Bangladesh"
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Rating (optional)</label>
              <select name="rating" value={form.rating} onChange={updateField} style={styles.select}>
                <option value="">Select rating</option>
                <option value="1">⭐ 1</option>
                <option value="2">⭐⭐ 2</option>
                <option value="3">⭐⭐⭐ 3</option>
                <option value="4">⭐⭐⭐⭐ 4</option>
                <option value="5">⭐⭐⭐⭐⭐ 5</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>Price *</label>
              <input
                name="price"
                value={form.price}
                onChange={updateField}
                placeholder="e.g. 12.50"
                type="number"
                step="0.01"
                required
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>Available quantity *</label>
              <input
                name="availableQty"
                value={form.availableQty}
                onChange={updateField}
                placeholder="e.g. 100"
                type="number"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>

        {msg && <div style={styles.msg}>{msg}</div>}
      </div>
    </div>
  );
}
