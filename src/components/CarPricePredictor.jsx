import { useState } from "react";

const API_URL = "http://103.196.155.76:8000";

const FIELDS = [
  { key: "Engine_size",      label: "Engine Size",     unit: "L",   placeholder: "e.g. 2.0",   step: "0.1" },
  { key: "Horsepower",       label: "Horsepower",      unit: "HP",  placeholder: "e.g. 150",   step: "1"   },
  { key: "Wheelbase",        label: "Wheelbase",       unit: "in",  placeholder: "e.g. 102.4", step: "0.1" },
  { key: "Width",            label: "Width",           unit: "in",  placeholder: "e.g. 67.9",  step: "0.1" },
  { key: "Length",           label: "Length",          unit: "in",  placeholder: "e.g. 178.5", step: "0.1" },
  { key: "Curb_weight",      label: "Curb Weight",     unit: "lbs", placeholder: "e.g. 3.3",  step: "1"   },
  { key: "Fuel_capacity",    label: "Fuel Capacity",   unit: "gal", placeholder: "e.g. 14.5",  step: "0.1" },
  { key: "Fuel_efficiency",  label: "Fuel Efficiency", unit: "mpg", placeholder: "e.g. 32",    step: "0.1" },
];

const initialForm = Object.fromEntries(FIELDS.map((f) => [f.key, ""]));

/* ── Inline styles (no Tailwind required, copy-paste ready) ── */
const S = {
  body: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0a0612",
    color: "#f0eaff",
    minHeight: "100vh",
    padding: "28px 20px",
    position: "relative",
    overflow: "hidden",
  },
  blob: (top, left, bottom, right, color, size) => ({
    position: "fixed",
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color}, transparent 70%)`,
    filter: "blur(90px)",
    top,
    left,
    bottom,
    right,
    pointerEvents: "none",
    zIndex: 0,
  }),
  header: { textAlign: "center", marginBottom: 32, position: "relative", zIndex: 1 },
  brand: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "#b48bff",
    marginBottom: 8,
    opacity: 0.8,
  },
  h1: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(22px,4vw,30px)",
    fontWeight: 800,
    background: "linear-gradient(135deg,#f0eaff 0%,#b48bff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1.2,
  },
  subtitle: { fontSize: 12, color: "rgba(240,234,255,0.45)", marginTop: 6, letterSpacing: 0.5 },
  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
    maxWidth: 900,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  glass: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    padding: 24,
    boxShadow: "0 0 40px rgba(124,77,255,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  panelTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#b48bff",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  fieldLabel: {
    display: "block",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(240,234,255,0.45)",
    marginBottom: 6,
  },
  input: (focused) => ({
    width: "100%",
    background: focused ? "rgba(180,140,255,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused ? "#b48bff" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10,
    padding: "10px 14px",
    color: "#f0eaff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    outline: "none",
    boxShadow: focused ? "0 0 0 3px rgba(124,77,255,0.12)" : "none",
    transition: "all 0.25s",
  }),
  btn: (loading) => ({
    width: "100%",
    marginTop: 8,
    padding: "13px",
    background: "linear-gradient(135deg,#7c4dff,#9c27b0)",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    boxShadow: "0 4px 20px rgba(124,77,255,0.3)",
    transition: "all 0.25s",
  }),
  priceCard: {
    background: "linear-gradient(135deg,rgba(245,200,66,0.12),rgba(245,200,66,0.04))",
    border: "1px solid rgba(245,200,66,0.2)",
    borderRadius: 16,
    padding: 24,
    textAlign: "center",
    backdropFilter: "blur(18px)",
    boxShadow: "0 0 30px rgba(245,200,66,0.06)",
    marginBottom: 14,
  },
  priceLabel: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "rgba(245,200,66,0.6)",
    marginBottom: 8,
    fontWeight: 600,
  },
  priceValue: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(28px,5vw,38px)",
    fontWeight: 800,
    color: "#f5c842",
    textShadow: "0 0 30px rgba(245,200,66,0.4)",
    letterSpacing: -1,
    minHeight: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  priceSub: { fontSize: 11, color: "rgba(245,200,66,0.5)", marginTop: 4 },
  varsCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 20,
    backdropFilter: "blur(18px)",
    marginBottom: 14,
  },
  varsTitle: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "rgba(240,234,255,0.45)",
    marginBottom: 14,
    fontWeight: 600,
  },
  varRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  varName: { fontSize: 10, color: "rgba(240,234,255,0.45)", letterSpacing: 0.5 },
  varVal: { fontSize: 11, color: "#b48bff", fontWeight: 500 },
  identityCard: {
    background: "linear-gradient(135deg,rgba(124,77,255,0.1),rgba(74,20,140,0.15))",
    border: "1px solid rgba(124,77,255,0.2)",
    borderRadius: 16,
    padding: 18,
    textAlign: "center",
    backdropFilter: "blur(18px)",
  },
  idLabel: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#b48bff",
    marginBottom: 10,
    fontWeight: 600,
  },
  idRow: { display: "flex", justifyContent: "space-between", padding: "4px 0" },
  idKey: { fontSize: 10, color: "rgba(240,234,255,0.45)" },
  idVal: { fontSize: 10, color: "#f0eaff", fontWeight: 500 },
  errorMsg: {
    background: "rgba(255,80,80,0.08)",
    border: "1px solid rgba(255,80,80,0.2)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 11,
    color: "#ff8a80",
    marginTop: 8,
  },
  apiNote: { fontSize: 9, color: "rgba(240,234,255,0.45)", textAlign: "center", marginTop: 8, letterSpacing: 0.5 },
};

/* ── Component ── */
export default function CarPricePredictor() {
  const [form, setForm] = useState(initialForm);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { priceUSD, priceRibu, demo }
  const [submitted, setSubmitted] = useState(null); // snapshot of form at prediction time
  const [error, setError] = useState("");

  // ── Metadata (edit these) ──
  const NAMA = "Rakha Fadhillah Anwar";
  const NPM  = "237006062";

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePredict = async () => {
    setError("");
    const allFilled = FIELDS.every((f) => form[f.key] !== "" && !isNaN(parseFloat(form[f.key])));
    if (!allFilled) { setError("⚠ Harap isi semua field terlebih dahulu."); return; }

    const payload = Object.fromEntries(FIELDS.map((f) => [f.key, parseFloat(form[f.key])]));
    setSubmitted({ ...payload });
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult({ priceUSD: data.harga_usd, demo: false });
    } catch {
      // Demo fallback
      const demo =
        Math.round(
          (payload.Engine_size * 3200 + payload.Horsepower * 85 + payload.Curb_weight * 2.1) / 100
        ) * 100;
      setResult({ priceUSD: demo, demo: true });
      setError("ℹ Backend offline — menampilkan estimasi demo lokal.");
    } finally {
      setLoading(false);
    }
  };

  const fmtUSD = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmtIDR = (n) => `≈ IDR ${Math.round(n * 16300).toLocaleString("id-ID")}`;

  return (
    <div style={S.body}>
      {/* Ambient blobs */}
      <div style={S.blob("-120px", "-150px", undefined, undefined, "rgba(124,77,255,0.18)", "500px")} />
      <div style={S.blob(undefined, undefined, "0", "-100px", "rgba(180,140,255,0.12)", "400px")} />
      <div style={S.blob("50%", "40%", undefined, undefined, "rgba(74,20,140,0.25)", "300px")} />

      <header style={S.header}>
        <div style={S.brand}>Data Science</div>
        <h1 style={S.h1}>Prediksi Harga Mobil</h1>
        <p style={S.subtitle}>Masukkan spesifikasi kendaraan untuk estimasi harga</p>
      </header>

      <div style={S.layout}>
        {/* LEFT — Input */}
        <div style={S.glass}>
          <div style={S.panelTitle}>
            Parameter Input
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {FIELDS.map((f) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={S.fieldLabel}>{f.label} ({f.unit})</label>
              <input
                type="number"
                step={f.step}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                onFocus={() => setFocused(f.key)}
                onBlur={() => setFocused(null)}
                style={S.input(focused === f.key)}
              />
            </div>
          ))}

          <button style={S.btn(loading)} onClick={handlePredict} disabled={loading}>
            {loading ? "Menghitung..." : "Hitung Harga Mobil"}
          </button>

          {error && <div style={S.errorMsg}>{error}</div>}
          <div style={S.apiNote}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 6px #4caf50", marginRight: 6, verticalAlign: "middle" }} />
            Terhubung ke FastAPI Backend · /predict
          </div>
        </div>

        {/* RIGHT — Results */}
        <div>
          {/* Price card */}
          <div style={S.priceCard}>
            <div style={S.priceLabel}>Perkiraan Harga Mobil</div>
            <div style={S.priceValue}>
              {result ? fmtUSD(result.priceUSD) : "—"}
            </div>
            <div style={S.priceSub}>
              {result ? (result.demo ? "[Demo] estimasi lokal" : fmtIDR(result.priceUSD)) : "Masukkan data untuk prediksi"}
            </div>
          </div>

          {/* Variables summary */}
          <div style={S.varsCard}>
            <div style={S.varsTitle}>Ringkasan Variabel</div>
            {FIELDS.map((f, i) => (
              <div key={f.key} style={{ ...S.varRow, ...(i === FIELDS.length - 1 ? { borderBottom: "none" } : {}) }}>
                <span style={S.varName}>{f.label}</span>
                <span style={S.varVal}>{submitted ? `${submitted[f.key]} ${f.unit}` : "—"}</span>
              </div>
            ))}
          </div>

          {/* Identity */}
          <div style={S.identityCard}>
            <div style={S.idLabel}>Sistem Ini Dibuat Oleh</div>
            <div style={S.idRow}><span style={S.idKey}>Nama</span><span style={S.idVal}>{NAMA}</span></div>
            <div style={S.idRow}><span style={S.idKey}>NPM</span><span style={S.idVal}>{NPM}</span></div>
            <div style={S.idRow}><span style={S.idKey}>Prodi</span><span style={S.idVal}>Informatika · Unsil</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
