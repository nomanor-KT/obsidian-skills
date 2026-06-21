---
name: obsidian-second-brain
description: "Default skill for the KarolOS Obsidian vault: save conversation output into notes, create or update daily notes, find existing notes, load vault context, or capture people, projects, tasks, and decisions. Use this first for vault work; pair with obsidian-markdown for syntax details and obsidian-cli for live vault operations."
---

# Obsidian Second Brain

Use this skill when the task is about keeping the KarolOS Obsidian vault useful, current, and connected.

This is the default Obsidian router for KarolOS. If the task is clearly about vault content, start here before choosing a more specific helper skill.

## Kiedy uzyc

- Chcesz zapisac wynik rozmowy do vaulta.
- Chcesz stworzyc lub zaktualizowac notatke dzienna.
- Chcesz znalezc istniejaca notatke zamiast tworzyc duplikat.
- Chcesz zaladowac kontekst vaulta przed dalsza praca.
- Chcesz zapisac osobe, projekt, spotkanie, decyzje, task albo notatke osobista.

## Zasady bazowe

1. Zaczynaj od mapy vaulta: przeczytaj [MOC.md](MOC.md) i odpowiedni lokalny [INDEX.md](praca/ai-projekty/INDEX.md) lub inny INDEX w folderze docelowym, jesli istnieje.
2. Szukaj przed tworzeniem. Jesli notatka juz istnieje, aktualizuj ja zamiast robic duplikat.
3. Traktuj [RAW](RAW) jako zrodlo surowe. Nie zmieniaj plikow w RAW, chyba ze zadanie dotyczy wprost przetwarzania RAW.
4. Uzywaj `[[wikilinks]]` do notatek wewnatrz vaulta.
5. Nowa notatka ma byc samowystarczalna: krotki kontekst, najwazniejsze punkty i linki do powiazanych miejsc.
6. Gdy dodajesz nowa notatke, sprawdz czy trzeba zaktualizowac tez MOC albo lokalny INDEX.
7. Jesli kontekst jest niejednoznaczny, zadaj jedno krotkie pytanie doprecyzowujace zamiast zgadywac.

## Preferowany routing

- Osoby i kontakty -> [kontakty](kontakty)
- Spotkania -> [praca/spotkania](praca/spotkania)
- Projekty AI -> [praca/ai-projekty](praca/ai-projekty)
- Raporty -> [praca/raporty](praca/raporty)
- Operacje / surcharge / instrukcje -> [praca](praca)
- Notatki osobiste -> [ja](ja)
- Material surowy -> [RAW](RAW)
- **Web research** -> Use `firecrawl-research` skill to search and scrape; this skill will then route findings here

## Core workflows

### 1. Save from conversation

Gdy rozmowa niesie wartosc do zachowania:

1. Wydziel rzeczy, ktore warto zapisac: decyzje, zadania, osoby, projekty, wnioski, ryzyka, pomysly.
2. Dla kazdego elementu ustal typ notatki i folder docelowy.
3. Sprawdz, czy istniejaca notatka juz pokrywa ten temat.
4. Zapisz lub zaktualizuj notatke.
5. Dodaj linki do powiazanych notatek i wlasciwego MOC.
6. Jesli to ma sens, dopisz krotki wpis do odpowiedniego INDEX.md.

### 2. Create or update a daily note

1. Znajdz dzisiejsza notatke w [ja/dziennik](ja/dziennik).
2. Jesli nie istnieje, utworz ja wedlug wzorca z istniejących dziennikow.
3. Dodaj do niej bieżące zadania, decyzje, spotkania i wazne obserwacje z rozmowy.
4. Nie nadpisuj wszystkiego od nowa, jesli notatka juz istnieje.

### 3. Find before creating

1. Szukaj po nazwie, temacie i powiazanych osobach.
2. Sprawdz notatki w folderze docelowym oraz MOC.
3. Jesli wynik jest podobny, ale niepewny, pokaz znaleziony plik i zapytaj o potwierdzenie.

### 4. Load vault context

1. Odczytaj [MOC.md](MOC.md).
2. Odczytaj notatke dzienna i ostatnie wpisy w folderze dziennika, jesli sa potrzebne.
3. Odczytaj lokalny INDEX z folderu, ktory dotyczy zadania.
4. Zwróć tylko to, co potrzebne do kolejnego kroku.

### 5. Capture structured items

- Osoba -> notatka kontaktowa z relacja i ostatnim kontaktem.
- Projekt -> notatka projektu z celem, statusem i nastepnym krokiem.
- Spotkanie -> notatka ze spotkania z uczestnikami, ustaleniami i follow-up.
- Decyzja -> wpis w notatce projektu albo osobna notatka, jesli decyzja jest wazna sama w sobie.
- Zadanie -> task z terminem, priorytetem i powiazaniem do projektu.

## Dobre nawyki

- Nie zostawiaj osieroconych notatek bez linkow, jesli da sie je powiazac.
- Nie twórz jednej ogolnej notatki, jesli temat naturalnie rozbija sie na osoby, projekty i decyzje.
- Zachowuj styl i strukture folderu, do ktorego zapisujesz.
- Przy wiekszych zmianach sprawdz, czy trzeba odswiezyc graphify albo raport grafu.

## Gotchas

- Nie mieszaj surowego tekstu z uporzadkowana notatka, jesli da sie to sensownie uporządkowac.
- Nie tworz duplikatow tylko dlatego, ze temat ma podobna nazwe.
- Nie wywracaj calego vaulta do gory nogami przy drobnym zapisie.
- Nie aktualizuj RAW po cichu; RAW ma byc zrodlem, nie miejscem obrobki.
