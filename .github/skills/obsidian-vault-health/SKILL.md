---
name: obsidian-vault-health
description: "Use when you need to audit the KarolOS Obsidian vault for broken links, duplicates, missing frontmatter, orphaned notes, stale claims, weak MOC/index coverage, or when graphify output should be interpreted after structural changes. Pair with obsidian-second-brain for vault routing and obsidian-markdown for note syntax."
---

# Obsidian Vault Health

Use this skill when the vault needs cleanup, structure checks, or a quick health pass.

## Kiedy uzyc

- Uzytkownik pyta, czy vault jest spójny.
- Pojawiaja sie podejrzenia duplikatow albo osieroconych notatek.
- Trzeba sprawdzic, czy nowa notatka ma dobre linki i frontmatter.
- Po wiekszej serii zmian w vaulta chcesz zrobic szybki przeglad struktury.
- Jest dostepny raport z graphify i trzeba wyciagnac z niego sens.

## Co sprawdzac

1. Broken links i nieaktualne wikilinki.
2. Duplikaty lub prawie-duplikaty tematow.
3. Notatki bez frontmatter, jesli ten folder tego wymaga.
4. Osierocone notatki bez linkow przychodzacych.
5. Stare lub sprzeczne informacje, zwlaszcza w notatkach o osobach, projektach i decyzjach.
6. Czy nowe notatki trafily do odpowiedniego MOC i lokalnego INDEX.
7. Czy RAW zostal zostawiony nietkniety tam, gdzie powinien.

## Proces

### 1. Zbierz kontekst

- Otworz [MOC.md](MOC.md).
- Otworz odpowiednie [INDEX.md](praca/ai-projekty/INDEX.md) lub inny INDEX w folderze, ktory dotyczy problemu.
- Jesli istnieje [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md), przeczytaj go przed ocena struktury.

### 2. Ocen wynik

Podziel problemy na trzy poziomy:

- Krytyczne: uszkodzone linki, brak frontmatter tam, gdzie jest wymagany, konfliktowe tresci.
- Ostrzezenia: duplikaty, stare wpisy, brakujace linki do MOC, osierocone notatki.
- Info: puste foldery, slabe pokrycie INDEX, notatki do podpięcia pozniej.

### 3. Rozdziel bezpieczne i ryzykowne poprawki

- Bezpieczne: poprawa linkow, dopisanie brakujacego linku, podpiecie do INDEX, dopisanie MOC.
- Ryzykowne: scalanie notatek, usuwanie czegokolwiek, przepisywanie sprzecznych tresci.
- Jesli poprawka moze zmienic sens notatki, najpierw popros o zgode.

### 4. Zasady naprawy

1. Najpierw napraw relacje miedzy notatkami.
2. Potem popraw frontmatter i podstawowa strukture.
3. Na koncu odswiez graf lub raport, jesli zmiana byla istotna.

## Format odpowiedzi

- Najpierw pokaz wniosek w jednym zdaniu.
- Potem lista problemow od najwazniejszych.
- Na koncu napisz, co mozna naprawic automatycznie, a co wymaga zgody.

## Gotchas

- Nie myl osieroconej notatki z notatka bezuzyteczna. Czasem po prostu jeszcze nie ma do niej linku.
- Nie usuwaj starej wiedzy, jesli nowa jej nie uniewaznia.
- Nie traktuj graphify jako wyroczni. To wskazowka, nie prawda absolutna.
- Nie naprawiaj destrukcyjnych rzeczy bez jasnego potwierdzenia.
