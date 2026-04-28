# Plan 7 dni - Claude (VS Code) + Obsidian dla SeaTrack v3

## Cel
Uruchomic 2 powtarzalne workflowy, ktore realnie oszczedzaja czas przy SeaTrack:
1. status/follow-up do PNS i interesariuszy,
2. szybkie przygotowanie notatek i decyzji po spotkaniach technicznych.

## Zasada
Nie wdrazamy wszystkiego naraz. Jedna zmiana dziennie, maly zakres, mierzalny efekt.

## Dzien 1 (dzis)
- Potwierdz folder roboczy dla workflowow: `Artefakty/19 - 04 - 2026 - SeaTrack v3/`.
- Stworz 2 szablony w Obsidian:
  - `szablon-statusu-dziennego.md`
  - `szablon-follow-up-po-spotkaniu.md`
- Ustal 1 metryke: ile minut oszczedzasz na jednym statusie.

## Dzien 2
- Zbuduj Skill #1: `seatrack-status`.
- Trigger: prosba o status dzienny/tygodniowy.
- Output: 5 sekcji (Co zrobione, Blokady, Ryzyka, Decyzje potrzebne, Nastepny krok).

## Dzien 3
- Przetestuj Skill #1 na realnym materiale z ostatniego tygodnia.
- Popraw 3 rzeczy:
  - krotsze zdania,
  - zero ogolnikow,
  - zawsze jedna prosba o decyzje na koncu.

## Dzien 4
- Zbuduj Skill #2: `seatrack-followup`.
- Trigger: notatki po callu/spotkaniu.
- Output: mail follow-up z terminami, wlascicielami zadan i jednym akapitem ryzyk.

## Dzien 5
- Przetestuj Skill #2 na 2 scenariuszach:
  - spotkanie techniczne z IT/PNS,
  - spotkanie operacyjne wewnetrzne.
- Dodaj warunek: jesli brakuje danych, model ma zadac 3 precyzyjne pytania.

## Dzien 6
- Ustal mini-standard kontroli jakosci (2 minuty):
  - czy output ma konkretne terminy,
  - czy output ma wlasciciela kazdego zadania,
  - czy output konczy sie decyzja GO/WAIT/NO-GO.

## Dzien 7
- Podsumuj wynik tygodnia:
  - liczba dokumentow wygenerowanych,
  - sredni czas oszczedzony,
  - co poprawic w triggerach i opisach skilli.
- Decyzja: utrzymujemy, rozszerzamy albo zamrazamy.

## Definicja sukcesu po 7 dniach
- Minimum 5 realnych outputow zrobionych przez 2 workflowy.
- Minimum 30-45 minut oszczednosci lacznie tygodniowo.
- Jedna, stale uzywana struktura statusu i follow-upow dla SeaTrack.

## Czego nie robic
- Nie budowac teraz skilli do tematow z Parking Lot.
- Nie tworzyc wiecej niz 2 skilli na start.
- Nie dopieszczac promptow godzinami - najpierw realny test, potem korekta.
