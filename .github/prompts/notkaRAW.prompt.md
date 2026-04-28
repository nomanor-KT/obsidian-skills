---
description: "Use when: processing files from Obsidian/Karol-KB/RAW into structured Obsidian notes with strict frontmatter, hierarchical tags, routing rules, and safe source cleanup. Trigger with /notkaRAW."
name: notkaRAW
---

# /notkaRAW

Masz wykonać pelny workflow dla notek z katalogu RAW.

## Cel
- Znajdz wszystkie nieprzerobione notatki w `Obsidian/Karol-KB/RAW`.
- Przetworz kazda notatke do formatu Obsidian z obowiazkowym YAML frontmatter.
- Ustaw linki `[[...]]` do istniejacych notatek i odpowiedniego MOC.
- Usun plik zrodlowy z `RAW` tylko po pelnym, poprawnym zapisie.
- Na koncu odswiez graph knowledge dla `Obsidian/Karol-KB`.

## Kontrakt notatki (obowiazkowy)

### FRONTMATTER YAML
Kazda notka musi zaczynac sie od YAML i zawierac wszystkie pola:

```yaml
---
typ: [jeden z: intel, operacja, spotkanie, kontakt, newsletter, projekt, notatka]
date: YYYY-MM-DD
source: RAW
tags: [tagi hierarchiczne, patrz sekcja ponizej]
status: [aktywny | zamkniety | czekam]
---
```

Reguly:
- `date` wyciagaj z tresci maila/dokumentu. Nie uzywaj daty systemowej, jesli data zrodla jest znana.
- `typ` musi byc spojny z co najmniej jednym tagiem `typ/...`.
- `source` zawsze `RAW`.

### TAGI HIERARCHICZNE
Zawsze stosuj tagi z prefiksami. Brak tagow plaskich.

Wymagane minimum:
- Dokladnie 1 tag typu: `typ/intel`, `typ/operacja`, `typ/spotkanie`, `typ/kontakt`, `typ/newsletter`, `typ/projekt`, `typ/notatka`.

Warunkowo:
- Armator: `armator/maersk`, `armator/cma`, `armator/msc`, `armator/hapag`, `armator/samskip`.
- Projekt: `projekt/seatrack`, `projekt/planer`, `projekt/dashboard`.
- Temat: `temat/hormuz`, `temat/stawki`, `temat/surcharge`, `temat/rail`, `temat/ams`.

Tagi moga byc rozszerzane, ale tylko z prefiksami: `typ/`, `armator/`, `projekt/`, `temat/`.

### STRUKTURA TRESCI
Kazda notka musi miec sekcje:
1. `# [zwiezly opis po polsku lub angielsku]`
2. `## Nadawca` (jesli to mail)
3. `## Kluczowe punkty`
4. `## Wymagane dzialania` (jesli brak dzialan, wpisz: `- Brak na ten moment`)
5. `## Powiazane notatki`

## Zasady działania
1. Najpierw sprawdź zawartość `RAW`.
2. Jeśli w RAW jest więcej niż jeden plik, przerabiaj je po kolei.
3. Obsluguj pliki `.txt` i `.md` z `RAW`.
4. Odczytaj tresc notatki i ustal: `typ`, date, glowny temat, folder docelowy, tagi.
5. Nazwij plik wg reguly: `YYYY-MM-DD-krotki-opis-po-angielsku.md`.
6. Zapisz notatke do folderu docelowego zgodnie z mapa routingu.
7. Uzupelnij sekcje `## Powiazane notatki` linkami `[[...]]` do notatek o tym samym kontekście.
8. Jezeli istnieje juz notatka o tej samej dacie i temacie, aktualizuj istniejaca zamiast tworzyc duplikat.
9. Zastosuj bramke bezpieczenstwa przed usunieciem zrodla (sekcja ponizej).
10. Po pozytywnym wyniku bramki usun plik zrodlowy z `RAW`.
10. Po przerobieniu wszystkich plikow uruchom aktualizacje grafu dla vaultu:
	- preferowane: `C:/Users/k.torebko/Desktop/KarolOS/.venv/Scripts/graphify.exe update Obsidian/Karol-KB`
	- jesli to niemozliwe, uzyj fallbacku przez skill `/graphify Obsidian/Karol-KB --update`
11. Po aktualizacji grafu odczytaj `Obsidian/Karol-KB/graphify-out/GRAPH_REPORT.md` i krotko podsumuj:
	- najważniejsze God Nodes
	- 2-3 Surprising Connections

## Gdzie zapisywac (routing)
Mapuj notatki dokladnie wg ponizszych regul:
- Mail od armatora (Maersk, CMA, MSC) -> `Obsidian/Karol-KB/praca/armatorzy/[NAZWA]/`
- Newsletter (ShipcoWeekly, Sea Freight Intelligence) -> `Obsidian/Karol-KB/praca/armatorzy/inne/`
- Market intelligence (Google Alerts, analizy rynkowe) -> `Obsidian/Karol-KB/praca/armatorzy/inne/`
- Surcharge / oplaty -> `Obsidian/Karol-KB/praca/surcharge/`
- Instrukcje operacyjne -> `Obsidian/Karol-KB/praca/`
- Kontakt / wizytowka -> `Obsidian/Karol-KB/kontakty/`
- Spotkanie -> `Obsidian/Karol-KB/praca/spotkania/`
- Projekt AI -> `Obsidian/Karol-KB/praca/ai-projekty/`
- Osobiste -> `Obsidian/Karol-KB/ja/`

### Priorytet przy konfliktach klasyfikacji
Stosuj priorytet od najwyzszego do najnizszego:
1. `kontakt`
2. `spotkanie`
3. `projekt` (AI)
4. `surcharge / oplaty`
5. `newsletter` / `intel`
6. `operacja`
7. `notatka`

Przykladowo: jesli mail armatora dotyczy glownie surcharge, kieruj do `praca/surcharge/` i dodaj tag `armator/...`.

## Linkowanie (kluczowe)
Sekcja `## Powiazane notatki` jest obowiazkowa.
Zawsze dodaj linki `[[...]]` do:
- Innych notatek o tym samym armatorze (jesli dotyczy)
- Notatek o tym samym temacie geopolitycznym/operacyjnym (np. Hormuz)
- Notatek o powiazanych projektach
- Wlasciwego MOC:
  - `[[praca/armatorzy/MOC-armatorzy]]` dla notatek armatorskich/intel/newsletter/surcharge
  - `[[praca/ai-projekty/MOC-projekty]]` dla notatek projektowych AI

## Bramka bezpieczenstwa przed usunieciem RAW
Usun plik z `RAW` tylko wtedy, gdy wszystkie warunki sa spelnione:
1. Notatka zostala zapisana w docelowym folderze.
2. Frontmatter zawiera wszystkie wymagane pola i poprawne wartosci.
3. Nazwa pliku jest w formacie `YYYY-MM-DD-krotki-opis-po-angielsku.md`.
4. Sekcje tresci sa kompletne, w tym `## Powiazane notatki`.
5. W `## Powiazane notatki` jest co najmniej 1 link kontekstowy `[[...]]` oraz odpowiedni MOC.

Jesli ktorykolwiek warunek nie jest spelniony:
- Nie usuwaj pliku zrodlowego.
- Zglos, co wymaga doprecyzowania/poprawy.

## Wymagania jakosciowe
- Zachowaj prosty, czytelny uklad.
- Nie zostawiaj surowego tekstu bez struktury, jesli da sie go uporzadkowac.
- Dla niejednoznacznych przypadkow zatrzymaj sie i popros o doprecyzowanie.
- Przy streszczeniu preferuj prawdziwe punkty, listy i naglowki z tresci, a nie pierwsze przypadkowe linie.
- Hashtagi wyciagaj tylko z inline tagow, nie z naglowkow markdown.
- Jesli notatka jest zbyt obszerna lub chaotyczna, uzyj trybu wiernego: zachowaj pelna tresc zrodlowa na koncu jako `## Oryginalna tresc`.
- W trybie wiernym nie gub zadnej czesci tresci zrodlowej; dodawaj tylko strukture i metadane.
- Jesli `RAW` jest puste, wykonaj tylko odswiezenie graphify i zwroc krotkie podsumowanie reportu.

## Tryb tygodniowy (sobota)
- Zakladaj, ze `/notkaRAW` to tygodniowe domkniecie inboxu wiedzy.
- Po kazdym sobotnim przebiegu koncz zawsze odswiezeniem graphify dla `Obsidian/Karol-KB`.
