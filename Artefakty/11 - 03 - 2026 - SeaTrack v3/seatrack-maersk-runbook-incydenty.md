# SeaTrack v3 - Runbook Incydentow (Maersk Adapter)

Data: 11-03-2026
Cel: Szybka obsluga problemow produkcyjnych po uruchomieniu integracji Maersk.

## 1) Szybka diagnoza (2 min)
1. Sprawdz endpoint health: GET /api/tracking/health
2. Sprawdz czy TRACKING_SOURCE=maersk
3. Sprawdz czy MAERSK_CONSUMER_KEY i MAERSK_CONSUMER_SECRET sa ustawione
4. Sprawdz czy serwer lokalny dziala na porcie API
5. Sprawdz ostatnie wpisy w tracking-sync.ndjson

## 2) Macierz objaw -> przyczyna -> akcja
| Objaw | Najczestsza przyczyna | Co robimy od razu |
|---|---|---|
| 401 Unauthorized | zly secret / niewazny token | zweryfikuj key+secret, odswiez token |
| 403 Forbidden | brak uprawnien do produktu/API | sprawdz status produktu, eskaluj do Maersk |
| 404 Not Found | customer code niepowiazany z shipmentem | potwierdz customer code i dane shipmentu, eskaluj |
| 429 Too Many Requests | przekroczony limit 60/min lub 4000/h | ogranicz batch, zwieksz interwal, retry z backoff |
| 500/5xx | problem po stronie Maersk | retry + oznaczenie jako tymczasowy blad |
| Brak zmian ETA/ETD | brak eventow lub zly lookup | sprawdz container/BL/trackingRef |
| Kafelek nie przesuwa sie | brak zmiany statusu po mapowaniu | sprawdz regule statusu i eventy wejsciowe |

## 3) Procedura incydentu krok po kroku
1. Potwierdz skale: 1 shipment czy globalnie.
2. Odtworz problem na manualnym TRACKING SYNC dla konkretnego shipmentu.
3. Zapisz payload wejsciowy (id, carrierCode, trackingRef, container, bl).
4. Sprawdz odpowiedz endpointu sync (status, trackingSyncError, changed).
5. Sprawdz log tracking-sync.ndjson i timestamp.
6. Dla bledow 401/403/404: przygotuj eskalacje do Maersk.
7. Dla 429/5xx: uruchom polityke retry i obciaz mniej requestow.
8. Oznacz wynik i decyzje: GO / WAIT / NO-GO dla dalszej synchronizacji.

## 4) Eskalacja do Maersk (minimalny pakiet danych)
- Integration ID
- Consumer Key (bez secret)
- Customer Code
- Srodowisko (stage/prod)
- Dokladny request (bez sekretow)
- HTTP status + response body
- Przynajmniej 1 przyklad shipmentu (container/BL/booking)
- Timestamp zdarzenia (UTC)

## 5) Triage priorytetow
- P1: Globalny brak syncu lub bledy auth dla wszystkich shipmentow
- P2: Brak syncu dla wybranych shipmentow
- P3: Bledy danych wejsciowych pojedynczych rekordow

## 6) Decyzja operacyjna
- GO: Incydent lokalny, workaround dziala
- WAIT: Incydent masowy, ale jest plan naprawy <24h
- NO-GO: Brak kontroli nad auth/rate-limit, ryzyko dla operacji

## 7) Workaround, gdy API niedostepne
1. TRACKING_SOURCE=mock (tymczasowo)
2. Manualna aktualizacja kluczowych shipmentow (ETA/ETD/status)
3. Priorytet na shipmenty z ETA <= 3 dni
4. Po przywroceniu API: rerun manual TRACKING SYNC
