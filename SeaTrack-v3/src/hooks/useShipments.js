import { useState, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import { SHIPMENT_OVERRIDE_FIELDS } from "../constants/index.js";
import { parseTranssoft, daysFromNow } from "../utils/parse.js";
import { deriveShipmentOfficeId, normalizeStatus, deriveTimelineStatus } from "../utils/shipment.js";
import { loadShipmentOverrides, saveShipmentOverrides } from "../utils/storage.js";
import { postShipmentAudit } from "../utils/api.js";

export function useShipments() {
  const [shipments, setShipments] = useState([]);
  const [importStats, setImportStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [docCounts, setDocCounts] = useState({});

  const updateDocCount = useCallback((shipmentId, count) => {
    setDocCounts(prev => ({ ...prev, [shipmentId]: count }));
  }, []);

  const updateStatus = useCallback((id, newStatus, options = {}) => {
    let previousShipment = null;
    let updatedShipment = null;
    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      previousShipment = s;
      updatedShipment = { ...s, status: newStatus };
      return updatedShipment;
    }));
    setSelected(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
    if (!options.skipAudit && previousShipment && updatedShipment && previousShipment.status !== newStatus) {
      postShipmentAudit({
        shipmentId: id,
        officeId: updatedShipment.officeId,
        action: "status-change",
        field: "status",
        previousValue: previousShipment.status,
        nextValue: newStatus,
        summary: `Status zmieniono z ${previousShipment.status} na ${newStatus}`,
      });
    }
  }, []);

  const togglePin = useCallback((id, options = {}) => {
    let previousShipment = null;
    let updatedShipment = null;
    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      previousShipment = s;
      updatedShipment = { ...s, pinned: !s.pinned };
      return updatedShipment;
    }));
    setSelected(prev => prev && prev.id === id ? { ...prev, pinned: !prev.pinned } : prev);
    if (!options.skipAudit && previousShipment && updatedShipment) {
      postShipmentAudit({
        shipmentId: id,
        officeId: updatedShipment.officeId,
        action: updatedShipment.pinned ? "pin-added" : "pin-removed",
        field: "pinned",
        previousValue: previousShipment.pinned,
        nextValue: updatedShipment.pinned,
        summary: updatedShipment.pinned ? "Przesylka zostala przypieta" : "Przesylka zostala odpieta",
      });
    }
  }, []);

  const updateField = useCallback((id, field, value, options = {}) => {
    let previousShipment = null;
    let updatedShipment = null;
    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      previousShipment = s;
      const updated = { ...s, [field]: value };
      if (field === "eta") updated.daysToEta = daysFromNow(value);
      if (field === "position" || field === "officeId") updated.officeId = deriveShipmentOfficeId(updated);
      updatedShipment = updated;
      return updated;
    }));
    setSelected(prev => {
      if (!prev || prev.id !== id) return prev;
      const updated = { ...prev, [field]: value };
      if (field === "eta") updated.daysToEta = daysFromNow(value);
      if (field === "position" || field === "officeId") updated.officeId = deriveShipmentOfficeId(updated);
      return updated;
    });
    if (!options.skipAudit && previousShipment && updatedShipment && previousShipment[field] !== value) {
      postShipmentAudit({
        shipmentId: id,
        officeId: updatedShipment.officeId,
        action: "field-update",
        field,
        previousValue: previousShipment[field],
        nextValue: value,
        summary: `Zmieniono pole ${field}`,
      });
    }
  }, []);

  const toggleOperationalFlag = useCallback((id, field, current) => {
    updateField(id, field, !current);
  }, [updateField]);

  const handleFile = useCallback(async (file) => {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    const parsed = parseTranssoft(rows);
    const overrides = loadShipmentOverrides();

    const merged = parsed.map(shipment => {
      const override = overrides[shipment.id];
      if (!override) return shipment;
      const next = { ...shipment, ...override };
      const mergedStatus = normalizeStatus(override.status || shipment.status);
      next.status = deriveTimelineStatus({
        eta: next.eta,
        etd: next.etd,
        previousStatus: mergedStatus,
        preserveManualCustoms: Boolean(next.customsCleared),
        preserveManualGoneOut: Boolean(next.delivered),
        today: new Date(),
      });
      next.daysToEta = daysFromNow(next.eta);
      next.officeId = deriveShipmentOfficeId(next);
      return next;
    });

    setShipments(merged);
    setImportStats({
      total: merged.length,
      archived: merged.filter(s => s.tseStatus != null && s.tseStatus >= 92).length,
      operators: [...new Set(merged.map(s => s.assignee))].filter(Boolean),
      origins: [...new Set(merged.map(s => s.fromRegion).filter(Boolean))],
    });
  }, []);

  const resetImport = useCallback(() => {
    setShipments([]);
    setImportStats(null);
    setSelected(null);
  }, []);

  // Persist overrides to localStorage on every shipments change
  useEffect(() => {
    if (!shipments.length) return;
    const overrides = {};
    for (const shipment of shipments) {
      const row = {};
      for (const field of SHIPMENT_OVERRIDE_FIELDS) {
        row[field] = field === "status" ? normalizeStatus(shipment[field]) : shipment[field];
      }
      overrides[shipment.id] = row;
    }
    saveShipmentOverrides(overrides);
  }, [shipments]);

  return {
    shipments,
    setShipments,
    importStats,
    selected,
    setSelected,
    docCounts,
    updateDocCount,
    updateStatus,
    togglePin,
    updateField,
    toggleOperationalFlag,
    handleFile,
    resetImport,
  };
}
