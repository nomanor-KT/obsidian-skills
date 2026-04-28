import { ShipIcon } from "./ui/ShipIcon.jsx";
import { THEME } from "../constants/index.js";

export function UploadScreen({ onFile }) {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: THEME.surface.dark, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.text.onDark }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <div style={{ width: "56px", height: "56px", background: `linear-gradient(135deg, ${THEME.brand.primarySoft}, ${THEME.brand.accent})`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: THEME.text.onDark }}>
          <ShipIcon />
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.02em" }}>SeaTrack</h1>
        <p style={{ color: "#9DB0C4", fontSize: "13px", marginBottom: "32px" }}>Zaimportuj eksport z Transsoft (XLSX) — dashboard zbuduje się automatycznie</p>

        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => { e.currentTarget.style.borderColor = THEME.brand.accent; }}
          onDragLeave={e => { e.currentTarget.style.borderColor = "#38536F"; }}
          onClick={() => document.getElementById("fileInput").click()}
          style={{ border: "2px dashed #38536F", borderRadius: "16px", padding: "48px 32px", background: "#1A334C", cursor: "pointer", transition: "all 0.2s" }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📂</div>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Przeciągnij plik XLSX tutaj</div>
          <div style={{ fontSize: "12px", color: "#9DB0C4" }}>lub kliknij aby wybrać</div>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }}
          />
        </div>

        <div style={{ marginTop: "24px", padding: "16px", background: "#1A334C", borderRadius: "10px", textAlign: "left" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9DB0C4", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Mapowanie kolumn Transsoft → SeaTrack</div>
          <div style={{ fontSize: "11px", color: "#C2CFDD", lineHeight: 1.8 }}>
            STN → ID &nbsp;|&nbsp; Consignee → Klient &nbsp;|&nbsp; From/To Terminal → Trasa<br/>
            ETD/ETA → Daty &nbsp;|&nbsp; TEU → Typ kontenera &nbsp;|&nbsp; Operator → Spedytor<br/>
            CID → Nr kontenera &nbsp;|&nbsp; Freightdoc → B/L<br/>
            Status operacyjny → <span style={{ color: "#F1C58D" }}>automatycznie wyliczany z dat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
