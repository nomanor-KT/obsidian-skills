---
name: status-summary
description: "Use when: generating executive summaries of project status, milestones, achievements, risks and next steps. Automatically extracts data from Active_Work.md and produces markdown reports for management."
---

# Status-Summary Skill

Automatyczne tworzenie podsumowań statusowych z Active_Work.md dla zarządu. Generuje raport w markdown zawierający status projektów (traffic lights), osiągnięcia, ryzyka i następne kroki.

## Zastosowanie

Skorzystaj z tego skill, gdy:
- Musisz przygotować raport dla zarządu na temat postępu projektów
- Chcesz szybko zsumować co osiągnęło Twoje zespół w tym tygodniu/miesiącu
- Potrzebujesz zidentyfikować główne ryzyka i blockers dla decydentów
- Chcesz przesłać status przez email, Slack lub dashboard

## Proces Generowania Raportu

### Krok 1: Załadowanie Danych
Skill przeanalizuje Twój plik `Active_Work.md` i wyciągnie:
- Cele na ten okres ("Goals" / "Objektive")
- Aktywne projekty ("Active Projects")
- Status każdego projektu
- Osiągnięcia (co zostało zrobione)
- Ryzyka i blokady ("Risks & Blockers")
- Następne kroki ("Next Steps")

### Krok 2: Mapowanie Statusu na Traffic Lights
Na podstawie opisów statusu w Active_Work.md, skill przypisze odpowiednie kolory:

| Status | Emoji | Znaczenie |
|--------|-------|-----------|
| 🟢 On Track | Zielone | Projekt postępuje zgodnie z planem, nie ma ryzyka |
| 🟡 At Risk | Żółte | Projekt ma zagrożenia, ale są plany mitygacji |
| 🔴 Blocked | Czerwone | Projekt jest zagrożony lub zatrzymany, wymagane działanie |

### Krok 3: Strukturyzacja Osiągnięć (Deliverables)
Skill wyciąga i grupuje osiągnięcia:
- Co zostało dostarczone w ostatnim okresie
- Które kamienie milowe zostały osiągnięte
- Jakie metryki/KPI zostały zrealizowane

### Krok 4: Zidentyfikowanie Zagrożeń
Zbiera ryzyka i blokady z Active_Work.md:
- Główne ryzyka projektowe
- Blockers - co blokuje postęp
- Wymagane decyzje / escalations

### Krok 5: Generacja Raportu Markdown
Creates nicely formatted executive summary:

```markdown
# Executive Summary
**Report Date**: [DATA]
**Reporting Period**: [OKRES]
**Prepared by**: [TWÓJ PROFIL]

## Overview
[Krótkie streszczenie ogólnego postępu]

## Project Status Dashboard
| Projekt | Status | Progress |
|---------|--------|----------|
| [Project 1] | 🟢 | X% |
| [Project 2] | 🟡 | X% |
| [Project 3] | 🔴 | X% |

## 🎯 Key Achievements (Deliverables)
- ✅ [Achievement 1]
- ✅ [Achievement 2]

## 🚨 Risks & Blockers
- ⚠️ **[Risk 1]**: [Description] → *Mitigation: [Plan]*
- 🔴 **[Blocker 1]**: [Description] → *Action Required*

## 📋 Next Steps (Priority Order)
1. [Highest Priority] - Owner: [Kto] - Deadline: [Data]
2. [Medium Priority] - Owner: [Kto] - Deadline: [Data]

## 📊 Key Metrics
- [KPI 1]: X
- [KPI 2]: Y

---
*Report generated from Active_Work.md*
```

## Input

Skill wymaga:
- **Aktualny plik `Active_Work.md`** w workspace (struktura opisana poniżej)
- Opcjonalnie: data raportowania, okres pokrycia (domyślnie: od ostatniej aktualizacji)

### Struktura wymaganego Active_Work.md
Aby skill działał prawidłowo, Active_Work.md powinien zawierać:

```markdown
# Active Work

## Goals for This Period
- [Cel 1]
- [Cel 2]

## Active Projects
### Project Name
- **Status**: [On Track | At Risk | Blocked]
- **Progress**: X%
- **Achievement**: [co osiągnięto]
- **Risks**: [jakie ryzyka]
- **Blockers**: [co blokuje]
- **Next Steps**: [co dalej]

## Risks & Blockers
- **[Risk Name]**: [Description] → Mitigation: [Plan]
- **[Blocker Name]**: [Description] → Action: [Plan]

## Decisions Pending
- [Decision 1]
```

## Output

Skill wygeneruje:
1. **Markdown report** gotowy do wysłania
2. **Struktura dla zarządu** (Executive Summary format)
3. **Status dashboard** (traffic light colors)
4. **Detailed breakdown** (osiągnięcia, ryzyka, następne kroki)

Raport można:
- Wysłać przez email
- Wkleić do Slacka
- Umieścić w dokumentacji projektu
- Archiwizować dla historia

## Dostosowania

Jeśli pracujesz z różnymi stakeholderami:

1. **Executive version** - tylko status, ryzyka, decyzje (krótko)
2. **Detailed version** - pełna analiza, metryki, KPI
3. **Funkcjonalna wersja** - dla zespołu zamiast zarządu

Możesz prosić skill o konkretny format: `"Wygeneruj status dla zarządu (krótka wersja)" vs "Pełny report ze wszystkimi metrykami"`

## Przykłady Zapytań
- `/status-summary`
- "Wygeneruj podsumowanie dla zarządu na podstawie Active_Work.md"
- "Stwórz raport statusowy z traffic lights i osiągnięciami"
- "Przygotuj executive summary dla wrzesnia"

## Wymagane Umiejętności Agenta
- Analiza strukturalna tekstu markdown
- Mapowanie statusu na kategorie/kolory
- Formatowanie raportów strukturalizowanych
- Komunikacja dla zarządu (conciseness, actionability)
- Identyfikacja KPI i metryk

## Gotchas

- **Mylenie celu raportu:** To jest raport statusowy dla decydentów, nie plan dnia i nie analiza techniczna kodu.
- **Domyślanie metryk:** Jeśli `Active_Work.md` nie zawiera KPI/progresu, nie zgaduj liczb. Oznacz brak danych jasno.
- **Mieszanie Parking Lot z aktywnymi projektami:** Projekty z Parking Lot nie powinny trafiać do głównego dashboardu statusowego.
- **Brak właściciela i deadline:** Sekcja Next Steps bez ownera i terminu traci wartość operacyjną.
- **Status bez uzasadnienia:** Kolor traffic light musi wynikać z konkretnych sygnałów ryzyka/blokad, nie z intuicji.

## Granice skilla

- Ten skill tworzy podsumowanie statusowe na podstawie `Active_Work.md`.
- Ten skill nie aktualizuje automatycznie `Active_Work.md` (chyba że użytkownik wyraźnie o to poprosi).
- Ten skill nie zastępuje `/briefing` (plan dnia) ani `/decyzja` (analiza opcji strategicznych).
