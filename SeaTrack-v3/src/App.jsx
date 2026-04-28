import { useState, useMemo, useCallback, useEffect } from "react";
import { STATUS_CFG, STAGES, THEME } from "./constants/index.js";
import { canUserAccessOffice, isTechnicalShipment } from "./utils/shipment.js";
import { useShipments } from "./hooks/useShipments.js";
import { useTracking } from "./hooks/useTracking.js";
import { useDragDrop } from "./hooks/useDragDrop.js";
import { useBulkSelect } from "./hooks/useBulkSelect.js";
import { useAuth } from "./hooks/useAuth.js";
import { ShipIcon } from "./components/ui/ShipIcon.jsx";
import { KanbanView } from "./components/KanbanView.jsx";
import { ListView } from "./components/ListView.jsx";
import { UploadScreen } from "./components/UploadScreen.jsx";
import { BulkReportModal } from "./components/BulkReportModal.jsx";
import { DetailPanel } from "./components/DetailPanel.jsx";
import { LoginScreen } from "./components/LoginScreen.jsx";

export default function SeaTrackImporter() {
  const { user, authReady, authBusy, authError, login, logout, changePassword } = useAuth();
  const [viewMode, setViewMode] = useState("kanban");
  const [assigneeFilter, setAssigneeFilter] = useState("Wszyscy");
  const [problemFilter, setProblemFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [isDetailEditing, setIsDetailEditing] = useState(false);
  const [, setClockTick] = useState(Date.now());

  const {
    shipments, setShipments, importStats,
    selected, setSelected,
    docCounts, updateDocCount,
    updateStatus, togglePin, updateField, toggleOperationalFlag,
    handleFile, resetImport,
  } = useShipments();

  const { isTrackingSyncing, trackingNotice, runTrackingSync, syncSingleShipment, syncingIds, nextSyncAt } = useTracking({
    shipments, setShipments, selected, setSelected,
  });

  const { dragStatus, dropTarget, handleHandleMouseDown, suppressClickRef } = useDragDrop({ setShipments });

  // Clock tick for "autoMovedGlow" TTL
  useEffect(() => {
    const timer = setInterval(() => setClockTick(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Kanban can be horizontally scrollable; reset x-scroll when switching views.
  useEffect(() => {
    window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });
  }, [viewMode]);

  const openDetails = useCallback((shipment) => {
    if (shipment.autoMovedUntil) {
      updateField(shipment.id, "autoMovedUntil", "", { skipAudit: true });
    }
    setSelected({ ...shipment, autoMovedUntil: "" });
    setIsDetailEditing(false);
  }, [setSelected, updateField]);

  const handleCardSelect = useCallback((shipment) => {
    if (suppressClickRef.current) return;
    openDetails(shipment);
  }, [openDetails, suppressClickRef]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const visibleShipments = useMemo(() => {
    if (!user) return [];
    return shipments.filter((shipment) => canUserAccessOffice(user, shipment.officeId));
  }, [shipments, user]);

  const {
    selectedShipments, setSelectedShipments, toggleShipmentSelection,
    getSelectedShipmentDetails, sendBulkReport, clearSelection,
    showBulkModal, setShowBulkModal, bulkModalEmail, setBulkModalEmail,
  } = useBulkSelect({ shipments: visibleShipments });

  const operators = useMemo(() =>
    ["Wszyscy", ...new Set(visibleShipments.map(s => s.assignee).filter(Boolean))],
    [visibleShipments],
  );

  const filtered = useMemo(() => {
    let items = visibleShipments;
    if (problemFilter === "active") {
      items = items.filter(s => {
        const tse = Number(s.tseStatus);
        return tse !== 98 && tse !== 99;
      });
    }
    if (assigneeFilter !== "Wszyscy") items = items.filter(s => s.assignee === assigneeFilter);
    if (problemFilter === "urgent") items = items.filter(s => s.daysToEta !== null && s.daysToEta <= 3 && s.status !== "gone_out");
    else if (problemFilter === "arrived") items = items.filter(s => s.status === "arrived");
    else if (problemFilter === "noeta") items = items.filter(s => !s.eta);
    if (search) {
      const q = search.toLowerCase();
      const f = v => String(v || "").toLowerCase().includes(q);
      items = items.filter(s =>
        f(s.id) || f(s.stn) || f(s.client) || f(s.shipper) || f(s.route) ||
        f(s.descr) || f(s.container) || f(s.bl) || f(s.mbl) || f(s.position) ||
        f(s.assignee) || f(s.salesManager) || f(s.vessel) || f(s.trackingRef) ||
        f(s.eta) || f(s.etd) || f(s.notes),
      );
    }
    return items.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [visibleShipments, assigneeFilter, problemFilter, search]);

  const kanbanItems = useMemo(
    () => filtered.filter(s => !isTechnicalShipment(s)),
    [filtered],
  );

  if (!authReady) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', -apple-system, sans-serif", color: THEME.text.secondary, background: THEME.surface.page }}>Ladowanie aplikacji...</div>;
  }

  if (!user || user.mustChangePassword) {
    return <LoginScreen user={user} authBusy={authBusy} authError={authError} onLogin={login} onChangePassword={changePassword} />;
  }

  if (shipments.length === 0) {
    return <UploadScreen onFile={handleFile} />;
  }

  const allKanbanSelected = kanbanItems.length > 0 && kanbanItems.every(s => selectedShipments.has(s.id));

  return (
    <div style={{ fontFamily: "'DM Sans', -apple-system, sans-serif", background: THEME.surface.page, minHeight: "100vh", color: THEME.text.primary, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #B8C5D3; border-radius: 3px; }
        button, input, select, textarea { border-radius: 6px; }
        button:not(:disabled) { transition: filter 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease; }
        button:not(:disabled):hover { filter: brightness(0.97); }
        input, select, textarea { transition: border-color 0.16s ease, box-shadow 0.16s ease; }
        button:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #C1122F !important;
          outline-offset: 1px;
          box-shadow: 0 0 0 3px rgba(193, 18, 47, 0.18) !important;
        }
        .shipment-card { will-change: transform; transform-origin: center; }
        .shipment-card:hover { transform: translateY(-1px) scale(1.012); }
        .shipment-card.is-dragging:hover { transform: none; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: THEME.surface.dark, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "30px", height: "30px", background: `linear-gradient(135deg, ${THEME.brand.primarySoft}, ${THEME.brand.accent})`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.text.onDark }}>
            <ShipIcon />
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: THEME.text.onDark }}>SeaTrack</div>
            <div style={{ fontSize: "9px", color: "#C2CFDD" }}>Zaimportowano: {importStats?.total} shipmentów z Transsoft{importStats?.archived > 0 ? ` · ${importStats.archived} ukrytych (status ≥92)` : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginLeft: "auto" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: THEME.text.onDark, fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: "9px", color: "#C2CFDD" }}>{Array.isArray(user.offices) && user.offices.includes("*") ? "Wszystkie biura" : `Biura: ${user.offices.join(", ")}`}</div>
          </div>
          <button onClick={logout} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, cursor: "pointer", background: THEME.brand.primary, color: THEME.text.onDark, border: `1px solid ${THEME.border.strong}` }}>
            Wyloguj
          </button>
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {operators.map(name => (
            <button key={name} onClick={() => setAssigneeFilter(name)} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: assigneeFilter === name ? 700 : 400, cursor: "pointer", border: "none", background: assigneeFilter === name ? THEME.brand.accent : THEME.brand.primary, color: assigneeFilter === name ? THEME.text.onDark : "#C2CFDD" }}>
              {name === "Wszyscy" ? "Wszyscy" : name.split(",")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ padding: "12px 20px 4px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { label: "Wszystkie",   value: visibleShipments.length, color: THEME.text.secondary },
          { label: "Aktywne",     value: visibleShipments.filter(s => Number(s.tseStatus) !== 98 && Number(s.tseStatus) !== 99).length, color: THEME.brand.primarySoft },
          { label: "W tranzycie", value: kanbanItems.filter(s => s.status === "in_transit").length, color: "#2C5D8A" },
          { label: "Przybyłe",   value: kanbanItems.filter(s => s.status === "arrived").length, color: THEME.state.success },
          { label: "ETA ≤ 3d",   value: kanbanItems.filter(s => s.daysToEta !== null && s.daysToEta <= 3 && s.status !== "gone_out" && s.daysToEta >= 0).length, color: THEME.state.danger },
        ].map(stat => (
          <div key={stat.label} style={{ flex: "1 1 120px", background: THEME.surface.card, borderRadius: "9px", padding: "10px 14px", border: `1px solid ${THEME.border.default}` }}>
            <div style={{ fontSize: "9px", color: THEME.text.secondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{stat.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div style={{ padding: "8px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
          {[
            { key: "active",  label: "Aktywne" },
            { key: "all",     label: "Wszystkie" },
            { key: "urgent",  label: "🔥 ETA ≤ 3d" },
            { key: "arrived", label: "⚓ Przybyłe" },
            { key: "noeta",   label: "❓ Brak ETA" },
          ].map(f => (
            <button key={f.key} onClick={() => setProblemFilter(f.key)} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: problemFilter === f.key ? 700 : 400, cursor: "pointer", background: problemFilter === f.key ? THEME.brand.primary : THEME.surface.card, color: problemFilter === f.key ? THEME.text.onDark : THEME.text.secondary, border: `1px solid ${problemFilter === f.key ? THEME.brand.primary : THEME.border.strong}` }}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="Szukaj..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "6px", border: `1px solid ${THEME.border.strong}`, fontSize: "11px", width: "170px", outline: "none", background: THEME.surface.card, color: THEME.text.primary }}
          />
          {viewMode === "kanban" && (
            <button
              onClick={() => setSelectedShipments(allKanbanSelected ? new Set() : new Set(kanbanItems.map(s => s.id)))}
              title="Zaznacz / odznacz wszystkie widoczne przesylki"
              style={{ padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", background: allKanbanSelected ? THEME.brand.accent : THEME.surface.card, color: allKanbanSelected ? THEME.text.onDark : THEME.text.secondary, border: `1px solid ${THEME.border.strong}` }}
            >
              ☑ Zaznacz grupę
            </button>
          )}
          <div style={{ display: "flex", background: THEME.surface.card, borderRadius: "6px", border: `1px solid ${THEME.border.strong}`, overflow: "hidden" }}>
            {[{ key: "kanban", label: "Kanban" }, { key: "list", label: "Lista" }].map(v => (
              <button key={v.key} onClick={() => setViewMode(v.key)} style={{ padding: "5px 10px", fontSize: "10px", fontWeight: viewMode === v.key ? 700 : 400, cursor: "pointer", border: "none", background: viewMode === v.key ? THEME.brand.primary : "transparent", color: viewMode === v.key ? THEME.text.onDark : THEME.text.secondary }}>{v.label}</button>
            ))}
          </div>
          <button
            onClick={() => runTrackingSync({ source: "manual" })}
            disabled={isTrackingSyncing}
            style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, cursor: isTrackingSyncing ? "not-allowed" : "pointer", background: isTrackingSyncing ? THEME.surface.muted : THEME.brand.accentSoft, color: isTrackingSyncing ? THEME.text.secondary : THEME.state.danger, border: `1px solid ${isTrackingSyncing ? THEME.border.strong : "#E9A4B0"}`, opacity: isTrackingSyncing ? 0.75 : 1 }}
          >
            {isTrackingSyncing ? "TRACKING SYNC..." : "TRACKING SYNC"}
          </button>
          <span style={{ fontSize: "10px", color: THEME.text.secondary, fontWeight: 600 }}>
            {nextSyncAt
              ? `AUTO: ${nextSyncAt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`
              : "AUTO: 12:00"}
          </span>
          <button onClick={resetImport} style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "10px", cursor: "pointer", background: THEME.surface.card, color: THEME.text.muted, border: `1px solid ${THEME.border.default}` }}>↻ Nowy import</button>
        </div>
      </div>

      <div style={{ padding: "0 20px 10px" }}>
        <div style={{ background: THEME.surface.card, border: `1px solid ${THEME.border.default}`, borderRadius: "8px", padding: "8px 10px", fontSize: "10px", color: THEME.text.secondary, fontWeight: 600 }}>
          Widzisz tylko przesylki przypisane do Twoich biur. Filtr "Wszyscy" oznacza wszystkich spedytorow z Twojego zespolu, a nie cala firme.
        </div>
      </div>

      {trackingNotice && (
        <div style={{ padding: "0 20px 10px" }}>
          <div style={{ background: THEME.surface.card, border: `1px solid ${THEME.border.default}`, borderRadius: "7px", padding: "8px 10px", fontSize: "10px", color: THEME.text.secondary, fontWeight: 600 }}>{trackingNotice}</div>
        </div>
      )}

      {/* BULK REPORT BAR */}
      {viewMode === "kanban" && (
        <div style={{ padding: "12px 20px", display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            onClick={() => {
              const sel = getSelectedShipmentDetails();
              if (sel.length > 0) { setBulkModalEmail(sel[0].clientEmail || ""); setShowBulkModal(true); }
            }}
            disabled={selectedShipments.size === 0}
            style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: selectedShipments.size === 0 ? "not-allowed" : "pointer", background: selectedShipments.size === 0 ? THEME.surface.muted : THEME.brand.accent, color: selectedShipments.size === 0 ? THEME.text.secondary : THEME.text.onDark, border: "none", opacity: selectedShipments.size === 0 ? 0.6 : 1 }}
          >
            Wyślij raport zbiorczy ({selectedShipments.size})
          </button>
          {selectedShipments.size > 0 && (
            <button onClick={clearSelection} style={{ padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, cursor: "pointer", background: THEME.brand.accentSoft, color: THEME.state.danger, border: "1px solid #E9A4B0" }}>
              ✕ Wyczyść zaznaczenie
            </button>
          )}
        </div>
      )}

      {showBulkModal && (
        <BulkReportModal
          selectedShipments={selectedShipments}
          getSelectedShipmentDetails={getSelectedShipmentDetails}
          bulkModalEmail={bulkModalEmail}
          setBulkModalEmail={setBulkModalEmail}
          onSend={sendBulkReport}
          onClose={() => setShowBulkModal(false)}
        />
      )}

      {viewMode === "kanban" ? (
        <KanbanView
          kanbanItems={kanbanItems}
          dragStatus={dragStatus}
          dropTarget={dropTarget}
          selectedShipments={selectedShipments}
          setSelectedShipments={setSelectedShipments}
          onSelect={handleCardSelect}
          onHandleMouseDown={handleHandleMouseDown}
          onToggleFlag={toggleOperationalFlag}
          onToggleSelection={toggleShipmentSelection}
          docCounts={docCounts}
          onSyncCard={syncSingleShipment}
          syncingIds={syncingIds}
        />
      ) : (
        <ListView
          filtered={filtered}
          onSelect={openDetails}
          updateStatus={updateStatus}
          togglePin={togglePin}
        />
      )}

      <DetailPanel
        selected={selected}
        isDetailEditing={isDetailEditing}
        setSelected={setSelected}
        setIsDetailEditing={setIsDetailEditing}
        updateStatus={updateStatus}
        updateField={updateField}
        togglePin={togglePin}
        updateDocCount={updateDocCount}
      />

      <div style={{ position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", background: THEME.surface.dark, color: "#9DB0C4", padding: "4px 12px", borderRadius: "14px", fontSize: "9px", fontWeight: 600 }}>
        SeaTrack v0.4 — Edytowalny dashboard + Transsoft XLSX parser
      </div>
    </div>
  );
}
