---
typ: projekt
tags: [typ/projekt, temat/automatyzacja, studia/ai-lider]
date: 2026-04-11
status: aktywny
---


# Automatyzacja: Gmail uczelniane → Google Calendar

**Data utworzenia:** 2026-04-11
**Narzędzie:** Make.com (dawniej Integromat)
**Konto:** s35571@pjwstk.edu.pl (PJWSTK)
**Cel:** Automatyczne wyłapywanie terminów akademickich z maili i wpisywanie ich do Google Calendar

---

## Jak działa scenariusz

Scenariusz uruchamia się **codziennie o 7:00** (Europe/Warsaw) i wykonuje:

1. **Search Unread Emails (#2)** — pobiera nieprzeczytane maile z ostatnich 24h (limit 50)
2. **AI Extract Events (#11)** — moduł Make AI Toolkit (Medium/gpt-5-nano) analizuje treść każdego maila i wyciąga terminy jako JSON
3. **Parse AI JSON (#4)** — parsuje odpowiedź AI do struktury danych
4. **Iterate Events (#5)** — iteruje po znalezionych terminach
5. **Create Event (#19)** — tworzy wydarzenie w Google Calendar

## Filtrowanie

Między modułami działają dwa filtry:
- **"AI found dates"** — przepuszcza tylko maile, w których AI znalazło terminy (`contains_dates = true`)
- **"Has date"** — przepuszcza tylko eventy, które mają uzupełnioną datę

## Co AI wyłapuje (a co ignoruje)

### Wyłapuje:
- Egzaminy, zaliczenia, kolokwia
- Oddanie prac, projektów, zadań domowych
- Obrony
- Rejestracje na przedmioty, zapisy na kursy
- Deadline'y formalne (podania, dokumenty do dziekanatu)

### Ignoruje:
- Wydarzenia kulturalne, imprezy, koncerty
- Konkursy, warsztaty, szkolenia opcjonalne
- Dni otwarte, targi pracy, spotkania z firmami
- Newslettery, reklamy, ogłoszenia
- Akcje charytatywne, wydarzenia społeczne

## Obsługa godzin

- Jeśli mail zawiera godzinę → wydarzenie z konkretną godziną, trwające 1.5h
- Jeśli mail nie zawiera godziny → wydarzenie całodniowe

## Koszty / limity

- Każdy mail = ~3-4 operacje Make + tokeny AI
- Limit dzienny: 50 maili
- Sprawdź regularnie: **Organization → Usage** w Make.com

## Czego brakuje (do dodania w przyszłości)

- [ ] **Deduplikacja** — scenariusz nie sprawdza czy wydarzenie już istnieje w kalendarzu (może tworzyć duplikaty)
- [ ] **Update + powiadomienie o zmianie terminu** — wykrywanie zmian terminów i wysyłanie maila "UWAGA ZMIANA TERMINU"
- [ ] **Dynamiczne przypomnienia** — 7 dni przed / 1 dzień przed / natychmiast (w zależności od tego ile czasu do wydarzenia)
- [ ] **Obsługa błędów** — mail z informacją gdy scenariusz się wysypie

## Połączenia (connections) w Make

| Moduł | Connection | Konto |
|-------|-----------|-------|
| Gmail | My Gmail connection | s35571@pjwstk.edu.pl |
| Google Calendar | My Google connection | s35571@pjwstk.edu.pl |
| Make AI Toolkit | My Make's AI Provider connection | Make wbudowane |

> **Uwaga:** Tokeny OAuth konta uczelnianego (Google Workspace) mają tendencję do wygasania. Jeśli scenariusz przestanie działać z błędem 401, trzeba reautoryzować połączenia Gmail i Google Calendar.

## Prompt AI (pełna treść)

Prompt jest w module AI Extract Events (#11), pole "Text". Zawiera instrukcje filtrowania + format JSON output. Jeśli trzeba zmienić co AI wyłapuje — edytuj tam.

## Jednorazowy skan całej skrzynki

Jeśli chcesz przeskanować starsze maile (nie tylko z ostatnich 24h):

1. Moduł #2 → Criteria: "All messages", Limit: 200
2. Advanced settings → Date From: `formatDate(addDays(now; -60); "YYYY-MM-DD")`
3. Run once
4. **Przywróć** ustawienia: Criteria: "Unread messages", Limit: 50, Date From: ostatnie 24h

---

*Notatka wygenerowana automatycznie na podstawie sesji budowania automatyzacji z Claude.*