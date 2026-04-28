---
typ: procedura
tags: [typ/operacja, armator/cma]
date: 2026-01-01
---


﻿## Kontekst — skąd pochodzi ta wiedza
Notatka na podstawie dokumentu "SOP 2026 Zasady wspAlL�pracy przy realizacji zleceL� ATR.pdf" od CMA CGM. Zawiera procedury zlecania transportAlw (ATR - armatorskich transportAlw wgL�ębi lądu/Inland) obowiązujące od 2026 roku.

## Kluczowe punkty — najwaLLniejsze informacje
- **Format zleceL� mailowych**:
  - KaLLde zlecenie w osobnej wiadomoL�ci z uzupeL�nioną formatką.
  - Wymagany temat maila: `ATR NAZWA firmy / ETA / numer BL / MiejscowoL�ć dostawy` (np. `ATR NAZWA X /ETA 23.09 /CDM01xxxxx/ SOCHACZEW/`).
  - Pole "Numer oferty" moLLe być puste, jeL�li wycena pochodzi z narzędzia **CMA CGM Inland Tariffs Finder** (wtedy naleLLy doL�ączyć screen wklejony do maila).
- **Proces i koszty dodatkowe**:
  - **Anulacje**: **Od 01/03/2026 r. wprowadzona opL�ata 50 EUR / kontener** za anulowanie na 5 dni lub mniej przed cut-offem kolejowym (zgL�oszenia tylko dni robocze do 15:30).
  - **Cut-off**: Brak gotowoL�ci na cut-off to przepięcie na kolejny skL�ad (moLLliwa opL�ata za tzw. dead freight / niewykorzystane miejsce na pociągu).
  - **Demurrage / Storage**: Okres D&D zamyka się dopiero w momencie podjęcia peL�nego kontenera na pociąg z placu portowego, _nie_ na placu docelowym. Koszty te poniesie Zleceniodawca.
  - **Awizacje**: Armator wysyL�a je z dnia na dzieL� między 14:00 a 16:00.
  - **Specjalne naczepy (KIPR, poL�oLLenie kontenera, itp.) oraz T1**: NaleLLy koniecznie wpisywać w polu "Uwagi / specjalne wymagania" w formatce CMA.

## Zastosowanie w pracy — jak to wykorzystać w logistyce/spedycji
- **Szkolenie spedytorAlw**: ZwrAlcić uwagę zespoL�om operacyjnym na opL�atę 50 EUR przy anulowaniu ATR przed cut-offem pociągowym na 5 dni.
- **Kalkulacje**: Kalkulując koszty ATR trzeba mieć na uwadze, LLe opAlLsniony wyjazd pociągu (z winy kolei czy opieszaL�oL�ci portu) będzie generowaL� koszty D&D/Storage po stronie importera, aLL do postawienia pudL�a na wagon! To wysokie ryzyko finansowe.
- **Automatyzacja procesAlw e-mail**: Szablon wysyL�kowy z TMS lub powiadomienia moLLna ustawić tak, aby sam formatowaL� temat wg wzoru: `ATR [Nazwa_Firma] / ETA [Data] / [BL] / [MiejscowoL�ć]`. PomoLLe to w sprawniejszych rezerwacjach, minimalizacji bL�ędAlw wysyL�ki i sprawniejszej obsL�udze po stronie CMA.

## Powiązane notatki — linki [[]] do innych plikAlw
- [[API Tracking - prezentacja rozwiązaL�]] (moLLna L�ledzić po tych samych BL z tematu maila)
- [[Make - Pierwsza automatyzacja]] (szablon do generowania poprawnych wiadomoL�ci dla rAlLLnych armatorAlw)

#logistyka #freight #cma #armatorzy #procedury #transport #kolejowy
