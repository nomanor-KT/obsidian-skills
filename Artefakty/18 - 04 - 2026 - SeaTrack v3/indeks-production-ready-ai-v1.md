# Indeks Production-Ready AI v1

## Cel
Jedno miejsce z listą komend i skilli gotowych do codziennego użycia po wdrożeniach z dnia 18-04-2026.

## Status ogólny
- 5 praktyk operacyjnych: wdrożone
- Komendy operacyjne: wdrożone
- Skill hardening (Gotchas + granice): częściowo wdrożone

## Komendy produkcyjne (gotowe)

1. `/briefing`
- Plik: `.claude/commands/briefing.md`
- Cel: poranny wybór 3 priorytetów na dziś z Active_Work.md

2. `/plan-fazowy [temat]`
- Plik: `.claude/commands/plan-fazowy.md`
- Cel: Research -> Plan -> Execute -> Review -> Ship dla jednego tematu

3. `/workflow-router [temat]`
- Plik: `.claude/commands/workflow-router.md`
- Cel: wybór trybu wykonania (Command vs Skill vs Agent)

4. `/sesja-higiena`
- Plik: `.claude/commands/sesja-higiena.md`
- Cel: decyzja Continue vs Compact vs Clear vs New Session

5. `/skill-gotchas [nazwa-skilla]`
- Plik: `.claude/commands/skill-gotchas.md`
- Cel: dopinanie triggerów i sekcji Gotchas w skillach

6. `/pr-scope-check`
- Plik: `.claude/commands/pr-scope-check.md`
- Cel: kontrola małego, bezpiecznego zakresu zmian

## Skille production-ready (po hardeningu)

1. briefing
- Plik: `.github/skills/briefing/SKILL.md`
- Status: Gotchas + granice skilla dodane

2. status-summary
- Plik: `.github/skills/status-summary/SKILL.md`
- Status: Gotchas + granice skilla dodane

## Skille zainstalowane globalnie (dzisiaj)

1. graphify
2. senior-architect
3. pr-review-expert
4. runbook-generator
5. codebase-onboarding
6. llm-wiki

## Kolejny krok (opcjonalny)
- Dokończyć hardening dla pozostałych lokalnych skilli w `.github/skills` tym samym wzorcem:
  - description jako trigger
  - sekcja Gotchas
  - granice skilla

## Definicja "production-ready" w tym repo
Komenda/skill jest production-ready, gdy:
1. Ma jasny trigger użycia.
2. Ma granice zakresu.
3. Ma listę najczęstszych pułapek (Gotchas).
4. Daje powtarzalny output operacyjny.
