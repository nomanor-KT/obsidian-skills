---
name: umowa-weryfikacja
description: "Use when a contract or agreement needs completeness checking against a clause checklist. Trigger on drafts, incoming agreements, or fragments that must be validated for missing sections and legal gaps."
---

# Umowa-Weryfikacja Skill

Systematyczna weryfikacja umów pod kątem wymaganych punktów, zasad i klauzul. Skill generuje raport z brakującymi elementami i rekomendacjami.

## Zastosowanie

Skorzystaj z tego skill, gdy:
- Otrzymałeś umowę do przeglądu i chcesz sprawdzić jej kompletność
- Piszesz umowę i chcesz się upewnić, że zawiera wszystkie niezbędne elementy
- Potrzebujesz standaryzowanego procesu weryfikacji dla zespołu

## Proces Weryfikacji

### Krok 1: Analiza Struktury Umowy
- Identyfikuj strony umowy (kto podpisuje)
- Zarejestruj datę i tytuł umowy
- Określ typ umowy (usługi, sprzedaż, licencja, NDA, itp.)

### Krok 2: Sprawdzenie Sekcji Wymaganych
Zweryfikuj obecność następujących elementów:

| Sekcja | Opis | Status |
|--------|------|--------|
| **Strony Umowy** | Jasne określenie podpisujących stron | ☐ |
| **Przedmiot** | Opisanie co dokładnie jest przedmiotem umowy | ☐ |
| **Termin Ważności** | Data początkowa, periods, lub warunki zakończenia | ☐ |
| **Cena / Wynagrodzenie** | Kwota, sposób kalkulacji, harmonogram płatności | ☐ |
| **Warunki Płatności** | Terminy płatności, sposoby, przewidziane opóźnienia | ☐ |
| **Terminy i Deadliny** | Konkretne daty lub okresy dla wykonania zobowiązań | ☐ |
| **Odpowiedzialność** | Limity odpowiedzialności, szkodzimy, ubezpieczenie | ☐ |
| **Poufność / NDA** | Ochrona informacji poufnych | ☐ |
| **Prawa Autorskie** | Własność IP, licencje, prawa użytkownika | ☐ |
| **Force Majeure** | Warunki zwolnienia z odpowiedzialności w nadzwyczajnych sytuacjach | ☐ |
| **Arbitraż / Rozstrzyganie Sporów** | Procedura rozwiązywania konfliktów (sąd, mediacja, arbitraż) | ☐ |
| **Ochrona Danych** | RODO, compliance, przechowywanie danych (jeśli dotyczy) | ☐ |
| **Modyfikacje** | Jak zmienić umowę (wymaga pisemnej zgody, procedury) | ☐ |
| **Wyrażenie Woli / Podpisy** | Pola do podpisów, data, opcjonalnie pieczęcie | ☐ |

### Krok 3: Identyfikacja Luk
- Wymień sekcje, które się nie pojawiają lub są niepełne
- Oceń krytyczność każdej luki (wysoka/średnia/niska)
- Zaproponuj tekst lub wskazówki dla brakujących elementów

### Krok 4: Generacja Raportu
Zwróć strukturalny raport zawierający:
- ✅ Elementy obecne i poprawnie sformułowane
- ❌ Brakujące elementy krytyczne
- ⚠️ Elementy niejasne lub niekompletne
- 📝 Rekomendacje popraw z priorytetami

## Input

Użytkownik dostarcza:
- Tekst umowy (całość lub fragment do sprawdzenia)
- Opcjonalnie: typ umowy lub specjalny zestaw wymaganych klauzul

## Output

Strukturalny raport w formacie:
```
## Raport Weryfikacji Umowy: [Tytuł]

### Podsumowanie
- **Typ umowy**: [np. Umowa o Świadczenie Usług]
- **Strony**: [lista]
- **Completeness**: X/14 wymaganych elementów

### ✅ Elementy Poprawne
- [element] ✓

### ❌ Brakujące Elementy Krytyczne
- [element] - Rekomendacja: [tekst/wskazówka]

### ⚠️ Elementy Niekompletne
- [element] - Uwaga: [co uzupełnić]

### 📝 Akcje Następne
1. [priorytet 1]
2. [priorytet 2]
```

## Dostosowania

Jeśli pracujesz z określonym typem umów (np. B2B SLA, umowy NDA, licencje), możesz:
1. Skopiować skill
2. Dostosować tabelę wymaganych elementów dla Twojego typu umowy
3. Dodać dodatkowe sekcje domeny (np. SLO dla umów serwisowych)

## Przykłady Zapytań
- `/umowa-weryfikacja`
- "Sprawdź czy ta umowa na usługi IT zawiera wszystkie wymagane klauzule"
- "Zweryfikuj umowę: [wklej tekst]"

## Wymagane Umiejętności Agenta
- Analiza strukturalna tekstu
- Identyfikacja luk informacyjnych
- Generowanie raportów strukturalizowanych
- Pisanie rekomendacji

## Gotchas

- **Mylenie kompletności z poprawnością prawną:** Skill sprawdza obecność i spójność sekcji, ale nie zastępuje porady prawnej.
- **Brak typu umowy:** Jeśli typ umowy jest nieznany, nie zakładaj specyfiki NDA/SLA/B2B bez sygnałów w tekście.
- **Zaokrąglanie luk:** Sekcja niejasna to nie to samo co sekcja poprawna — oznacz ją jako niekompletną.
- **Nadmierna pewność:** Gdy fragmentów jest mało, raportuj brak danych zamiast udawać pełną ocenę.
- **Mieszanie wymagań branżowych:** Dodatkowe klauzule powinny wynikać z typu kontraktu, nie z uniwersalnej listy.

## Granice skilla

- Ten skill sprawdza kompletność i strukturę umowy.
- Ten skill nie pisze finalnej opinii prawnej.
- Ten skill nie zastępuje prawnika ani audytu compliance.
