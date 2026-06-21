# SeaTrack v3 — Dokumentacja Techniczna
**Wersja dokumentu:** 1.0  
**Data:** 17.03.2026  
**Przygotowana dla:** Dział IT (PN Standard) — M&M air sea cargo  
**Kontakt po stronie biznesu:** Karol Torebko  

---

## 1. Czym jest SeaTrack v3

SeaTrack v3 to wewnętrzne narzędzie webowe do śledzenia i zarządzania przesyłkami morskimi działu spedycji M&M air sea cargo.

> **Ważna informacja dla IT:** SeaTrack v3 jest aplikacją opracowaną wewnętrznie na potrzeby M&M — nie jest produktem zewnętrznego dostawcy. Nie istnieje dokumentacja producenta ani oficjalna witryna producenta. Niniejszy dokument jest jedyną i kompletną specyfikacją techniczną systemu.

**Główne funkcje:**
- Import danych przesyłek z pliku Excel (eksport z Transsoft)
- Widok Kanban i lista przesyłek z filtrowaniem i wyszukiwaniem
- Śledzenie kontenerów przez API Maersk
- Wysyłanie statusów przesyłek do klientów przez Microsoft Outlook Classic
- Archiwum i podgląd dokumentów przypiętych do przesyłki (PDF, DOC, XLS)
- Historia zmian statusów (audit trail)
- Kontrola dostępu oparta na biurach operacyjnych (RBAC)

---

## 2. Architektura systemu

```
┌─────────────────────────────────────────────────────────┐
│                     PRZEGLĄDARKA                         │
│         (Chrome / Edge — dowolny komputer w LAN)        │
│                                                          │
│   React SPA (Single-Page Application)                   │
│   Serwowany jako pliki statyczne (HTML + JS + CSS)      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (REST API, port 8787)
                       ▼
┌─────────────────────────────────────────────────────────┐
│              SERWER APLIKACYJNY (Node.js)                │
│                 port: 8787 (domyślnie)                  │
│                                                          │
│  Obsługuje: logowanie, dokumenty, synchronizację        │
│  śledzenia, audit trail, wysyłkę maili                  │
│                                                          │
│  Dane lokalne (plik JSON + logi NDJSON)                 │
│  Brak zewnętrznej bazy danych                           │
└─────────┬─────────────────────────────┬─────────────────┘
          │ HTTPS (opcjonalnie)         │ Outlook COM
          ▼                             ▼
   Maersk Tracking API            Outlook Classic
   api.maersk.com                 (zainstalowany lokalnie
                                   na serwerze / maszynie)
```

**Technologie:**

| Warstwa | Technologia | Wersja |
|---------|-------------|--------|
| Frontend | React | 19.x |
| Frontend build | Vite | 7.x |
| Backend runtime | Node.js | ≥ 18 LTS |
| Backend | Natywny moduł `node:http` (bez Express) | — |
| Dane użytkowników | JSON (plik) | — |
| Logi operacyjne | NDJSON (pliki tekstowe) | — |
| Śledzenie kontenerów | Maersk Tracking API v1 | HTTPS |
| Wysyłka e-mail | Microsoft Outlook Classic | ≥ 2016 |

---

## 3. Wymagania serwerowe

### 3.1 Wymagania minimalne (środowisko produkcyjne)

| Parametr | Wymaganie minimalne | Zalecane |
|----------|---------------------|----------|
| System operacyjny | Windows 10/11 lub Windows Server 2019+ | Windows Server 2022 |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 512 MB wolnej pamięci | 1 GB |
| Dysk | 2 GB wolnego miejsca | 10 GB (na logi i dokumenty) |
| Node.js | ≥ 18.0.0 LTS | 20.x LTS lub 22.x LTS |
| Microsoft Outlook | Outlook Classic (desktop) ≥ 2016 | Outlook 2021 / M365 |

> **Uwaga:** Jeśli funkcja wysyłki e-mail przez Outlook nie jest wymagana, Outlook nie musi być zainstalowany. Aplikacja działa bez niego — wysyłka e-mail będzie wtedy niedostępna.

### 3.2 Dodatkowe wymagania na stacji wdrożenia

- Node.js zainstalowany jako usługa lub uruchamiany przy starcie systemu (np. przez `pm2`, `NSSM` lub Windows Task Scheduler)
- Dostęp do internetu (jeden kierunek — wychodzący HTTPS) jeśli używane jest śledzenie Maersk (punkt 5.2)

---

## 4. Porty i komunikacja sieciowa

### 4.1 Porty aplikacji

| Port | Protokół | Kierunek | Opis |
|------|----------|----------|------|
| **8787** | TCP/HTTP | Wejście (inbound) | Główny port serwera API + serwowanie plików statycznych frontendu |

> **Konfiguracja:** Port 8787 jest domyślny i można go zmienić przez zmienną środowiskową `MAIL_API_PORT` w pliku `.env`.

**Wymaganie do firewalla:**
- Użytkownicy w sieci LAN muszą mieć dostęp TCP do portu 8787 na maszynie serwerowej
- Nie jest wymagane otwarcie portu na zewnątrz organizacji (internet)
- Zalecane: dostęp tylko z sieci wewnętrznej (VLAN spedycja lub IP whitelist)

### 4.2 Dostęp wychodzący (outbound) — śledzenie Maersk

Jeśli włączone jest automatyczne śledzenie kontenerów Maersk:

| Cel | Protokół | Port | Opis |
|-----|----------|------|------|
| `api.maersk.com` | HTTPS | 443 | Maersk Tracking API — śledzenie kontenerów |
| `api-stage.maersk.com` | HTTPS | 443 | Środowisko testowe (tylko dev) |

> Śledzenie Maersk jest opcjonalne. Można je wyłączyć ustawiając `TRACKING_SOURCE=mock` w pliku `.env` — wtedy aplikacja nie nawiązuje żadnych połączeń zewnętrznych.

### 4.3 Połączenia zewnętrzne — podsumowanie

| Ruch | Wymagany | Cel | Protokół |
|------|----------|-----|----------|
| LAN → serwer:8787 | **TAK** | Użytkownicy łączą się z aplikacją | HTTP |
| Serwer → api.maersk.com:443 | Opcjonalnie | Śledzenie kontenerów | HTTPS |
| Serwer → internet (inne) | **NIE** | — | — |

---

## 5. Uwierzytelnianie i autoryzacja

### 5.1 Mechanizm logowania

- Logowanie przez formularz webowy (login + hasło)
- Adres loginu: `imie.nazwisko@mumnet.com`
- Hasło tymczasowe (pierwsze logowanie): `SeaTrack1!` — użytkownik jest zmuszony do zmiany przy pierwszym logowaniu
- Token sesji: HMAC-SHA256 (podobny do JWT), ważny 12 godzin (konfigurowalny)
- Token przechowywany po stronie przeglądarki (localStorage) — nie ma wrażliwych danych w cookies
- Hasła hashowane algorytmem `scrypt` z losowym soltem (bezpieczny standard)

### 5.2 Role i dostęp

| Rola | Opis |
|------|------|
| `user` | Widzi tylko przesyłki przypisane do swoich biur operacyjnych |
| `superuser` | Widzi przesyłki wszystkich biur, pełen dostęp |

- Dostęp do danych jest ograniczony per biuro operacyjne (np. 44225, 44923)
- Lista użytkowników i ich uprawnień przechowywana w pliku `server/data/users.json` na serwerze
- Brak integracji z Active Directory / LDAP w obecnej wersji

### 5.3 Zarządzanie użytkownikami

- Konta tworzone ręcznie w pliku `server/data/users.json`
- Nie ma panelu administracyjnego do zarządzania kontami przez przeglądarkę (w planach)
- Reset hasła: ręcznie przez administratora (ustawienie `"mustChangePassword": true`)

---

## 6. Dane i pliki

### 6.1 Struktura danych na dysku

Aplikacja nie używa zewnętrznej bazy danych. Wszystkie dane są przechowywane w plikach na serwerze:

```
server/
├── data/
│   └── users.json              # Konta użytkowników i hasła (zahashowane)
├── logs/
│   ├── email-log.ndjson        # Historia wysłanych e-maili
│   ├── auth-log.ndjson         # Logi logowań (sukcesy i błędy)
│   ├── audit-log.ndjson        # Historia zmian statusów przesyłek
│   └── tracking-sync.ndjson    # Logi synchronizacji śledzenia
└── uploads/
    └── {ID_PRZESYLKI}/
        ├── metadata.json       # Metadane dokumentów
        └── {plik}.pdf/.docx    # Pliki dokumentów
```

### 6.2 Dopuszczalne typy plików (upload dokumentów)

| Format | MIME Type |
|--------|-----------|
| PDF | application/pdf |
| Word (.doc) | application/msword |
| Word (.docx) | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| Excel (.xls) | application/vnd.ms-excel |
| Excel (.xlsx) | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |

**Limity:**
- Maksymalny rozmiar pojedynczego pliku: **25 MB** (konfigurowalny)
- Maksymalna liczba plików na przesyłkę: **20**

### 6.3 Dane przesyłek

Dane przesyłek (statusy, notatki, przypisania) są przechowywane **lokalnie w przeglądarce** (`localStorage`) po stronie każdego użytkownika, a nie na serwerze. Źródłem danych jest import z pliku Excel (eksport z Transsoft).

> **Implikacja dla IT:** Wyczyszczenie danych przeglądarki przez użytkownika spowoduje utratę jego lokalnych danych. W środowisku produkcyjnym zalecane jest wdrożenie centralnego repozytorium danych (planowana funkcja w przyszłej wersji).

---

## 7. Konfiguracja — zmienne środowiskowe

Plik konfiguracyjny: `.env` w głównym katalogu aplikacji `SeaTrack-v3/`.

| Zmienna | Domyślna wartość | Opis |
|---------|-----------------|------|
| `MAIL_API_PORT` | `8787` | Port serwera API |
| `MAIL_API_ORIGIN` | `http://localhost:5173` | Dozwolony origin CORS (adres frontendu) |
| `AUTH_REQUIRED` | `false` | Wymuszenie logowania (`true` = wymagane) |
| `AUTH_JWT_SECRET` | *(dev default)* | Sekret do podpisywania tokenów — **zmienić na produkcji!** |
| `AUTH_TOKEN_TTL_HOURS` | `12` | Ważność tokenu sesji (godziny) |
| `AUTH_TEMP_PASSWORD` | `SeaTrack1!` | Hasło tymczasowe dla nowych kont |
| `TRACKING_SOURCE` | `maersk` | Źródło śledzenia: `maersk` lub `mock` |
| `MAERSK_CONSUMER_KEY` | — | Klucz API Maersk |
| `MAERSK_CONSUMER_SECRET` | — | Secret API Maersk |
| `MAX_FILE_SIZE_MB` | `25` | Limit rozmiaru pliku dokumentu (MB) |
| `MAX_FILES_PER_SHIPMENT` | `20` | Limit plików na przesyłkę |

---

## 8. Procedura instalacji (krok po kroku)

### Wymagania wstępne
1. Zainstalowany **Node.js ≥ 18 LTS** ([nodejs.org](https://nodejs.org))
2. Kod źródłowy aplikacji (folder `SeaTrack-v3`) umieszczony na serwerze

### Instalacja

```bash
# 1. Wejdź do folderu aplikacji
cd C:\Aplikacje\SeaTrack-v3

# 2. Zainstaluj zależności
npm install

# 3. Zbuduj frontend (pliki statyczne do folderu dist/)
npm run build

# 4. Uruchom serwer
node server/index.js
```

### Uruchomienie jako usługa Windows (zalecane na produkcji)

Zalecane narzędzie: **NSSM** (Non-Sucking Service Manager) lub **pm2**

```bash
# Przykład z pm2
npm install -g pm2
pm2 start server/index.js --name "seatrack-api"
pm2 save
pm2 startup
```

### Weryfikacja

Po uruchomieniu serwer powinien wyświetlić:
```
[mail-api] listening on http://localhost:8787
```

Użytkownicy wchodzą w przeglądarce na: `http://<adres-serwera>:8787`

---

## 9. Bezpieczeństwo — rekomendacje dla IT

| Temat | Stan obecny | Rekomendacja IT |
|-------|------------|-----------------|
| Protokół | HTTP | Zalecane wdrożenie reverse proxy (np. nginx/IIS) z certyfikatem TLS i przekierowaniem HTTPS |
| Sekret tokenów | Default w pliku `.env` | Ustawić silny, losowy `AUTH_JWT_SECRET` (min. 32 znaki) przed wdrożeniem |
| Wymuszenie logowania | `AUTH_REQUIRED=false` | Ustawić `AUTH_REQUIRED=true` na produkcji |
| AD/LDAP | Brak integracji | Nie dotyczy wersji v3; planowane w przyszłości |
| Backup danych | Brak automatyczny | Zalecane codzienne kopie zapasowe folderu `server/data/` i `server/uploads/` |
| Dostęp sieciowy | Brak ograniczeń | Zalecane ograniczenie dostępu do portu 8787 wyłącznie z sieci wewnętrznej (LAN/VLAN) |

---

---

## 10. Ograniczenia wersji v3 i roadmapa

### 10.1 Znane ograniczenia MVP (stan na 17.03.2026)

Poniższe ograniczenia są znane i zaplanowane do rozwiązania w kolejnych wersjach. Nie blokują bieżącego użycia operacyjnego, ale IT powinno je uwzględnić przy planowaniu wdrożenia.

| # | Ograniczenie | Wpływ | Planowane rozwiązanie |
|---|-------------|-------|----------------------|
| 1 | **Dane przesyłek w localStorage przeglądarki** — każdy użytkownik ma swoje lokalne dane; wyczyszczenie przeglądarki = utrata danych | Średni — import z Transsoft zawsze możliwy ponownie | Centralna baza danych po stronie serwera (v4) |
| 2 | **Brak szyfrowania HTTPS** — ruch między przeglądarką a serwerem nieszyfrowany | Niski w sieci LAN; Wysoki przy dostępie z zewnątrz | Reverse proxy (nginx / IIS) z TLS — konfiguracja po stronie IT |
| 3 | **`AUTH_REQUIRED=false` domyślnie** — logowanie zaimplementowane, ale nie jest jeszcze wymuszone dla API | Niski — działa tylko w LAN; ustawić `AUTH_REQUIRED=true` przed go-live | Zmiana flagi w `.env` przed wdrożeniem |
| 4 | **Brak panelu administracyjnego dla kont** — zarządzanie użytkownikami wymaga ręcznej edycji pliku JSON | Niski — zmiana kont rzadka | Panel admin w przeglądarce (planowany) |
| 5 | **Brak integracji z Active Directory / SSO** | Średni — osobne hasła poza AD | Integracja LDAP/SSO planowana w przyszłości |
| 6 | **Brak automatycznego backupu** | Średni — ryzyko utraty danych przy awarii dysku | Backup konfigurowany przez IT (`server/data/` + `server/uploads/`) |
| 7 | **Brak synchronizacji między użytkownikami w czasie rzeczywistym** — zmiany statusów jednego użytkownika nie są natychmiast widoczne dla innych | Niski — odświeżenie strony aktualizuje dane | Centralne repozytorium danych (v4) |

### 10.2 Roadmapa kolejnych wersji (planowana)

| Wersja | Zakres |
|--------|--------|
| **v3.x** (patch) | Wymuszenie HTTPS; panel zarządzania użytkownikami; stabilizacja po wdrożeniu pilotażowym |
| **v4** | Centralna baza danych (SQLite lub PostgreSQL); synchronizacja w czasie rzeczywistym; integracja AD/SSO; automatyczny backup |

---

## 11. Pytania i odpowiedzi dla PN Standard

**P: Czy aplikacja wymaga Active Directory lub integracji SSO?**  
Nie. Uwierzytelnianie jest własne (custom), oparte na loginie e-mail i haśle. Integracja z AD nie jest wdrożona w wersji v3.

**P: Czy potrzebna jest licencja na oprogramowanie serwerowe?**  
Nie. Aplikacja opiera się wyłącznie na Node.js (licencja MIT, darmowy) i bibliotekach open-source.

**P: Czy aplikacja zapisuje dane w chmurze?**  
Nie. Wszystkie dane (użytkownicy, logi, dokumenty) przechowywane są lokalnie na serwerze. Jedyne połączenie zewnętrzne to opcjonalne API Maersk (śledzenie kontenerów).

**P: Czy możliwa jest instalacja na istniejącym serwerze Windows?**  
Tak, pod warunkiem zainstalowania Node.js ≥ 18 LTS i dostępności portu 8787.

**P: Czy aplikacja wymaga SQL Server, IIS lub innych usług Windows?**  
Nie. Żadne dodatkowe usługi Windows nie są wymagane.

**P: Ile miejsca na dysku jest potrzebne?**  
Sama aplikacja zajmuje ok. 150 MB (po `npm install`). Docelowo, przy intensywnym użyciu i przechowywaniu dokumentów, warto zarezerwować 5–10 GB na logi i pliki przesyłek.

**P: Czy aplikacja obsługuje wielu jednoczesnych użytkowników?**  
Tak. Serwer jest bezstanowy w zakresie danych przesyłek (dane sesji w przeglądarce) i obsługuje wielu użytkowników jednocześnie. Przy obecnej skali M&M (kilkudziesięciu użytkowników) wydajność Node.js jest w pełni wystarczająca.

---

*Dokument przygotowany przez: Karol Torebko / SeaTrack v3 Internal Project*  
*Pytania techniczne: karol.torebko@mumnet.com*
