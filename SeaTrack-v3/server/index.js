import { createServer } from "node:http";
import { appendFile, mkdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import { existsSync, readFileSync, createReadStream } from "node:fs";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { deriveTimelineStatus } from "./trackingStatus.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function findClassicOutlookPath() {
  const basePaths = [
    process.env.ProgramFiles,
    process.env["ProgramFiles(x86)"],
    "C:\\Program Files",
    "C:\\Program Files (x86)",
  ].filter(Boolean);

  const officeVersions = ["Office16", "Office15", "Office14"];
  for (const base of basePaths) {
    for (const version of officeVersions) {
      const candidate = join(base, "Microsoft Office", "root", version, "OUTLOOK.EXE");
      if (existsSync(candidate)) return candidate;
    }
  }

  return null;
}

function buildOutlookComposeTarget({ to, cc, subject, body }) {
  const recipient = Array.isArray(to) ? to.join(";") : "";
  const params = [];
  if (Array.isArray(cc) && cc.length) {
    params.push(`cc=${encodeURIComponent(cc.join(";"))}`);
  }
  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }
  const query = params.join("&");
  return query ? `${recipient}?${query}` : recipient;
}

function openOutlookClassicDraft({ to, cc, subject, body, attachmentPath }) {
  if (process.platform !== "win32") {
    throw new Error("Outlook Classic launch is supported only on Windows.");
  }

  const outlookPath = findClassicOutlookPath();
  if (!outlookPath) {
    throw new Error("OUTLOOK.EXE not found. Install Outlook Classic desktop app.");
  }

  const target = buildOutlookComposeTarget({ to, cc, subject, body });
  if (!target) {
    throw new Error("No recipient e-mail provided.");
  }

  const args = ["/c", "ipm.note", "/m", target];
  if (attachmentPath) {
    args.push("/a", attachmentPath);
  }

  const child = spawn(outlookPath, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();
}

function loadEnvFile() {
  const envPath = join(__dirname, "..", ".env");
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const PORT = Number(process.env.MAIL_API_PORT || 8787);
const ALLOWED_ORIGIN = process.env.MAIL_API_ORIGIN || "http://localhost:5173";
const LOG_PATH = process.env.MAIL_LOG_PATH || "./logs/email-log.ndjson";
const TRACKING_LOG_PATH = process.env.TRACKING_LOG_PATH || "./logs/tracking-sync.ndjson";
const TRACKING_MOCK_PATH = process.env.TRACKING_MOCK_PATH || "./logs/tracking-mock.json";
const AUTH_LOG_PATH = process.env.AUTH_LOG_PATH || "./logs/auth-log.ndjson";
const AUDIT_LOG_PATH = process.env.AUDIT_LOG_PATH || "./logs/audit-log.ndjson";
const USERS_PATH = process.env.USERS_PATH || "./data/users.json";
const UPLOADS_PATH = process.env.UPLOADS_PATH || "./uploads";
const AUTH_REQUIRED = String(process.env.AUTH_REQUIRED || "false").toLowerCase() === "true";
const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || "seatrack-dev-insecure-secret";
const AUTH_TOKEN_TTL_HOURS = Number(process.env.AUTH_TOKEN_TTL_HOURS || 12);
const AUTH_TEMP_PASSWORD = process.env.AUTH_TEMP_PASSWORD || "SeaTrack1!";

const AUTH_DEFAULT_JWT_SECRET = "seatrack-dev-insecure-secret";
const AUTH_DEFAULT_TEMP_PASSWORD = "SeaTrack1!";
const authSecurityWarnings = [];
if (!AUTH_REQUIRED) {
  authSecurityWarnings.push("AUTH_REQUIRED is false: document, tracking-sync, and email endpoints are reachable without a token.");
}
if (AUTH_JWT_SECRET === AUTH_DEFAULT_JWT_SECRET) {
  authSecurityWarnings.push("AUTH_JWT_SECRET is not set; using the built-in insecure fallback value.");
}
if (AUTH_TEMP_PASSWORD === AUTH_DEFAULT_TEMP_PASSWORD) {
  authSecurityWarnings.push("AUTH_TEMP_PASSWORD is not set; using the published default value.");
}

const MAX_FILE_SIZE_BYTES = Number(process.env.MAX_FILE_SIZE_MB || 25) * 1024 * 1024;
const MAX_FILES_PER_SHIPMENT = Number(process.env.MAX_FILES_PER_SHIPMENT || 20);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx"]);

const resolvedLogPath = join(__dirname, LOG_PATH.replace(/^\.\//, ""));
const resolvedTrackingLogPath = join(__dirname, TRACKING_LOG_PATH.replace(/^\.\//, ""));
const resolvedTrackingMockPath = join(__dirname, TRACKING_MOCK_PATH.replace(/^\.\//, ""));
const resolvedAuthLogPath = join(__dirname, AUTH_LOG_PATH.replace(/^\.\//, ""));
const resolvedAuditLogPath = join(__dirname, AUDIT_LOG_PATH.replace(/^\.\//, ""));
const resolvedUsersPath = join(__dirname, USERS_PATH.replace(/^\.\//, ""));
const resolvedUploadsPath = join(__dirname, UPLOADS_PATH.replace(/^\.\//, ""));
const maerskTokenCache = { token: "", expiresAt: 0 };
const cmaRateLimitState = {
  cooldownUntil: 0,
  reason: "",
};
// Rate limit for tracking sync requests (respects CMA's global quota: 20/hour ≈ 3 min per sync)
const trackingSyncRateLimit = {
  minIntervalMs: Number(process.env.TRACKING_SYNC_MIN_INTERVAL_MS || 180000), // 3 minutes default
  lastSyncAtMs: 0,
};
const HAPAG_CARRIER_CODES = new Set(["HAPAG", "HAPAG-LLOYD", "HLCU", "HL"]);
const CMA_CARRIER_CODES = new Set(["CMA", "CMA CGM", "CMACGM", "CMDU"]);
const MAERSK_CARRIER_CODES = new Set(["MAERSK", "MAEU"]);

// Add new carriers by appending one entry here and implementing a fetcher.
// Fetcher contract (normalized later):
// { trackingKey, eta, etd, status, trackingSyncError }
const TRACKING_ADAPTER_REGISTRY = [
  {
    source: "cma",
    carrierCodes: CMA_CARRIER_CODES,
    fetcher: fetchCmaTrackingUpdate,
  },
  {
    source: "hapag",
    carrierCodes: HAPAG_CARRIER_CODES,
    fetcher: fetchHapagTrackingUpdate,
  },
  {
    source: "maersk",
    carrierCodes: MAERSK_CARRIER_CODES,
    fetcher: fetchMaerskTrackingUpdate,
  },
];

function getTrackingAdapterBySource(source) {
  const normalizedSource = String(source || "").trim().toLowerCase();
  return TRACKING_ADAPTER_REGISTRY.find((adapter) => adapter.source === normalizedSource) || null;
}

function resolveTrackingAdapterSource(preferredSource, carrierCode) {
  const normalizedCarrier = String(carrierCode || "").trim().toUpperCase();
  for (const adapter of TRACKING_ADAPTER_REGISTRY) {
    if (adapter.carrierCodes.has(normalizedCarrier)) return adapter.source;
  }

  const preferredAdapter = getTrackingAdapterBySource(preferredSource);
  if (preferredAdapter) return preferredAdapter.source;
  return "maersk";
}

function resolveTrackingAdapter(preferredSource, carrierCode) {
  const source = resolveTrackingAdapterSource(preferredSource, carrierCode);
  return getTrackingAdapterBySource(source) || getTrackingAdapterBySource("maersk");
}

const STATUS_LABEL = {
  booked: "Zarezerwowany",
  delivered_to_port: "Dostarczony do portu",
  departed: "Wyplyniecie",
  in_transit: "W tranzycie",
  arrived: "Przybyl",
  customs: "Odprawa",
  gone_out: "Wyjechal",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function snapshotSendRequest({ to, cc, subject, body, shipment }) {
  return {
    to: Array.isArray(to) ? to : [],
    cc: Array.isArray(cc) ? cc : [],
    subject: typeof subject === "string" ? subject : "",
    body: typeof body === "string" ? body : "",
    shipment: shipment && typeof shipment === "object" ? shipment : {},
  };
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8") || "{}";
  return JSON.parse(raw);
}

function getStatusTemplate(shipment) {
  const status = shipment?.status || "booked";
  const map = {
    booked: [
      "Przesylka jest potwierdzona i oczekuje na kolejne operacje.",
      "Bede informowac na biezaco o zmianie etapu.",
    ],
    delivered_to_port: [
      "Ladunek zostal dostarczony do portu i oczekuje na operacje armatorskie.",
      "Po potwierdzeniu wyplyniecia wysle kolejna aktualizacje.",
    ],
    departed: [
      "Jednostka wyplynela zgodnie z harmonogramem.",
      "Kolejna aktualizacja po wejsciu w pelny tranzyt.",
    ],
    in_transit: [
      "Przesylka jest aktualnie w tranzycie morskim.",
      "Monitorujemy ETA i damy znac przy kazdej istotnej zmianie.",
    ],
    arrived: [
      "Przesylka przybyla do portu docelowego.",
      "Kolejny krok to proces odprawy i wydania.",
    ],
    customs: [
      "Przesylka jest aktualnie na etapie odprawy.",
      "Po zakonczonej odprawie przeslemy potwierdzenie wydania.",
    ],
    gone_out: [
      "Przesylka opuscila port i jest po stronie dostawy koncowej.",
      "Temat uznajemy za operacyjnie domkniety.",
    ],
  };
  return map[status] || ["Przesylamy aktualizacje statusu przesylki."];
}

function buildEmailFromShipment(shipment) {
  const statusLabel = STATUS_LABEL[shipment?.status] || shipment?.status || "Brak statusu";
  const intro = getStatusTemplate(shipment);
  const lines = [
    "Dzien dobry,",
    "",
    `Przesylamy aktualizacje statusu przesylki ${shipment?.id || ""}.`,
    ...intro,
    "",
    `Status: ${statusLabel}`,
    `Klient: ${shipment?.client || "-"}`,
    `Trasa: ${shipment?.route || "-"}`,
    `ETD: ${shipment?.etd || "-"}`,
    `ETA: ${shipment?.eta || "-"}`,
    `B/L: ${shipment?.bl || "-"}`,
    `Kontener: ${shipment?.container || "-"}`,
    `Odprawiony (c/c): ${shipment?.customsCleared ? "TAK" : "NIE"}`,
    `Dostarczony (DEL): ${shipment?.delivered ? "TAK" : "NIE"}`,
    "",
    "W razie pytan pozostaje do dyspozycji.",
    "",
    "Pozdrawiam,",
  ];

  return {
    subject: `Status przesylki ${shipment?.id || ""}`,
    body: lines.join("\n"),
  };
}

function buildBulkStatusEmail(shipments) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pl-PL");
  const timeStr = now.toLocaleTimeString("pl-PL");
  
  const lines = [
    "Dzien dobry,",
    "",
    `Przesylamy raport zbiorczy dla ${shipments.length} przesylek.`,
    `Data i godzina: ${dateStr} ${timeStr}`,
    "",
    "=== ZESTAWIENIE PRZESYLEK ===",
    "",
  ];

  // Add table header
  lines.push("Lp. | ID       | Status        | ETD        | ETA        | Kontener");
  lines.push("-".repeat(70));

  // Add shipment rows
  shipments.forEach((s, idx) => {
    const statusLabel = STATUS_LABEL[s?.status] || s?.status || "???";
    const container = s?.container || "—";
    const etd = s?.etd || "—";
    const eta = s?.eta || "—";
    const id = (s?.id || "—").padEnd(8);
    const status = statusLabel.padEnd(13);
    const row = `${String(idx + 1).padEnd(3)} | ${id} | ${status} | ${etd.padEnd(10)} | ${eta.padEnd(10)} | ${container}`;
    lines.push(row);
  });

  lines.push("");
  lines.push("-".repeat(70));
  lines.push("");
  lines.push("W razie pytan dotyczacych ktorejkolwiek z powyzszych przesylek,");
  lines.push("pozostaje do dyspozycji.");
  lines.push("");
  lines.push("Pozdrawiam,");

  return {
    subject: `Raport zbiorczy statusu przesylek - ${dateStr}`,
    body: lines.join("\n"),
  };
}

async function writeLog(entry) {
  await mkdir(dirname(resolvedLogPath), { recursive: true });
  await appendFile(resolvedLogPath, `${JSON.stringify(entry)}\n`, "utf8");
}

async function writeTrackingLog(entry) {
  await mkdir(dirname(resolvedTrackingLogPath), { recursive: true });
  await appendFile(resolvedTrackingLogPath, `${JSON.stringify(entry)}\n`, "utf8");
}

async function writeAuthLog(entry) {
  await mkdir(dirname(resolvedAuthLogPath), { recursive: true });
  await appendFile(resolvedAuthLogPath, `${JSON.stringify(entry)}\n`, "utf8");
}

async function writeAuditLog(entry) {
  await mkdir(dirname(resolvedAuditLogPath), { recursive: true });
  await appendFile(resolvedAuditLogPath, `${JSON.stringify(entry)}\n`, "utf8");
}

function toAsciiLower(value) {
  return String(value || "")
    .trim()
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildEmailFromName(name) {
  const parts = toAsciiLower(name)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return `${parts[0]}@mumnet.com`;
  const firstName = parts[parts.length - 1];
  const lastName = parts.slice(0, -1).join("-");
  return `${firstName}.${lastName}@mumnet.com`;
}

function normalizeOfficeId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw === "*") return "*";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 5 && digits.startsWith("44")) return digits;
  if (digits.length === 3) return `44${digits}`;
  return "";
}

function extractOfficeIdFromValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const fullMatch = raw.match(/^(44\d{3})/);
  if (fullMatch) return fullMatch[1];
  const shortMatch = raw.match(/^(\d{3})/);
  if (shortMatch) return `44${shortMatch[1]}`;
  return normalizeOfficeId(raw);
}

function deriveOfficeIdFromShipment(shipment, fallbackShipmentId = "", fallbackOfficeId = "") {
  const candidates = [
    shipment?.officeId,
    shipment?.office_id,
    shipment?.position,
    shipment?.pos,
    shipment?.shipmentPos,
    fallbackOfficeId,
    fallbackShipmentId,
    shipment?.id,
    shipment?.stn,
  ];

  for (const candidate of candidates) {
    const officeId = extractOfficeIdFromValue(candidate);
    if (officeId) return officeId;
  }

  return "";
}

function normalizeUserRecord(raw) {
  const role = String(raw?.role || "user").toLowerCase();
  const offices = Array.isArray(raw?.offices)
    ? raw.offices.map(normalizeOfficeId).filter(Boolean)
    : [];

  return {
    id: Number(raw?.id || 0),
    name: String(raw?.name || "").trim(),
    email: buildEmailFromName(raw?.name),
    role,
    status: String(raw?.status || "active").toLowerCase(),
    offices: offices.length ? offices : [],
    mustChangePassword: Boolean(raw?.mustChangePassword),
    passwordSalt: String(raw?.passwordSalt || ""),
    passwordHash: String(raw?.passwordHash || ""),
  };
}

function hashPassword(password, salt) {
  return scryptSync(String(password || ""), String(salt || ""), 64).toString("hex");
}

function createPasswordSeed() {
  const salt = randomBytes(16).toString("hex");
  return {
    passwordSalt: salt,
    passwordHash: hashPassword(AUTH_TEMP_PASSWORD, salt),
  };
}

async function readUsersFile() {
  const raw = await readFile(resolvedUsersPath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeUsersFile(users) {
  await mkdir(dirname(resolvedUsersPath), { recursive: true });
  await writeFile(resolvedUsersPath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

async function ensureSeededUsersFile() {
  const rawUsers = await readUsersFile();
  let changed = false;
  const nextUsers = rawUsers.map((rawUser) => {
    const user = normalizeUserRecord(rawUser);
    if (!user.passwordSalt || !user.passwordHash) {
      const seed = createPasswordSeed();
      changed = true;
      return {
        ...rawUser,
        passwordSalt: seed.passwordSalt,
        passwordHash: seed.passwordHash,
        mustChangePassword: rawUser?.mustChangePassword ?? true,
      };
    }
    return rawUser;
  });

  if (changed) {
    await writeUsersFile(nextUsers);
  }
}

const usersReadyPromise = ensureSeededUsersFile();

async function loadUsers() {
  await usersReadyPromise;
  const rawUsers = await readUsersFile();
  return rawUsers.map(normalizeUserRecord);
}

async function findUserByEmail(email) {
  const normalizedEmail = toAsciiLower(email);
  const users = await loadUsers();
  return users.find((user) => toAsciiLower(user.email) === normalizedEmail) || null;
}

async function findUserById(id) {
  const numericId = Number(id || 0);
  const users = await loadUsers();
  return users.find((user) => user.id === numericId) || null;
}

function verifyPassword(password, user) {
  if (!user?.passwordSalt || !user?.passwordHash) return false;
  const candidate = Buffer.from(hashPassword(password, user.passwordSalt), "hex");
  const expected = Buffer.from(user.passwordHash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

async function updateStoredUser(userId, updater) {
  await usersReadyPromise;
  const rawUsers = await readUsersFile();
  let updatedRecord = null;
  const nextUsers = rawUsers.map((rawUser) => {
    if (Number(rawUser?.id || 0) !== Number(userId || 0)) return rawUser;
    updatedRecord = updater(rawUser);
    return updatedRecord;
  });

  if (!updatedRecord) {
    throw new Error("User not found.");
  }

  await writeUsersFile(nextUsers);
  return normalizeUserRecord(updatedRecord);
}

function sanitizeUserForClient(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    offices: user.offices,
    mustChangePassword: user.mustChangePassword,
  };
}

function base64urlEncode(value) {
  const raw = Buffer.isBuffer(value) ? value.toString("base64") : Buffer.from(String(value), "utf8").toString("base64");
  return raw.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecode(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function signAuthToken(user) {
  const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64urlEncode(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    offices: user.offices,
    iat: now,
    exp: now + Math.max(AUTH_TOKEN_TTL_HOURS, 1) * 3600,
  }));
  const signature = base64urlEncode(createHmac("sha256", AUTH_JWT_SECRET).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${signature}`;
}

function verifyAuthToken(token) {
  const [header, payload, signature] = String(token || "").split(".");
  if (!header || !payload || !signature) {
    throw new Error("Invalid token format.");
  }

  const expected = base64urlEncode(createHmac("sha256", AUTH_JWT_SECRET).update(`${header}.${payload}`).digest());
  if (signature !== expected) {
    throw new Error("Invalid token signature.");
  }

  const decoded = JSON.parse(base64urlDecode(payload));
  if (!decoded?.sub || !decoded?.exp) {
    throw new Error("Invalid token payload.");
  }
  if (decoded.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired.");
  }
  return decoded;
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || "").trim();
  if (header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  const query = req.url?.split("?")[1] || "";
  const params = new URLSearchParams(query);
  return String(params.get("authToken") || "").trim();
}

function userHasGlobalAccess(user) {
  return user?.role === "superuser" || user?.role === "management" || Array.isArray(user?.offices) && user.offices.includes("*");
}

function userCanAccessOffice(user, officeId) {
  if (!user) return false;
  if (!officeId) return userHasGlobalAccess(user);
  if (userHasGlobalAccess(user)) return true;
  return Array.isArray(user.offices) && user.offices.includes(officeId);
}

async function authenticateRequest(req, res, options = {}) {
  const { required = AUTH_REQUIRED } = options;
  const token = getBearerToken(req);

  if (!token) {
    if (!required) return null;
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Authentication required." }));
    return false;
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await findUserById(payload.sub);
    if (!user || user.status !== "active") {
      throw new Error("User not active.");
    }
    req.authUser = user;
    return user;
  } catch (err) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: err?.message || "Invalid token." }));
    return false;
  }
}

function rejectForbidden(res, message = "Forbidden.") {
  res.writeHead(403, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: message }));
}

function ensureOfficeAccess(res, user, officeId, contextLabel = "shipment") {
  if (!user) return true;
  if (!officeId) {
    if (AUTH_REQUIRED && !userHasGlobalAccess(user)) {
      rejectForbidden(res, `Cannot resolve office for ${contextLabel}.`);
      return false;
    }
    return true;
  }
  if (userCanAccessOffice(user, officeId)) return true;
  rejectForbidden(res, `No access to office ${officeId}.`);
  return false;
}

async function readLogs(limit = 50) {
  try {
    const raw = await readFile(resolvedLogPath, "utf8");
    const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
    return lines.slice(-limit).map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { parseError: true, raw: line };
      }
    });
  } catch {
    return [];
  }
}

async function readShipmentAuditLogs(shipmentId, limit = 50) {
  try {
    const raw = await readFile(resolvedAuditLogPath, "utf8");
    const lines = raw.split("\n").map((line) => line.trim()).filter(Boolean);
    const records = [];
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed?.shipmentId === shipmentId) {
          records.push(parsed);
        }
      } catch {
        // Ignore broken log lines.
      }
    }
    return records.slice(-limit).reverse();
  } catch {
    return [];
  }
}

/* ─── DOCUMENT STORAGE ─── */

function sanitizePathSegment(value) {
  return String(value || "").replace(/[^a-zA-Z0-9\-_.]/g, "").slice(0, 200);
}

function generateDocId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function getShipmentUploadsDir(shipmentId) {
  const safe = sanitizePathSegment(shipmentId);
  if (!safe) throw new Error("Invalid shipment ID.");
  return join(resolvedUploadsPath, safe);
}

async function readShipmentDocState(shipmentId) {
  try {
    const metaPath = join(getShipmentUploadsDir(shipmentId), "metadata.json");
    const raw = await readFile(metaPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      officeId: normalizeOfficeId(parsed?.officeId),
      docs: Array.isArray(parsed?.docs) ? parsed.docs : [],
    };
  } catch {
    return { officeId: "", docs: [] };
  }
}

async function readDocMeta(shipmentId) {
  const state = await readShipmentDocState(shipmentId);
  return state.docs;
}

async function writeDocMeta(shipmentId, docs, officeId = "") {
  const dir = getShipmentUploadsDir(shipmentId);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "metadata.json"), JSON.stringify({ officeId: normalizeOfficeId(officeId), docs }, null, 2), "utf8");
}

function isAllowedFile(filename, mimeType) {
  const ext = extname(String(filename || "")).toLowerCase();
  const mime = String(mimeType || "").split(";")[0].trim().toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext) || ALLOWED_MIME_TYPES.has(mime);
}

function startOfDay(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseIsoDate(value) {
  if (!value) return null;
  const m = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function pickNewerDate(currentValue, incomingValue) {
  const current = parseIsoDate(currentValue);
  const incoming = parseIsoDate(incomingValue);
  if (!incoming) return current || null;
  if (!current) return incoming;
  return incoming > current ? incoming : current;
}

function guessOpStatus(eta, etd, finished) {
  if (finished && String(finished).trim() !== "") return "gone_out";
  const now = startOfDay(new Date());
  if (!eta && !etd) return "booked";
  const etaDate = eta ? startOfDay(eta) : null;
  const etdDate = etd ? startOfDay(etd) : null;

  if (etaDate && etaDate <= now) return "arrived";
  if (etdDate && etdDate.getTime() === now.getTime()) return "departed";
  if (etdDate && etdDate < now) return "in_transit";
  return "booked";
}

async function readTrackingMockData() {
  try {
    const raw = await readFile(resolvedTrackingMockPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function getTrackingLookupKeys(shipment) {
  const values = [
    shipment?.trackingRef,
    shipment?.container,
    shipment?.bl,
    shipment?.id,
  ];
  return values
    .map((v) => String(v || "").trim())
    .filter(Boolean)
    .filter((v, idx, arr) => arr.indexOf(v) === idx);
}

function getMockTrackingCandidate(mockMap, shipment) {
  const keys = getTrackingLookupKeys(shipment);
  for (const key of keys) {
    if (mockMap[key] && typeof mockMap[key] === "object") {
      return { key, data: mockMap[key] };
    }
  }
  return null;
}

function isContainerRef(value) {
  return /^[A-Za-z]{4}\d{7}$/.test(String(value || "").trim());
}

function extractFirstContainerRef(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return "";

  // Support user input with many containers in one field (comma/newline/semicolon separated).
  const candidates = value
    .split(/[\s,;|]+/)
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (isContainerRef(candidate)) return candidate;
  }

  return "";
}

function isBookingRef(value) {
  return /^[A-Za-z0-9]{9}$/.test(String(value || "").trim());
}

function parseApiErrorBody(body) {
  if (!body || typeof body !== "object") return "";
  return body?.message || body?.debugMessage || "";
}

function parseRetryAfterMs(headerValue) {
  const fallbackMs = Math.max(Number(process.env.CMA_RATE_LIMIT_FALLBACK_MS || 120000), 10000);
  const maxMs = Math.max(Number(process.env.CMA_RATE_LIMIT_MAX_MS || 900000), 10000);
  const value = String(headerValue || "").trim();
  if (!value) return Math.min(fallbackMs, maxMs);

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(Math.max(Math.floor(seconds * 1000), 1000), maxMs);
  }

  const dateTs = Date.parse(value);
  if (!Number.isNaN(dateTs)) {
    return Math.min(Math.max(dateTs - Date.now(), 1000), maxMs);
  }

  return Math.min(fallbackMs, maxMs);
}

function getCmaCooldownError() {
  const leftMs = cmaRateLimitState.cooldownUntil - Date.now();
  if (leftMs <= 0) return "";
  const leftSec = Math.max(1, Math.ceil(leftMs / 1000));
  const reason = cmaRateLimitState.reason ? ` (${cmaRateLimitState.reason})` : "";
  return `CMA API cooldown active for ${leftSec}s${reason}.`;
}

function buildMaerskConfig() {
  return {
    consumerKey: process.env.MAERSK_CONSUMER_KEY || process.env.MAERSK_CLIENT_ID || "",
    consumerSecret: process.env.MAERSK_CONSUMER_SECRET || process.env.MAERSK_CLIENT_SECRET || "",
    tokenUrl: process.env.MAERSK_OAUTH_TOKEN_URL || "https://api-stage.maersk.com/oauth2/access_token",
    baseUrl: process.env.MAERSK_TRACKING_BASE_URL || "https://api-stage.maersk.com/track-and-trace-private",
    scope: process.env.MAERSK_OAUTH_SCOPE || "",
    timeoutMs: Number(process.env.MAERSK_HTTP_TIMEOUT_MS || 15000),
    eventsLimit: Number(process.env.MAERSK_EVENTS_LIMIT || 100),
    apiVersion: process.env.MAERSK_API_VERSION || "1",
  };
}

function buildCmaConfig() {
  return {
    apiKey: process.env.CMA_API_KEY || process.env.CMA_KEY_ID || "",
    baseUrl: process.env.CMA_TRACKING_BASE_URL || "https://apis.cma-cgm.net",
    path: process.env.CMA_TRACKING_PATH || "/operation/trackandtrace/v1",
    timeoutMs: Number(process.env.CMA_HTTP_TIMEOUT_MS || 15000),
    eventsLimit: Number(process.env.CMA_EVENTS_LIMIT || 100),
    apiVersion: process.env.CMA_API_VERSION || "2.2.0",
  };
}

function getMaerskLookup(shipment) {
  const trackingRef = String(shipment?.trackingRef || "").trim();
  const container = extractFirstContainerRef(shipment?.container);
  const bl = String(shipment?.bl || "").trim();
  const booking = String(shipment?.bookingRef || "").trim();

  if (container && isContainerRef(container)) {
    return { key: "equipmentReference", value: container };
  }
  if (trackingRef && isContainerRef(trackingRef)) {
    return { key: "equipmentReference", value: trackingRef };
  }
  if (bl) {
    return { key: "transportDocumentReference", value: bl };
  }
  if (trackingRef) {
    return { key: "transportDocumentReference", value: trackingRef };
  }
  if (booking && isBookingRef(booking)) {
    return { key: "carrierBookingReference", value: booking };
  }
  return null;
}

function getCmaLookup(shipment) {
  const trackingRef = String(shipment?.trackingRef || "").trim();
  const container = extractFirstContainerRef(shipment?.container);
  const bl = String(shipment?.bl || "").trim();
  const booking = String(shipment?.bookingRef || "").trim();

  if (container && isContainerRef(container)) {
    return { key: "equipmentReference", value: container };
  }
  if (trackingRef && isContainerRef(trackingRef)) {
    return { key: "equipmentReference", value: trackingRef };
  }
  if (bl) {
    return { key: "transportDocumentReference", value: bl };
  }
  if (trackingRef) {
    return { key: "transportDocumentReference", value: trackingRef };
  }
  if (booking && isBookingRef(booking)) {
    return { key: "carrierBookingReference", value: booking };
  }
  return null;
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(Number(timeoutMs) || 15000, 1000));
  try {
    return await fetchJson(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function formatNetworkError(err) {
  const base = String(err?.message || "Network request failed.");
  const causeCode = String(err?.cause?.code || "").trim();
  const causeMsg = String(err?.cause?.message || "").trim();

  if (causeCode || causeMsg) {
    return `${base}${causeCode ? ` (${causeCode})` : ""}${causeMsg ? ` - ${causeMsg}` : ""}`;
  }

  return base;
}

async function fetchJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    throw new Error(formatNetworkError(err));
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = parseApiErrorBody(body);
    const error = new Error(`${response.status} ${response.statusText}${detail ? ` - ${detail}` : ""}`);
    error.status = response.status;
    error.headers = response.headers;
    error.apiDetail = detail;
    throw error;
  }
  return body;
}

async function getMaerskAccessToken(config) {
  const now = Date.now();
  if (maerskTokenCache.token && maerskTokenCache.expiresAt > now + 30_000) {
    return maerskTokenCache.token;
  }

  if (!config.consumerKey || !config.consumerSecret) {
    throw new Error("Missing MAERSK_CONSUMER_KEY or MAERSK_CONSUMER_SECRET.");
  }

  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");
  body.set("client_id", config.consumerKey);
  body.set("client_secret", config.consumerSecret);
  if (config.scope) body.set("scope", config.scope);

  const basicAuth = `Basic ${Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64")}`;
  let tokenRes;
  try {
    tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
  } catch (err) {
    throw new Error(`OAuth token request failed: ${formatNetworkError(err)}`);
  }

  // Some Maersk tenants still require HTTP Basic auth for client credentials.
  if (!tokenRes.ok && tokenRes.status === 401) {
    try {
      tokenRes = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: basicAuth,
        },
        body: body.toString(),
      });
    } catch (err) {
      throw new Error(`OAuth token request failed: ${formatNetworkError(err)}`);
    }
  }

  const tokenBody = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok || !tokenBody?.access_token) {
    const detail = parseApiErrorBody(tokenBody);
    throw new Error(`OAuth token error: ${tokenRes.status}${detail ? ` - ${detail}` : ""}`);
  }

  const expiresIn = Number(tokenBody.expires_in || 3600);
  maerskTokenCache.token = tokenBody.access_token;
  maerskTokenCache.expiresAt = Date.now() + Math.max(expiresIn - 60, 60) * 1000;
  return maerskTokenCache.token;
}

function eventToMillis(value) {
  const ts = Date.parse(String(value || ""));
  return Number.isNaN(ts) ? 0 : ts;
}

function classifierRank(code) {
  const value = String(code || "").trim().toUpperCase();
  if (value === "ACT" || value === "ACTUAL") return 3;
  if (value === "EST" || value === "ESTIMATED") return 2;
  if (value === "PLN" || value === "PLANNED") return 1;
  return 0;
}

function pickBestEvent(events, predicate) {
  const items = events.filter(predicate);
  if (!items.length) return null;
  items.sort((a, b) => {
    const diffEvent = eventToMillis(b.eventDateTime) - eventToMillis(a.eventDateTime);
    if (diffEvent !== 0) return diffEvent;
    const diffClassifier = classifierRank(b.eventClassifierCode) - classifierRank(a.eventClassifierCode);
    if (diffClassifier !== 0) return diffClassifier;
    return eventToMillis(b.eventCreatedDateTime) - eventToMillis(a.eventCreatedDateTime);
  });
  return items[0];
}

function resolveMaerskDates(events) {
  const bestDeparture = pickBestEvent(
    events,
    (e) => e?.eventType === "TRANSPORT" && e?.transportEventTypeCode === "DEPA",
  ) || pickBestEvent(
    events,
    (e) => e?.eventType === "EQUIPMENT" && ["LOAD", "GTOT"].includes(e?.equipmentEventTypeCode),
  );

  const bestArrival = pickBestEvent(
    events,
    (e) => e?.eventType === "TRANSPORT" && e?.transportEventTypeCode === "ARRI",
  ) || pickBestEvent(
    events,
    (e) => e?.eventType === "EQUIPMENT" && ["DISC", "PICK", "DROP"].includes(e?.equipmentEventTypeCode),
  );

  return {
    etd: parseIsoDate(bestDeparture?.eventDateTime),
    eta: parseIsoDate(bestArrival?.eventDateTime),
  };
}

function deriveStatusFromMaerskEvents({ mergedEta, mergedEtd, shipment }) {
  return deriveTimelineStatus({
    eta: mergedEta,
    etd: mergedEtd,
    previousStatus: shipment?.status,
    preserveManualCustoms: Boolean(shipment?.customsCleared),
    preserveManualGoneOut: Boolean(shipment?.delivered),
    today: new Date(),
  });
}

function normalizeTrackingAdapterResult(shipment, partial) {
  const fallbackEta = parseIsoDate(shipment?.eta);
  const fallbackEtd = parseIsoDate(shipment?.etd);
  const fallbackStatus = String(shipment?.status || "booked");
  const rawStatus = typeof partial?.status === "string" ? partial.status.trim() : "";
  const rawError = partial?.trackingSyncError;

  return {
    trackingKey: partial?.trackingKey ? String(partial.trackingKey) : null,
    eta: parseIsoDate(partial?.eta) || fallbackEta,
    etd: parseIsoDate(partial?.etd) || fallbackEtd,
    status: rawStatus || fallbackStatus,
    trackingSyncError: rawError == null ? null : String(rawError),
  };
}

async function fetchMaerskTrackingUpdate(shipment) {
  const config = buildMaerskConfig();
  const lookup = getMaerskLookup(shipment);
  if (!lookup) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "Missing lookup reference (container/BL/trackingRef).",
    });
  }

  const code = String(shipment?.carrierCode || "").trim().toUpperCase();
  if (code && !["MAERSK", "MAEU"].includes(code)) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: `${lookup.key}:${lookup.value}`,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: `Carrier ${code} not supported by Maersk adapter.`,
    });
  }

  const token = await getMaerskAccessToken(config);
  const params = new URLSearchParams();
  params.set(lookup.key, lookup.value);
  params.set("eventType", "TRANSPORT,EQUIPMENT");
  params.set("sort", "eventDateTime:DESC,eventCreatedDateTime:DESC");
  params.set("limit", String(Math.min(Math.max(config.eventsLimit, 1), 500)));

  const url = `${config.baseUrl.replace(/\/$/, "")}/events?${params.toString()}`;
  const body = await fetchJson(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Consumer-Key": config.consumerKey,
      "API-Version": config.apiVersion,
      Accept: "application/json",
    },
  });

  const events = Array.isArray(body?.events) ? body.events : [];
  const beforeEta = parseIsoDate(shipment?.eta);
  const beforeEtd = parseIsoDate(shipment?.etd);
  const beforeStatus = String(shipment?.status || "booked");
  const fromEvents = resolveMaerskDates(events);
  const mergedEta = pickNewerDate(beforeEta, fromEvents.eta);
  const mergedEtd = pickNewerDate(beforeEtd, fromEvents.etd);
  const status = deriveStatusFromMaerskEvents({ mergedEta, mergedEtd, shipment });

  return normalizeTrackingAdapterResult(shipment, {
    trackingKey: `${lookup.key}:${lookup.value}`,
    eta: mergedEta,
    etd: mergedEtd,
    status: status || beforeStatus,
    trackingSyncError: events.length ? null : "No events returned by Maersk API.",
  });
}

async function fetchCmaTrackingUpdate(shipment) {
  const config = buildCmaConfig();
  const cooldownError = getCmaCooldownError();
  if (cooldownError) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: cooldownError,
    });
  }

  if (!config.apiKey) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "CMA_API_KEY not configured.",
    });
  }

  const lookup = getCmaLookup(shipment);
  if (!lookup) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "Missing lookup reference (container/BL/trackingRef).",
    });
  }

  const code = String(shipment?.carrierCode || "").trim().toUpperCase();
  if (code && !CMA_CARRIER_CODES.has(code)) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: `${lookup.key}:${lookup.value}`,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: `Carrier ${code} not supported by CMA adapter.`,
    });
  }

  const params = new URLSearchParams();
  params.set(lookup.key, lookup.value);
  params.set("eventType", "TRANSPORT,EQUIPMENT");
  params.set("limit", String(Math.min(Math.max(config.eventsLimit, 1), 500)));

  const path = `${config.path || "/operation/trackandtrace/v1"}`.replace(/\/+$/, "");
  const base = `${config.baseUrl || "https://apis.cma-cgm.net"}`.replace(/\/+$/, "");
  const url = `${base}${path}/events?${params.toString()}`;

  let body;
  try {
    body = await fetchJsonWithTimeout(url, {
      method: "GET",
      headers: {
        keyId: config.apiKey,
        "API-Version": config.apiVersion,
        Accept: "application/json",
      },
    }, config.timeoutMs);
  } catch (err) {
    if (Number(err?.status) === 429) {
      const retryAfterHeader = err?.headers?.get?.("retry-after");
      const retryAfterMs = parseRetryAfterMs(retryAfterHeader);
      cmaRateLimitState.cooldownUntil = Date.now() + retryAfterMs;
      cmaRateLimitState.reason = String(err?.apiDetail || "API rate limit exceeded");
    }
    throw err;
  }

  const events = Array.isArray(body)
    ? body
    : (Array.isArray(body?.events) ? body.events : []);

  const beforeEta = parseIsoDate(shipment?.eta);
  const beforeEtd = parseIsoDate(shipment?.etd);
  const beforeStatus = String(shipment?.status || "booked");
  const fromEvents = resolveMaerskDates(events);
  const mergedEta = pickNewerDate(beforeEta, fromEvents.eta);
  const mergedEtd = pickNewerDate(beforeEtd, fromEvents.etd);
  const status = deriveStatusFromMaerskEvents({ mergedEta, mergedEtd, shipment });

  return normalizeTrackingAdapterResult(shipment, {
    trackingKey: `${lookup.key}:${lookup.value}`,
    eta: mergedEta,
    etd: mergedEtd,
    status: status || beforeStatus,
    trackingSyncError: events.length ? null : "No events returned by CMA API.",
  });
}

function buildHapagConfig() {
  return {
    clientId: process.env.HAPAG_CLIENT_ID || "",
    clientSecret: process.env.HAPAG_CLIENT_SECRET || "",
    baseUrl: "https://api.hlag.com/hlag/exp/tnt2/tracking/v2",
  };
}

function getHapagLookup(shipment) {
  const container = extractFirstContainerRef(shipment?.container);
  if (container) return { key: "containerNumber", value: container };
  if (shipment?.bl) return { key: "billOfLadingNumber", value: String(shipment.bl).trim() };
  if (shipment?.trackingRef) {
    const trackingRefContainer = extractFirstContainerRef(shipment?.trackingRef);
    if (trackingRefContainer) return { key: "containerNumber", value: trackingRefContainer };
  }
  return null;
}

function resolveHapagDates(data) {
  let eta = null;
  let etd = null;

  const legs = Array.isArray(data?.transportLegs) ? data.transportLegs : [];
  for (const leg of legs) {
    const arrivalDate = leg?.arrival?.plannedArrival || leg?.arrival?.actualArrival;
    const departureDate = leg?.departure?.plannedDeparture || leg?.departure?.actualDeparture;
    if (arrivalDate) eta = pickNewerDate(eta, parseIsoDate(arrivalDate));
    if (departureDate) etd = pickNewerDate(etd, parseIsoDate(departureDate));
  }

  // Also check top-level estimatedTimeOfArrival / estimatedTimeOfDeparture
  if (data?.estimatedTimeOfArrival) eta = pickNewerDate(eta, parseIsoDate(data.estimatedTimeOfArrival));
  if (data?.estimatedTimeOfDeparture) etd = pickNewerDate(etd, parseIsoDate(data.estimatedTimeOfDeparture));

  return { eta, etd };
}

function deriveStatusFromHapagData(data, shipment) {
  const transportStatus = String(data?.transportStatus || "").toUpperCase();
  const beforeStatus = String(shipment?.status || "booked");

  if (transportStatus === "ARRIVED") return "arrived";
  if (transportStatus === "IN_TRANSIT" || transportStatus === "INTRANSIT") return "in_transit";
  if (transportStatus === "DEPARTED") return "departed";
  if (transportStatus === "LOADED") return "delivered_to_port";

  return beforeStatus;
}

async function fetchHapagTrackingUpdate(shipment) {
  const config = buildHapagConfig();

  if (!config.clientId || !config.clientSecret) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "HAPAG_CLIENT_ID or HAPAG_CLIENT_SECRET not configured.",
    });
  }

  const lookup = getHapagLookup(shipment);
  if (!lookup) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: null,
      eta: parseIsoDate(shipment?.eta),
      etd: parseIsoDate(shipment?.etd),
      status: String(shipment?.status || "booked"),
      trackingSyncError: "Missing lookup reference (container/BL/trackingRef).",
    });
  }

  const params = new URLSearchParams();
  params.set(lookup.key, lookup.value);
  const url = `${config.baseUrl}?${params.toString()}`;

  const body = await fetchJson(url, {
    method: "GET",
    headers: {
      "X-IBM-Client-Id": config.clientId,
      "X-IBM-Client-Secret": config.clientSecret,
      Accept: "application/json",
    },
  });

  const beforeEta = parseIsoDate(shipment?.eta);
  const beforeEtd = parseIsoDate(shipment?.etd);
  const beforeStatus = String(shipment?.status || "booked");

  // Response may be an array or single object
  const record = Array.isArray(body) ? body[0] : body;
  if (!record) {
    return normalizeTrackingAdapterResult(shipment, {
      trackingKey: `${lookup.key}:${lookup.value}`,
      eta: beforeEta,
      etd: beforeEtd,
      status: beforeStatus,
      trackingSyncError: "No tracking data returned by Hapag-Lloyd API.",
    });
  }

  const fromApi = resolveHapagDates(record);
  const mergedEta = pickNewerDate(beforeEta, fromApi.eta);
  const mergedEtd = pickNewerDate(beforeEtd, fromApi.etd);
  const status = deriveStatusFromHapagData(record, shipment);

  return normalizeTrackingAdapterResult(shipment, {
    trackingKey: `${lookup.key}:${lookup.value}`,
    eta: mergedEta,
    etd: mergedEtd,
    status: status || beforeStatus,
    trackingSyncError: null,
  });
}

async function sendWithResend({ to, cc, subject, body, attachments }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or MAIL_FROM in environment.");
  }

  const maxAttempts = Number(process.env.MAIL_RETRY_ATTEMPTS || 3);
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          cc: cc?.length ? cc : undefined,
          subject,
          text: body,
          ...(attachments?.length ? { attachments } : {}),
        }),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = json?.message || `Resend returned ${response.status}`;
        throw new Error(msg);
      }
      return { attempt, providerMessageId: json?.id || null };
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        await sleep(300 * 2 ** (attempt - 1));
      }
    }
  }

  throw new Error(lastError?.message || "Email send failed after retries.");
}

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  const pathOnly = req.url?.split("?")[0] || "/";

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && pathOnly === "/api/auth/config") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      authRequired: AUTH_REQUIRED,
      loginFormat: "imie.nazwisko@mumnet.com",
    }));
    return;
  }

  if (req.method === "POST" && pathOnly === "/api/auth/login") {
    const startedAt = new Date().toISOString();
    try {
      const payload = await readJsonBody(req);
      const email = String(payload?.email || "").trim();
      const password = String(payload?.password || "");
      if (!email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Email and password are required." }));
        return;
      }

      const user = await findUserByEmail(email);
      if (!user) {
        await writeAuthLog({ ts: startedAt, ok: false, type: "login", email, error: "User not found" }).catch(() => {});
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Invalid credentials." }));
        return;
      }

      if (user.status !== "active") {
        await writeAuthLog({ ts: startedAt, ok: false, type: "login", email, userId: user.id, error: "Inactive account" }).catch(() => {});
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Account inactive." }));
        return;
      }

      if (!verifyPassword(password, user)) {
        await writeAuthLog({ ts: startedAt, ok: false, type: "login", email, userId: user.id, error: "Wrong password" }).catch(() => {});
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Invalid credentials." }));
        return;
      }

      const token = signAuthToken(user);
      await writeAuthLog({ ts: startedAt, ok: true, type: "login", email, userId: user.id }).catch(() => {});
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, token, user: sanitizeUserForClient(user) }));
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err?.message || "Login failed." }));
      return;
    }
  }

  if (req.method === "GET" && pathOnly === "/api/auth/me") {
    const user = await authenticateRequest(req, res, { required: true });
    if (user === false) return;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, user: sanitizeUserForClient(user) }));
    return;
  }

  if (req.method === "POST" && pathOnly === "/api/auth/change-password") {
    const user = await authenticateRequest(req, res, { required: true });
    if (user === false) return;
    try {
      const payload = await readJsonBody(req);
      const currentPassword = String(payload?.currentPassword || "");
      const newPassword = String(payload?.newPassword || "");
      if (!verifyPassword(currentPassword, user)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Current password is incorrect." }));
        return;
      }
      if (newPassword.length < 8) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "New password must be at least 8 characters." }));
        return;
      }

      const seed = createPasswordSeed();
      const nextUser = await updateStoredUser(user.id, (rawUser) => ({
        ...rawUser,
        passwordSalt: seed.passwordSalt,
        passwordHash: hashPassword(newPassword, seed.passwordSalt),
        mustChangePassword: false,
      }));

      await writeAuthLog({ ts: new Date().toISOString(), ok: true, type: "change-password", userId: user.id }).catch(() => {});
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, user: sanitizeUserForClient(nextUser) }));
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err?.message || "Password change failed." }));
      return;
    }
  }

  if (req.method === "GET" && pathOnly === "/api/auth/users") {
    const user = await authenticateRequest(req, res, { required: true });
    if (user === false) return;
    const users = await loadUsers();
    const visibleUsers = users
      .filter((candidate) => candidate.status === "active")
      .filter((candidate) => userHasGlobalAccess(user) || candidate.offices.some((officeId) => userCanAccessOffice(user, officeId)));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, users: visibleUsers.map(sanitizeUserForClient) }));
    return;
  }

  const shipmentAuditUrl = pathOnly.match(/^\/api\/shipments\/([^/?]+)\/audit$/);
  const shipmentHistoryUrl = pathOnly.match(/^\/api\/shipments\/([^/?]+)\/history$/);

  if (req.method === "POST" && shipmentAuditUrl) {
    const user = await authenticateRequest(req, res, { required: true });
    if (user === false) return;
    try {
      const shipmentId = sanitizePathSegment(decodeURIComponent(shipmentAuditUrl[1]));
      const payload = await readJsonBody(req);
      const officeId = normalizeOfficeId(payload?.officeId);
      if (!ensureOfficeAccess(res, user, officeId, `audit for ${shipmentId}`)) return;
      await writeAuditLog({
        ts: new Date().toISOString(),
        shipmentId,
        officeId,
        action: String(payload?.action || "update"),
        field: String(payload?.field || ""),
        previousValue: payload?.previousValue ?? null,
        nextValue: payload?.nextValue ?? null,
        summary: String(payload?.summary || "Zmiana na przesylce"),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err?.message || "Audit save failed." }));
      return;
    }
  }

  if (req.method === "GET" && shipmentHistoryUrl) {
    const user = await authenticateRequest(req, res, { required: true });
    if (user === false) return;
    const shipmentId = sanitizePathSegment(decodeURIComponent(shipmentHistoryUrl[1]));
    const params = new URLSearchParams(req.url?.split("?")[1] || "");
    const officeId = normalizeOfficeId(params.get("officeId") || "");
    if (!ensureOfficeAccess(res, user, officeId, `history for ${shipmentId}`)) return;
    const logs = await readShipmentAuditLogs(shipmentId, 100);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, logs }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, provider: process.env.MAIL_PROVIDER || "resend" }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/tracking/health") {
    const source = process.env.TRACKING_SOURCE || "mock";
    const maersk = buildMaerskConfig();
    const cma = buildCmaConfig();
    const hapag = buildHapagConfig();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      source,
      mockPath: resolvedTrackingMockPath,
      maerskConfigured: Boolean(maersk.consumerKey && maersk.consumerSecret),
      maerskBaseUrl: maersk.baseUrl,
      cmaConfigured: Boolean(cma.apiKey),
      cmaBaseUrl: `${cma.baseUrl.replace(/\/+$/, "")}${cma.path}`,
      hapagConfigured: Boolean(hapag.clientId && hapag.clientSecret),
      hapagBaseUrl: hapag.baseUrl,
    }));
    return;
  }

  if (req.method === "GET" && req.url?.startsWith("/api/email/logs")) {
    const query = req.url.split("?")[1] || "";
    const params = new URLSearchParams(query);
    const limit = Number(params.get("limit") || 50);
    const logs = await readLogs(Number.isNaN(limit) ? 50 : Math.min(Math.max(limit, 1), 500));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, count: logs.length, logs }));
    return;
  }

  if (req.method === "POST" && req.url === "/api/email/send-status") {
    const startedAt = new Date().toISOString();
    let shipmentForLog = {};
    let toForLog = [];
    let ccForLog = [];
    let subjectForLog = "";
    let bodyForLog = "";
    let requestForLog = null;

    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;
      const payload = await readJsonBody(req);
      const officeId = deriveOfficeIdFromShipment(payload?.shipment);
      if (!ensureOfficeAccess(res, user, officeId, "shipment email")) return;
      const to = Array.isArray(payload.to) ? payload.to : [];
      const cc = Array.isArray(payload.cc) ? payload.cc : [];
      const shipment = payload.shipment || {};
      const template = buildEmailFromShipment(shipment);
      const subject = payload.subject || template.subject;
      const body = payload.body || template.body;

      shipmentForLog = shipment;
      toForLog = to;
      ccForLog = cc;
      subjectForLog = subject;
      bodyForLog = body;
      requestForLog = snapshotSendRequest({
        to,
        cc,
        subject,
        body,
        shipment,
      });

      // Load file attachments if requested
      let emailAttachments = [];
      if (Array.isArray(payload.attachDocIds) && payload.attachDocIds.length > 0 && shipment.id) {
        const safeShipId = sanitizePathSegment(String(shipment.id));
        const docList = await readDocMeta(safeShipId);
        for (const docId of payload.attachDocIds.slice(0, 10)) {
          const safeDocId = sanitizePathSegment(String(docId));
          const doc = docList.find((d) => d.id === safeDocId);
          if (!doc) continue;
          const filePath = join(getShipmentUploadsDir(safeShipId), doc.storedName);
          if (!filePath.startsWith(resolvedUploadsPath)) continue;
          try {
            const fileBuffer = await readFile(filePath);
            emailAttachments.push({ filename: doc.originalName, content: fileBuffer.toString("base64") });
          } catch {
            // Skip unreadable files
          }
        }
      }

      if (!to.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No recipient e-mail provided." }));
        return;
      }

      const result = await sendWithResend({ to, cc, subject, body, attachments: emailAttachments.length ? emailAttachments : undefined });
      const logEntry = {
        ts: startedAt,
        ok: true,
        type: "send-status",
        to,
        cc,
        subject,
        request: requestForLog,
        shipmentId: shipment.id || null,
        status: shipment.status || null,
        attempt: result.attempt,
        providerMessageId: result.providerMessageId,
      };
      await writeLog(logEntry);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, ...result }));
      return;
    } catch (err) {
      const body = {
        ok: false,
        error: err?.message || "Unknown send error",
      };

      await writeLog({
        ts: startedAt,
        ok: false,
        type: "send-status",
        to: toForLog,
        cc: ccForLog,
        subject: subjectForLog,
        request: requestForLog || snapshotSendRequest({
          to: toForLog,
          cc: ccForLog,
          subject: subjectForLog,
          body: bodyForLog,
          shipment: shipmentForLog,
        }),
        shipmentId: shipmentForLog.id || null,
        status: shipmentForLog.status || null,
        error: body.error,
      }).catch(() => {});

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
      return;
    }
  }

  if (req.method === "POST" && req.url === "/api/email/open-outlook-classic") {
    const startedAt = new Date().toISOString();
    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;
      const payload = await readJsonBody(req);
      const officeId = deriveOfficeIdFromShipment(payload?.shipment);
      if (!ensureOfficeAccess(res, user, officeId, "shipment email")) return;
      const to = Array.isArray(payload.to) ? payload.to : [];
      const cc = Array.isArray(payload.cc) ? payload.cc : [];
      const subject = typeof payload.subject === "string" ? payload.subject : "";
      const body = typeof payload.body === "string" ? payload.body : "";
      const shipment = payload.shipment || {};
      let attachmentPath = "";
      if (Array.isArray(payload.attachDocIds) && payload.attachDocIds.length > 0 && shipment.id) {
        const safeShipId = sanitizePathSegment(String(shipment.id));
        const docList = await readDocMeta(safeShipId);
        for (const docId of payload.attachDocIds.slice(0, 10)) {
          const safeDocId = sanitizePathSegment(String(docId));
          const doc = docList.find((d) => d.id === safeDocId);
          if (!doc) continue;
          const candidate = join(getShipmentUploadsDir(safeShipId), doc.storedName);
          if (!candidate.startsWith(resolvedUploadsPath)) continue;
          if (existsSync(candidate)) {
            attachmentPath = candidate;
            break;
          }
        }
      }

      openOutlookClassicDraft({ to, cc, subject, body, attachmentPath });

      await writeLog({
        ts: startedAt,
        ok: true,
        type: "outlook-classic",
        to,
        cc,
        subject,
        shipmentId: shipment.id || null,
        status: shipment.status || null,
      }).catch(() => {});

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, client: "outlook-classic" }));
      return;
    } catch (err) {
      await writeLog({
        ts: startedAt,
        ok: false,
        type: "outlook-classic",
        error: err?.message || "Failed to open Outlook Classic.",
      }).catch(() => {});

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: false,
        error: err?.message || "Failed to open Outlook Classic.",
      }));
      return;
    }
  }

  if (req.method === "POST" && req.url === "/api/email/send-bulk-status") {
    const startedAt = new Date().toISOString();
    let toForLog = [];
    let ccForLog = [];
    let subjectForLog = "";
    let shipmentIdsForLog = [];
    let requestForLog = null;

    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;
      const payload = await readJsonBody(req);
      const to = Array.isArray(payload.to) ? payload.to : [];
      const cc = Array.isArray(payload.cc) ? payload.cc : [];
      const shipments = Array.isArray(payload.shipments) ? payload.shipments : [];
      const subject = payload.subject || "";

      for (const shipment of shipments) {
        const officeId = deriveOfficeIdFromShipment(shipment);
        if (!ensureOfficeAccess(res, user, officeId, "bulk shipment email")) return;
      }

      toForLog = to;
      ccForLog = cc;
      subjectForLog = subject;
      shipmentIdsForLog = shipments.map(s => s.id).filter(Boolean);

      if (!to.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No recipient e-mail provided." }));
        return;
      }

      if (!shipments.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No shipments provided." }));
        return;
      }

      // Build bulk report email body
      const emailTemplate = buildBulkStatusEmail(shipments);
      const finalSubject = subject || emailTemplate.subject;
      const body = emailTemplate.body;

      requestForLog = {
        to,
        cc,
        subject: finalSubject,
        body,
        shipmentIds: shipmentIdsForLog,
        shipmentCount: shipments.length,
      };

      openOutlookClassicDraft({ to, cc, subject: finalSubject, body });

      const logEntry = {
        ts: startedAt,
        ok: true,
        type: "send-bulk-status",
        client: "outlook-classic",
        to,
        cc,
        subject: finalSubject,
        request: requestForLog,
        shipmentIds: shipmentIdsForLog,
        shipmentCount: shipments.length,
      };
      await writeLog(logEntry);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, client: "outlook-classic" }));
      return;
    } catch (err) {
      const body = {
        ok: false,
        error: err?.message || "Unknown bulk send error",
      };

      await writeLog({
        ts: startedAt,
        ok: false,
        type: "send-bulk-status",
        to: toForLog,
        cc: ccForLog,
        subject: subjectForLog,
        request: requestForLog,
        shipmentIds: shipmentIdsForLog,
        error: body.error,
      }).catch(() => {});

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
      return;
    }
  }

  if (req.method === "POST" && req.url === "/api/tracking/sync") {
    const startedAt = new Date().toISOString();
    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;

      // Rate limit: prevent frequent sync requests that would exceed CMA quota (20/hour)
      const now = Date.now();
      const msSinceLastSync = now - trackingSyncRateLimit.lastSyncAtMs;
      if (msSinceLastSync < trackingSyncRateLimit.minIntervalMs) {
        const msToWait = trackingSyncRateLimit.minIntervalMs - msSinceLastSync;
        res.writeHead(429, { "Content-Type": "application/json", "Retry-After": String(Math.ceil(msToWait / 1000)) });
        res.end(JSON.stringify({
          ok: false,
          error: `Tracking sync rate limit exceeded. Please retry in ${Math.ceil(msToWait / 1000)}s.`,
        }));
        return;
      }
      trackingSyncRateLimit.lastSyncAtMs = now;

      const payload = await readJsonBody(req);
      const source = process.env.TRACKING_SOURCE || "mock";
      const inputShipments = Array.isArray(payload?.shipments) ? payload.shipments : [];

      if (!inputShipments.length) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "No shipments provided." }));
        return;
      }

      const mockMap = source === "mock" ? await readTrackingMockData() : {};
      const updates = [];

      for (const shipment of inputShipments) {
        const officeId = deriveOfficeIdFromShipment(shipment);
        if (!ensureOfficeAccess(res, user, officeId, `tracking sync for ${shipment?.id || "shipment"}`)) return;
        const beforeEta = parseIsoDate(shipment?.eta);
        const beforeEtd = parseIsoDate(shipment?.etd);
        const beforeStatus = String(shipment?.status || "booked");
        let trackingKey = null;
        let incomingEta = null;
        let incomingEtd = null;
        let afterStatus = beforeStatus;
        let trackingSyncError = null;
        let resolvedSource = source;

        if (source === "mock") {
          const mockCandidate = getMockTrackingCandidate(mockMap, shipment);
          trackingKey = mockCandidate?.key || null;
          incomingEta = parseIsoDate(mockCandidate?.data?.eta);
          incomingEtd = parseIsoDate(mockCandidate?.data?.etd);
          const mergedEtaCandidate = pickNewerDate(beforeEta, incomingEta);
          const mergedEtdCandidate = pickNewerDate(beforeEtd, incomingEtd);
          afterStatus = guessOpStatus(mergedEtaCandidate, mergedEtdCandidate, shipment?.finished);
          trackingSyncError = mockCandidate ? null : "No tracking data found for provided reference.";
        } else {
          try {
            const carrierCode = String(shipment?.carrierCode || "").trim().toUpperCase();
            const adapterDefinition = resolveTrackingAdapter(source, carrierCode);
            resolvedSource = adapterDefinition.source;
            let adapter = await adapterDefinition.fetcher(shipment);
            adapter = normalizeTrackingAdapterResult(shipment, adapter);
            trackingKey = adapter.trackingKey;
            incomingEta = parseIsoDate(adapter.eta);
            incomingEtd = parseIsoDate(adapter.etd);
            afterStatus = adapter.status || beforeStatus;
            trackingSyncError = adapter.trackingSyncError || null;
          } catch (adapterErr) {
            trackingSyncError = String(adapterErr?.message || "Tracking sync error.");
          }
        }

        const mergedEta = pickNewerDate(beforeEta, incomingEta);
        const mergedEtd = pickNewerDate(beforeEtd, incomingEtd);
        if (!afterStatus) {
          afterStatus = guessOpStatus(mergedEta, mergedEtd, shipment?.finished);
        }
        const changed = mergedEta !== beforeEta || mergedEtd !== beforeEtd || afterStatus !== beforeStatus;

        updates.push({
          id: shipment?.id || null,
          changed,
          source: resolvedSource,
          trackingKey,
          eta: mergedEta,
          etd: mergedEtd,
          status: afterStatus,
          previous: {
            eta: beforeEta,
            etd: beforeEtd,
            status: beforeStatus,
          },
          trackingLastSyncAt: startedAt,
          trackingSyncError,
        });
      }

      const changedCount = updates.filter((u) => u.changed).length;
      await writeTrackingLog({
        ts: startedAt,
        ok: true,
        type: "tracking-sync",
        source,
        count: updates.length,
        changedCount,
        updates,
      }).catch(() => {});

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        ok: true,
        source,
        count: updates.length,
        changedCount,
        updates,
      }));
      return;
    } catch (err) {
      await writeTrackingLog({
        ts: startedAt,
        ok: false,
        type: "tracking-sync",
        error: err?.message || "Tracking sync failed.",
      }).catch(() => {});

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err?.message || "Tracking sync failed." }));
      return;
    }
  }

  // ─── DOCUMENT ENDPOINTS ───
  const shipmentDocsListUrl = req.url?.match(/^\/api\/shipments\/([^/?]+)\/documents\/?(?:\?.*)?$/);
  const shipmentDocItemUrl = req.url?.match(/^\/api\/shipments\/([^/?]+)\/documents\/([^/?]+)\/?(?:\?.*)?$/);

  // POST /api/shipments/:id/documents — upload (base64 JSON body)
  if (req.method === "POST" && shipmentDocsListUrl) {
    const shipmentId = sanitizePathSegment(decodeURIComponent(shipmentDocsListUrl[1]));
    if (!shipmentId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid shipment ID." }));
      return;
    }
    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;
      const payload = await readJsonBody(req);
      const existingState = await readShipmentDocState(shipmentId);
      const officeId = deriveOfficeIdFromShipment(payload?.shipment, shipmentId, payload?.officeId || existingState.officeId);
      if (!ensureOfficeAccess(res, user, officeId, `documents for ${shipmentId}`)) return;
      const { filename, mimeType, content } = payload;
      const fileSize = Number(payload.size || 0);
      if (!filename || typeof content !== "string" || !content) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Wymagane pola: filename, content (base64)." }));
        return;
      }
      if (!isAllowedFile(filename, mimeType)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Niedozwolony typ pliku. Dozwolone: ${Array.from(ALLOWED_EXTENSIONS).join(", ")}` }));
        return;
      }
      if (fileSize > MAX_FILE_SIZE_BYTES) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Plik zbyt duzy. Maks. ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.` }));
        return;
      }
      const existingDocs = await readDocMeta(shipmentId);
      if (existingDocs.length >= MAX_FILES_PER_SHIPMENT) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Przekroczono limit ${MAX_FILES_PER_SHIPMENT} dokumentow na przesylke.` }));
        return;
      }
      const buffer = Buffer.from(content, "base64");
      if (buffer.length > MAX_FILE_SIZE_BYTES) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Plik zbyt duzy. Maks. ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.` }));
        return;
      }
      const docId = generateDocId();
      const ext = extname(filename).toLowerCase() || ".bin";
      const storedName = `${docId}${ext}`;
      const dir = getShipmentUploadsDir(shipmentId);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, storedName), buffer);
      const docEntry = {
        id: docId,
        originalName: filename,
        storedName,
        mimeType: String(mimeType || "application/octet-stream").split(";")[0].trim(),
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
      };
      await writeDocMeta(shipmentId, [...existingDocs, docEntry], officeId || existingState.officeId);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, doc: docEntry }));
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err?.message || "Blad uploadu." }));
      return;
    }
  }

  // GET /api/shipments/:id/documents — list docs
  if (req.method === "GET" && shipmentDocsListUrl) {
    const shipmentId = sanitizePathSegment(decodeURIComponent(shipmentDocsListUrl[1]));
    if (!shipmentId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid shipment ID." }));
      return;
    }
    const user = await authenticateRequest(req, res);
    if (user === false) return;
    const docState = await readShipmentDocState(shipmentId);
    const officeId = docState.officeId || extractOfficeIdFromValue(shipmentId);
    if (!ensureOfficeAccess(res, user, officeId, `documents for ${shipmentId}`)) return;
    const docs = await readDocMeta(shipmentId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, docs }));
    return;
  }

  // GET /api/shipments/:id/documents/:docId — download
  if (req.method === "GET" && shipmentDocItemUrl) {
    const shipmentId = sanitizePathSegment(decodeURIComponent(shipmentDocItemUrl[1]));
    const docId = sanitizePathSegment(decodeURIComponent(shipmentDocItemUrl[2]));
    if (!shipmentId || !docId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid IDs." }));
      return;
    }
    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;
      const docState = await readShipmentDocState(shipmentId);
      const officeId = docState.officeId || extractOfficeIdFromValue(shipmentId);
      if (!ensureOfficeAccess(res, user, officeId, `documents for ${shipmentId}`)) return;
      const docs = await readDocMeta(shipmentId);
      const doc = docs.find((d) => d.id === docId);
      if (!doc) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Dokument nie znaleziony." }));
        return;
      }
      const filePath = join(getShipmentUploadsDir(shipmentId), doc.storedName);
      if (!filePath.startsWith(resolvedUploadsPath)) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Access denied." }));
        return;
      }
      const fileStat = await stat(filePath);
      res.writeHead(200, {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(doc.originalName)}`,
        "Content-Length": fileStat.size,
      });
      createReadStream(filePath).pipe(res);
      return;
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err?.message || "Blad pobierania." }));
      }
      return;
    }
  }

  // DELETE /api/shipments/:id/documents/:docId — delete
  if (req.method === "DELETE" && shipmentDocItemUrl) {
    const shipmentId = sanitizePathSegment(decodeURIComponent(shipmentDocItemUrl[1]));
    const docId = sanitizePathSegment(decodeURIComponent(shipmentDocItemUrl[2]));
    if (!shipmentId || !docId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid IDs." }));
      return;
    }
    try {
      const user = await authenticateRequest(req, res);
      if (user === false) return;
      const docState = await readShipmentDocState(shipmentId);
      const officeId = docState.officeId || extractOfficeIdFromValue(shipmentId);
      if (!ensureOfficeAccess(res, user, officeId, `documents for ${shipmentId}`)) return;
      const docs = await readDocMeta(shipmentId);
      const doc = docs.find((d) => d.id === docId);
      if (!doc) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Dokument nie znaleziony." }));
        return;
      }
      const filePath = join(getShipmentUploadsDir(shipmentId), doc.storedName);
      if (!filePath.startsWith(resolvedUploadsPath)) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Access denied." }));
        return;
      }
      await unlink(filePath).catch(() => {});
      await writeDocMeta(shipmentId, docs.filter((d) => d.id !== docId), officeId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err?.message || "Blad usuwania." }));
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

if (authSecurityWarnings.length > 0) {
  console.warn("[mail-api] SECURITY WARNING: running with relaxed auth defaults:");
  for (const msg of authSecurityWarnings) console.warn(`[mail-api]   - ${msg}`);
}

server.listen(PORT, () => {
  console.log(`[mail-api] listening on http://localhost:${PORT}`);
});
