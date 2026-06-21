import { STAGES, GENERATOR_PREFILL_KEY_PREFIX } from "../constants/index.js";

export const normalizeStatus = (status) => {
  if (status === "loaded") return "delivered_to_port";
  if (status === "cleared") return "gone_out";
  if (STAGES.includes(status)) return status;
  return "booked";
};

function startOfDay(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

export const deriveTimelineStatus = ({
  eta,
  etd,
  previousStatus = "",
  preserveManualCustoms = false,
  preserveManualGoneOut = false,
  today = new Date(),
}) => {
  const previous = normalizeStatus(previousStatus);
  if ((previous === "customs" && preserveManualCustoms) || (previous === "gone_out" && preserveManualGoneOut)) {
    return previous;
  }

  const now = startOfDay(today);
  const etdDate = etd ? startOfDay(etd) : null;
  const etaDate = eta ? startOfDay(eta) : null;

  if (!etdDate && !etaDate) return "booked";
  if (etdDate && now && now < etdDate) return "delivered_to_port";
  if (etdDate && now && now.getTime() === etdDate.getTime()) return "departed";
  if (etaDate && now && now >= etaDate) return "arrived";
  if (etdDate && now && now > etdDate) return "in_transit";
  if (!etdDate && etaDate) return now && now < etaDate ? "in_transit" : "arrived";

  return previous || "booked";
};

export const mapShipmentTypeToGeneratorType = (type) => {
  const normalized = String(type || "").toUpperCase();
  if (normalized.includes("45")) return "1x45'HC";
  if (normalized.includes("40") && normalized.includes("HC")) return "1x40'HC";
  if (normalized.includes("40")) return "1x40'";
  if (normalized.includes("20")) return "1x20'";
  return "1x40'HC";
};

export const mapCarrierCodeToGeneratorArmator = (carrierCode) => {
  const normalized = String(carrierCode || "").trim().toUpperCase();
  const codeMap = {
    MSC: "MSC", MAERSK: "Maersk", MAEU: "Maersk",
    CMA: "CMA CGM", "CMA CGM": "CMA CGM",
    COSCO: "COSCO", HAPAG: "Hapag-Lloyd", "HAPAG-LLOYD": "Hapag-Lloyd",
    ONE: "ONE", EVERGREEN: "Evergreen", HMM: "HMM", ZIM: "ZIM",
    "YANG MING": "Yang Ming", YML: "Yang Ming",
  };
  return codeMap[normalized] || "Inny";
};

export const mapAssigneeToGeneratorSped = (assignee) => {
  const firstName = String(assignee || "").trim().split(",")[0]?.trim().split(/\s+/)[0] || "";
  return ["Karol", "Gosia", "Oliwia", "Kamil"].includes(firstName) ? firstName : "";
};

export const formatPositionForCard = (position) => {
  const raw = String(position || "").trim();
  if (!raw) return "";
  if (raw.length <= 14) return raw;
  return raw.slice(4, raw.length - 10);
};

export const isTechnicalShipment = (shipment) =>
  String(shipment?.client || "").toUpperCase().includes("TECHNICZNE");

export const deriveShipmentOfficeId = (shipment) => {
  const candidates = [shipment?.officeId, shipment?.position, shipment?.id, shipment?.stn];
  for (const candidate of candidates) {
    const raw = String(candidate || "").trim();
    if (!raw) continue;
    const fullMatch = raw.match(/^(44\d{3})/);
    if (fullMatch) return fullMatch[1];
    const shortMatch = raw.match(/^(\d{3})/);
    if (shortMatch) return `44${shortMatch[1]}`;
  }
  return "";
};

export const canUserAccessOffice = (user, officeId) => {
  if (!user) return false;
  if (user.role === "superuser" || user.role === "management") return true;
  if (Array.isArray(user.offices) && user.offices.includes("*")) return true;
  if (!officeId) return false;
  return Array.isArray(user.offices) && user.offices.includes(officeId);
};

export const buildGeneratorPrefill = (shipment) => ({
  mode: "imp",
  i_ref: shipment?.id || shipment?.stn || "",
  i_sped: mapAssigneeToGeneratorSped(shipment?.assignee),
  i_deladdr: shipment?.clientAddress || "",
  i_notes: "",
  _containers: [
    {
      ctype: mapShipmentTypeToGeneratorType(shipment?.type),
      cnum: shipment?.container || "",
      seal: "",
      arm: mapCarrierCodeToGeneratorArmator(shipment?.carrierCode),
      pcs: shipment?.colli ? String(shipment.colli) : "",
      desc: shipment?.descr || "",
      wt: shipment?.weight ? String(shipment.weight) : "",
    },
  ],
});

export const openGeneratorWindow = (shipment) => {
  const shipmentId = shipment?.id || "UNKNOWN";
  const prefillKey = `${GENERATOR_PREFILL_KEY_PREFIX}.${shipmentId}.${Date.now()}`;
  try {
    localStorage.setItem(prefillKey, JSON.stringify(buildGeneratorPrefill(shipment)));
  } catch {
    // If storage is unavailable, generator still opens without prefill.
  }
  window.open(
    `/generator.html?id=${encodeURIComponent(shipmentId)}&prefill=${encodeURIComponent(prefillKey)}`,
    "_blank",
  );
};

export const getLogRetryType = (log) => {
  const request = log?.request;
  const hasRequest = request && typeof request === "object";
  const hasTo = hasRequest && Array.isArray(request.to) && request.to.length > 0;
  return hasTo ? "retry-ready" : "legacy-log";
};
