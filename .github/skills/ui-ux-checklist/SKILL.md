---
name: ui-ux-checklist
description: "Use when building, reviewing, or fixing UI in SeaTrack-v3, karcianka, or any web app in this repo — checklist for accessibility, touch targets, layout, typography, animation, forms, and navigation. Use when UI 'wygląda nieprofesjonalnie' but powód jest niejasny, albo przed pokazaniem czegokolwiek użytkownikowi."
---

# UI/UX Checklist

Skondensowany, stack-agnostic checklist dobrych praktyk UI/UX. Źródło: wyciąg z [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — bez ich maszynerii Python/CSV/CLI, tylko reguły przydatne do projektów w tym repo (React + plain CSS, brak Tailwind/shadcn).

## Kiedy używać

- Budowa lub refaktor komponentu UI (formularz, modal, tabela, nawigacja, lista).
- Code review frontu — szukanie problemów z dostępnością, layoutem, interakcją.
- Karol mówi "to wygląda nieprofesjonalnie" bez wskazania konkretnej przyczyny — przejdź checklist od priorytetu 1.
- Pre-delivery pass przed pokazaniem feature'a.

**Nie używaj** dla czystego backendu, API, DevOps, czy zadań bez wpływu na wygląd/interakcję.

## Priorytety (od najważniejszego)

| # | Kategoria | Impact | Kluczowe reguły | Czego unikać |
|---|-----------|--------|------------------|----------------|
| 1 | Dostępność | KRYTYCZNY | Kontrast 4.5:1, alt-text, nawigacja klawiaturą, aria-label, focus rings widoczne | Usuwanie focus ring, ikony bez etykiet |
| 2 | Touch & interakcja | KRYTYCZNY | Min. 44×44px klikalny obszar, 8px+ odstęp, feedback przy ładowaniu | Tylko hover (brak wsparcia dla tap), zmiany stanu 0ms |
| 3 | Performance | WYSOKI | WebP/AVIF, lazy loading, zarezerwowane miejsce pod obrazy (CLS < 0.1) | Layout shift, brak width/height na obrazach |
| 4 | Layout & responsywność | WYSOKI | Mobile-first, spójne breakpointy, brak scrolla horyzontalnego | Sztywne px-szerokości, wyłączony zoom |
| 5 | Typografia & kolor | ŚREDNI | Min. 16px body, line-height 1.5, semantyczne tokeny kolorów | Tekst < 12px, szary-na-szarym, hardkodowany hex |
| 6 | Animacja | ŚREDNI | 150–300ms na mikro-interakcje, animuj transform/opacity, respektuj prefers-reduced-motion | Animacje > 500ms, animowanie width/height |
| 7 | Formularze & feedback | ŚREDNI | Widoczne labelki (nie tylko placeholder), błąd przy polu, potwierdzenie destrukcyjnych akcji | Placeholder jako jedyna etykieta, błędy tylko na górze formularza |
| 8 | Nawigacja | WYSOKI | Przewidywalny "back", aktywny stan podświetlony, deep linking | Przeładowana nawigacja, zerwane zachowanie "back" |
| 9 | Wykresy/dane | NISKI | Legendy, tooltipy, dostępne kolory (nie tylko czerwony/zielony) | Poleganie tylko na kolorze do przekazania informacji |

## Reguły, które najczęściej psują "wrażenie profesjonalizmu"

- **Brak emoji jako ikon** — używaj SVG (Lucide, Heroicons), nie 🎨🚀⚙️. Emoji są niekonsystentne między systemami.
- **cursor: pointer** na każdym klikalnym elemencie.
- **Spójna skala spacingu** (np. 4/8px) — losowe wartości odstępów psują rytm wizualny.
- **Jeden styl ikon** w całej aplikacji (stroke width, wypełnienie) — nie mieszaj filled/outline na tym samym poziomie hierarchii.
- **Stan disabled** wyraźnie odróżniony (opacity 0.4–0.5 + zmiana kursora), nie tylko "trochę bledszy".
- **Dark mode** (jeśli używany) testowany niezależnie — kontrast nie przenosi się automatycznie z light mode.

## Pre-delivery checklist (szybki przebieg)

- [ ] Brak emoji jako ikon strukturalnych
- [ ] Wszystkie klikalne elementy mają `cursor: pointer` i widoczny stan hover/focus
- [ ] Touch targety ≥ 44×44px
- [ ] Kontrast tekstu ≥ 4.5:1 (sprawdź dla obu trybów, jeśli jest dark mode)
- [ ] Formularze: etykiety widoczne, błąd komunikuje przyczynę + sposób naprawy
- [ ] Responsywność sprawdzona na min. 2 szerokościach (mobile + desktop)
- [ ] Animacje respektują `prefers-reduced-motion`
- [ ] Brak layout shiftu przy ładowaniu obrazów/danych

## Po przejściu checklisty

Jeśli zmiana dotyczy SeaTrack-v3 lub karcianka, uruchom realny test w przeglądarce — patrz [webapp-testing](../webapp-testing/SKILL.md).
