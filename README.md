# SeaTrack v3 Runner

Dashboard operacyjny dla przesylek morskich (import XLSX z Transsoft) z widokiem Kanban i panelem detali.

## Co jest wdrozone

- Workflow statusow z 7 kolumnami.
- `c/c` i `DEL` na kafelkach (double click, ochrona przed przypadkowym kliknieciem).
- E-mail statusowy z panelu detali:
  - szablon tresci zalezny od statusu,
  - `To` z pola `E-mail klienta`,
  - `CC` z pol `E-mail spedytora (CC)` i `E-mail sales managera (CC)`.
- Backend mail API z retry i logiem wysylek (`server/logs/email-log.ndjson`).
- Tracking sync (MVP):
  - endpoint `POST /api/tracking/sync`,
  - auto-sync w UI co 60 min,
  - manualny przycisk `TRACKING SYNC`,
  - automatyczne przesuniecie statusu po zmianie ETD/ETA,
  - czerwone podswietlenie kafelka po auto-przesunieciu.

## Uruchomienie lokalne

Uruchamiaj komendy z katalogu `SeaTrack-v3`.

Alternatywnie z root workspace mozesz uzyc `npm --prefix SeaTrack-v3 <komenda>`.

Szablony konfiguracji:
- `.env.development.example` - propozycja ustawien dev.
- `.env.production.example` - propozycja ustawien prod.

1. Frontend (Vite):

```bash
npm run dev:local
```

2. Backend API (drugi terminal):

```bash
npm run server
```

Frontend jest skonfigurowany z proxy `/api -> http://localhost:8787`.

## Konfiguracja mail API

Skopiuj `.env.example` do `.env` i uzupelnij wartosci:

Wazne: sekretow API nie trzymaj w repo. Uzywaj tylko pliku `.env` lokalnie.

- `MAIL_FROM` - adres nadawcy
- `RESEND_API_KEY` - klucz API Resend
- opcjonalnie:
  - `MAIL_API_PORT`
  - `MAIL_API_ORIGIN`
  - `MAIL_RETRY_ATTEMPTS`
  - `MAIL_LOG_PATH`
  - `TRACKING_SOURCE` (`mock` lub `external`)
  - `TRACKING_LOG_PATH`
  - `TRACKING_MOCK_PATH`

## Tracking MVP (mock)

1. Skopiuj `server/tracking-mock.example.json` do `server/logs/tracking-mock.json`.
2. W `.env` ustaw:
  - `TRACKING_SOURCE=mock`
  - opcjonalnie `TRACKING_MOCK_PATH=./logs/tracking-mock.json`
3. W panelu detali shipmentu uzupelnij:
  - `Armator (kod)`
  - `Referencja trackingu` (np. container lub B/L)
4. Uzyj `TRACKING SYNC` albo poczekaj na auto-sync (60 min).

Regula ETD/ETA: `nowsza data wygrywa` (mixed rule).

## Tracking Maersk (adapter)

1. W `.env` ustaw:
  - `TRACKING_SOURCE=maersk`
  - `MAERSK_CONSUMER_KEY=<consumer key>`
  - `MAERSK_CONSUMER_SECRET=<consumer secret>`
  - `MAERSK_OAUTH_TOKEN_URL=https://api.maersk.com/oauth2/access_token` (prod)
  - `MAERSK_TRACKING_BASE_URL=https://api.maersk.com/track-and-trace-private` (prod)
2. Upewnij sie, ze API product `Ocean Track & Trace` ma status `Approved`.
3. W shipmentach uzupelnij:
  - `Armator (kod)`: `MAERSK` lub `MAEU`
  - `Referencja trackingu`: najlepiej `equipmentReference` (kontener), fallback: B/L.
4. Uzyj `TRACKING SYNC`.

Diagnostyka:
- `GET /api/tracking/health` pokazuje aktywne zrodlo i czy klucze Maersk sa skonfigurowane.
- `POST /api/tracking/sync` zwraca per-shipment `trackingSyncError`.
- Gdy widzisz `OAuth token error: 401`, sprawdz pare `MAERSK_CONSUMER_KEY`/`MAERSK_CONSUMER_SECRET` oraz status produktu `Ocean Track & Trace`.
- Gdy widzisz `503 Service Unavailable`, sprawdz czy endpointy Maersk sa ustawione na prod.

Uwagi o wyborze adaptera:
- Dla `TRACKING_SOURCE` roznego od `mock`, backend dobiera adapter per przesylka na podstawie `Armator (kod)`.
- `MAERSK`/`MAEU` -> Maersk API, `CMA`/`CMA CGM`/`CMACGM`/`CMDU` -> CMA API, kody Hapag -> Hapag API.
- Gdy kod armatora jest pusty/nieznany, uzywane jest zrodlo z `TRACKING_SOURCE`.

## Endpointy backendu

- `GET /api/health` - status serwera.
- `POST /api/email/send-status` - wysylka e-maila statusowego.
- `GET /api/email/logs?limit=50` - historia ostatnich wysylek.
- `GET /api/tracking/health` - status warstwy tracking.
- `POST /api/tracking/sync` - synchronizacja trackingu dla paczki shipmentow.

## Szybki test po wdrozeniu (30-60s)

1. Sprawdz health backendu:

```bash
curl http://localhost:8787/api/tracking/health
```

2. Wykonaj testowy sync MAERSK:

```bash
curl -X POST http://localhost:8787/api/tracking/sync \
  -H "Content-Type: application/json" \
  -d "{\"shipments\":[{\"id\":\"TEST-MAERSK\",\"officeId\":\"PL\",\"status\":\"booked\",\"carrierCode\":\"MAERSK\",\"trackingRef\":\"MRKU3654755\"}]}"
```

3. Oczekiwany wynik:
- `source` dla update to `maersk`
- `trackingSyncError` jest `null`
- `trackingKey` jest uzupelniony

Alternatywnie (smoke test Node):

```bash
npm run test:tracking
```

Pelna checklista wdrozenia i hardeningu:
- `docs/deploy-checklist.md`

## Uwaga

Jesli backend jest niedostepny lub API zwroci blad, frontend automatycznie odpali fallback `mailto` z gotowym tematem i trescia.
