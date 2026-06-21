import { useCallback, useEffect, useState } from "react";
import { apiFetch, clearAuthSession, getStoredAuthUser, persistAuthSession } from "../utils/api.js";

function createGuestUser() {
  return {
    id: 0,
    name: "Tryb bez logowania",
    email: "",
    role: "superuser",
    status: "active",
    offices: ["*"],
    mustChangePassword: false,
  };
}

export function useAuth() {
  const authDisabled = String(import.meta.env.VITE_AUTH_REQUIRED || "false").toLowerCase() !== "true";
  const [user, setUser] = useState(() => (authDisabled ? createGuestUser() : getStoredAuthUser()));
  const [authReady, setAuthReady] = useState(() => authDisabled);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(authDisabled ? createGuestUser() : null);
    setAuthError("");
  }, [authDisabled]);

  const refreshMe = useCallback(async () => {
    if (authDisabled) {
      return createGuestUser();
    }

    try {
      const res = await apiFetch("/api/auth/me");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Sesja wygasla.");
      persistAuthSession(null, data.user);
      setUser(data.user || null);
      return data.user || null;
    } catch {
      logout();
      return null;
    }
  }, [authDisabled, logout]);

  useEffect(() => {
    if (authDisabled) {
      setUser(createGuestUser());
      setAuthReady(true);
      return undefined;
    }

    let cancelled = false;

    async function init() {
      try {
        const currentUser = await refreshMe();
        if (!cancelled && currentUser) {
          setUser(currentUser);
        }
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [authDisabled, refreshMe]);

  const login = useCallback(async (email, password) => {
    if (authDisabled) {
      const guestUser = createGuestUser();
      clearAuthSession();
      setUser(guestUser);
      setAuthError("");
      return { ok: true, user: guestUser };
    }

    setAuthBusy(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie zalogowac.");
      persistAuthSession(data.token, data.user);
      setUser(data.user || null);
      return { ok: true, user: data.user || null };
    } catch (err) {
      const message = String(err?.message || "Nie udalo sie zalogowac.");
      setAuthError(message);
      return { ok: false, error: message };
    } finally {
      setAuthBusy(false);
    }
  }, [authDisabled]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (authDisabled) {
      const guestUser = createGuestUser();
      clearAuthSession();
      setUser(guestUser);
      setAuthError("");
      return { ok: true, user: guestUser };
    }

    setAuthBusy(true);
    setAuthError("");
    try {
      const res = await apiFetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Nie udalo sie zmienic hasla.");
      persistAuthSession(null, data.user);
      setUser(data.user || null);
      return { ok: true };
    } catch (err) {
      const message = String(err?.message || "Nie udalo sie zmienic hasla.");
      setAuthError(message);
      return { ok: false, error: message };
    } finally {
      setAuthBusy(false);
    }
  }, [authDisabled]);

  return {
    user,
    authReady,
    authBusy,
    authError,
    login,
    logout,
    refreshMe,
    changePassword,
    clearError: () => setAuthError(""),
  };
}