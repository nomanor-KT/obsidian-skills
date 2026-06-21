# SeaTrack v3 - Maersk Adapter - Test Matrix

Data: 11-03-2026
Wlasciciel: Karol Torebko
Cel: Zweryfikowac gotowosc techniczna i operacyjna integracji trackingu przed final approval API.

## Zakres
- Backend: OAuth + /events + mapowanie ETA/ETD/status
- Frontend: auto-sync 60 min, manual sync, auto-przesuwanie kafelkow
- Operacje: logowanie bledow i obsluga przypadkow granicznych

## Kryteria akceptacji (Definition of Done)
- ETA/ETD aktualizuja sie zgodnie z regula "nowsza data wygrywa"
- Status zmienia sie automatycznie zgodnie z logika SeaTrack
- Auto-przesuniety kafelek ma czerwona mglieke
- Synchronizacja nie blokuje UI i zapisuje wynik per shipment
- Bledy 401/403/404/429/500 sa czytelnie raportowane

## Scenariusze funkcjonalne
| ID | Scenariusz | Dane wejsciowe | Oczekiwany rezultat | Priorytet |
|---|---|---|---|---|
| F01 | Sync manualny 1 shipment | poprawny container + carrier MAERSK | aktualizacja ETA/ETD/status | P1 |
| F02 | Sync auto (timer 60 min) | min. 1 shipment z trackingRef | uruchomienie bez interakcji usera | P1 |
| F03 | Brak danych trackingowych | pusty container + BL + trackingRef | trackingSyncError, brak crash | P1 |
| F04 | Tylko BL | BL poprawny, brak container | query po transportDocumentReference | P1 |
| F05 | Tylko container | container ISO/BIC | query po equipmentReference | P1 |
| F06 | Carrier nie-Maersk | carrierCode=MSC | blad biznesowy adaptera, bez crash | P2 |
| F07 | Nowsza ETA z API | ETA API > ETA lokalna | ETA z API nadpisuje lokalna | P1 |
| F08 | Starsza ETA z API | ETA API < ETA lokalna | ETA lokalna zostaje | P1 |
| F09 | Zmiana statusu przez ETD/ETA | ETD<dzis, ETA>w przyszlosci | status in_transit | P1 |
| F10 | Auto-move glow | zmiana statusu przez sync | kafelek z czerwona mglieka | P1 |
| F11 | Brak eventow | events=[] | brak zmiany dat, komunikat diagnostyczny | P2 |
| F12 | Duza partia shipmentow | 50-100 shipmentow | odpowiedz w akceptowalnym czasie | P2 |

## Scenariusze bledow API
| ID | Kod | Symulacja | Oczekiwane zachowanie |
|---|---|---|---|
| E01 | 401 | zly secret/token | jasny komunikat auth, brak zmiany shipmentow |
| E02 | 403 | brak dostepu produktu | komunikat uprawnien |
| E03 | 404 | customer code niepowiazany z shipmentem | komunikat autoryzacji danych |
| E04 | 429 | przekroczenie limitu | retry/backoff + log |
| E05 | 500 | blad serwera Maersk | blad techniczny + brak crash UI |

## Scenariusze danych i jakosci
| ID | Scenariusz | Oczekiwane zachowanie |
|---|---|---|
| D01 | container niezgodny z ISO | odrzucenie lookup i error per shipment |
| D02 | duplikat shipment ID | brak nadpisan niepowiazanych rekordow |
| D03 | eventy PLN/EST/ACT | priorytet ACT > EST > PLN |
| D04 | eventy z roznymi strefami czasowymi | poprawna normalizacja do daty YYYY-MM-DD |

## Raport z testu (szablon)
- Data testu:
- Tester:
- Zakres wykonany:
- Wynik: PASS / FAIL / PARTIAL
- Blokery:
- Decyzja: GO / WAIT / NO-GO
- Kolejne kroki:

## Minimalny gate przed produkcja
- [ ] Wszystkie testy P1 = PASS
- [ ] E01-E05 przetestowane i udokumentowane
- [ ] Monitoring logow tracking-sync aktywny
- [ ] Runbook incydentow zatwierdzony
- [ ] Day-0 checklist gotowa
