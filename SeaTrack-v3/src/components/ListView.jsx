import { THEME } from "../constants/index.js";
import { StatusDropdown } from "./ui/StatusDropdown.jsx";
import { PinIcon } from "./ui/PinIcon.jsx";

export function ListView({ filtered, onSelect, updateStatus, togglePin }) {
  return (
    <div style={{ padding: "0 20px 20px" }}>
      <div style={{ background: THEME.surface.card, borderRadius: "10px", border: `1px solid ${THEME.border.default}`, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", minWidth: "900px" }}>
          <thead>
            <tr style={{ background: THEME.surface.muted, borderBottom: `2px solid ${THEME.border.default}` }}>
              {["", "ID", "Klient", "Towar", "Trasa", "Status", "ETA", "Spedytor", "Kontener"].map(h => (
                <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontSize: "9px", fontWeight: 700, color: THEME.text.secondary, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const isUrgent = s.daysToEta !== null && s.daysToEta <= 3 && s.status !== "gone_out";
              return (
                <tr
                  key={s.id}
                  onClick={() => onSelect(s)}
                  style={{ borderBottom: `1px solid ${THEME.border.default}`, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = THEME.surface.muted}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "8px 4px 8px 10px", width: "20px" }}>
                    <span onClick={e => { e.stopPropagation(); togglePin(s.id); }} style={{ cursor: "pointer" }}>
                      <PinIcon filled={s.pinned} />
                    </span>
                  </td>
                  <td style={{ padding: "8px 10px", fontWeight: 700, color: THEME.text.primary, whiteSpace: "nowrap" }}>{s.id}</td>
                  <td style={{ padding: "8px 10px", fontWeight: 500, color: THEME.text.primary, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.client}</td>
                  <td style={{ padding: "8px 10px", color: THEME.text.muted, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.descr || "—"}</td>
                  <td style={{ padding: "8px 10px", color: THEME.text.secondary, whiteSpace: "nowrap" }}>{s.route}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <StatusDropdown current={s.status} onChange={v => updateStatus(s.id, v)} />
                  </td>
                  <td style={{ padding: "8px 10px", fontWeight: 600, color: isUrgent ? THEME.state.danger : s.daysToEta === null ? THEME.border.strong : THEME.text.primary, whiteSpace: "nowrap" }}>
                    {s.eta || "—"} {s.daysToEta !== null && s.daysToEta >= 0 && <span style={{ fontSize: "9px", opacity: 0.7 }}>({s.daysToEta}d)</span>}
                  </td>
                  <td style={{ padding: "8px 10px", color: THEME.text.secondary, whiteSpace: "nowrap" }}>{s.assignee.split(",")[0]}</td>
                  <td style={{ padding: "8px 10px", color: THEME.text.muted, whiteSpace: "nowrap", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>{s.container || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
