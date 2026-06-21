---
name: mcp-builder
description: "Use when designing or implementing Model Context Protocol servers, tools, resources, or prompts for agent integrations. Focuses on minimal tool surfaces, safe schemas, auth, and testability."
---

# MCP-Builder Skill

Pomaga projektować i wdrażać serwery MCP oraz integracje dla agentów. Cel: mała, jasna powierzchnia narzędzi i przewidywalne zachowanie.

## Kiedy używać

- Chcesz wystawić dane lub akcje przez MCP.
- Budujesz integrację między agentem a zewnętrznym API, lokalnym narzędziem albo workspace.
- Potrzebujesz zaprojektować zestaw tools, resources lub prompts.
- Chcesz przygotować bezpieczny szkielet serwera MCP do dalszego rozwijania.

## Proces

### 1. Określ cel integracji

- Zdefiniuj problem biznesowy albo techniczny.
- Wypisz, jakie akcje agent ma wykonywać.
- Usuń wszystko, co nie jest potrzebne do pierwszej wersji.

### 2. Zaprojektuj powierzchnię MCP

- Wybierz minimalny zestaw tools.
- Dla każdego toola opisz wejście, wyjście i skutki uboczne.
- Jeśli dane są tylko do odczytu, rozważ resource zamiast toola.
- Jeśli agent potrzebuje instrukcji, dodaj prompt zamiast rozbudowywać toola.

### 3. Zadbaj o bezpieczeństwo i stabilność

- Trzymaj sekrety poza kodem.
- Waliduj wejścia jawnie, nie zakładaj poprawności danych.
- Ustal jasne błędy i komunikaty zwrotne.
- Unikaj ukrytych efektów ubocznych i zbyt szerokich uprawnień.

### 4. Zbuduj i przetestuj

- Sprawdź uruchamianie lokalne.
- Przetestuj każdy tool osobno.
- Zweryfikuj zachowanie przy błędnych danych, braku autoryzacji i timeoutach.
- Upewnij się, że klient MCP widzi dokładnie to, co powinien.

### 5. Owiń to w prostą dokumentację

- Opisz do czego służy serwer.
- Opisz dostępne narzędzia.
- Dodaj przykład użycia i informacje o konfiguracji.

## Output

Preferowany rezultat:

```markdown
## MCP Plan

### Goal
- [jeden cel]

### Tools
- [tool 1] - [po co]
- [tool 2] - [po co]

### Risks
- [ryzyko]

### Next Step
- [jedna konkretna akcja]
```

## Gotchas

- Nie buduj nadmiarowego MCP z dziesiątkami narzędzi.
- Nie łącz w jednym toolu wielu niezależnych akcji.
- Nie chowaj logiki w niejawnych efektach ubocznych.
- Nie używaj broad permissions, jeśli wystarczy wąski zakres.

## Granice skilla

- Ten skill dotyczy projektowania i wdrażania MCP.
- Ten skill nie służy do ogólnej architektury aplikacji bez komponentu MCP.
- Gdy potrzebna jest analiza produktu, najpierw ustal wymagania, potem projektuj narzędzia.