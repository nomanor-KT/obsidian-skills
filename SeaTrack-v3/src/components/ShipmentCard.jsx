import { memo } from "react";
import { STATUS_CFG, THEME } from "../constants/index.js";
import { formatPositionForCard } from "../utils/shipment.js";
import { DragHandle } from "./ui/DragHandle.jsx";
import { PinIcon } from "./ui/PinIcon.jsx";
import { OperationalToggle } from "./ui/OperationalToggle.jsx";

export const ShipmentCard = memo(function ShipmentCard({
  shipment, isDragging, onSelect, onHandleMouseDown,
  onToggleFlag, onToggleSelection, isSelected, docCount,
  onSyncCard, isSyncing,
}) {
  const cfg = STATUS_CFG[shipment.status] || STATUS_CFG.booked;
  const isUrgent = shipment.daysToEta !== null && shipment.daysToEta <= 3 && shipment.status !== "gone_out";
  const autoMovedUntilTs = shipment.autoMovedUntil ? Date.parse(shipment.autoMovedUntil) : 0;
  const isAutoMovedGlow = Number.isFinite(autoMovedUntilTs) && autoMovedUntilTs > Date.now();
  const assigneeName = (shipment.assignee || "").split(",")[0] || "—";
  const formattedPosition = formatPositionForCard(shipment.position);
  const showCustomsToggle = shipment.status === "customs";
  const showDeliveredToggle = shipment.status === "gone_out";

  return (
    <div
      className={`shipment-card${isDragging ? " is-dragging" : ""}`}
      onDoubleClick={e => { e.stopPropagation(); onToggleSelection(shipment.id); }}
      onClick={() => onSelect(shipment)}
      style={{
        background: isAutoMovedGlow ? `linear-gradient(180deg, ${THEME.brand.accentSoft} 0%, ${THEME.surface.card} 56%)` : THEME.surface.card,
        borderRadius: "9px", padding: "10px 12px",
        borderTop: `1px solid ${THEME.border.default}`, borderRight: `1px solid ${THEME.border.default}`,
        borderBottom: `1px solid ${THEME.border.default}`,
        borderLeft: `3px solid ${isAutoMovedGlow ? THEME.state.danger : cfg.color}`,
        cursor: "pointer",
        transition: "transform 0.14s ease, box-shadow 0.15s, opacity 0.15s, background-color 0.1s",
        position: "relative", opacity: isDragging ? 0.35 : 1,
        userSelect: "none", WebkitUserSelect: "none",
        boxShadow: isAutoMovedGlow
          ? "0 0 0 1px #E9A4B0, 0 0 18px rgba(196, 18, 47, 0.24)"
          : isSelected
            ? `0 0 0 2px ${THEME.brand.accent}, 0 6px 14px rgba(16, 38, 62, 0.12)`
            : "0 1px 0 rgba(16, 38, 62, 0.05), 0 6px 14px rgba(16, 38, 62, 0.08)",
        backgroundColor: isSelected ? "#F8F1F3" : undefined,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 48px", columnGap: "8px", alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span
              onMouseDown={e => onHandleMouseDown(e, shipment)}
              onClick={e => e.stopPropagation()}
              title="Przeciągnij, aby zmienić status"
              style={{ cursor: "grab", padding: "2px 1px", display: "flex", alignItems: "center" }}
            >
              <DragHandle />
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: THEME.text.primary }}>{shipment.id || "—"}</span>
          </div>
          {formattedPosition
            ? <div style={{ fontSize: "9px", color: THEME.text.secondary, marginBottom: "4px", lineHeight: 1.25, wordBreak: "break-all" }}>
                <span style={{ fontWeight: 700, color: THEME.text.secondary }}>Position:</span> {formattedPosition}
              </div>
            : null}
          <div style={{ fontSize: "11px", fontWeight: 600, color: THEME.text.primary, marginBottom: "2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shipment.client || "—"}
          </div>
          <div style={{ fontSize: "10px", color: THEME.text.secondary, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shipment.route || "—"}
          </div>
          {shipment.descr
            ? <div style={{ fontSize: "9px", color: THEME.text.muted, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shipment.descr}</div>
            : null}
          <div style={{ fontSize: "9px", color: THEME.text.secondary, marginBottom: "2px", lineHeight: 1.25, wordBreak: "break-all" }}>
            <span style={{ fontWeight: 700, color: THEME.text.secondary }}>HBL:</span> {shipment.bl || "-"}
          </div>
          <div style={{ fontSize: "9px", color: THEME.text.secondary, marginBottom: "4px", lineHeight: 1.25, wordBreak: "break-all" }}>
            <span style={{ fontWeight: 700, color: THEME.text.secondary }}>MBL:</span> {shipment.mbl || "-"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9px", color: THEME.text.muted, paddingTop: "4px", borderTop: `1px solid ${THEME.surface.muted}` }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {assigneeName}
              {onSyncCard && (shipment.container || shipment.bl || shipment.trackingRef) && (
                <button
                  onClick={e => { e.stopPropagation(); onSyncCard(shipment.id); }}
                  disabled={isSyncing}
                  title="Odśwież tracking tej przesyłki"
                  style={{ padding: "0 3px", borderRadius: "3px", fontSize: "9px", cursor: isSyncing ? "not-allowed" : "pointer", border: `1px solid ${THEME.border.strong}`, background: isSyncing ? THEME.surface.muted : THEME.surface.card, color: isSyncing ? THEME.text.muted : THEME.text.secondary, lineHeight: "14px", display: "inline-flex", alignItems: "center" }}
                >
                  {isSyncing ? "…" : "↻"}
                </button>
              )}
            </span>
            <span style={{ fontWeight: 700, color: isUrgent ? THEME.state.danger : shipment.daysToEta === null ? THEME.text.muted : THEME.text.secondary }}>
              {shipment.daysToEta === null ? "brak ETA" : shipment.daysToEta <= 0 ? "Przybył" : `ETA ${shipment.daysToEta}d`}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", paddingTop: "1px" }}>
          {shipment.pinned ? <div style={{ marginBottom: "1px" }}><PinIcon filled /></div> : <div style={{ height: "13px" }} />}
          {showCustomsToggle
            ? <OperationalToggle label="c/c" checked={Boolean(shipment.customsCleared)} onToggle={() => onToggleFlag(shipment.id, "customsCleared", shipment.customsCleared)} />
            : null}
          {showDeliveredToggle
            ? <OperationalToggle label="DEL" checked={Boolean(shipment.delivered)} onToggle={() => onToggleFlag(shipment.id, "delivered", shipment.delivered)} />
            : null}
          {docCount > 0
            ? <button
                onClick={e => { e.stopPropagation(); onSelect(shipment); }}
                title="Otworz panel i sekcje dokumentow"
                style={{ fontSize: "9px", fontWeight: 700, color: THEME.brand.primarySoft, background: "#EAF2FB", border: "1px solid #AFC7E1", borderRadius: "4px", padding: "1px 5px", display: "flex", alignItems: "center", gap: "2px", cursor: "pointer" }}>
                📎 {docCount}
              </button>
            : null}
          {isSelected && (
            <div style={{ width: "16px", height: "16px", borderRadius: "3px", border: `1.5px solid ${THEME.brand.accent}`, background: THEME.brand.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: THEME.text.onDark, fontWeight: 700, cursor: "pointer", pointerEvents: "auto" }}>
              ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
