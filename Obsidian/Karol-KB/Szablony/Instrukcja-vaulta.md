---
typ: referencja
tags: [typ/referencja, workflow]
date: 2026-04-26
status: aktywny
---

# Instrukcja obslugi vaulta

Kompletny przewodnik po zoptymalizowanym vaulcie. Wracaj tu kiedy zapomnisz jak cos dziala.

---

## 1. Nawigacja -- jak sie poruszac

### MOC jako punkt startowy
MOC.md to Twoja strona glowna. Kazdy link prowadzi do MOC-a tematycznego lub kluczowej notki.

Sciezka: MOC -> MOC tematyczny -> konkretna notka

Przyklad: szukasz informacji o Maersku?
MOC -> MOC: Armatorzy -> sekcja Maersk -> konkretny update

### Szybkie otwieranie plikow
- **Ctrl+O** -- otworz plik po nazwie (szybsze niz klikanie w drzewie folderow)
- **Ctrl+P** -- paleta komend (wpisz co chcesz zrobic)
- **Ctrl+Shift+F** -- szukaj tekstu we wszystkich notkach

### Linki zwrotne
Kiedy otwierasz dowolna notke, w prawym panelu zobaczysz "Linki zwrotne" -- lista notek ktore linkuja DO tej notki. To pozwala odkrywac powiazania bez klikania.

---

## 2. Codzienne uzytkowanie

### Daily note -- codziennie rano
1. Kliknij ikone kalendarza w lewym panelu (albo Ctrl+P > "Dziennik: Otworz dzisiejszy dziennik")
2. Otworzy sie notatka z dzisiejsza data z gotowym szablonem
3. Wypelnij priorytety dnia
4. W ciagu dnia dopisuj spotkania, decyzje, maile
5. Wieczorem wypelnij sekcje "Niezakonczone" i "Refleksja dnia"

### Weekly review -- w piatek/niedziele
1. Stworz nowy plik: `ja/dziennik/tygodniowe/2026-Wxx.md`
2. Dodaj frontmatter:
```yaml
---
typ: dziennik
date: YYYY-MM-DD
tags: [typ/dziennik, dziennik/tygodniowy]
---
```
3. Przejrzyj daily notes z tygodnia i wyciagnij wnioski

---

## 3. Dodawanie nowych notek

### Sciezka A: Z maila (automatyczna)
1. Wyslij maila na dedykowanego Gmaila
2. Make.com przerabia na .md i zapisuje na Google Drive
3. Raz w tygodniu wrzuc pliki do folderu `RAW/`
4. Odpal GitHub Copilota z promptem z [[Szablony/Prompt-RAW-Processing|Prompt-RAW-Processing]]
5. Copilot przerabia, dodaje frontmatter, tagi, linkowanie i zapisuje we wlasciwym folderze

### Sciezka B: Reczna notatka
1. Ctrl+N (nowa notatka)
2. ZAWSZE zacznij od frontmattera:
```yaml
---
typ: [intel | operacja | spotkanie | kontakt | newsletter | projekt | notatka | referencja | przepis | procedura]
date: YYYY-MM-DD
tags: [uzyj tagow hierarchicznych -- patrz sekcja 5]
status: [aktywny | zamkniety | czekam]
---
```
3. Zapisz w odpowiednim folderze (patrz sekcja 4)
4. Na koncu dodaj sekcje `## Powiazane notatki` z linkami [[]]

### Sciezka C: Nowy kontakt
1. Ctrl+P > "Szablony: Wstaw szablon" > wybierz "Szablon-Kontakt"
2. Wypelnij pola
3. Zapisz w folderze `kontakty/`

---

## 4. Gdzie co zapisywac

| Typ notki | Folder | Przyklad |
|-----------|--------|----------|
| Update od armatora | `praca/armatorzy/[Nazwa]/` | Maersk Middle East Update |
| Google Alert / analiza rynkowa | `praca/armatorzy/inne/` | Lars Jensen post |
| Newsletter (ShipcoWeekly itp.) | `praca/armatorzy/inne/` | ShipcoWeekly Edition 15 |
| Surcharge / oplata | `praca/surcharge/` | PSA DG fees |
| Instrukcja operacyjna | `praca/` | Instrukcja AMS/ISF |
| Spotkanie | `praca/spotkania/` | Spotkanie z klientem X |
| Kontakt | `kontakty/` | Andrew Gordon |
| Projekt AI | `praca/ai-projekty/wdrozenia/` | SeaTrack |
| Daily note | `ja/dziennik/` | 2026-04-26 |
| Weekly review | `ja/dziennik/tygodniowe/` | 2026-W17 |
| Zdrowie | `ja/zdrowie/` | Profil zdrowotny |
| Przepis | `ja/zdrowie/odzywianie/przepisy/` | Naan |
| Trening | `ja/sport/silownia/` | Dziennik treningowy |
| Ksiazka / rozwoj | `ja/rozwoj/ksiazki/` | Z zimna krwia |
| Studia | `studia/AI Lider/` | Fiszki egzaminacyjne |
| Pliki binarne (PDF/PPTX) | `_archiwum/` | Prezentacje, raporty PDF |

---

## 5. System tagow -- sciagawka

Tagi sa hierarchiczne (uzyj / jako separator). Kazda notka powinna miec minimum tag `typ/`.

### Typ notki (obowiazkowy -- jeden na notke)
- `typ/intel` -- analiza rynkowa, google alert, post eksperta
- `typ/operacja` -- update od armatora, advisory, instrukcja
- `typ/newsletter` -- cykliczny newsletter (ShipcoWeekly, SFI)
- `typ/kontakt` -- wizytowka, dane kontaktowe
- `typ/spotkanie` -- notatka ze spotkania
- `typ/projekt` -- opis projektu, wdrozenie
- `typ/notatka` -- ogolna notatka
- `typ/referencja` -- materialy do wracania (SOP, profil zdrowotny, plan)
- `typ/procedura` -- instrukcja krok-po-kroku
- `typ/przepis` -- przepis kulinarny
- `typ/dziennik` -- daily note, weekly review
- `typ/szablon` -- szablon do kopiowania

### Armator (jesli dotyczy)
`armator/maersk`, `armator/cma`, `armator/msc`, `armator/hapag`, `armator/zim`, `armator/samskip`

### Temat (jesli dotyczy)
`temat/hormuz`, `temat/iran`, `temat/stawki`, `temat/surcharge`, `temat/rail`, `temat/ams`, `temat/blank-sailings`, `temat/rynek`, `temat/panama-canal`, `temat/api`, `temat/automatyzacja`, `temat/dg`, `temat/ponadgabaryty`, `temat/przeladunek`, `temat/middle-east`, `temat/usa`, `temat/cpk`, `temat/air-cargo`, `temat/multimodal`, `temat/agenci`

### Zrodlo (jesli warto oznaczyc)
`zrodlo/lars-jensen`, `zrodlo/shipco`, `zrodlo/sea-freight-intelligence`

### Projekt
`projekt/seatrack`, `projekt/planer`, `projekt/dashboard`, `projekt/bee-tracker`, `projekt/awex-tracker`

### Osobiste
`zdrowie/profil`, `zdrowie/dieta`, `zdrowie/leki`, `zdrowie/biohacking`, `zdrowie/pielegnacja`, `zdrowie/odzywianie`, `zdrowie/wyniki-badan`, `sport/silownia`, `rozwoj/czytelnictwo`, `rozwoj/kursy`, `rozwoj/kariera`, `rozwoj/wydarzenia`

### Studia
`studia/ai-lider`

### Status (w frontmatter, nie jako tag)
`status: aktywny` | `status: zamkniety` | `status: czekam`

---

## 6. Dataview -- dynamiczne listy

Dataview generuje automatyczne listy z frontmattera. Nie musisz recznie utrzymywac spisow -- one sie same aktualizuja.

Gotowe zapytania sa w [[Szablony/Dataview-Zapytania]]. Mozesz je kopiowac do dowolnej notki.

### Przyklad: wklej ten blok do dowolnej notki

````
```dataview
TABLE date AS "Data", file.folder AS "Folder"
FROM #typ/intel AND #temat/hormuz
SORT date DESC
```
````

Wynik: dynamiczna tabela wszystkich notek intel o Hormuzie, posortowana od najnowszej.

### Najczesciej przydatne zapytania

**Co jest aktywne?**
````
```dataview
LIST
WHERE status = "aktywny"
SORT date DESC
```
````

**Ostatnie notki z RAW (do sprawdzenia):**
````
```dataview
TABLE date AS "Data", typ AS "Typ"
WHERE source = "RAW"
SORT date DESC
LIMIT 15
```
````

**Notki bez frontmattera (do ogarniecia):**
````
```dataview
LIST
WHERE !typ
SORT file.name ASC
```
````

---

## 7. Linkowanie -- jak budowac siec powiazan

### Zasada: kazda notka powinna linkowac do czegos

Na koncu kazdej notki dodaj sekcje:
```markdown
## Powiazane notatki
- [[praca/armatorzy/MOC-armatorzy|MOC: Armatorzy]]
- [[inna-powiazana-notka]]
```

### Jak linkowac
- Wpisz `[[` i zacznij pisac nazwe notki -- Obsidian podpowie
- Mozesz dodac alias: `[[sciezka/do/pliku|Wyswietlany tekst]]`
- Linkuj do MOC-ow tematycznych -- to buduje nawigacje

### Co z czym laczyc
- Notka o Maersku -> inne notki Maerska + MOC: Armatorzy
- Notka o Hormuzie -> inne notki o Hormuzie + notki armatorow ktorych dotyczy
- Kontakt -> spotkania z ta osoba
- Projekt -> notki techniczne + kontakty zwiazane z projektem

### Graph view
Ctrl+P > "Podglad grafu: Otworz widok grafu" -- zobaczysz wizualna mape powiazan. Im wiecej linkow, tym bardziej uzyteczny graf.

---

## 8. Utrzymanie vaulta -- co robic cyklicznie

### Co tydzien (5 min)
1. Wrzuc pliki z Google Drive do `RAW/`
2. Odpal Copilota z [[Szablony/Prompt-RAW-Processing|promptem RAW]]
3. Sprawdz czy nowe notki maja poprawne tagi i linki

### Co miesiac (15 min)
1. Otworz zapytanie Dataview "notki bez frontmattera" -- ogarni zaleglosci
2. Przejrzyj MOC-e -- dodaj linki do nowych notek
3. Sprawdz `_archiwum/` -- czy nie wrzuciles tam czegos co powinno byc notatka

### Kiedy dodajesz nowy temat/armator
1. Dodaj nowy tag do tej sciagawki (sekcja 5)
2. Dodaj link w odpowiednim MOC-u
3. Jesli to duzy obszar -- stworz nowy MOC

---

## 9. Skroty klawiszowe -- najwazniejsze

| Skrot | Co robi |
|-------|---------|
| Ctrl+O | Szybkie otwieranie pliku |
| Ctrl+N | Nowa notatka |
| Ctrl+P | Paleta komend |
| Ctrl+Shift+F | Szukaj we wszystkich notkach |
| Ctrl+E | Przelacz edycja / podglad |
| Ctrl+K | Wstaw link |
| Ctrl+, | Ustawienia |
| Alt+strzalka | Przejdz do nastepnej/poprzedniej notki |

---

## Powiazane
- [[MOC|Glowna mapa vaulta]]
- [[Szablony/Prompt-RAW-Processing|Prompt RAW Processing]]
- [[Szablony/Dataview-Zapytania|Gotowe zapytania Dataview]]
- [[Szablony/Szablon-Kontakt|Szablon kontaktowy]]
- [[Szablony/Daily-Note-Template|Szablon daily note]]
