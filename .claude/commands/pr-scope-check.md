---
description: Kontrola zakresu zmiany pod mały, bezpieczny PR
allowed-tools: Read, Grep, Glob, Bash
---

Sprawdź czy bieżący zestaw zmian kwalifikuje się jako mały i bezpieczny PR.

## Kryteria

1. Jeden cel zmiany
- Tak/nie: czy da się opisać PR jednym zdaniem.

2. Ograniczony blast radius
- Liczba dotkniętych modułów i poziom ryzyka.

3. Czytelna weryfikacja
- Czy jest prosty sposób potwierdzenia działania.

4. Brak przypadkowego scope creep
- Czy nie doszły zmiany niezwiązane z celem.

## Decyzja

- GO: zakres jest mały i spójny.
- WAIT: potrzebny podział na 2+ PR.
- NO-GO: zmiana za szeroka/ryzykowna bez planu.

## Output

- Decyzja: GO / WAIT / NO-GO
- 3 najważniejsze ryzyka
- Proponowany podział, jeśli WAIT lub NO-GO
