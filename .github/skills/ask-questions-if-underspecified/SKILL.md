---
name: ask-questions-if-underspecified
description: "Use when a request is incomplete, ambiguous, or missing decision-critical details. Forces a short clarification step before implementation."
---

# Ask-Questions-If-Underspecified Skill

Pomaga zatrzymać zgadywanie, gdy wymagania są niepełne. Celem jest szybkie wyłapanie braków, zanim powstanie błędne rozwiązanie.

## Kiedy używać

- Wymaganie jest niejasne albo ma kilka możliwych interpretacji.
- Brakuje informacji, które zmieniają rozwiązanie.
- Użytkownik podaje skrót myślowy zamiast pełnego opisu.
- Istnieje ryzyko, że zła decyzja na starcie wymusi przeróbkę całego rozwiązania.

## Proces

### 1. Odsiej to, co już wiadomo

- Zapisz jawne wymagania.
- Oddziel fakty od założeń.
- Zidentyfikuj brakujące informacje krytyczne.

### 2. Zadaj tylko pytania rozstrzygające

- Pytaj o rzeczy, które realnie zmieniają kierunek pracy.
- Preferuj 1 do 3 pytań, nie ankietę.
- Jeśli jedno pytanie wystarczy, nie zadawaj trzech.

### 3. Jeśli można działać, nazwij założenie

- Gdy brak danych nie blokuje pracy, powiedz na jakim założeniu jedziesz.
- Oznacz założenie wprost, żeby dało się je skorygować.

### 4. Po odpowiedzi ruszaj od razu

- Nie powtarzaj całego wywiadu.
- Przejdź do działania na podstawie doprecyzowanego zakresu.

## Output

Preferowany format:

```markdown
Potrzebuję doprecyzować 1 rzecz:
1. [pytanie rozstrzygające]

Jeśli chcesz, mogę ruszyć od razu przy założeniu, że [założenie].
```

## Gotchas

- Nie zadawaj pytań tylko po to, żeby wyglądać ostrożnie.
- Nie pytaj o to, co nie zmienia decyzji.
- Nie mieszaj pytań technicznych z biznesowymi, jeśli jedno dobre pytanie wystarczy.
- Nie zgaduj, gdy brak danych naprawdę zmienia wynik.

## Granice skilla

- Ten skill służy do doprecyzowania niepełnych zadań.
- Ten skill nie zastępuje pełnej analizy wymagań.
- Gdy dane są wystarczające, przejdź do wykonania bez dalszego zatrzymywania.