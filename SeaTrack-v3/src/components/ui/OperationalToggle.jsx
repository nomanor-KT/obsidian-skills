import { THEME } from "../../constants/index.js";

export const OperationalToggle = ({ label, checked, onToggle }) => (
  <div
    onClick={e => e.stopPropagation()}
    onDoubleClick={e => { e.stopPropagation(); onToggle(); }}
    title="Double click aby zmienic"
    style={{
      display: "flex", alignItems: "center", gap: "5px",
      minWidth: "42px", fontSize: "9px", fontWeight: 700,
      color: checked ? THEME.state.success : THEME.text.muted,
      cursor: "pointer", userSelect: "none",
      padding: "1px 3px", borderRadius: "4px",
      background: checked ? "#EAF7F0" : THEME.surface.muted,
      border: `1px solid ${checked ? "#A9D9BF" : THEME.border.default}`,
    }}
  >
    <span style={{
      width: "10px", height: "10px", borderRadius: "2px",
      border: `1px solid ${checked ? THEME.state.success : THEME.border.strong}`,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: "8px", lineHeight: 1, color: THEME.state.success, background: THEME.surface.card,
    }}>
      {checked ? "✓" : ""}
    </span>
    <span>{label}</span>
  </div>
);
