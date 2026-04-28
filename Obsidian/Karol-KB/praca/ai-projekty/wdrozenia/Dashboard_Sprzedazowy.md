---
typ: projekt
tags: [typ/projekt, projekt/dashboard]
status: aktywny
---


# Dashboard Sprzedażowy

## Opis projektu
Interaktywny panel analityczno-zarządczy (Dashboard) dedykowany dla działu Spedycji Morskiej. Służy do bieżącego ewidencjowania, wizualizacji przychodów poszczególnych spedytorów (m.in. Gosia, Oliwia, Kamil) oraz monitorowania wyników przez kierownika działu (Karol). Zawiera zintegrowany mechanizm pobierania aktualnych kursów walut z NBP, weryfikacji i rozbijania historycznych przychodów według tygodni i miesięcy za pomocą połączenia z bazą współdzieloną przez Google Sheets.

## Zastosowane technologie
- HTML5, nowoczesny CSS z CSS Variables (Dark theme / Dashboard UI)
- JavaScript Vanilla (zarządzanie mechanizmami DOM, przeliczanie KPI)
- Fetch API (komunikacja asynchroniczna z Google Apps Script / Web App oraz API NBP do walut)
- System autoryzacji bazujący na prostym PIN z rozróżnianiem uprawnień standardowych i administratorskich

## Opis wdrożenia / powiązane pliki
- `dashboard_sprzedazowy_nowy 25 02 2026.html` – Zintegrowana, wielostanowa aplikacja posiadająca moduł logowania oraz rozbudowany kokpit. Aplikacja ułatwia edycję "inline", przypisywanie przesyłek do tygodni i szybkie wprowadzanie statystyk, pozwalając na centralizowany wgląd we wszystkie dane zespołu i ułatwiając kierownikowi kontrolę nad realizacją celów (KPI).