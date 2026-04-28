import { useState, useCallback, useRef, useEffect } from "react";
import { STATUS_CFG, STAGES, THEME } from "../constants/index.js";
import { extractEmails } from "../utils/email.js";
import { buildShipmentStatusEmail, buildTransportOrderEmail } from "../utils/email.js";
import { openGeneratorWindow, getLogRetryType } from "../utils/shipment.js";
import { apiFetch, buildAuthenticatedUrl } from "../utils/api.js";
import { StatusDropdown } from "./ui/StatusDropdown.jsx";
import { PinIcon } from "./ui/PinIcon.jsx";

const INPUT = { width: "100%", padding: "7px 10px", borderRadius: "8px", border: `1px solid ${THEME.border.default}`, fontSize: "11px", color: THEME.text.primary, outline: "none", background: THEME.surface.card, fontFamily: "inherit" };
const LABEL = { fontSize: "10px", color: THEME.text.secondary, fontWeight: 600, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.04em" };
const SECTION = { background: THEME.surface.muted, borderRadius: "12px", padding: "16px", marginBottom: "14px", border: `1px solid ${THEME.border.default}` };
const SECTION_TITLE = { fontSize: "10px", color: THEME.text.secondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" };

export function DetailPanel({ selected, isDetailEditing, setSelected, setIsDetailEditing, updateStatus, updateField, togglePin, updateDocCount }) {
  const s = selected;
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState(null);
  const [mailLogs, setMailLogs] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [auditLogs, setAuditLogs] = useState([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  const [docs, setDocs] = useState([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfFilename, setPdfFilename] = useState("");
  const [pdfCarrierEmail, setPdfCarrierEmail] = useState("");
  const [pdfCarrierName, setPdfCarrierName] = useState("");

  // Listen for PDF from generator window
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === "pdf-generated") {
        setPdfBlob(e.data.blob);
        setPdfFilename(e.data.filename);
        setPdfCarrierEmail(String(e.data.carrierEmail || ""));
        setPdfCarrierName(String(e.data.carrierName || ""));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const loadShipmentLogs = useCallback(async (shipmentId) => {
    if (!shipmentId) { setMailLogs([]); return; }
    setIsLogsLoading(true);
    try {
      const res = await apiFetch("/api/email/logs?limit=150");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie pobrac logow.");
      const logs = Array.isArray(data?.logs) ? data.logs : [];
      setMailLogs(logs.filter(log => log?.shipmentId === shipmentId).slice(-20).reverse());
    } catch {
      setMailLogs([]);
    } finally {
      setIsLogsLoading(false);
    }
  }, []);

  const loadAuditHistory = useCallback(async (shipmentId, officeId) => {
    if (!shipmentId) { setAuditLogs([]); return; }
    setIsAuditLoading(true);
    try {
      const query = officeId ? `?officeId=${encodeURIComponent(officeId)}` : "";
      const res = await apiFetch(`/api/shipments/${encodeURIComponent(shipmentId)}/history${query}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie pobrac historii zmian.");
      setAuditLogs(Array.isArray(data?.logs) ? data.logs : []);
    } catch {
      setAuditLogs([]);
    } finally {
      setIsAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!s?.id) { setMailLogs([]); setEmailNotice(null); return; }
    loadShipmentLogs(s.id);
  }, [s?.id, loadShipmentLogs]);

  useEffect(() => {
    if (!s?.id) { setAuditLogs([]); return; }
    loadAuditHistory(s.id, s.officeId);
  }, [s?.id, s?.officeId, loadAuditHistory]);

  const loadDocs = useCallback(async (shipmentId) => {
    if (!shipmentId) { setDocs([]); return; }
    setIsDocsLoading(true);
    setDocsError(null);
    try {
      const res = await apiFetch(`/api/shipments/${encodeURIComponent(shipmentId)}/documents`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie pobrac dokumentow.");
      const list = Array.isArray(data?.docs) ? data.docs : [];
      setDocs(list);
      if (typeof updateDocCount === "function") updateDocCount(shipmentId, list.length);
    } catch (err) {
      setDocsError(err.message || "Blad ladowania dokumentow.");
      setDocs([]);
    } finally {
      setIsDocsLoading(false);
    }
  }, [updateDocCount]);

  useEffect(() => {
    setDocs([]);
    setDocsError(null);
    loadDocs(s?.id ?? null);
  }, [s?.id, loadDocs]);

  const openOutlookDraft = async ({ toList, ccList, subject, body, shipment, attachDocIds }) => {
    try {
      const res = await apiFetch("/api/email/open-outlook-classic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toList, cc: ccList, subject, body, shipment, attachDocIds }),
      });
      const data = await res.json().catch(() => ({}));
      return Boolean(res.ok && data?.ok);
    } catch {
      return false;
    }
  };

  const sendPayload = useCallback(async ({ payload, startedFromRetry = false }) => {
    const toList = Array.isArray(payload?.to) ? payload.to : [];
    const ccList = Array.isArray(payload?.cc) ? payload.cc : [];
    const subject = typeof payload?.subject === "string" ? payload.subject : "";
    const body = typeof payload?.body === "string" ? payload.body : "";
    const shipment = payload?.shipment && typeof payload.shipment === "object" ? payload.shipment : {};

    setIsSendingEmail(true);
    try {
      const res = await apiFetch("/api/email/send-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Nie udalo sie wyslac (${res.status}).`);

      setEmailNotice({
        tone: "success",
        text: startedFromRetry
          ? `Ponowiono wysylke poprawnie (proba ${data.attempt || 1}).`
          : `E-mail wyslany poprawnie (proba ${data.attempt || 1}).`,
      });
      await loadShipmentLogs(s.id);
      return true;
    } catch (err) {
      const openedClassic = await openOutlookDraft({
        toList, ccList, subject, body,
        shipment: { id: shipment?.id || s.id, officeId: shipment?.officeId || s.officeId, status: shipment?.status || s.status },
        attachDocIds: Array.isArray(payload?.attachDocIds) ? payload.attachDocIds : [],
      });

      if (openedClassic) {
        setEmailNotice({
          tone: "info",
          text: startedFromRetry
            ? "Ponowienie przez API nieudane. Otworzono ten sam szkic w Outlook Classic."
            : "API mail niedostepne. Otworzono szkic w Outlook Classic.",
        });
        await loadShipmentLogs(s.id);
        return false;
      }

      const to = toList.join(",");
      const cc = ccList.join(",");
      const ccPart = cc ? `&cc=${encodeURIComponent(cc)}` : "";
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${ccPart}`;
      const errText = String(err?.message || "");
      const isConfigError = /Missing RESEND_API_KEY|MAIL_FROM/i.test(errText);
      setEmailNotice({
        tone: "info",
        text: isConfigError
          ? "Brak konfiguracji API mail. Otworzono klienta poczty jako fallback."
          : "API mail chwilowo niedostepne. Otworzono klienta poczty jako fallback.",
      });
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  }, [s?.id, s?.status, loadShipmentLogs]);

  const buildCurrentPayload = (attachDocIds) => {
    const toList = extractEmails(s.clientEmail);
    const ccList = extractEmails(s.assigneeEmail, s.salesManagerEmail).filter(e => !toList.includes(e));
    const { subject, body } = buildShipmentStatusEmail(s);
    return {
      to: toList, cc: ccList,
      shipment: { id: s.id, officeId: s.officeId, status: s.status, client: s.client, route: s.route, etd: s.etd, eta: s.eta, bl: s.bl, container: s.container, customsCleared: Boolean(s.customsCleared), delivered: Boolean(s.delivered) },
      subject, body,
      ...(attachDocIds?.length ? { attachDocIds } : {}),
    };
  };

  const sendStatusEmail = () => {
    const payload = buildCurrentPayload();
    if (!payload.to.length) {
      setEmailNotice({ tone: "warn", text: "Uzupelnij poprawny e-mail klienta w polu 'E-mail klienta'." });
      return;
    }
    sendPayload({ payload });
  };

  const sendStatusEmailWithDocs = () => {
    if (!docs.length) { setEmailNotice({ tone: "warn", text: "Brak dokumentow do dolaczenia." }); return; }
    const payload = buildCurrentPayload(docs.map(d => d.id));
    if (!payload.to.length) { setEmailNotice({ tone: "warn", text: "Uzupelnij poprawny e-mail klienta w polu 'E-mail klienta'." }); return; }
    sendPayload({ payload });
  };

  const retryFromLog = (log) => {
    if (isSendingEmail) return;
    const request = log?.request;
    if (!request || !Array.isArray(request.to) || !request.to.length) {
      setEmailNotice({ tone: "warn", text: "Ten wpis nie zawiera pelnych danych do ponowienia 1:1." });
      return;
    }
    sendPayload({
      payload: { to: request.to, cc: Array.isArray(request.cc) ? request.cc : [], subject: request.subject || "", body: request.body || "", shipment: request.shipment || { id: s.id, officeId: s.officeId, status: s.status } },
      startedFromRetry: true,
    });
  };

  const openOutlookClassicManually = async () => {
    const toList = extractEmails(s.clientEmail);
    if (!toList.length) { setEmailNotice({ tone: "warn", text: "Uzupelnij poprawny e-mail klienta w polu 'E-mail klienta'." }); return; }
    const ccList = extractEmails(s.assigneeEmail, s.salesManagerEmail).filter(e => !toList.includes(e));
    const { subject, body } = buildShipmentStatusEmail(s);
    const openedClassic = await openOutlookDraft({ toList, ccList, subject, body, shipment: { id: s.id, officeId: s.officeId, status: s.status } });
    if (openedClassic) {
      setEmailNotice({ tone: "info", text: "Otworzono szkic w Outlook Classic." });
      await loadShipmentLogs(s.id);
      return;
    }
    const to = toList.join(",");
    const cc = ccList.join(",");
    const ccPart = cc ? `&cc=${encodeURIComponent(cc)}` : "";
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}${ccPart}`;
    setEmailNotice({ tone: "info", text: "Nie udalo sie otworzyc Outlook Classic. Otworzono domyslny klient poczty." });
  };

  const handleUpload = useCallback(async (file) => {
    if (!file || !s?.id) return;
    setIsUploading(true);
    setDocsError(null);
    try {
      const content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(String(e.target.result).split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await apiFetch(`/api/shipments/${encodeURIComponent(s.id)}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, mimeType: file.type || "", size: file.size, content, officeId: s.officeId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie wgrac pliku.");
      await loadDocs(s.id);
    } catch (err) {
      setDocsError(String(err?.message || "Blad wgrywania."));
    } finally {
      setIsUploading(false);
    }
  }, [s?.id, loadDocs]);

  const handleDeleteDoc = useCallback(async (docId) => {
    if (!s?.id) return;
    setDocsError(null);
    try {
      const res = await apiFetch(`/api/shipments/${encodeURIComponent(s.id)}/documents/${encodeURIComponent(docId)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie usunac dokumentu.");
      await loadDocs(s.id);
    } catch (err) {
      setDocsError(String(err?.message || "Blad usuwania."));
    }
  }, [s?.id, loadDocs]);

  const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(String(e.target.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSavePdfToTile = useCallback(async () => {
    if (!pdfBlob || !s?.id) return;
    setIsUploading(true);
    setDocsError(null);
    try {
      const content = await readFileAsBase64(pdfBlob);
      const res = await apiFetch(`/api/shipments/${encodeURIComponent(s.id)}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: pdfFilename, mimeType: "application/pdf", size: pdfBlob.size, content, officeId: s.officeId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie zapisac zlecenia.");
      await loadDocs(s.id);
      setPdfBlob(null);
      setPdfFilename("");
      setPdfCarrierEmail("");
      setPdfCarrierName("");
    } catch (err) {
      setDocsError(String(err?.message || "Blad zapisu zlecenia."));
    } finally {
      setIsUploading(false);
    }
  }, [pdfBlob, pdfFilename, s?.id, loadDocs]);

  const handleSaveAndSendPdf = useCallback(async () => {
    if (!pdfBlob || !s?.id) return;
    setIsUploading(true);
    setDocsError(null);
    try {
      const content = await readFileAsBase64(pdfBlob);
      const res = await apiFetch(`/api/shipments/${encodeURIComponent(s.id)}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: pdfFilename, mimeType: "application/pdf", size: pdfBlob.size, content, officeId: s.officeId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie zapisac zlecenia.");
      await loadDocs(s.id);
      const newDocId = data.doc?.id;
      setPdfBlob(null);
      setPdfFilename("");
      const toList = extractEmails(pdfCarrierEmail);
      if (!toList.length) {
        setDocsError("PDF zapisany. Uzupelnij e-mail przewoznika w generatorze, aby wyslac zlecenie.");
        return;
      }
      const { subject, body } = buildTransportOrderEmail(s, pdfCarrierName);
      const payload = {
        to: toList, cc: [],
        shipment: { id: s.id, officeId: s.officeId, status: s.status, client: s.client, route: s.route, etd: s.etd, eta: s.eta, bl: s.bl, container: s.container, customsCleared: Boolean(s.customsCleared), delivered: Boolean(s.delivered) },
        subject, body,
        ...(newDocId ? { attachDocIds: [newDocId] } : {}),
      };
      await sendPayload({ payload });
      setPdfCarrierEmail("");
      setPdfCarrierName("");
    } catch (err) {
      setDocsError(String(err?.message || "Blad zapisu/wysylki."));
    } finally {
      setIsUploading(false);
    }
  }, [pdfBlob, pdfFilename, pdfCarrierEmail, pdfCarrierName, s, loadDocs, sendPayload]);

  const copyText = async (value, label) => {
    const text = String(value || "").trim();
    if (!text) { setEmailNotice({ tone: "warn", text: `${label}: brak danych do skopiowania.` }); return; }
    const fallbackCopy = (content) => {
      const ta = document.createElement("textarea");
      ta.value = content;
      ta.setAttribute("readonly", "");
      Object.assign(ta.style, { position: "fixed", top: "-9999px", left: "-9999px" });
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!fallbackCopy(text)) {
        throw new Error("Clipboard API niedostepne");
      }
      setEmailNotice({ tone: "info", text: `${label} skopiowano.` });
    } catch {
      setEmailNotice({ tone: "warn", text: `Nie udalo sie skopiowac: ${label}.` });
    }
  };

  const renderField = ({ label, field, type, placeholder }) => (
    <div style={{ marginBottom: "10px" }}>
      <div style={LABEL}>{label}</div>
      {!isDetailEditing ? (
        <div style={{ ...INPUT, minHeight: "30px", display: "flex", alignItems: "center", background: THEME.surface.muted, color: THEME.text.secondary, borderColor: THEME.border.default }}>{s[field] || "—"}</div>
      ) : type === "textarea" ? (
        <textarea value={s[field] || ""} placeholder={placeholder || ""} rows={2} onClick={e => e.stopPropagation()} onChange={e => updateField(s.id, field, e.target.value)} style={{ ...INPUT, resize: "vertical" }} />
      ) : type === "date" ? (
        <input type="date" value={s[field] || ""} onClick={e => e.stopPropagation()} onChange={e => updateField(s.id, field, e.target.value)} style={INPUT} />
      ) : (
        <input type="text" value={s[field] || ""} placeholder={placeholder || ""} onClick={e => e.stopPropagation()} onChange={e => updateField(s.id, field, e.target.value)} style={INPUT} />
      )}
    </div>
  );

  if (!s) return null;

  const cfg = STATUS_CFG[s.status] || STATUS_CFG.booked;
  const toList = extractEmails(s.clientEmail);
  const ccList = extractEmails(s.assigneeEmail, s.salesManagerEmail).filter(e => !toList.includes(e));
  const previewSubject = buildShipmentStatusEmail(s).subject;
  const visibleLogs = mailLogs.filter(log => {
    if (historyFilter === "sent") return Boolean(log?.ok);
    if (historyFilter === "errors") return !log?.ok;
    return true;
  });

  const closePanel = () => { setSelected(null); setIsDetailEditing(false); };
  const actionBtnBase = { borderRadius: "8px", height: "32px", padding: "0 10px", cursor: "pointer", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", letterSpacing: "0.03em" };
  const miniBtnBase = { borderRadius: "6px", fontSize: "9px", fontWeight: 700, padding: "3px 8px", cursor: "pointer" };

  return (
    <>
      <div onClick={closePanel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 99 }} />
      <div style={{ position: "fixed", top: 0, right: 0, width: "440px", height: "100vh", background: THEME.surface.card, boxShadow: "-6px 0 30px rgba(16, 38, 62, 0.14)", zIndex: 100, overflowY: "auto", borderLeft: `3px solid ${cfg.color}` }}>
        <div style={{ padding: "22px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "10px", color: THEME.text.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Shipment</div>
              <div style={{ fontSize: "19px", fontWeight: 800, color: THEME.text.primary }}>{s.id}</div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={sendStatusEmail} disabled={isSendingEmail} style={{ ...actionBtnBase, background: "#EAF7F0", border: "1px solid #A9D9BF", color: THEME.state.success, opacity: isSendingEmail ? 0.65 : 1, cursor: isSendingEmail ? "not-allowed" : "pointer" }}>
                {isSendingEmail ? "SENDING" : "MAIL"}
              </button>
              <button
                onClick={() => docs.length > 0 ? sendStatusEmailWithDocs() : fileInputRef.current?.click()}
                disabled={isSendingEmail}
                title={docs.length ? `Wyslij z ${docs.length} dokumentem` : "Dodaj pierwszy dokument"}
                style={{ ...actionBtnBase, background: docs.length ? "#EAF2FB" : THEME.surface.muted, border: `1px solid ${docs.length ? "#AFC7E1" : THEME.border.default}`, color: docs.length ? THEME.brand.primarySoft : THEME.text.secondary, opacity: isSendingEmail ? 0.65 : 1, gap: "3px", cursor: isSendingEmail ? "not-allowed" : "pointer" }}>
                📎{docs.length > 0 ? ` +${docs.length}` : ""}
              </button>
              <button onClick={openOutlookClassicManually} disabled={isSendingEmail} style={{ ...actionBtnBase, background: "#EAF2FB", border: "1px solid #AFC7E1", color: THEME.brand.primarySoft, opacity: isSendingEmail ? 0.65 : 1, cursor: isSendingEmail ? "not-allowed" : "pointer" }}>OUTLOOK</button>
              <button onClick={() => setIsDetailEditing(v => !v)} style={{ ...actionBtnBase, background: isDetailEditing ? THEME.brand.accentSoft : THEME.surface.muted, border: `1px solid ${isDetailEditing ? "#E9A4B0" : THEME.border.default}`, color: isDetailEditing ? THEME.state.danger : THEME.text.secondary, letterSpacing: "0.05em" }}>
                {isDetailEditing ? "LOCK" : "EDIT"}
              </button>
              <button onClick={() => togglePin(s.id)} style={{ background: s.pinned ? "#FFF5E8" : THEME.surface.muted, border: `1px solid ${s.pinned ? "#F1C58D" : THEME.border.default}`, borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><PinIcon filled={s.pinned} /></button>
              <button onClick={closePanel} style={{ background: THEME.surface.muted, border: `1px solid ${THEME.border.default}`, borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "13px", color: THEME.text.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          </div>

          {/* Status + progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <div style={LABEL}>Status</div>
            <StatusDropdown disabled={!isDetailEditing} current={s.status} onChange={v => { updateStatus(s.id, v); setSelected({ ...s, status: v }); }} />
          </div>
          <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
            {STAGES.map((stage, i) => {
              const sc = STATUS_CFG[stage];
              const ci = STAGES.indexOf(s.status);
              return (
                <div key={stage} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: "4px", borderRadius: "2px", background: i <= ci ? sc.color : THEME.border.default, marginBottom: "3px", boxShadow: i === ci ? `0 0 6px ${sc.color}50` : "none" }} />
                  <span style={{ fontSize: "9px", color: i <= ci ? sc.color : THEME.border.strong }}>{sc.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Basic data */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Dane podstawowe</div>
            {renderField({ label: "Klient (Consignee)", field: "client", placeholder: "Nazwa klienta" })}
            {renderField({ label: "Adres klienta", field: "clientAddress", placeholder: "Adres dostawy klienta" })}
            {renderField({ label: "E-mail klienta", field: "clientEmail", placeholder: "np. klient@firma.pl" })}
            {renderField({ label: "Shipper", field: "shipper", placeholder: "Nadawca" })}
            {renderField({ label: "Towar", field: "descr", placeholder: "Opis towaru" })}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {renderField({ label: "Typ kontenera", field: "type", placeholder: "FCL 40'" })}
              {renderField({ label: "Nr kontenera", field: "container", placeholder: "ABCD1234567" })}
            </div>
            {renderField({ label: "B/L", field: "bl", placeholder: "Nr konosamentu" })}
          </div>

          {/* Route & dates */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Trasa i daty</div>
            {renderField({ label: "Trasa", field: "route", placeholder: "Shanghai → Gdynia" })}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {renderField({ label: "ETD", field: "etd", type: "date" })}
              {renderField({ label: "ETA", field: "eta", type: "date" })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {renderField({ label: "LFD (Last Free Day)", field: "lfd", type: "date" })}
              {renderField({ label: "Vessel", field: "vessel", placeholder: "Nazwa statku" })}
            </div>
          </div>

          {/* Assignment */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Przypisanie</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {renderField({ label: "Spedytor (Operator)", field: "assignee", placeholder: "Imię Nazwisko" })}
              {renderField({ label: "Sales Manager", field: "salesManager", placeholder: "Imię Nazwisko" })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {renderField({ label: "E-mail spedytora (CC)", field: "assigneeEmail", placeholder: "np. spedytor@firma.pl" })}
              {renderField({ label: "E-mail sales managera (CC)", field: "salesManagerEmail", placeholder: "np. sales@firma.pl" })}
            </div>
          </div>

          {/* Tracking */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Tracking API</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {renderField({ label: "Armator (kod)", field: "carrierCode", placeholder: "np. MAERSK, MSC, CMA" })}
              {renderField({ label: "Referencja trackingu", field: "trackingRef", placeholder: "Container / B/L / booking" })}
            </div>
            <div style={{ marginTop: "2px", fontSize: "10px", color: THEME.text.secondary }}>
              Ostatni sync: {s.trackingLastSyncAt ? new Date(s.trackingLastSyncAt).toLocaleString("pl-PL") : "brak"}
            </div>
            {s.trackingSyncError
              ? <div style={{ marginTop: "4px", fontSize: "10px", color: THEME.state.danger }}>Sync info: {s.trackingSyncError}</div>
              : null}
          </div>

          {/* Notes */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Notatki</div>
            {renderField({ label: "Notatka operacyjna", field: "notes", type: "textarea", placeholder: "Dodaj notatkę..." })}
          </div>

          {/* Documents */}
          <div style={SECTION}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={SECTION_TITLE}>Dokumenty{docs.length > 0 ? ` (${docs.length})` : ""}</div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={() => openGeneratorWindow(s)} style={{ ...actionBtnBase, height: "28px", background: "#FFF5E8", border: "1px solid #F1C58D", color: "#8A5616" }}>📋 GENERATOR</button>
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} style={{ ...actionBtnBase, height: "28px", background: "#EAF2FB", border: "1px solid #AFC7E1", color: THEME.brand.primarySoft, opacity: isUploading ? 0.65 : 1, cursor: isUploading ? "not-allowed" : "pointer" }}>
                  {isUploading ? "WGRYWANIE..." : "+ DODAJ"}
                </button>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) { handleUpload(e.target.files[0]); e.target.value = ""; } }} />
              </div>
            </div>
            {docsError ? <div style={{ marginBottom: "8px", padding: "7px 9px", borderRadius: "8px", background: THEME.brand.accentSoft, border: "1px solid #E9A4B0", color: THEME.state.danger, fontSize: "10px", fontWeight: 600 }}>{docsError}</div> : null}
            {pdfBlob && (
              <div style={{ marginBottom: "8px", padding: "8px 10px", borderRadius: "8px", background: "#EAF7F0", border: "1px solid #A9D9BF", color: THEME.state.success, fontSize: "10px", fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                <span>📄 {pdfFilename || "Nowe zlecenie"} gotowe do zapisu</span>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button onClick={() => { setPdfBlob(null); setPdfFilename(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: THEME.text.secondary, fontSize: "14px", fontWeight: 700, lineHeight: 1, padding: 0 }}>✕</button>
                  <button onClick={handleSavePdfToTile} disabled={isUploading} style={{ background: THEME.state.success, color: "#fff", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: isUploading ? "not-allowed" : "pointer", fontSize: "10px", fontWeight: 700 }}>
                    {isUploading ? "ZAPIS..." : "💾 ZAPISZ"}
                  </button>
                  <button onClick={handleSaveAndSendPdf} disabled={isUploading || isSendingEmail} style={{ background: THEME.brand.primarySoft, color: "#fff", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: (isUploading || isSendingEmail) ? "not-allowed" : "pointer", fontSize: "10px", fontWeight: 700, opacity: (isUploading || isSendingEmail) ? 0.65 : 1 }}>
                    {isUploading || isSendingEmail ? "..." : "💾📧 WYŚLIJ"}
                  </button>
                </div>
              </div>
            )}
            {isDocsLoading ? (
              <div style={{ fontSize: "10px", color: THEME.text.muted }}>Ladowanie...</div>
            ) : docs.length === 0 ? (
              <div style={{ fontSize: "10px", color: THEME.text.muted }}>Brak dokumentow. Kliknij &ldquo;+ DODAJ&rdquo; aby dolaczyc plik PDF, DOC lub XLSX.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {docs.map(doc => (
                  <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "6px", background: THEME.surface.card, border: `1px solid ${THEME.border.default}`, borderRadius: "8px", padding: "7px 9px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: THEME.text.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={doc.originalName}>{doc.originalName}</div>
                      <div style={{ fontSize: "9px", color: THEME.text.muted }}>
                        {String(doc.mimeType || "").split("/")[1]?.toUpperCase() || "DOC"}
                        {doc.size ? ` · ${(doc.size / 1024).toFixed(0)} KB` : ""}
                        {doc.uploadedAt ? ` · ${new Date(doc.uploadedAt).toLocaleDateString("pl-PL")}` : ""}
                      </div>
                    </div>
                    <a href={buildAuthenticatedUrl(`/api/shipments/${encodeURIComponent(s.id)}/documents/${encodeURIComponent(doc.id)}`)} download={doc.originalName} onClick={e => e.stopPropagation()} style={{ background: THEME.surface.muted, border: `1px solid ${THEME.border.strong}`, borderRadius: "7px", height: "24px", padding: "0 8px", cursor: "pointer", fontSize: "9px", fontWeight: 700, color: THEME.text.secondary, display: "flex", alignItems: "center", textDecoration: "none", whiteSpace: "nowrap" }}>POBIERZ</a>
                    <button onClick={() => handleDeleteDoc(doc.id)} style={{ background: THEME.brand.accentSoft, border: "1px solid #E9A4B0", borderRadius: "7px", height: "24px", padding: "0 8px", cursor: "pointer", fontSize: "9px", fontWeight: 700, color: THEME.state.danger }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick mail actions */}
          <div style={SECTION}>
            <div style={SECTION_TITLE}>Szybkie akcje mail</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button onClick={() => copyText(toList.join(", "), "Pole Do")} style={{ ...actionBtnBase, height: "28px", background: THEME.surface.card, border: `1px solid ${THEME.border.strong}`, color: THEME.text.secondary }}>KOPIUJ DO</button>
              <button onClick={() => copyText(ccList.join(", "), "Pole CC")} style={{ ...actionBtnBase, height: "28px", background: THEME.surface.card, border: `1px solid ${THEME.border.strong}`, color: THEME.text.secondary }}>KOPIUJ CC</button>
              <button onClick={() => copyText(previewSubject, "Tytul")} style={{ ...actionBtnBase, height: "28px", background: THEME.surface.card, border: `1px solid ${THEME.border.strong}`, color: THEME.text.secondary }}>KOPIUJ TYTUL</button>
            </div>
            {emailNotice && (
              <div style={{ marginTop: "10px", padding: "8px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 600, border: `1px solid ${emailNotice.tone === "success" ? "#A9D9BF" : emailNotice.tone === "warn" ? "#F1C58D" : "#AFC7E1"}`, background: emailNotice.tone === "success" ? "#EAF7F0" : emailNotice.tone === "warn" ? "#FFF5E8" : "#EAF2FB", color: emailNotice.tone === "success" ? THEME.state.success : emailNotice.tone === "warn" ? THEME.state.warning : THEME.brand.primarySoft }}>
                {emailNotice.text}
              </div>
            )}
          </div>

          <div style={SECTION}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={SECTION_TITLE}>Historia zmian</div>
              <button onClick={() => loadAuditHistory(s.id, s.officeId)} style={{ ...miniBtnBase, background: THEME.surface.card, border: `1px solid ${THEME.border.strong}`, color: THEME.text.secondary }}>ODSWIEZ</button>
            </div>
            {isAuditLoading ? (
              <div style={{ fontSize: "10px", color: THEME.text.muted }}>Ladowanie historii zmian...</div>
            ) : auditLogs.length === 0 ? (
              <div style={{ fontSize: "10px", color: THEME.text.muted }}>Brak zapisanych zmian dla tej przesylki.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {auditLogs.map((log, idx) => (
                  <div key={`${log.ts || "audit"}-${idx}`} style={{ background: THEME.surface.card, border: `1px solid ${THEME.border.default}`, borderRadius: "8px", padding: "8px 9px", fontSize: "10px", color: THEME.text.secondary }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
                      <span style={{ fontWeight: 700, color: THEME.text.primary }}>{log.userName || "Uzytkownik"}</span>
                      <span style={{ color: THEME.text.muted }}>{log.ts ? new Date(log.ts).toLocaleString("pl-PL") : "-"}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: THEME.text.primary }}>{log.summary || "Zmiana na przesylce"}</div>
                    {log.field ? <div>Pole: {log.field}</div> : null}
                    {log.previousValue !== null && log.previousValue !== undefined ? <div>Bylo: {String(log.previousValue || "—")}</div> : null}
                    {log.nextValue !== null && log.nextValue !== undefined ? <div>Jest: {String(log.nextValue || "—")}</div> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mail history */}
          <div style={SECTION}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <div style={SECTION_TITLE}>Historia wysylek</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {[{ key: "all", label: "Wszystkie" }, { key: "sent", label: "Wyslane" }, { key: "errors", label: "Bledy" }].map(item => (
                  <button key={item.key} onClick={() => setHistoryFilter(item.key)} style={{ ...miniBtnBase, background: historyFilter === item.key ? THEME.brand.primary : THEME.surface.card, color: historyFilter === item.key ? THEME.text.onDark : THEME.text.secondary, border: `1px solid ${historyFilter === item.key ? THEME.brand.primary : THEME.border.strong}` }}>{item.label}</button>
                ))}
                <button onClick={() => loadShipmentLogs(s.id)} style={{ ...miniBtnBase, background: THEME.surface.card, border: `1px solid ${THEME.border.strong}`, color: THEME.text.secondary }}>ODSWIEZ</button>
              </div>
            </div>
            {isLogsLoading ? (
              <div style={{ fontSize: "10px", color: THEME.text.muted }}>Ladowanie historii...</div>
            ) : visibleLogs.length === 0 ? (
              <div style={{ fontSize: "10px", color: THEME.text.muted }}>Brak historii wysylek dla tej przesylki.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {visibleLogs.map((log, idx) => {
                  const retryType = getLogRetryType(log);
                  const retryReady = retryType === "retry-ready";
                  return (
                    <div key={`${log.ts || "no-ts"}-${idx}`} style={{ background: THEME.surface.card, border: `1px solid ${THEME.border.default}`, borderRadius: "8px", padding: "8px 9px", fontSize: "10px", color: THEME.text.secondary }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "2px" }}>
                        <span style={{ fontWeight: 700, color: log.ok ? THEME.state.success : THEME.state.danger }}>{log.ok ? "Wyslano" : "Blad"}</span>
                        <span style={{ color: THEME.text.muted }}>{log.ts ? new Date(log.ts).toLocaleString("pl-PL") : "-"}</span>
                      </div>
                      {!log.ok && (
                        <div style={{ marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                          <span title={retryReady ? "Wpis ma pelny payload." : "Stary wpis bez pelnego payloadu."} style={{ background: retryReady ? "#EAF7F0" : THEME.surface.muted, color: retryReady ? THEME.state.success : THEME.text.secondary, border: `1px solid ${retryReady ? "#A9D9BF" : THEME.border.strong}`, borderRadius: "999px", fontSize: "9px", fontWeight: 700, padding: "2px 7px", textTransform: "uppercase", letterSpacing: "0.03em" }}>{retryType}</span>
                          <button onClick={() => retryFromLog(log)} disabled={isSendingEmail || !retryReady} title={retryReady ? "Ponow wysylke 1:1" : "Brak pelnego payloadu"} style={{ background: THEME.brand.accentSoft, border: "1px solid #E9A4B0", borderRadius: "6px", fontSize: "9px", fontWeight: 700, padding: "3px 8px", cursor: isSendingEmail || !retryReady ? "not-allowed" : "pointer", color: THEME.state.danger, opacity: isSendingEmail || !retryReady ? 0.6 : 1 }}>PONOW</button>
                        </div>
                      )}
                      <div>Proba: {log.attempt || "-"}</div>
                      {Array.isArray(log.to) && log.to.length ? <div>Do: {log.to.join(", ")}</div> : null}
                      {Array.isArray(log.cc) && log.cc.length ? <div>CC: {log.cc.join(", ")}</div> : null}
                      {log.subject ? <div>Tytul: {log.subject}</div> : null}
                      {log.error ? <div style={{ color: THEME.state.danger }}>{log.error}</div> : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Import data (read-only) */}
          <div style={{ padding: "8px 0", borderTop: `1px solid ${THEME.border.default}` }}>
            <div style={{ fontSize: "9px", color: THEME.border.strong, marginBottom: "4px" }}>Dane z importu (tylko odczyt)</div>
            <div style={{ fontSize: "10px", color: THEME.text.muted, lineHeight: 1.6 }}>
              STN: {s.stn || "—"} &nbsp;|&nbsp; Waga: {s.weight ? (s.weight / 1000).toFixed(2) + "t" : "—"} &nbsp;|&nbsp; Colli: {s.colli || "—"} &nbsp;|&nbsp; Vol: {s.volume || "—"} m³
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
