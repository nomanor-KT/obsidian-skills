---
name: templater
description: "Use when creating or editing Templater templates, tp.* scripts, daily notes, project templates, meeting templates, or automated note creation for KarolOS Obsidian vault."
---

# Templater Skill

Use this skill when you need dynamic templates in the KarolOS vault.

## Kiedy uzyc

- Chcesz zrobic szablon notatki dziennej, spotkania albo projektu.
- Chcesz wstawic date, nazwe pliku, zawartosc schowka albo prompt od uzytkownika.
- Chcesz automatycznie utworzyc i przeniesc plik.
- Chcesz dopisac frontmatter albo wygenerowac sekcje z logicznym warunkiem.

## Co jest najwazniejsze

1. `<% %>` zwraca wynik.
2. `<%* %>` wykonuje logike bez bezposredniego outputu.
3. `tp.date`, `tp.file`, `tp.system`, `tp.web`, `tp.frontmatter` i `tp.obsidian` to podstawowe moduly.
4. W tym vaultcie przydatne sa glownie szablony dla notatek dziennych, spotkan, projektow i szybkiego capture.
5. Jesli szablon ma tworzyc nowy plik, lepiej zrobic to jawnie przez `tp.file.create_new()` niz przez niejasna automatyzacje.

## Najbardziej przydatne wzorce dla tego vaulta

### Notatka dzienna

- data z `tp.date.now()`
- nawigacja do wczoraj i jutra
- sekcje na priorytety, spotkania i notatki

### Spotkanie

- tytul przez `tp.system.prompt()`
- data przez `tp.date.now()`
- uczestnicy przez prompt albo multi_suggester

### Projekt

- status przez `tp.system.suggester()`
- start, termin i sekcje celow

### Quick capture

- zawartosc schowka przez `tp.system.clipboard()`
- automatyczny tytul z pierwszej linii

## Przykladowy start dla daily note

```markdown
---
date: <% tp.date.now("YYYY-MM-DD") %>
type: daily
tags: [daily]
ai-first: true
---

# <% tp.date.now("dddd, MMMM Do YYYY") %>

## Top 3
- [ ]

## Notes

## Links
- [[MOC]]
```

## Przykladowy start dla meeting note

```markdown
---
date: <% tp.date.now("YYYY-MM-DD") %>
type: meeting
tags: [meeting]
ai-first: true
---

# <% await tp.system.prompt("Meeting title") %>

## Attendees

## Key Points

## Action Items
- [ ]
```

## Gotchas

- Nie zakladaj, ze `tp.file.title` jest juz sensownie ustawiony.
- Nie mieszaj logiki z outputem, jesli mozna to rozdzielic.
- Nie uzywaj zbyt wielu promptow, jesli szablon ma dzialac szybko.
- Nie tworz szablonu, ktory generuje plik bez jasnego miejsca docelowego.

## Minimalna odpowiedz

Gdy odpowiadasz, podaj:
- gotowy szablon lub fragment
- gdzie go zapisac
- jesli trzeba, wersje prostsza dla szybkiego uzycia i wersje pelna do automatyzacji
