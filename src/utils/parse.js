import { deriveShipmentOfficeId } from "./shipment.js";

const HEADER_MAP = {
  STN: ["STN"], Consignee: ["Consignee"], Client: ["Client"],
  Shipper: ["Shipper"], FreightDoc1: ["Freightdoc-Nr 1", "FreightDoc1"],
  FreightDoc2: ["Freightdoc-Nr 2", "FreightDoc2"], CID: ["CID"],
  Colli: ["Colli"], Volume: ["Volume"], Weight: ["Weight"],
  Revenue: ["Revenue"], Costs: ["Costs"], Profit: ["Profit"],
  SalesManager: ["SalesManager"], Descr: ["Descr"],
  TU: ["TU"], TEU: ["TEU"],
  FromRegion: ["From Region"], PickupCity: ["PickupCity"],
  FromTerminal: ["From Terminal"], ToRegion: ["To Region"],
  DeliveryCity: ["DeliveryCity"], ToTerminal: ["To Terminal"],
  ETD: ["ETD"], ETA: ["ETA"], Finished: ["Finished"],
  Operator: ["Operator"], Created: ["Created"],
  Position: ["Position"], Status: ["Status"],
};

function buildColIndex(headerRow) {
  const idx = {};
  const normalized = headerRow.map(h => h ? String(h).trim() : "");
  for (const [key, aliases] of Object.entries(HEADER_MAP)) {
    for (const alias of aliases) {
      const found = normalized.indexOf(alias);
      if (found !== -1) { idx[key] = found; break; }
    }
  }
  return idx;
}

export const clean = (v) => {
  if (v === null || v === undefined) return "";
  return String(v).trim().replace(/\s+/g, " ");
};

export const parseDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, "0");
    const d = String(v.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(v).trim();
  const mt = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (mt) return `${mt[1]}-${mt[2]}-${mt[3]}`;
  return null;
};

const formatCity = (s) => {
  if (!s) return "";
  return clean(s)
    .split(/[\s-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .replace(/^Cn[a-z]*$/i, "")
    .trim();
};

const guessContainerType = (teu, tu) => {
  if (teu === 2) return "FCL 40'";
  if (teu === 1 && tu === 1) return "FCL 20'";
  if (teu >= 1) return `FCL (${teu} TEU)`;
  if (tu === 0 || (!tu && !teu)) return "LCL";
  return `${teu} TEU`;
};

export const startOfDay = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
};

export const guessOpStatus = (eta, etd, finished) => {
  if (finished && String(finished).trim() !== "") return "gone_out";
  const now = startOfDay(new Date());
  if (!eta && !etd) return "booked";
  const etaDate = eta ? startOfDay(eta) : null;
  const etdDate = etd ? startOfDay(etd) : null;
  if (etaDate && etaDate <= now) return "arrived";
  if (etdDate && etdDate.getTime() === now.getTime()) return "departed";
  if (etdDate && etdDate < now) return "in_transit";
  return "booked";
};

export const daysFromNow = (dateStr) => {
  if (!dateStr) return null;
  const d = startOfDay(dateStr);
  const now = startOfDay(new Date());
  if (!d || !now) return null;
  return Math.ceil((d - now) / 86400000);
};

export function parseTranssoft(rows) {
  const headerRow = rows[0];
  const C = buildColIndex(headerRow);
  const g = (r, key) => (C[key] !== undefined ? r[C[key]] : null);
  const dataRows = rows.slice(1).filter(r => g(r, "STN"));

  return dataRows.map((r, idx) => {
    const stn = clean(g(r, "STN"));
    const id = stn.split(" - ")[0] || `SEA-${idx}`;
    const eta = parseDate(g(r, "ETA"));
    const etd = parseDate(g(r, "ETD"));
    const finishedRaw = g(r, "Finished");
    const fromCity = formatCity(g(r, "PickupCity") || g(r, "FromTerminal"));
    const toCity = formatCity(g(r, "DeliveryCity") || g(r, "ToTerminal"));
    const route = `${fromCity || clean(g(r, "FromRegion"))} → ${toCity || clean(g(r, "ToRegion"))}`;
    const teu = Number(g(r, "TEU")) || 0;
    const tu = Number(g(r, "TU")) || 0;
    const weight = Number(g(r, "Weight")) || 0;
    const revenue = Number(g(r, "Revenue")) || 0;
    const costs = Number(g(r, "Costs")) || 0;
    const profit = Number(g(r, "Profit")) || 0;
    const operator = clean(g(r, "Operator"));
    const status = guessOpStatus(eta, etd, finishedRaw);
    const tseStatusRaw = g(r, "Status");
    const tseStatus = (tseStatusRaw !== null && tseStatusRaw !== undefined && String(tseStatusRaw).trim() !== "")
      ? Number(tseStatusRaw)
      : null;

    const shipment = {
      id, stn,
      client: clean(g(r, "Consignee")) || clean(g(r, "Client")) || "—",
      shipper: clean(g(r, "Shipper")),
      route, type: guessContainerType(teu, tu),
      status, tseStatus, eta, etd,
      container: clean(g(r, "CID")),
      bl: clean(g(r, "FreightDoc1")),
      mbl: clean(g(r, "FreightDoc2")),
      assignee: operator || "Nieprzypisany",
      salesManager: clean(g(r, "SalesManager")),
      descr: clean(g(r, "Descr")),
      weight, colli: Number(g(r, "Colli")) || 0,
      volume: Number(g(r, "Volume")) || 0,
      revenue, costs, profit,
      position: clean(g(r, "Position")),
      daysToEta: daysFromNow(eta),
      lfd: null,
      pinned: false,
      actions: [],
      fromRegion: clean(g(r, "FromRegion")),
      toRegion: clean(g(r, "ToRegion")),
      delterm: clean(g(r, "DeliveryCity")),
      lastUpdate: parseDate(g(r, "Created")) || "—",
      vessel: "",
      notes: "",
      clientAddress: "",
      clientEmail: "",
      assigneeEmail: "",
      salesManagerEmail: "",
      customsCleared: false,
      delivered: false,
      carrierCode: "",
      trackingRef: clean(g(r, "CID")) || clean(g(r, "FreightDoc1")),
      trackingLastSyncAt: "",
      trackingSyncError: "",
      autoMovedUntil: "",
    };

    shipment.officeId = deriveShipmentOfficeId(shipment);
    return shipment;
  });
}
