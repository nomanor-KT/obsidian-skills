---
name: webapp-testing
description: "Use when testing local web applications end to end in a browser, especially React, Vite, and Node apps. Covers happy paths, regressions, console/network checks, and quick bug isolation."
---

# Webapp-Testing Skill

Test lokalnych aplikacji webowych w przeglądarce. Skupia się na szybkim wykrywaniu błędów w UI, przepływach użytkownika i widocznych regresjach.

## Kiedy używać

- Budujesz lub poprawiasz frontend i chcesz sprawdzić działanie w realnej przeglądarce.
- Masz podejrzenie błędu w formularzu, nawigacji, stanie komponentu albo integracji z backendem.
- Chcesz zweryfikować krytyczne ścieżki przed pokazaniem aplikacji komuś innemu.
- Pracujesz nad lokalnym projektem typu SeaTrack-v3 lub karcianka i chcesz szybki test po zmianie.

## Proces

### 1. Ustal zakres testu

- Zidentyfikuj 1 do 3 najważniejszych przepływów.
- Określ, co jest sukcesem, a co błędem.
- Jeśli zakres jest niejasny, poproś o doprecyzowanie przed testem.

### 2. Sprawdź uruchomienie aplikacji

- Zweryfikuj, czy frontend działa lokalnie.
- Jeśli aplikacja ma backend, sprawdź też, czy API odpowiada.
- Zwróć uwagę na błędy startu, brak zależności i problemy z portami.

### 3. Testuj jak użytkownik

- Klikaj, wpisuj dane, przechodź przez ekrany i obserwuj wynik.
- Sprawdzaj komunikaty błędów, stany ładowania, puste widoki i odświeżanie danych.
- W razie potrzeby porównuj zachowanie na desktopie i w węższym widoku.

### 4. Sprawdź sygnały techniczne

- Obejrzyj konsolę przeglądarki pod kątem błędów.
- Sprawdź network, jeśli problem wygląda na backendowy albo autoryzacyjny.
- Jeśli błąd jest niejednoznaczny, zawęź go do jednego ekranu albo jednej akcji.

### 5. Zapisz wynik

- Opisz, co działa.
- Opisz, co nie działa.
- Podaj najkrótszy krok naprawczy, jaki ma sens.

## Output

Zwracaj krótki raport:

```markdown
## Webapp Test Report

### Scope
- [co testowano]

### Passed
- [scenariusz] - OK

### Failed
- [scenariusz] - [krótki opis błędu]

### Notes
- [istotne obserwacje]

### Next Step
- [jedna konkretna akcja]
```

## Gotchas

- Nie oceniaj aplikacji tylko po ekranie startowym.
- Nie zakładaj, że problem jest w backendzie, dopóki nie sprawdzisz zachowania w UI i konsoli.
- Nie rozbudowuj testu o poboczne ścieżki, jeśli główny przepływ już się sypie.
- Nie rób z tego pełnego QA planu; ma to być szybka, praktyczna weryfikacja.

## Granice skilla

- Ten skill służy do testowania lokalnych aplikacji webowych.
- Ten skill nie zastępuje pełnego test suite ani automatyzacji E2E.
- Gdy trzeba naprawiać kod, przejdź do właściwego zadania deweloperskiego.