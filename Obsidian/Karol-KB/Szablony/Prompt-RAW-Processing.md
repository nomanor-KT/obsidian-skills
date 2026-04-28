---
typ: szablon
date: 2026-04-25
tags: [typ/szablon, workflow, automatyzacja]
---

# Prompt: Przetwarzanie RAW na notatki

Uzyj tego promptu kiedy odpalasz GitHub Copilota / Cline do przerobki plikow z katalogu RAW na notatki w vaulcie.

---

## Prompt do skopiowania

```
Przetworz pliki z folderu RAW/ na notatki Obsidian wedlug ponizszych zasad.

### FRONTMATTER (obowiazkowy)
Kazda notka MUSI zaczynac sie od frontmattera YAML:
---
typ: [jeden z: intel, operacja, spotkanie, kontakt, newsletter, projekt, notatka]
date: YYYY-MM-DD (data z tresci maila/dokumentu)
source: RAW
tags: [uzyj tagow hierarchicznych -- patrz nizej]
status: [aktywny | zamkniety | czekam]
---

### TAGI HIERARCHICZNE
Zamiast generycznych tagow, uzyj konkretnych:
- Typ notki: typ/intel, typ/operacja, typ/spotkanie, typ/kontakt, typ/newsletter
- Armator (jesli dotyczy): armator/maersk, armator/cma, armator/msc, armator/hapag, armator/samskip
- Projekt (jesli dotyczy): projekt/seatrack, projekt/planer, projekt/dashboard
- Temat (jesli dotyczy): temat/hormuz, temat/stawki, temat/surcharge, temat/rail, temat/ams

### STRUKTURA NOTKI
Kazda notka powinna miec:
1. Tytul: # [zwiezly opis po polsku lub angielsku]
2. ## Nadawca (jesli to mail)
3. ## Kluczowe punkty -- wypunktowane najwazniejsze informacje
4. ## Wymagane dzialania -- co trzeba zrobic (jesli cokolwiek)
5. ## Powiazane notatki -- WAZNE: dodaj linki [[]] do istniejacych notek na podobny temat

### GDZIE ZAPISAC
- Mail od armatora (Maersk, CMA, MSC) -> praca/armatorzy/[NAZWA]/
- Newsletter (ShipcoWeekly, Sea Freight Intelligence) -> praca/armatorzy/inne/
- Market intelligence (Google Alerts, analizy rynkowe) -> praca/armatorzy/inne/
- Surcharge / oplaty -> praca/surcharge/
- Instrukcje operacyjne -> praca/ (root)
- Kontakt / wizytowka -> kontakty/
- Spotkanie -> praca/spotkania/
- Projekt AI -> praca/ai-projekty/
- Osobiste -> ja/

### LINKOWANIE -- KLUCZOWE
Po zapisaniu notki, ZAWSZE dodaj sekcje "## Powiazane notatki" z linkami [[]] do:
- Innych notek o tym samym armatorze
- Notek o tym samym temacie geopolitycznym (np. Hormuz)
- Notek o powiazanych projektach
- MOC-a tematycznego: [[praca/armatorzy/MOC-armatorzy]] lub [[praca/ai-projekty/MOC-projekty]]

### NAZEWNICTWO PLIKOW
Format: YYYY-MM-DD-krotki-opis-po-angielsku.md
Przyklad: 2026-04-25-maersk-middle-east-update-26.md
```

---

## Powiazane
- [[MOC|Glowna mapa vaulta]]
- [[Szablony/Przetworz-skrzynke|Stary szablon przetwarzania skrzynki]]
