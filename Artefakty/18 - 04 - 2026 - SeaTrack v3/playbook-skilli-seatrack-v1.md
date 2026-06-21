# Playbook skilli - SeaTrack v1

## Po co ten playbook
Ten dokument ma skrócić czas decyzji: jakiego skilla użyć w konkretnym zadaniu, bez zastanawiania się "co teraz odpalić".

## Zasada 10 sekund
Jeśli pytanie dotyczy:
- architektury systemu -> `senior-architect`
- jakości zmian / ryzyka regresji -> `pr-review-expert`
- procedury operacyjnej krok po kroku -> `runbook-generator`
- szybkiego wejścia w kod po przerwie -> `codebase-onboarding`
- porządkowania wiedzy w czasie -> `llm-wiki`
- mapy zależności i ukrytych powiązań -> `graphify`

## Scenariusze SeaTrack (najczęstsze)

### 1) "Dodajemy nowego armatora"
- Skill: `senior-architect` + `graphify`
- Cel: ocenić wpływ na architekturę i miejsca największego ryzyka.
- Wynik: lista punktów zmian + kolejność wdrożenia.

### 2) "Zrobiliśmy zmiany w trackingu - czy to bezpieczne?"
- Skill: `pr-review-expert`
- Cel: złapać regresje, ryzyka i braki testowe przed wdrożeniem.
- Wynik: lista krytycznych uwag (priorytet P1/P2/P3).

### 3) "Potrzebuję instrukcji dla zespołu, co robić przy incydencie"
- Skill: `runbook-generator`
- Cel: gotowa procedura krok po kroku.
- Wynik: runbook operacyjny do użycia przez zespół.

### 4) "Wracam po kilku dniach i nie pamiętam co gdzie jest"
- Skill: `codebase-onboarding` + `graphify`
- Cel: szybki powrót do kontekstu.
- Wynik: mapa modułów, punktów wejścia i zależności.

### 5) "Chcę, żeby wiedza nie znikała między sesjami"
- Skill: `llm-wiki`
- Cel: utrwalanie decyzji, relacji i wniosków.
- Wynik: żywa baza wiedzy zamiast odtwarzania od zera.

## Rytm tygodniowy (lekki)
- Poniedziałek wieczór: `graphify` na SeaTrack-v3 i szybki przegląd raportu.
- W trakcie tygodnia: `pr-review-expert` przy większych zmianach.
- Po incydencie / zmianie operacyjnej: aktualizacja runbooka (`runbook-generator`).
- Po większym etapie prac: krótkie podsumowanie wiedzy (`llm-wiki`).

## Czerwone flagi (kiedy od razu użyć konkretnego skilla)
- "To ma wejść na produkcję" -> `pr-review-expert`
- "Nie wiemy gdzie to najlepiej podpiąć" -> `senior-architect`
- "Zespół robi to każdy inaczej" -> `runbook-generator`
- "Po przerwie nie wiemy od czego zacząć" -> `codebase-onboarding`

## Definicja sukcesu
Po 2 tygodniach pracy z tym playbookiem:
1. Mniej ad-hoc decyzji technicznych.
2. Mniej regresji po zmianach.
3. Szybszy powrót do projektu po przerwie.
4. Spójniejsze działania operacyjne zespołu.
