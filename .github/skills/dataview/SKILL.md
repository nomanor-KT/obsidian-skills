---
name: dataview
description: "Use when creating Dataview queries, DataviewJS dashboards, task views, project tables, daily-note indexes, or vault audits for KarolOS Obsidian notes."
---

# Dataview Skill

Use this skill when you need dynamic views over the KarolOS vault.

## Kiedy uzyc

- Chcesz zrobic liste notatek z folderu, tagu albo linku.
- Chcesz zbudowac dashboard projektow, spotkan, kontaktow albo dziennikow.
- Chcesz pokazac taski, overdue items, ostatnio zmienione pliki albo osierocone notatki.
- Chcesz analizowac dane z frontmatter i inline fields.

## Co jest najwazniejsze

1. Dataview czyta frontmatter, inline fields, tags i linki.
2. Do prostych widokow uzywaj `dataview` DQL.
3. Do logiki, liczenia i niestandardowych tabel uzywaj `dataviewjs`.
4. Gdy pytanie dotyczy jednego pliku, sprawdz `this` i `file.*`.
5. Gdy pytanie dotyczy calego vaulta, zawężaj zakres przez folder, tag albo link.

## Silne przypadki uzycia w tym vaultcie

- Dashboard `praca` z aktywnymi projektami i terminami.
- Widok `RAW` do kontroli, co juz zostalo przetworzone.
- Lista osieroconych notatek do podpiecia do MOC.
- Przeglad notatek dziennych z ostatnich 30 dni.
- Tabela kontaktow albo spotkan z ostatnia data interakcji.

## Szybki schemat DQL

```dataview
TABLE
  file.link AS Note,
  status,
  date,
  tags
FROM "praca"
WHERE status != "zamkniety"
SORT date DESC
LIMIT 20
```

## Szybki schemat taskow

```dataview
TASK
FROM "praca"
WHERE !completed
SORT due ASC
```

## Szybki schemat DataviewJS

```dataviewjs
const pages = dv.pages('"praca"')
  .where(p => p.status && p.status !== "zamkniety")
  .sort(p => p.date, "desc");

dv.table(
  ["Note", "Status", "Date"],
  pages.map(p => [p.file.link, p.status, p.date])
);
```

## Przydatne pola

- `file.name`, `file.folder`, `file.path`
- `file.ctime`, `file.mtime`, `file.day`
- `file.tags`, `file.etags`
- `file.inlinks`, `file.outlinks`
- `file.tasks`, `file.frontmatter`

## Gotchas

- Nie zakladaj, ze frontmatter istnieje w kazdym pliku.
- Nie mieszaj DQL i DataviewJS w jednej odpowiedzi bez potrzeby.
- Nie dawaj zbyt szerokiego `FROM ""`, jesli pytanie dotyczy tylko jednego obszaru.
- Nie zgaduj nazwy pola, jesli mozna je wyczytac z istniejacego frontmatteru lub przykladu.

## Minimalna odpowiedz

Gdy odpowiadasz, podaj:
- gotowy kod bloku Dataview albo DataviewJS
- krotkie wyjasnienie, gdzie go wkleic
- jesli trzeba, jedna alternatywe prostsza i jedna bardziej zaawansowana
