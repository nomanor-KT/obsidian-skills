---
typ: referencja
tags: [typ/referencja, armator/cma, temat/api]
date: 2026-01-01
---


﻿## Kontekst — skąd pochodzi ta wiedza
Notatka na podstawie dokumentu CMA CGM "2026 Product offer and Roadmap.pdf", przedstawiającego cyfrowe pakiety API oraz EDI oferowane przez armatora. Dokument omawia model biznesowy oraz roadmape rozwoju usL�ug cyfrowych do 2026 roku.

## Kluczowe punkty — najwaLLniejsze informacje
- **Dostępne pakiety L�ącznoL�ci cyfrowej**:
  - **Essential** (API, model STARTER / POWER / ADVANCED) dla odpytywaL� GET (Schedules, Lines&Services, SpotOn, Inland Prices, BL Suite, etc.).
  - Pakiety rAlLLnią się limitem zapytaL� i ceną:
    - Starter: $139 (10k wywoL�aL� / miesiąc)
    - Power: $1179 (100k wywoL�aL� / miesiąc)
    - Advanced: $4729 (500k wywoL�aL� / miesiąc)
  - **Visibility** (zdarzenia dotyczące sprzętu, push webhook) od $49 za 100 kontenerAlw. Oraz wersja z powiadomieniami dla transportu lądowego (Carrier Haulage) po tej samej lub zbliLLonej zryczaL�towanej stawce w wyLLszych pakietach.
  - **Transport Execution** (wysyL�anie BookingAlw / SI przez API / PUSH) od $75 za 100 bookingAlw do $794 za 2000.
  - **BL Suites** (zdobywanie danych BL i skanAlw PDF przez API) od $79 za 100 BL.
- **Direct Connection Charge Code (opcja bez zewnętrznego poL�rednika)**: Dostęp do wszystkich zapytaL� API/EDI pL�atny zryczaL�towaną dawką na poziomie **$5 za TEU** (wliczane we faktury frachtowe).
- **Roadmapa 2026**:
  - Q1: Ceny i Spot On blisko portAlw (Nearby ports), API harmonogramAlw w standardzie DCSA V2.
  - Q2-Q3: Bookingi OOG, SOC (Booking Request DCSA), SI w standardzie DCSA 3.0 oraz eBL DCSA V3, a takLLe obsL�uga VGM (Request/Event).
  - Q4: Wzbogacone T&T DCSA V3 oraz Release DCSA i Delivery Order.
- Z platform zewnętrznych CMA jest takLLe poL�ączone we wspAlL�pracy typu EDI z wieloma popularnymi serwisami (Cargosmart, Inttra, e2open, project44, FourKites itp.).

## Zastosowanie w pracy — jak to wykorzystać w logistyce/spedycji
- **WdroLLenia technologiczne (API Tracking):** Rozliczenia kosztAlw API. NaleLLy przeliczyć czy opL�aca nam się (jako spedytorowi) inwestować w poL�ączenia pakiety (np. Starter za 139 USD) pod naszą wewnętrzną bazę / aplikację TMS, czy negocjować "Direct Connection" (5 USD / TEU) z uwzględnieniem obrotu z tym armatorem. ULLyteczna wiedza w rozmowie o wdroLLeniach i automatyzacji aktualizacji systemAlw logistycznych.
- **Real-Time Visibility (RTV):** WdroLLenie webhookAlw L�ledzących statusy przewozAlw lądowych bezpoL�rednio od CMA za poL�rednictwem taniego pakietu "Visibility+" - moLLe zniwelować koniecznoL�ć ręcznego L�ledzenia i obdzwaniania terminali.
- Planując narzędzia z agentami warto bazować na zuniwersalizowanych modelach danych **DCSA** – zgodnie z roadmapą armatora, caL�y rynek zmierzający w stronę EDI i API wdroLLy ten standard ostatecznie do koL�ca 2026 r. 

## Powiązane notatki — linki [[]] do innych plikAlw
- [[API Tracking - prezentacja rozwiązaL�]]
- [[Make - Pierwsza automatyzacja]] (potencjalne poL�ączenie webhookAlw CMA)
- [[Make - Popularne szablony automatyzacji]]

#logistyka #ai #projekty #automatyzacja #freight #api #cma #armatorzy
