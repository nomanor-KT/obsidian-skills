---
typ: referencja
tags: [typ/referencja, workflow]
date: 2026-04-26
status: aktywny
---

# Dataview -- jak tego uzywac (od zera)

---

## Co to jest Dataview

Dataview to wtyczka ktora automatycznie tworzy listy i tabele na podstawie Twoich notek. Nie musisz recznie utrzymywac spisow -- one sie same aktualizuja kiedy dodajesz nowe notki.

Przyklad: chcesz zobaczyc wszystkie notki o Hormuzie posortowane od najnowszej? Zamiast recznego przeszukiwania folderow, wklejasz krotki blok kodu do dowolnej notki -- i Dataview generuje liste za Ciebie. Kiedy dodasz nowa notke o Hormuzie, pojawi sie na liscie automatycznie.

---

## Jak to dziala -- krok po kroku

### Krok 1: Otworz dowolna notke

Moze byc MOC-armatorzy, moze byc nowa pusta notatka -- nie ma znaczenia. Dataview dziala w kazdej notce.

### Krok 2: Przelacz sie na tryb edycji

U gory notki jest ikona olowka / ikona oka. Kliknij ja zeby przejsc do trybu edycji (albo Ctrl+E). Musisz byc w trybie edycji zeby wklejac kod.

### Krok 3: Wklej blok kodu

Skopiuj dokladnie ten tekst i wklej go w dowolne miejsce w notce:

````
```dataview
LIST
FROM #typ/intel
SORT date DESC
LIMIT 5
```
````

### Krok 4: Przelacz na tryb podgladu

Kliknij ponownie ikone olowka/oka (albo Ctrl+E). Zamiast kodu zobaczysz liste -- 5 ostatnich notek oznaczonych tagiem typ/intel.

To wszystko. Wklejasz blok kodu, przelaczasz na podglad, widzisz wynik.

---

## Anatomia zapytania -- co oznacza kazda linijka

Przykladowe zapytanie:

````
```dataview
TABLE
date AS "Data"
FROM #typ/intel
WHERE status = "aktywny"
SORT date DESC
LIMIT 10
```
````

Co oznacza kazda linijka:

- **dataview** -- poczatek bloku, nie zmieniaj
- **TABLE** -- typ wyswietlania. TABLE = tabela z kolumnami. LIST = prosta lista linkow
- **date AS "Data"** -- jakie kolumny pokazac w tabeli. "date" to pole z frontmattera notki, "Data" to nazwa kolumny. Mozesz dodac wiele kolumn po przecinku
- **FROM #typ/intel** -- skad brac notki. Mozesz uzyc tagu (#typ/intel), folderu ("praca/armatorzy"), albo pominac te linijke zeby wziac wszystko
- **WHERE status = "aktywny"** -- dodatkowy filtr. Opcjonalny. Mozesz filtrowac po dowolnym polu z frontmattera
- **SORT date DESC** -- sortowanie. DESC = od najnowszej, ASC = od najstarszej
- **LIMIT 10** -- ile wynikow pokazac. Opcjonalne. Bez tego pokaze wszystkie

Nie musisz uzywac wszystkich linijek. Minimalne zapytanie to:

````
```dataview
LIST
```
````

To pokaze WSZYSTKIE notki w vaulcie. Bezuzyteczne, ale pokazuje ze dziala.

---

## Gotowe zapytania do kopiowania

Ponizej sa zapytania gotowe do uzycia. Skopiuj caly blok lacznie ze znacznikami na poczatku i koncu, wklej do dowolnej notki, przelacz na podglad.

---

### Wszystko o Hormuzie (chronologicznie)

Pokazuje tabele wszystkich notek z tagiem temat/hormuz, od najnowszej.

````
```dataview
TABLE date AS "Data", file.folder AS "Folder"
FROM #temat/hormuz
SORT date DESC
```
````

---

### Aktywne projekty

Lista notek gdzie w frontmatter jest status: aktywny.

````
```dataview
TABLE date AS "Data", file.folder AS "Gdzie"
WHERE status = "aktywny"
SORT date DESC
```
````

---

### Ostatnie newslettery

10 ostatnich newsletterow (ShipcoWeekly, Sea Freight Intelligence itp.).

````
```dataview
TABLE date AS "Data"
FROM #typ/newsletter
SORT date DESC
LIMIT 10
```
````

---

### Notki per armator -- przyklad Maersk

Wszystkie notki z tagiem armator/maersk. Zmien "maersk" na "cma", "msc", "hapag" zeby zobaczyc innego armatora.

````
```dataview
LIST
FROM #armator/maersk
SORT date DESC
```
````

---

### Kontakty z firma i stanowiskiem

Tabela kontaktow z polami z frontmattera.

````
```dataview
TABLE firma AS "Firma", stanowisko AS "Stanowisko"
WHERE typ = "kontakt"
SORT file.name ASC
```
````

---

### Notki z ostatniego tygodnia

Wszystko co ma date z ostatnich 7 dni.

````
```dataview
TABLE date AS "Data", typ AS "Typ"
WHERE date >= date(today) - dur(7 days)
SORT date DESC
```
````

---

### Notki na ktore czekam

Wszystko ze statusem "czekam".

````
```dataview
TABLE date AS "Data", file.folder AS "Folder"
WHERE status = "czekam"
SORT date DESC
```
````

---

### Notki BEZ frontmattera (do ogarniecia)

Lista notek ktore nie maja pola typ -- czyli nie zostaly jeszcze poprawnie otagowane.

````
```dataview
LIST
WHERE !typ
SORT file.name ASC
```
````

---

## Gdzie wklejac te zapytania

Mozesz je wkleic gdziekolwiek, ale najlepsze miejsca to:

**1. MOC-e tematyczne** -- np. w MOC-armatorzy wklej zapytanie "notki per armator Maersk". Wtedy MOC sam sie aktualizuje kiedy dodasz nowa notke o Maersku.

**2. Weekly review** -- wklej "notki z ostatniego tygodnia" zeby zobaczyc co sie dzialo.

**3. Osobna notatka-dashboard** -- stworz pusta notke "Dashboard", wklej kilka zapytan jedno pod drugim. Bedziesz mial podglad na caly vault w jednym miejscu.

---

## Czeste problemy i rozwiazania

**Widze tekst kodu zamiast tabeli**
Jestes w trybie edycji. Nacisnij Ctrl+E zeby przelaczac na podglad.

**Tabela jest pusta**
Notki nie maja frontmattera albo maja inne tagi niz w zapytaniu. Otworz jedna z notek i sprawdz czy na pewno ma np. tags: [typ/intel] w bloku miedzy trzema myslnikami (---) na poczatku pliku.

**Wyswietla za duzo wynikow**
Dodaj LIMIT. Np. LIMIT 10 pokaze tylko 10 wynikow.

**Nie wiem jaki tag uzyc**
Kliknij ikone # (hashtag) w lewym pasku bocznym. Otworzy sie panel tagow -- zobaczysz liste WSZYSTKICH tagow uzywanych w vaulcie z liczba wystapien. Stad mozesz sprawdzic dokladna nazwe tagu.

---

## Powiazane
- [[MOC|Glowna mapa vaulta]]
- [[Szablony/Prompt-RAW-Processing|Prompt RAW Processing]]
