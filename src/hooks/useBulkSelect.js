import { useState, useCallback } from "react";
import { apiFetch } from "../utils/api.js";

export function useBulkSelect({ shipments }) {
  const [selectedShipments, setSelectedShipments] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkModalEmail, setBulkModalEmail] = useState("");

  const toggleShipmentSelection = useCallback((id) => {
    setSelectedShipments(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const getSelectedShipmentDetails = useCallback(() => {
    return Array.from(selectedShipments)
      .map(id => shipments.find(s => s.id === id))
      .filter(Boolean);
  }, [selectedShipments, shipments]);

  const sendBulkReport = useCallback(async (email) => {
    const selected = Array.from(selectedShipments)
      .map(id => shipments.find(s => s.id === id))
      .filter(Boolean);

    if (!selected.length) {
      alert("Brak zaznaczonych przesyłek.");
      return;
    }

    const ccEmails = new Set();
    for (const s of selected) {
      if (s.assigneeEmail) ccEmails.add(s.assigneeEmail);
      if (s.salesManagerEmail) ccEmails.add(s.salesManagerEmail);
    }

    const payload = {
      to: [email],
      cc: Array.from(ccEmails).filter(Boolean),
      subject: `Raport zbiorczy statusu przesyłek - ${new Date().toLocaleDateString("pl-PL")}`,
      shipments: selected.map(s => ({
        id: s.id, client: s.client, status: s.status,
        etd: s.etd, eta: s.eta, container: s.container, bl: s.bl,
        officeId: s.officeId,
      })),
    };

    try {
      const res = await apiFetch("/api/email/send-bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Bulk report send failed (${res.status}).`);
      alert("Raport zbiorczy wysłany pomyślnie!");
      setSelectedShipments(new Set());
      setShowBulkModal(false);
    } catch (err) {
      alert(`Błąd wysyłania raportu: ${err.message}`);
    }
  }, [selectedShipments, shipments]);

  const clearSelection = useCallback(() => setSelectedShipments(new Set()), []);

  return {
    selectedShipments,
    setSelectedShipments,
    toggleShipmentSelection,
    getSelectedShipmentDetails,
    sendBulkReport,
    clearSelection,
    showBulkModal,
    setShowBulkModal,
    bulkModalEmail,
    setBulkModalEmail,
  };
}
