---
typ: projekt
tags: [typ/projekt, projekt/planer]
status: aktywny
---


# Container Load Planner

## Opis projektu
Kalkulator i planer załadunku kontenerów morskich stworzony w celu optymalizacji rozłożenia ładunku. Narzędzie oferuje szczegółową wizualizację 3D wykorzystanej przestrzeni, zestaw wskaźników zapełnienia/wagi oraz system automatycznych podpowiedzi wyboru kontenera, który jest  w stanie wskazać, jaki rodzaj kontenera lub w jakiej kombinacji najlepiej pomieścić zadany tonaż/kubaturę towaru. Dodatkowym atutem jest możliwość wygenerowania czytelnego raportu w formacie PDF instruującego w kolejności załadunku.

## Zastosowane technologie
- HTML5, CSS3, ES6+
- React & Babel (standalone) – renderowanie UI
- Three.js – do silnika wizualizacji 3D załadunku
- jsPDF – do generowania eksportu (raporty)
- Zaimplementowane algorytmy bin packing dostosowane do kontenerów morskich i dopuszczalnego środka ciężkości

## Opis wdrożenia / powiązane pliki
- `container-load-planner (13).html` – Główna aplikacja jednoplikowa łącząca całą logikę, definicje asortymentów kontenerowych, style, silnik wizualizacyjny React+Three.js oraz generowanie PDF. Aplikacja przeznaczona do użytku lokalnego lub hostowania jako niezależne narzędzie statyczne.