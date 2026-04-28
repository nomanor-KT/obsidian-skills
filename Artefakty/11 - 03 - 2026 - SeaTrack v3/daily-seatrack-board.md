# Daily SeaTrack Board - 11-03-2026

Cel dnia: domknac stabilnosc operacyjna SeaTrack bez rozwadniania focusu na nowe funkcje.

## P1 - Musi byc dzis

1. E2E MAIL na 1 realnej przesylce
- otworz przesylke,
- wyslij status przez MAIL,
- potwierdz wpis w Historii wysylek,
- potwierdz wpis w `/api/email/logs` z `ok: true`.

2. Regresja 5-minutowa UI
- pola mailowe: brak gubienia focusu,
- `c/c` tylko w kolumnie Odprawa,
- `DEL` tylko w kolumnie Wyjechal,
- drag and drop kolumn bez psucia panelu detali.

3. Lista tarc operacyjnych (max 3)
- zanotuj 3 najczestsze problemy,
- kazdy problem opisz jednym zdaniem,
- do kazdego dopisz propozycje poprawki (1 linia).

## P2 - Jesli zostanie czas

1. Najwieksza poprawka UX z listy tarc (tylko 1 temat).
2. Uproszczenie komunikatu bledu/sukcesu przy wysylce MAIL.

## Parking - Nie robic teraz

1. DNS i produkcyjna domena mailowa.
2. Nowe funkcje niezwiązane ze stabilnoscia i szybkoscia pracy operacyjnej.

## Definicja "done" na dzis

1. Minimum 1 potwierdzona wysylka API (`ok: true`).
2. 0 blockerow w regresji 5-minutowej.
3. Lista 3 tarc + wskazana 1 poprawka na jutro.

## Blok 90 minut (proponowany)

1. 0-35 min: E2E MAIL + logi.
2. 35-55 min: regresja UI.
3. 55-75 min: lista tarc + priorytetyzacja.
4. 75-90 min: szybka poprawka P2 albo dokumentacja decyzji na jutro.
