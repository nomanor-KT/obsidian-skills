# SeaTrack v3 - Maersk Day-0 Checklista (po approval)

Data: 11-03-2026
Cel: Bezpiecznie uruchomic produkcyjny tracking i szybko wykryc ryzyka.

## A. Przed startem (T-1)
- [ ] API product Ocean Track & Trace ma status Approved
- [ ] Consumer Key i Secret zapisane w bezpiecznym miejscu
- [ ] Customer Code potwierdzony
- [ ] .env uzupelnione (TRACKING_SOURCE=maersk + MAERSK_* )
- [ ] Port API wolny i backend startuje poprawnie
- [ ] Backup: TRACKING_SOURCE=mock gotowy do rollback

## B. Smoke test (T0, pierwsze 30 min)
- [ ] GET /api/tracking/health = ok + maerskConfigured=true
- [ ] Manualny TRACKING SYNC dla 1 shipmentu z poprawnym container
- [ ] Manualny TRACKING SYNC dla 1 shipmentu po BL
- [ ] Odpowiedz zawiera updates[] i poprawne trackingSyncError
- [ ] ETA/ETD zaktualizowane zgodnie z regula "nowsza data wygrywa"
- [ ] Status kafelka aktualizuje sie poprawnie
- [ ] Czerwona mglieka widoczna po auto-przesunieciu

## C. Stabilizacja (T0, pierwsze 2-4h)
- [ ] Co najmniej 10 shipmentow przeszlo sync bez krytycznych bledow
- [ ] Brak lawiny 401/403/404
- [ ] Brak 429 (lub kontrolowane i opanowane)
- [ ] tracking-sync.ndjson zapisuje wpisy regularnie
- [ ] Zespol operacyjny rozumie znaczenie nowych komunikatow bledow

## D. Kryteria GO / WAIT / NO-GO
- GO:
  - [ ] >=90% shipmentow z poprawnymi danymi syncuje sie poprawnie
  - [ ] Brak P1
- WAIT:
  - [ ] P2/P3 wymagaja korekty danych lub drobnych poprawek
- NO-GO:
  - [ ] Powtarzalne 401/403 globalnie
  - [ ] Powtarzalne 429 bez kontroli
  - [ ] Brak przewidywalnosci statusu po sync

## E. Plan rollback (5 minut)
- [ ] Przelacz TRACKING_SOURCE=mock
- [ ] Restart backendu
- [ ] Potwierdz stabilnosc UI i workflow operacyjnego
- [ ] Oznacz incydent i uruchom runbook eskalacyjny

## F. Komunikacja wewnetrzna (gotowy status)
"Uruchomienie Maersk tracking: [GO/WAIT/NO-GO].
Zakres: [x/y shipmentow], bledy krytyczne: [0/n],
kolejny checkpoint: [godzina]."
