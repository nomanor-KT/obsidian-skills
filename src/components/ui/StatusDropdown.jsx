import { STATUS_CFG, STAGES } from "../../constants/index.js";

export const StatusDropdown = ({ current, onChange, disabled = false }) => (
  <select
    value={current}
    onChange={e => onChange(e.target.value)}
    onClick={e => e.stopPropagation()}
    disabled={disabled}
    style={{
      padding: "4px 8px", borderRadius: "8px",
      border: `1px solid ${STATUS_CFG[current].ring}`,
      background: STATUS_CFG[current].bg, color: STATUS_CFG[current].color,
      fontSize: "10px", fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      outline: "none", textTransform: "uppercase",
      opacity: disabled ? 0.75 : 1,
    }}
  >
    {STAGES.map(s => (
      <option key={s} value={s}>{STATUS_CFG[s].icon} {STATUS_CFG[s].label}</option>
    ))}
  </select>
);
