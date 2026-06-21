---
typ: projekt
date: 2026-04-25
tags: [typ/projekt, projekt/seatrack, armator/maersk, armator/cma]
status: aktywny
---

# SeaTrack

## Kontekst — skąd pochodzi ta wiedza
Notatka podsumowująca analizę i wdrożenie lokalne projektu SeaTrack, aplikacji wspomagającej pracę działu frachtu morskiego. 

## Kluczowe punkty — najważniejsze informacje
- Aplikacja pełniąca funkcję dashboardu operacyjnego z tablicą Kanban dla przesyłek morskich (importowane pliki XLSX).
- Posiada wbudowaną obsługę trackingu armatorów do weryfikacji ETD i ETA oraz wysyłania powiadomień masowych.

## Zastosowanie w pracy — jak to wykorzystać w logistyce/spedycji
Projekt może zostać zaoferowany zespołom operacyjnym jako nakładka lub rozszerzenie dla systemu ERP klienta, przyspieszając pracę z kontenerami i ułatwiając oraz ujednolicając komunikację statusową z klientami.

## Powiązane notatki
- [[AWEX_Shipment_Tracker]]
- [[BEE_Shipment_Tracker]]
- [[Container_Load_Planner]]
- [[Dashboard_Sprzedazowy]]
- [[INDEX-wdrozenia]]

## Opis projektu
SeaTrack (wersja v3) to dashboard operacyjny dla przesyłek morskich wspierający import danych z plików XLSX (m.in. struktury z narzędzi pokroju Transsoft). Aplikacja oferuje zwinny widok Kanban z 7 kolumnami odpowiadającymi kolejnym etapom przewozu morskiego (od "booked" i "delivered_to_port" poprzez "in_transit" aż do "gone_out"). Cechą szczególną jest bardzo bogaty panel detali z widokiem kontenera, zarządzaniem plikami wgrywanymi na platformę, generowanie szablonowych e-maili per ładunek (w tym wariant zbiorowy dla wielu) oraz autorska integracja "Tracking Sync" na bazie publicznych API przewoźników morskich.

## Architektura i struktura plików
Architektura aplikacji składa się z dwóch głównych warstw i jest stworzona jako klasyczny projekt SPA:
- **Frontend**: Aplikacja UI oparta na nowoczesnym React i komponencie Vite (`src/`). Posiada proxy do warstwy backendowej rozwiązujące problemy CORS w devmode. Strona wykorzystuje drag-and-drop tablicy.
- **Backend (API)**: Serwer backendu postawiony surowym Node.js (`server/index.js`), wystawiający natywne endpointy REST. API przechowuje bazę użytkowników w pliku JSON, zarządza JWT, a także loguje zdarzenia analityczne i trackingowe jako `.ndjson`. To tutaj zlokalizowane jest serce logiki Trackingu (Adaptery).

Struktura plików projektu:
- `src/` - cała struktura frontendu (React, hooki, css).
- `server/` - pliki odpowiedzialne za serwer, foldery `logs`, `data` i binarne składowisko `uploads`. 
- `scripts/` - testy ułatwiające sprawdzanie stabilności kodu śledzenia.
- `public/`, `docs/` i inne pomocnicze pliki frameworkowe.

## Technologie i narzędzia
- **Frontend**: React 19 w oparciu o silnik Vite. Parsowanie Exceli przy użyciu pakietu `xlsx`.
- **Backend**: Native Node.js HTTP serwer ze wsparciem domyslnych modułów takich jak `fs` do odczytu czy `crypto` (szyfrowanie haseł `scryptSync`, podpisywanie żetonów).
- **Integracje trackingu i łączność API**: 
  - Standardowy Adapter dla kont Maersk API, CMA CGM API oraz autoryzacja Hapag-Lloyd.
  - Generowanie wysyłek mailowych w oparciu o chmurę Resend API, jak również poprzez bezpośrednie otwieranie wersji okienkowej (Outlook Classic `.exe`) bezpośrednio dla środowisk Windows (`spawn` w Node.js).

## Problem który rozwiązuje
- **Zwiększenie widoczności ETA/ETD**: Dyspozytorzy i handlowcy nie muszą odświeżać kilku serwisów firm żeglugowych, aby zweryfikować czy statek wypłynął – SeaTrack asynchronicznie odpyta armatorów (np. auto-sync co 60 minut).
- **Standaryzacja statusowania**: Rozwiązuje problem różnorodnego tytułowania wiadomości u każdego ze spedytorów, generuje przejrzyste szablony per adekwatny etap kontenera, z dołączanymi załącznikami z platformy.
- **Redukcja żmudnej pracy MS Excel**: Tablica Kanban w połączeniu z łatwym podziałem interfejsowym poprawia nawigację pracownika nad listą ładunków priorytetowych danego dnia.

## Jak uruchomić
1. Sklonuj/przejdź do katalogu `SeaTrack-v3`.
2. Skopiuj szablony `.env.example` do pliku `.env` wpisując m.in. wymagane kody autoryzacji: `RESEND_API_KEY`, podział `TRACKING_SOURCE` i pozostałe klucze od armatorów. 
3. Zainstaluj biblioteki node za pomocą polecenia: `npm install`.
4. Wykorzystując system taskrunnera pakietów wpisz polecenie `npm run dev` w celu wzbudzenia symultanicznie serwera na porcie `8787` oraz silnika Vite pod adresem `localhost:5173`.
5. Dla testu trackingu, możesz wysłać testowego curla do endpointu lokalnego `/api/tracking/health`.

## Rezultaty
Wdrożenie udowadnia gotowość przejścia z pracy ręcznej na model proaktywnych powiadomień. Znacząco pomniejszono okno czasowe weryfikacji floty morskiej oraz oszczędza się mnóstwo czasu redukując przełączanie zakładek między skrzynką mailową, systemem ERP i portalami morskimi.

## Potencjał rozwoju
- Stworzenie pełnej bazy bazodanowej z wykorzystaniem serwera chmurowego z prawdziwego zdarzenia (PostgreSQL/Supabase) zamiast plików na dysku.
- Poszerzenie zestawienia dla kolejnych, potężnych na rynku frachtowym armatorów jak azjatycki gigant COSCO czy śródziemnomorskie MSC.
- Zautomatyzowanie analiz KPI i dodanie statystyki predykcyjnej ETA statków na podstawie tras i zebranych do lokalnej bazy aktualizacji trackingowych z różnych logów wycieczek.
- Migracja bezpośredniego wprowadzania danych ze skryptu XLSX na ujednolicone API.

#logistyka #ai #studia #projekty #automatyzacja #freight