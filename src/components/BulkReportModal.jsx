import { STATUS_CFG, THEME } from "../constants/index.js";

export function BulkReportModal({ selectedShipments, getSelectedShipmentDetails, bulkModalEmail, setBulkModalEmail, onSend, onClose }) {
  const selected = getSelectedShipmentDetails();
  const clients = [...new Set(selected.map(s => s.client))];
  const hasMultipleClients = clients.length > 1;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: THEME.surface.card, borderRadius: "12px", padding: "24px", maxWidth: "520px", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 25px rgba(16,38,62,0.2)", border: `1px solid ${THEME.border.default}` }}>
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: THEME.text.primary, marginBottom: "8px" }}>Wyślij raport zbiorczy</h2>
          <p style={{ fontSize: "12px", color: THEME.text.secondary }}>Przesyłki: {selectedShipments.size}</p>
        </div>

        {hasMultipleClients && (
          <div style={{ background: "#FFF5E8", border: "1px solid #F1C58D", borderRadius: "8px", padding: "10px 12px", marginBottom: "16px", fontSize: "12px", color: "#8A5616" }}>
            ⚠️ <strong>Uwaga:</strong> Zaznaczono przesyłki dotyczące {clients.length} różnych odbiorców: {clients.join(", ")}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Odbiorcy</label>
          <div style={{ fontSize: "11px", color: THEME.text.primary, background: THEME.surface.muted, padding: "10px", borderRadius: "8px", border: `1px solid ${THEME.border.default}` }}>
            {clients.map(c => <div key={c}>{c}</div>)}
          </div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Email odbiorcy (do)</label>
          <input
            type="email"
            value={bulkModalEmail}
            onChange={e => setBulkModalEmail(e.target.value)}
            placeholder="email@example.com"
            style={{ width: "100%", padding: "9px 10px", borderRadius: "8px", border: `1px solid ${THEME.border.default}`, fontSize: "11px", outline: "none", boxSizing: "border-box", color: THEME.text.primary }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "10px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase", display: "block" }}>Podgląd przesyłek</label>
          <div style={{ background: THEME.surface.muted, border: `1px solid ${THEME.border.default}`, borderRadius: "8px", maxHeight: "240px", overflow: "auto" }}>
            <table style={{ width: "100%", fontSize: "10px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${THEME.border.default}`, background: "#E8EDF2" }}>
                  {["ID", "Status", "ETD", "ETA", "Kontener"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "left", fontWeight: 700, color: THEME.text.secondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.map(s => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${THEME.border.default}` }}>
                    <td style={{ padding: "6px 8px", color: THEME.text.primary, fontWeight: 600 }}>{s.id}</td>
                    <td style={{ padding: "6px 8px", color: THEME.text.primary }}>{STATUS_CFG[s.status]?.label || s.status}</td>
                    <td style={{ padding: "6px 8px", color: THEME.text.secondary }}>{s.etd || "—"}</td>
                    <td style={{ padding: "6px 8px", color: THEME.text.secondary }}>{s.eta || "—"}</td>
                    <td style={{ padding: "6px 8px", color: THEME.text.secondary, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.container || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, cursor: "pointer", background: THEME.surface.card, color: THEME.text.secondary, border: `1px solid ${THEME.border.strong}` }}>Anuluj</button>
          <button
            onClick={() => {
              if (!bulkModalEmail.trim()) { alert("Podaj email odbiorcy."); return; }
              onSend(bulkModalEmail);
            }}
            style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", background: THEME.brand.accent, color: THEME.text.onDark, border: "none" }}
          >
            Wyślij raport
          </button>
        </div>
      </div>
    </div>
  );
}
