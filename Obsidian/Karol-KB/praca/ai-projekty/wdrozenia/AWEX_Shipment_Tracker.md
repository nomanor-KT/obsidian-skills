---
typ: projekt
tags: [typ/projekt, projekt/awex-tracker]
status: aktywny
---


# AWEX Shipment Tracker

## Opis projektu
System do zarządzania zestawieniem przesyłek (Shipment Tracker) dla klienta AWEX. Aplikacja ułatwia śledzenie i aktualizację statusów transportów (Rail, Sea, Air, FCL), a także udostępnianie odpowiednich, wyselekcjonowanych danych bezpośrednio dla klienta.

## Zastosowane technologie
- HTML5, CSS3, JavaScript (Vanilla)
- Google Sheets API (poprzez Google Apps Script w roli backendu)
- LocalStorage (jako warstwa zapasowa / fallback)
- Eksport danych do formatu CSV

## Opis wdrożenia / powiązane pliki
Wdrożenie składa się z dwóch powiązanych plików HTML:
1. `AWEX_shipment_tracker.html` – Aplikacja wewnętrzna dla pracowników M&M do zarządzania przesyłkami. Funkcjonalności obejmują m.in. dodawanie/edycję przesyłek, rejestrację historii zmian, możliwość ukrywania przesyłek przed klientem, filtrowanie, eksport zestawień do pliku oraz synchronizację z arkuszem Google Sheets.
2. `AWEX_zestawienie_klient.html` – Aplikacja "read-only" przeznaczona dla klienta AWEX. Pobiera za pośrednictwem API dane o przesyłkach, które nie zostały wyłączone z widoku, i prezentuje je w czytelnej formie z możliwością przeszukiwania i filtrowania, zapewniając klientowi szybki dostęp do aktualnych statusów łańcucha dostaw.