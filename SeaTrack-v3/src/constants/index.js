export const THEME = {
  brand: {
    primary: "#0E2A47",
    primarySoft: "#1F4E79",
    accent: "#C1122F",
    accentSoft: "#FCE8EC",
  },
  surface: {
    page: "#F3F5F8",
    card: "#FFFFFF",
    muted: "#EEF2F6",
    dark: "#10263E",
  },
  text: {
    primary: "#13263A",
    secondary: "#4E6073",
    muted: "#7D8FA3",
    onDark: "#F5F8FB",
  },
  border: {
    default: "#D3DCE6",
    strong: "#B8C5D3",
  },
  state: {
    success: "#1F7A4C",
    warning: "#B7721D",
    danger: "#B4232C",
    info: "#1F4E79",
  },
};

export const STATUS_CFG = {
  booked:             { label: "Zarezerwowany",       color: "#5F7288", bg: "#EEF2F6", ring: "#C8D2DD", icon: "📋" },
  delivered_to_port:  { label: "Dostarczony do portu",color: "#1F4E79", bg: "#EAF2FB", ring: "#AFC7E1", icon: "🚛" },
  departed:           { label: "Wypłynięcie",          color: "#0E2A47", bg: "#E8EEF5", ring: "#9FB2C9", icon: "🛳️" },
  in_transit:         { label: "W tranzycie",          color: "#2C5D8A", bg: "#EBF3FA", ring: "#BCD0E5", icon: "🚢" },
  arrived:            { label: "Przybył",              color: "#1F7A4C", bg: "#EAF7F0", ring: "#A9D9BF", icon: "⚓" },
  customs:            { label: "Odprawa",              color: "#B7721D", bg: "#FFF5E8", ring: "#F1C58D", icon: "🛃" },
  gone_out:           { label: "Wyjechał",             color: "#14663E", bg: "#E3F2E8", ring: "#90C7A5", icon: "✅" },
};

export const STAGES = [
  "booked",
  "delivered_to_port",
  "departed",
  "in_transit",
  "arrived",
  "customs",
  "gone_out",
];

export const TRACKING_AUTO_SYNC_MS = 60 * 60 * 1000;
export const AUTO_MOVE_HIGHLIGHT_MS = 30 * 60 * 1000;
export const GENERATOR_PREFILL_KEY_PREFIX = "seatrackv3.generator-prefill";
export const SHIPMENT_OVERRIDES_KEY = "seatrackv3.shipment-overrides.v1";
export const AUTH_TOKEN_STORAGE_KEY = "seatrackv3.auth.token";
export const AUTH_USER_STORAGE_KEY = "seatrackv3.auth.user";

export const SHIPMENT_OVERRIDE_FIELDS = [
  "status", "client", "shipper", "route", "type", "container", "bl", "mbl",
  "assignee", "salesManager", "descr", "position", "eta", "etd", "lfd",
  "vessel", "notes", "clientAddress", "clientEmail", "assigneeEmail",
  "salesManagerEmail", "pinned", "customsCleared", "delivered",
  "carrierCode", "trackingRef", "trackingLastSyncAt", "trackingSyncError",
  "autoMovedUntil", "officeId",
];
