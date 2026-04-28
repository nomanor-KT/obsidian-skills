import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from "../constants/index.js";

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function getStoredAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function persistAuthSession(token, user) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    if (user) localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors.
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

export async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}

export function buildAuthenticatedUrl(path) {
  const token = getAuthToken();
  if (!token) return path;
  const separator = String(path).includes("?") ? "&" : "?";
  return `${path}${separator}authToken=${encodeURIComponent(token)}`;
}

export async function postShipmentAudit({ shipmentId, officeId, action, field, previousValue, nextValue, summary }) {
  if (!shipmentId) return;
  try {
    await apiFetch(`/api/shipments/${encodeURIComponent(shipmentId)}/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officeId, action, field, previousValue, nextValue, summary }),
    });
  } catch {
    // Audit trail should not block user work.
  }
}