import { STATUS_CFG, STAGES, THEME } from "../constants/index.js";
import { ShipmentCard } from "./ShipmentCard.jsx";

export function KanbanView({ kanbanItems, dragStatus, dropTarget, selectedShipments, setSelectedShipments, onSelect, onHandleMouseDown, onToggleFlag, onToggleSelection, docCounts, onSyncCard, syncingIds }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, minmax(200px, 1fr))`, gap: "8px", padding: "0 20px 20px", overflowX: "auto", minHeight: "400px", width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
      {STAGES.map(stage => {
        const cfg = STATUS_CFG[stage];
        const items = kanbanItems.filter(s => s.status === stage);
        const isOver = dropTarget === stage && dragStatus;
        const allColSelected = items.length > 0 && items.every(s => selectedShipments.has(s.id));

        return (
          <div key={stage} data-stage={stage} style={{ transition: "all 0.15s" }}>
            <div data-stage={stage} style={{ display: "flex", alignItems: "center", gap: "6px", height: "58px", padding: "8px 10px", marginBottom: "6px", borderRadius: "7px", background: isOver ? cfg.color + "20" : cfg.bg, border: `1px solid ${isOver ? cfg.color : cfg.ring}`, transition: "all 0.15s", boxShadow: isOver ? `0 0 0 2px ${cfg.color}30` : "none" }}>
              <span style={{ fontSize: "13px" }}>{cfg.icon}</span>
              <span style={{ flex: 1, minWidth: 0, fontSize: "11px", fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "normal", overflowWrap: "anywhere", lineHeight: 1.2, display: "block" }}>{cfg.label}</span>
              <span
                onClick={() => {
                  if (!items.length) return;
                  const colIds = items.map(s => s.id);
                  setSelectedShipments(prev => {
                    const next = new Set(prev);
                    if (allColSelected) colIds.forEach(id => next.delete(id));
                    else colIds.forEach(id => next.add(id));
                    return next;
                  });
                }}
                title={items.length ? `Zaznacz / odznacz wszystkie: ${cfg.label}` : ""}
                style={{ marginLeft: "auto", background: allColSelected ? THEME.brand.accent : cfg.color, color: THEME.text.onDark, borderRadius: "9px", padding: "0 6px", fontSize: "10px", fontWeight: 700, lineHeight: "18px", cursor: items.length ? "pointer" : "default", userSelect: "none", transition: "background 0.15s" }}
              >
                {items.length}
              </span>
            </div>
            <div data-stage={stage} style={{ display: "flex", flexDirection: "column", gap: "6px", minHeight: "60px", borderRadius: "7px", padding: "0", background: "transparent", border: "2px dashed transparent", transition: "all 0.15s" }}>
              {items.map(s => (
                <ShipmentCard
                  key={s.id}
                  shipment={s}
                  isDragging={dragStatus === s.id}
                  onSelect={onSelect}
                  onHandleMouseDown={onHandleMouseDown}
                  onToggleFlag={onToggleFlag}
                  onToggleSelection={onToggleSelection}
                  isSelected={selectedShipments.has(s.id)}
                  docCount={docCounts[s.id] || 0}
                  onSyncCard={onSyncCard}
                  isSyncing={syncingIds?.has(s.id) || false}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
