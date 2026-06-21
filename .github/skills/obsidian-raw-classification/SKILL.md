---
name: obsidian-raw-classification
description: "Use when you need to classify a note from Obsidian/Karol-KB/RAW by type, date, topic, tags, and likely destination before any rewrite happens."
---

# Obsidian RAW Classification

Use this skill for fast triage of inbox notes.

## Co robi

- Rozpoznaje typ notatki.
- Wyciaga date z tresci, jesli jest.
- Okresla glowny temat.
- Sugeruje folder docelowy.
- Proponuje tagi hierarchiczne.

## Co nie robi

- Nie przepisuje calej notatki.
- Nie buduje pelnego frontmattera dla finalnej wersji.
- Nie usuwa plikow z RAW.
- Nie zastępuje `/notkaRAW`.

## Wynik

Zwracaj tylko:
- typ
- date
- temat
- routing
- tagi
- czy potrzebny jest pelny workflow

## Gotchas

- Nie zgaduj daty systemowej, jesli data jest w tresci.
- Nie mieszaj klasyfikacji z pelnym przetwarzaniem.
- Jesli temat jest niejednoznaczny, zaznacz to wprost.
