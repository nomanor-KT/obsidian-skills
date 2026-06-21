---
typ: projekt
tags: [typ/projekt, projekt/bee-tracker]
status: aktywny
---


# BEE Shipment Tracker

## Opis projektu
System śledzenia ładunków przeznaczony dla klienta BEE. Umożliwia precyzyjne ewidencjonowanie statusów przesyłek oraz współpracę online pomiędzy operatorami M&M a klientem docelowym, któremu udostępniono dedykowany uproszczony podgląd. Aplikacja wspiera optymalizację łańcucha dostaw pozwalając na szybką identyfikację przesyłek w trasie lub oczekujących na odprawę.

## Zastosowane technologie
- Dedykowane widoki w HTML/CSS (interfejs zoptymalizowany m.in. z czcionką Outfit / JetBrains Mono)
- JavaScript do logiki biznesowej, filtrowania na żywo oraz tworzenia zrzutów / eksportów (CSV)
- Baza danych w oparciu o Google Sheets (przez API Web App)
- Awaryjny tryb offline z wykorzystaniem pamieci LocalStorage

## Opis wdrożenia / powiązane pliki
Aplikacja została wdrożona w środowisku dwumodułowym:
1. `bee_shipment_tracker.html` – Złożony w interfejs tracker zawierający pełny zestaw narzędzi (CRUD dla przesyłek, statystyki, śledzenie historii modyfikacji z kolorowaniem zmian, funkcja ukrywania pojedynczych elementów przesyłek "ocznych" itp.) Menedżer dostaw wewnętrznych.
2. `bee_zestawienie_klient.html` – Prezentacja udostępniana wyłącznie odczytowi. Klient BEE logując się widzi listę statusów tylko dla autoryzowanych przesyłek. Wykorzystuje to samo API do sprawdzania danych w czasie rzeczywistym.