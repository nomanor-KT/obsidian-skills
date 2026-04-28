---
description: "Use when: reviewing, drafting, editing, or analyzing contracts/agreements. Provides checklist-based guidance for contract completeness, legal compliance, and best practices."
name: Umowy - Wytyczne
applyTo: "**/*umowa*"
---

# Wytyczne do Umów

Ten plik instrukcji automatycznie się pojawia, gdy pracujesz z umowami. Wspiera Cię w tworzeniu, przeglądzie i analizie umów biznesowych.

## 🎯 Przed Rozpoczęciem

1. **Zidentyfikuj typ umowy**: usługi, sprzedaż, NDA, licencja, partnerstwo, itp.
2. **Określ strony**: kto podpisuje umowę?
3. **Ustaw zakres czasowy**: data początkowa, okres, warunki wygaśnięcia

## ✅ Quick Checklist - Wymagane Elementy

Zanim umowę sfinalizujesz czy zatwierdzisz, sprawdź:

- [ ] **Strony umowy** klarownie zdefiniowane (nazwa, dane kontatowe)
- [ ] **Przedmiot umowy** (co dokładnie jest dostarczane/świadczone)
- [ ] **Terminy i deadliny** (kiedy co się wykonuje)
- [ ] **Cena i warunki płatności** (kwota, terminy, sposoby)
- [ ] **Odpowiedzialność** (co się dzieje za naruszenie, limity odpowiedzialności)
- [ ] **Poufność** / NDA (jak są chronione dane)
- [ ] **Prawa autorskie i IP** (kto jest właścicielem)
- [ ] **Force majeure** (co się dzieje w nadzwyczajnych sytuacjach)
- [ ] **Arbitraż/rozstrzyganie sporów** (procedury rozwiązywania konfliktów)
- [ ] **Ochrona danych** (RODO, compliance, jeśli dotyczy)
- [ ] **Modyfikacje** (jak zmienić umowę)
- [ ] **Podpisy** (pola do podpisu, data)

## 🔍 Głębokie Sprawdzenie

Skorzystaj ze skilla `/umowa-weryfikacja` aby:
1. Przeanalizować strukturę umowy
2. Zweryfikować wszystkie sekcje wymagane
3. Otrzymać raport z brakującymi elementami
4. Uzyskać rekomendacje popraw

## 📝 Best Practices

### Jasność Redakcji
- ✅ Używaj jasnego, konkretnego języka
- ❌ Unikaj niejasnych sformułowań typu "w rozsądnym terminie"
- ✅ Specyfikuj konkretne liczby, daty, procenty

### Obustronnie Sprawiedliwa
- Zweryfikuj, czy umowa obraca się w stronę jednej ze stron
- Upewnij się, że oba strony rozumieją zobowiązania i uprawnienia
- Jeśli jest asymetria, powinna być uzasadniona i zaakceptowana

### Zgodność Wewnętrzna
- ❌ Sprzeczne termin w różnych sekcjach
- ❌ Różne definicje tego samego pojęcia
- ✅ Spójne linki między sekcjami (np. "Vide: Sekcja 3.2")

### Compliance i Lokalne Wymogi
- Dla umów międzynarodowych: sprawdź prawo właściwe (jaki kraj, jaki stan)
- RODO i GDPR: jeśli umowa dotyczy danych osobowych
- Branżowe wymagania: np. NDA w tech, umowy health care itp.

## 🚩 Red Flags - Czego Unikać

| Red Flag | Działanie |
|----------|----------|
| Brakuje wyraźnych terminów płatności | Dodaj sekcję "Warunki Płatności" |
| Nieograniczona odpowiedzialność | Usuń lub postaw limit odpowiedzialności |
| Przebywanie danych bez zgody | Dodaj sekcję RODO/GDPR compliance |
| Force majeure obejmuje zwyczajne opóźnienia | Ogranicz do faktycznych nadzwyczajnych zdarzeń |
| Niemożliwość modyfikacji umowy | Dodaj procedurę zmian (np. "pisemna zgoda obu stron") |

## 📋 Wzory i Szablony

Jeśli piszesz z zera:
- Zaproś kontekst: pokazujesz mi przykład podobnej umowy
- Powiedz jakie elementy mają być uwzględnione
- Poprosisz o draft w formatzie markdown lub .docx

## 🔗 Linki Szybkie

- **Skill Weryfikacji**: `/umowa-weryfikacja` — pełna analiza umowy
- **Dokumentacja**: Ten plik (umowa.instructions.md)
- **Workspace**: `.github/skills/umowa-weryfikacja/SKILL.md`

## 💡 Przykłady Zadań

- "Zweryfikuj tę umowę o usługach IT"
- "Napisz umowę NDA między [dwie strony]"
- "Edytuj sekcję odpowiedzialności w tej umowie"
- "Rozwiń klauzulę o ochronie danych"

---

**Notatka**: Ta instrukcja pojawia się automatycznie, gdy nazwa pliku zawiera "umowa". Możesz też wznowić ją manualnie via `Add Context` → `Instructions`.
