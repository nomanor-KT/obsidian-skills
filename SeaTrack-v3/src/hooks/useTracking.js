import { useState, useCallback, useRef, useEffect } from "react";
import { AUTO_MOVE_HIGHLIGHT_MS } from "../constants/index.js";
import { parseDate, daysFromNow } from "../utils/parse.js";
import { apiFetch } from "../utils/api.js";

const trackingAutoSyncEnabled = String(import.meta.env.VITE_TRACKING_AUTO_SYNC_ENABLED || "false").toLowerCase() === "true";

const mergeNewerDate = (currentValue, incomingValue) => {
  const current = parseDate(currentValue);
  const incoming = parseDate(incomingValue);
  if (!incoming) return currentValue || "";
  if (!current) return incoming;
  return incoming > current ? incoming : current;
};

function msUntilNextNoon() {
  const now = new Date();
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (noon <= now) noon.setDate(noon.getDate() + 1);
  return noon.getTime() - now.getTime();
}

export function useTracking({ shipments, setShipments, selected, setSelected }) {
  const [isTrackingSyncing, setIsTrackingSyncing] = useState(false);
  const [trackingNotice, setTrackingNotice] = useState("");
  const [syncingIds, setSyncingIds] = useState(new Set());
  const [nextSyncAt, setNextSyncAt] = useState(null);
  const shipmentsRef = useRef([]);
  const inFlightRef = useRef(false);

  useEffect(() => {
    shipmentsRef.current = shipments;
  }, [shipments]);

  const runTrackingSync = useCallback(async ({ source = "manual", shipmentIds = null } = {}) => {
    const current = shipmentsRef.current;
    let toSync = current
      .filter(s => s.container || s.bl || s.trackingRef)
      .map(s => ({
        id: s.id,
        officeId: s.officeId,
        status: s.status,
        etd: s.etd,
        eta: s.eta,
        container: s.container,
        bl: s.bl,
        trackingRef: s.trackingRef,
        carrierCode: s.carrierCode,
      }));

    if (shipmentIds) {
      toSync = toSync.filter(s => shipmentIds.includes(s.id));
    }

    if (!toSync.length) {
      if (source === "manual") {
        setTrackingNotice("Brak shipmentow z danymi trackingowymi do synchronizacji.");
      }
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsTrackingSyncing(true);

    try {
      const res = await apiFetch("/api/tracking/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipments: toSync }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Tracking sync failed (${res.status}).`);

      const updates = Array.isArray(data?.updates) ? data.updates : [];
      const updateById = new Map(updates.map(item => [item.id, item]));
      const nowIso = new Date().toISOString();

      setShipments(prev => prev.map(shipment => {
        const update = updateById.get(shipment.id);
        if (!update) return shipment;

        const nextEta = mergeNewerDate(shipment.eta, update.eta);
        const nextEtd = mergeNewerDate(shipment.etd, update.etd);
        const nextStatus = update.status || shipment.status;
        const statusChanged = nextStatus !== shipment.status;
        const next = {
          ...shipment,
          eta: nextEta,
          etd: nextEtd,
          status: nextStatus,
          daysToEta: daysFromNow(nextEta),
          trackingLastSyncAt: update.trackingLastSyncAt || nowIso,
          trackingSyncError: update.trackingSyncError || "",
        };
        if (statusChanged) {
          next.autoMovedUntil = new Date(Date.now() + AUTO_MOVE_HIGHLIGHT_MS).toISOString();
        }
        return next;
      }));

      if (selected?.id && updateById.has(selected.id)) {
        const update = updateById.get(selected.id);
        setSelected(prev => {
          if (!prev) return prev;
          const nextEta = mergeNewerDate(prev.eta, update.eta);
          const nextEtd = mergeNewerDate(prev.etd, update.etd);
          const nextStatus = update.status || prev.status;
          const next = {
            ...prev,
            eta: nextEta,
            etd: nextEtd,
            status: nextStatus,
            daysToEta: daysFromNow(nextEta),
            trackingLastSyncAt: update.trackingLastSyncAt || nowIso,
            trackingSyncError: update.trackingSyncError || "",
          };
          if (nextStatus !== prev.status) {
            next.autoMovedUntil = new Date(Date.now() + AUTO_MOVE_HIGHLIGHT_MS).toISOString();
          }
          return next;
        });
      }

      const changedCount = Number(data?.changedCount || 0);
      if (source === "manual") {
        setTrackingNotice(changedCount > 0
          ? `Tracking zsynchronizowany. Zmieniono ${changedCount} shipmentow.`
          : "Tracking zsynchronizowany. Brak zmian ETA/ETD/statusu.");
      }
    } catch (err) {
      if (source === "manual") {
        setTrackingNotice(`Tracking sync blad: ${String(err?.message || "nieznany")}`);
      }
    } finally {
      inFlightRef.current = false;
      setIsTrackingSyncing(false);
    }
  }, [selected?.id, setShipments, setSelected]);

  const syncSingleShipment = useCallback(async (id) => {
    if (inFlightRef.current) return;
    setSyncingIds(prev => new Set([...prev, id]));
    try {
      await runTrackingSync({ source: "manual-card", shipmentIds: [id] });
    } finally {
      setSyncingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  }, [runTrackingSync]);

  // Auto-sync: once on load, then every day at 12:00
  useEffect(() => {
    if (!trackingAutoSyncEnabled) {
      setNextSyncAt(null);
      return;
    }
    if (!shipments.length) return;
    runTrackingSync({ source: "auto-initial" });

    let timeoutId;
    function scheduleNextNoon() {
      const ms = msUntilNextNoon();
      setNextSyncAt(new Date(Date.now() + ms));
      timeoutId = setTimeout(() => {
        runTrackingSync({ source: "auto-noon" });
        scheduleNextNoon();
      }, ms);
    }
    scheduleNextNoon();

    return () => clearTimeout(timeoutId);
  }, [shipments.length, runTrackingSync]);

  return { isTrackingSyncing, trackingNotice, runTrackingSync, syncSingleShipment, syncingIds, nextSyncAt };
}
