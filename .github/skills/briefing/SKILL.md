---
name: briefing
description: "Wywołaj ZAWSZE gdy użytkownik wpisze /briefing, 'briefing', 'co mam dziś robić', 'priorytety na dziś', 'poranny przegląd' lub podobne pytanie o plan dnia. Skill czyta Active_Work.md i generuje zwięzły przegląd 3 najważniejszych zadań na dziś z uwzględnieniem dostępności i aktywnych blokad."
---

# Briefing Skill

Poranny przegląd dnia dla Karola. Wybiera 3 najważniejsze zadania na dziś z `Active_Work.md`, uwzględnia dostępność i aktywne blokady.

## Proces

### Krok 1: Wczytaj dane

Przeczytaj `Active_Work.md`. Odnotuj:
- Cele na ten okres
- Aktywne projekty (TOP 5) + ich status i następny krok
- Dostępność w tym okresie (czy dziś jest dzień z głęboką pracą, czy operacyjny)
- Otwarte decyzje i blokady
- Parking Lot — te projekty POMIJAJ całkowicie

### Krok 2: Ustal kontekst dnia

Na podstawie aktualnej daty i sekcji dostępności w `Active_Work.md`:

- **Pn–Pt 8–16** → tryb operacyjny, brak skupienia. Priorytety = zadania możliwe do wykonania z przerwami, krótkie follow-upy, maile, telefony.
- **Wieczory po 16 / weekendy** → czas głębokiej pracy. Priorytety = zadania wymagające skupienia (kod, analiza, pisanie).
- **Treningi M/W/F 6:30** → uwzględnij w planowaniu (rano zajęte do ~8:00).
- Sprawdź czy są nieobecności lub zjazdy zaplanowane na dziś w sekcji dostępności.

### Krok 3: Wybierz 3 priorytety

Kryteria wyboru (w kolejności ważności):
1. Czy projekt blokuje innych lub jest blokowany przez kogoś? → wyższy priorytet
2. Czy jest deadline lub rosnące ryzyko?
3. Zgodność z "Celami na ten okres"
4. Czy zadanie jest w ogóle wykonalne dziś (typ dnia, dostępność ludzi)?

Nie umieszczaj w briefingu projektów z Parking Lot — nawet jeśli są interesujące.

### Krok 4: Wygeneruj briefing

Użyj poniższego szablonu. Odpowiedź po polsku, zwięźle — bez wstępów, bez pochlebstw.

---

## Szablon outputu

```
## Briefing — [DZIEŃ TYGODNIA], [DATA]

**Okno pracy dziś:** [np. "Wieczór po 16 — głęboka praca" / "Tryb operacyjny 8–16, głęboka praca od wieczoru"]

**Top 3 na dziś:**

1. **[Nazwa projektu/zadania]**
   → [Jeden konkretny następny krok — co dokładnie zrobić]
   ⚠️ Blokada: [jeśli jest — kto/co blokuje] *(pomiń jeśli brak blokady)*

2. **[Nazwa projektu/zadania]**
   → [Jeden konkretny następny krok]

3. **[Nazwa projektu/zadania]**
   → [Jeden konkretny następny krok]

**Aktywne blokady:** [lista lub "Brak — możesz działać na wszystkich frontach"]
```

---

## Zasady

- Nigdy nie zaczynaj od pochlebstw ani wstępu — od razu briefing.
- Jeden konkretny krok na projekt, nie lista życzeń.
- Jeśli wszystkie 3 blokady są zewnętrzne i nic nie możesz dziś pchnąć — napisz to wprost i zaproponuj co możesz zrobić zamiast.
- Nie pytaj o rzeczy, które są w `Active_Work.md` — masz dane, użyj ich.
- Sekcja zdrowotna i trening — respektuj harmonogram, ale nie komentuj proaktywnie.

## Przykłady wywołania

- `/briefing`
- "briefing"
- "co mam dziś robić?"
- "priorytety na dziś"
- "poranny przegląd"

## Gotchas

- **Mylenie trybu dnia:** Nie planuj zadań deep-work w oknie Pn-Pt 8-16, jeśli `Active_Work.md` wskazuje tryb operacyjny.
- **Przeciekanie Parking Lot:** Nie wrzucaj tematów z sekcji Parking Lot do Top 3, nawet jeśli są atrakcyjne.
- **Za dużo kroków na punkt:** Każdy priorytet ma mieć jeden następny krok, nie mini-plan projektu.
- **Brak filtracji przez cele:** Jeśli zadanie nie wspiera "Celów na ten okres", nie powinno wejść do Top 3.
- **Ignorowanie blokad zewnętrznych:** Gdy blokada jest po stronie innej osoby/systemu, nazwij ją wprost i zaproponuj alternatywę.

## Granice skilla

- Ten skill służy wyłącznie do wyboru 3 priorytetów na dziś.
- Ten skill nie tworzy planu tygodniowego ani roadmapy projektu.
- Gdy potrzebna jest analiza opcji strategicznych, użyj `/decyzja [temat]`.
