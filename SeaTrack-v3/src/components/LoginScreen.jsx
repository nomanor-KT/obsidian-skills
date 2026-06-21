import { useState } from "react";
import { THEME } from "../constants/index.js";

const CARD = {
  width: "100%",
  maxWidth: "420px",
  background: THEME.surface.card,
  border: `1px solid ${THEME.border.default}`,
  borderRadius: "18px",
  boxShadow: "0 20px 40px rgba(16, 38, 62, 0.12)",
  padding: "28px",
};

const INPUT = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: "10px",
  border: `1px solid ${THEME.border.strong}`,
  fontSize: "14px",
  outline: "none",
  background: THEME.surface.card,
  color: THEME.text.primary,
};

export function LoginScreen({ user, authBusy, authError, onLogin, onChangePassword }) {
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const isPasswordReset = Boolean(user?.mustChangePassword);

  const submitLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    await onLogin(email, password);
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (newPassword.length < 8) {
      setLocalError("Nowe haslo musi miec co najmniej 8 znakow.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setLocalError("Nowe hasla musza byc identyczne.");
      return;
    }
    await onChangePassword(currentPassword, newPassword);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${THEME.surface.muted} 0%, ${THEME.surface.page} 45%, ${THEME.surface.card} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={CARD}>
        <div style={{ marginBottom: "22px" }}>
          <div style={{ fontSize: "13px", color: THEME.brand.accent, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>SeaTrack</div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: THEME.text.primary, marginBottom: "8px" }}>{isPasswordReset ? "Ustaw nowe haslo" : "Zaloguj sie"}</div>
          <div style={{ fontSize: "14px", color: THEME.text.secondary, lineHeight: 1.5 }}>
            {isPasswordReset
              ? "To pierwsze logowanie. Dla bezpieczenstwa ustaw swoje wlasne haslo."
              : "Wpisz firmowy adres e-mail i haslo, zeby zobaczyc tylko przesylki swojego zespolu."}
          </div>
        </div>

        {!isPasswordReset ? (
          <form onSubmit={submitLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Adres e-mail</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="imie.nazwisko@mumnet.com" style={INPUT} autoComplete="username" />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Haslo</div>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Wpisz haslo" style={INPUT} autoComplete="current-password" />
            </div>
            {(authError || localError) ? (
              <div style={{ background: THEME.brand.accentSoft, border: "1px solid #E9A4B0", color: THEME.state.danger, borderRadius: "10px", padding: "10px 12px", fontSize: "13px", fontWeight: 600 }}>
                {localError || authError}
              </div>
            ) : null}
            <button type="submit" disabled={authBusy} style={{ height: "44px", border: "none", borderRadius: "12px", background: authBusy ? THEME.text.muted : THEME.brand.primary, color: THEME.text.onDark, fontSize: "14px", fontWeight: 800, cursor: authBusy ? "not-allowed" : "pointer" }}>
              {authBusy ? "Logowanie..." : "Wejdz do aplikacji"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitPasswordChange} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "#EAF2FB", border: "1px solid #AFC7E1", color: THEME.brand.primarySoft, borderRadius: "10px", padding: "10px 12px", fontSize: "13px", fontWeight: 600 }}>
              Zalogowano jako {user?.email}. Teraz ustaw prywatne haslo.
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Obecne haslo</div>
              <input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Wpisz dotychczasowe haslo" style={INPUT} autoComplete="current-password" />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Nowe haslo</div>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Minimum 8 znakow" style={INPUT} autoComplete="new-password" />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: THEME.text.secondary, marginBottom: "6px", textTransform: "uppercase" }}>Powtorz nowe haslo</div>
              <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} type="password" placeholder="Wpisz jeszcze raz" style={INPUT} autoComplete="new-password" />
            </div>
            {(authError || localError) ? (
              <div style={{ background: THEME.brand.accentSoft, border: "1px solid #E9A4B0", color: THEME.state.danger, borderRadius: "10px", padding: "10px 12px", fontSize: "13px", fontWeight: 600 }}>
                {localError || authError}
              </div>
            ) : null}
            <button type="submit" disabled={authBusy} style={{ height: "44px", border: "none", borderRadius: "12px", background: authBusy ? THEME.text.muted : THEME.brand.primary, color: THEME.text.onDark, fontSize: "14px", fontWeight: 800, cursor: authBusy ? "not-allowed" : "pointer" }}>
              {authBusy ? "Zapisywanie..." : "Zapisz nowe haslo"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}