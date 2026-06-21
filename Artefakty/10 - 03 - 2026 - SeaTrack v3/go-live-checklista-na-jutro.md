# SeaTrack v3 - Go-Live Checklista Na Jutro

Data: 10-03-2026
Cel: uruchomic pelna wysylke MAIL przez API (bez fallbacku mailto) i potwierdzic stabilnosc operacyjna.

## 1. DNS i Resend

1. Otworz `Resend -> Domains` i sprawdz status domeny.
2. Oczekiwany wynik: `Verified`.
3. Jesli nadal nie jest `Verified`, nie rob testu produkcyjnego maili - tylko fallback i logi lokalne.

## 2. Konfiguracja .env

Plik: `c:\Users\k.torebko\Downloads\seatrackv3-runner\.env`

1. `MAIL_FROM` ustawione na zweryfikowana domene nadawcy.
2. `RESEND_API_KEY` uzupelnione realnym kluczem `re_...`.
3. `MAIL_API_PORT=8787`.
4. `MAIL_API_ORIGIN=http://localhost:5173`.

## 3. Start uslug

1. Backend API (terminal 1):

```powershell
node "c:\Users\k.torebko\Downloads\seatrackv3-runner\server\index.js"
```

2. Frontend (terminal 2):

```powershell
Set-Location "c:\Users\k.torebko\Downloads\seatrackv3-runner"
npm run dev:local
```

## 4. Szybki test API

1. Health check:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8787/api/health" | ConvertTo-Json -Depth 4
```

Oczekiwany wynik: `ok: true`.

2. Odczyt logow:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8787/api/email/logs?limit=10" | ConvertTo-Json -Depth 6
```

Oczekiwany wynik: endpoint zwraca `ok: true`.

## 5. Test E2E z aplikacji

1. Otworz jedna przesylke w SeaTrack.
2. Uzupelnij pola:
- `E-mail klienta`
- opcjonalnie `E-mail spedytora (CC)`
- opcjonalnie `E-mail sales managera (CC)`
3. Kliknij `MAIL`.
4. Oczekiwany wynik:
- komunikat sukcesu w panelu,
- nowy wpis w sekcji `Historia wysylek`,
- nowy wpis w `/api/email/logs` z `ok: true`.

## 6. Regresja funkcjonalna (5 minut)

1. Edycja pol mailowych nie traci focusu.
2. `c/c` widoczne tylko w kolumnie `Odprawa`.
3. `DEL` widoczne tylko w kolumnie `Wyjechal`.
4. Drag and drop kolumn dziala i nie psuje szczegolow.

## 7. Plan B (gdy API nie przejdzie)

1. Pracuj przez fallback `mailto`.
2. Zbieraj logi bledu z `/api/email/logs`.
3. Nie blokuj operacji dzialu - wysylka statusow ma isc dalej.

## 8. Kryterium "gotowe"

1. Domena `Verified`.
2. Min. 1 poprawnie wyslany mail przez API.
3. Wpis `ok: true` w logach backendu.
4. Brak blockerow w UI po 1 cyklu testowym.
