---
typ: procedura
tags: [typ/operacja, temat/cpk, temat/air-cargo]
date: 2026-04-01
---


# CPK Cargo Community System - Eksport General Cargo (perspektywa spedytora)

## Kontekst - skad pochodzi ta wiedza
Notatka robocza przygotowana na potrzeby konsultacji procesu cargo dla CPK (kwiecien 2026). Dokument opisuje eksport lotniczy general cargo w modelu back-to-back (1 MAWB / 1 HAWB), z perspektywy spedytora dzialajacego jako Agencja Celna.

## Kluczowe punkty - najwazniejsze informacje
- Zakres obejmuje os procesu od inicjacji przesylki, przez booking, sloty i security, po odprawe celna i pre-alert.
- Najwazniejsza zasada CCS: dane operacyjne wprowadzone raz i udostepniane uprawnionym uczestnikom procesu.
- Dane handlowe (stawki, warunki platnosci, marze, zlecenie spedycyjne) powinny pozostac poza CCS.
- Krytyczne integracje: e-AWB, systemy celne (AES/CELINA), ICS2/PLACI, statusy security i milestone tracking.

## Zakres i zalozenia
- Proces: eksport lotniczy z Polski (CPK)
- Typ ladunku: general cargo (bez DG)
- Model przesylki: back-to-back (1 MAWB / 1 HAWB)
- Model dostawy: dostawa bezposrednia do GHA
- Status spedytora: Agencja Celna (AC)

## Wylaczenia
- Konsolidacja (wiele HAWB pod jednym MAWB)
- Procesy DG
- Operacje wewnetrzne linii lotniczej i GHA
- Import lotniczy
- Obszar handlowy/ksiegowy

## Interesariusze
- Klient (eksporter)
- Spedytor (AC)
- Linia lotnicza
- GHA
- Przewoznik drogowy
- Urzad Celno-Skarbowy
- Agent/importer w destynacji

## Milestones (os czasu)
- M1 BKD: Booking Confirmed
- M2 DOC: Documents Ready
- M3 PRE: Pre-advised to GHA
- M4 SLT: Slot Confirmed
- M5 ARR: Arrived at Terminal
- M6 RCF: Received by GHA
- M7 SEC: Security Cleared
- M8 CUS: Customs Released
- M9 RCS: Ready for Carriage
- M10 DEP: Departed
- M11 NFD: Pre-Alert Sent
- M12 CNF: Client Confirmed

## Rekomendacje dla CPK CCS
1. Single Window dla danych operacyjnych i twarde oddzielenie danych handlowych.
2. e-AWB jako domyslny standard wymiany.
3. Integracja slot booking z shipmentem (MAWB/HAWB).
4. End-to-end tracking statusu security (KC i non-KC).
5. Integracja celna (MRN, IE529, IE599) oraz wsparcie ICS2/PLACI.
6. Wspolna os milestone z eventami i webhookami.
7. API-first (REST/JSON) do integracji z TMS/WMS i systemami partnerow.
8. Obsluga rozbieznosci przy przyjeciu ladunku.
9. Zgodnosc ze standardami: IATA Cargo-XML, Cargo IMP, ONE Record, Cargo iQ, WCO Data Model.

## Dalsze kroki
- Opracowac osobne dokumenty: konsolidacja eksportu, import/dekonsolidacja, DG, perishables, live animals, oversize/heavy/valuable.
- Przygotowac perspektywy pozostalych uczestnikow procesu (linia, GHA, UC, przewoznik drogowy).

## Powiazane notatki
- [[INDEX]]
- [[SeaTrack]]
- [[Mapa wiedzy]]

#CPK #cargo #eksport #spedycja #CCS #proces #general-cargo
