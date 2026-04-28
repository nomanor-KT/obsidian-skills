---
typ: spotkanie
tags: [typ/spotkanie, armator/cma, temat/api, projekt/seatrack]
date: 2026-01-01
---


﻿# CMA CGM: Prezentacja rozwiązaL� API Tracking

## Kontekst — skąd pochodzi ta wiedza
Podsumowanie ("debriefing") po spotkaniu z p. Anne-claire Medrinal z CMA CGM w temacie wdroLLenia i integracji API Trackingowego dla firmy (Militzer & Munch Poland). Sprawa powiązana z cyfryzacją i digitalizacją procesu L�ledzenia L�adunkAlw.

## Kluczowe punkty — najwaLLniejsze informacje
- **Rozwiązania API**: Do dyspozycji są dwie gL�Alwne opcje L�ledzenia przesyL�ek morskich (w tym zdarzeL� "inland" dla przewozAlw w opcji Carrier Haulage):
  1. *Track & Trace GET API*: Zapytania do bazy armatora wysyL�ane w sposAlb zautomatyzowany. Odpowiada temu pakiet "Essential".
  2. *Tracking Push Events/Webhooks*: Armator "wypycha" aktualizacje o statusie transportu i zdarzeniach sprzętowych (equipment + transport events), gdy tylko się pojawią. Odpowiada temu pakiet "Visibility".
- **Okres prAlbny i techniczne zasoby**: Przekazano link do katalogu i specyfikacji Swagger dla programistAlw. Wersja "free trial" dziaL�ająca na API publicznym jest aktywna do 15 kwietnia.
- **WdroLLenie kontraktu (Setup)**:
  - Wymaga podpisania umowy API. OkoL�o 10 dni po podpisaniu zespAlL� ProServices rozpoczyna integrację techniczną.
  - Zasięg dostępu kont do wdroLLenia (Implementation scope) moLLe uwzględniać dane lokalne z kraju, regionalne lub globalne z 12 miesięcy.
- **Role kontaktowe**: Do domknięcia API niezbędne jest okreL�lenie osAlb po stronie M&M do: podpisania umowy, konfiguracji technicznej i komunikacji API.
- Czas na przedstawienie wnioskAlw zarządowi/zespoL�owi i powrAlt do CMA wyniesie szacunkowo okoL�o 2 miesięcy.

## Zastosowanie w pracy — jak to wykorzystać w logistyce/spedycji
- Ustanowić plan (proof of concept) integracji pobierania eventAlw od CMA tak, by zaciągać je bezpoL�rednio do naszego systemu lub platformy no-code (Make / Airtable), by automatycznie informować klientAlw o statusach Track & Trace (ograniczenie liczby maili zapytaniowych do operacji).
- Skonsultować z DziaL�em IT, jak maile te mają wpisać się w ogAllny system ERP / TMS (np. Cargowise/inne) dla spedycji w caL�ej Polsce.
- Zebranie danych analitycznych przez API Push Events pozwoli na precyzyjniejsze mierzenie jakoL�ci serwisAlw, np. on-time delivery – co moLLna przekuć we wskaLsniki (KPI).

## Powiązane notatki
- [[INDEX]]
- [[Make - Popularne szablony automatyzacji]]
- [[Make - Pierwsza automatyzacja]]
- [[KPI]]

#logistyka #freight #ai #automatyzacja #cma #api #it
