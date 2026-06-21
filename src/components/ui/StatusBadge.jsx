import { STATUS_CFG } from "../../constants/index.js";

export const StatusBadge = ({ status }) => {
  const c = STATUS_CFG[status];
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.ring}`,
      padding: "3px 8px", borderRadius: "8px", fontSize: "10px",
      fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em",
      whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
};
