---
typ: referencja
tags: [typ/referencja, rozwoj/kursy]
date: 2026-04-01
---


# Moduł 1: Obsidian — Twój AI-powered PKM ⭐

**Czas całkowity:** ~3.5h | **Poziom:** Bazowy → Średniozaawansowany
**Wymagania wstępne:** Zainstalowany Obsidian, podstawowa znajomość interfejsu
**Po tym module:** Będziesz mieć vault skonfigurowany pod integrację z AI, działające pluginy AI i system notatek, który sam podpowiada powiązania.

---

## Lekcja 1.1: Szybka mapa ekosystemu — Claude Code vs Cline vs Obsidian AI

**Czas:** ~30 min | **Poziom:** Beginner
**Cel:** Zrozumiesz, czym jest każde narzędzie, jak się różnią i jak będą ze sobą współpracować w Twoim workflow.

### Kontekst

Zanim zanurkujesz w konfigurację, musisz zrozumieć mapę terenu. W ekosystemie AI-assisted development masz trzy warstwy, które się uzupełniają — nie konkurują:

1. **Obsidian** = Twoja baza wiedzy (PKM — Personal Knowledge Management)
2. **Cline** = Agent kodujący wewnątrz VS Code (rozszerzenie)
3. **Claude Code** = Agent kodujący Anthropic (CLI + rozszerzenie VS Code)

### Teoria

#### Obsidian — fundament: notatki jako dane

Obsidian to aplikacja do zarządzania wiedzą oparta na plikach Markdown (.md). Kluczowe cechy:

- **Local-first** — Twoje pliki leżą na dysku, nie w chmurze. Żaden vendor nie ma do nich dostępu.
- **Plain text** — każda notatka to zwykły plik .md, który przeczyta dowolne narzędzie (w tym AI agent).
- **Graph view** — Obsidian wizualizuje powiązania między notatkami jako graf.
- **Pluginy** — ponad 2700 pluginów społecznościowych, w tym kilkanaście AI-owych.

Dlaczego to ważne w kontekście AI? Bo Twój vault to gotowa baza wiedzy, którą agenty AI mogą czytać, przeszukiwać i modyfikować — bez potrzeby uploadu do chmury.

#### 🔀 Alternatywy dla Obsidiana (PKM)

| Narzędzie | Opis | Kiedy rozważyć |
|-----------|------|----------------|
| **Notion** | All-in-one workspace z bazami danych, widokami Kanban, AI wbudowanym. | Jeśli pracujesz w zespole i potrzebujesz współdzielonych baz. Ale: dane w chmurze, vendor lock-in, AI od $20/użytkownika/mies. |
| **Logseq** | Open-source, outliner-first (jak Workflowy + Obsidian). Lokalne pliki. | Jeśli preferujesz myślenie w bullet points zamiast długich dokumentów. Mniejszy ekosystem pluginów. |
| **Capacities** | Object-oriented notetaking — notatki jako „obiekty" z typami (osoba, książka, projekt). | Jeśli lubisz ustrukturyzowane podejście z typizacją. Mniej elastyczny, ale bardziej intuicyjny dla nie-techników. |
| **Tana** | Supertags, live queries, AI voice chat. Bliżej bazy danych niż edytora tekstu. | Jeśli chcesz PKM jako „programowalną bazę danych". Stroma krzywa uczenia się. |
| **Silverbullet** | Self-hosted, open-source, markdown + live queries. Działa w przeglądarce. | Jeśli chcesz full self-hosting i jesteś technicznie biegły. |

W tym kursie używamy Obsidiana, bo ma najlepszą integrację z AI (pluginy, MCP, local-first), największy ekosystem i Ty już go znasz.

#### Cline — agent autonomiczny w VS Code

Cline to rozszerzenie VS Code, które zamienia LLM (np. Claude, GPT, Gemini) w autonomicznego agenta kodującego. Co potrafi:

- Tworzyć i edytować pliki (z podglądem diff przed zatwierdzeniem)
- Uruchamiać komendy w terminalu
- Przeglądać strony w przeglądarce (browser automation)
- Rozszerzać swoje możliwości przez MCP (Model Context Protocol)

**Kluczowa cecha:** Human-in-the-loop — każda zmiana wymaga Twojego zatwierdzenia. To nie jest „automat, który sam coś zmieni w kodzie" — Ty zawsze masz kontrolę.

Cline jest **model-agnostic** — podłączysz do niego Claude'a (przez Anthropic API), GPT (przez OpenAI API), Gemini, lokalne modele (Ollama) czy OpenRouter. Ty już używasz GitHub Copilot jako providera — to też działa.

#### 🔀 Alternatywy dla Cline

| Narzędzie | Opis | Kluczowa różnica vs Cline |
|-----------|------|---------------------------|
| **Roo Code** | Fork Cline'a z rozbudowanymi trybami (Architect, Code, Debug, Ask) i multi-agent workflow. 900K+ instalacji. | Więcej automatyzacji i trybów pracy, ale cięższy. Dobry jeśli chcesz większą autonomię agenta. |
| **Continue.dev** | Open-source asystent z trybami chat, plan i agent. Może działać w pełni lokalnie. | Priorytet na prywatność i lokalne modele. Mniej agresywny agent niż Cline. |
| **Cursor** | Pełne IDE (fork VS Code) z AI wbudowanym w każdą warstwę. Tab completions, background agents. $20/mies. | Nie rozszerzenie, lecz osobne IDE. Głębsza integracja, ale vendor lock-in. Można używać Cline WEWNĄTRZ Cursora. |
| **Aider** | CLI agent open-source. 130+ języków, voice-to-code, tryb watch (komentarze `# aider:` w kodzie). | Terminalowy, lekki, świetny do par-programmingu. Brak GUI w VS Code. |
| **GitHub Copilot** | Oficjalny asystent GitHub/Microsoft. Autocomplete + agent mode (enterprise). 53.8M instalacji. | Najszersze adopcja, ale mniej autonomii. Dobry jako uzupełnienie Cline'a, nie zamiennik. |

#### Claude Code — natywny agent Anthropic

Claude Code to narzędzie Anthropic, które istnieje w dwóch formach:

| | **Claude Code CLI** | **Claude Code VS Code Extension** |
|---|---|---|
| **Interfejs** | Terminal (REPL) | Panel w VS Code |
| **Obsługa** | Klawiatura, komendy | GUI, kliknięcia, @-mentions |
| **Dla kogo** | Deweloperzy terminalowi | Użytkownicy IDE |
| **Unikalne cechy** | Context rewind (Esc×2), subagenty, hooks | Plan mode z edycją, inline diffs, wiele kart |
| **Koszt** | API pay-as-you-go lub Max plan ($100/mies.) | Zawarte w Claude Code (ta sama licencja) |

**Ważne:** Rozszerzenie VS Code **zawiera** CLI — instalując extension, dostajesz też dostęp do terminala.

#### 🔀 Alternatywy dla Claude Code

| Narzędzie | Opis | Kluczowa różnica vs Claude Code |
|-----------|------|----------------------------------|
| **Codex CLI (OpenAI)** | Terminalowy agent OpenAI. Sandbox kernelowy (Seatbelt/Landlock), kontekst 1M tokenów, `codex cloud exec`. | Większy kontekst (1M vs 200K), sandbox na poziomie OS, delegowanie zadań do chmury. Ale mniej elastyczne hooks. |
| **Goose (Block/Square)** | Open-source agent od Block. Planning-first, rozbija zadania na weryfikowalne kroki. 33K+ stars. | Świetny do orkiestracji i scaffoldingu systemów. Mniej interaktywny niż Claude Code. |
| **Gemini CLI (Google)** | Agent terminalowy Google z modelem Gemini. Darmowy tier. | Darmowy z limitem, ale mniej dojrzały ekosystem niż Claude Code. Wart przetestowania. |
| **OpenCode** | Open-source CLI agent, minimalistyczny. | Lekki i prosty, dobry do nauki. Mniej funkcji niż Claude Code. |

#### Jak to się łączy?

```
┌─────────────────────────────────────────────┐
│              TWÓJ WORKFLOW                   │
│                                              │
│  ┌──────────┐    ┌──────────────────────┐   │
│  │ OBSIDIAN │◄──►│      VS CODE         │   │
│  │ (Vault)  │    │  ┌──────┐ ┌────────┐ │   │
│  │ • Notatki│    │  │ Cline│ │ Claude │ │   │
│  │ • PKM    │    │  │      │ │  Code  │ │   │
│  │ • AI     │    │  └──────┘ └────────┘ │   │
│  │ plugins  │    │     ▲         ▲       │   │
│  └────┬─────┘    └─────┼─────────┼──────┘   │
│       │                │         │           │
│       └────────────────┴─────────┘           │
│           Pliki .md na dysku (wspólne)       │
└─────────────────────────────────────────────┘
```

Klucz: **wszystko łączy się przez pliki na dysku**. Twój vault Obsidiana to folder z plikami .md. Claude Code i Cline mogą ten folder czytać i modyfikować. MCP (Model Context Protocol) pozwala agentom na jeszcze głębszą integrację.

### Przykłady zastosowań w Twojej pracy

1. **Logistyka:** Notatki o stawkach, trasach i SOP w Obsidianie → Claude Code generuje skrypt automatyzujący wycenę → wynik wraca jako notatka
2. **Studia PJATK:** Notatki z wykładów w Obsidianie → Cline generuje prototyp projektu → dokumentacja wraca do vault'u
3. **Codzienny workflow:** Obsidian AI podpowiada powiązane notatki → kopiujesz kontekst do Cline → agent pisze kod z pełnym kontekstem

### Ćwiczenia

🟢 **Ćwiczenie 1:** Narysuj na kartce (lub w Obsidian Canvas) swoją obecną mapę narzędzi — jakich narzędzi używasz do: notatek, kodowania, automatyzacji. Zaznacz, gdzie są luki.

🟢 **Ćwiczenie 2:** Otwórz swój vault Obsidiana i policz: ile masz notatek? Ile folderów? Czy masz jakieś tagi? Zapisz te liczby — wrócisz do nich po skonfigurowaniu AI.

🟡 **Ćwiczenie 3:** Sprawdź, które narzędzia masz już zainstalowane:
- [ ] Obsidian (wersja?)
- [ ] VS Code (wersja?)
- [ ] Cline (zainstalowany? jaki provider?)
- [ ] Claude Code CLI (`claude --version` w terminalu)
- [ ] Claude Code VS Code Extension (w marketplace)

### Podsumowanie

- Obsidian = baza wiedzy (input/output), Cline = agent w IDE (wykonawca), Claude Code = agent Anthropic (wykonawca natywny)
- Wszystko łączy się przez pliki na dysku i MCP
- Nie musisz wybierać jedno — w kursie nauczysz się używać wszystkich trzech razem
- Zaczynamy od Obsidiana, bo to fundament, z którego karmisz agenty kontekstem

---

## Lekcja 1.2: Architektura vault'u AI-ready

**Czas:** ~45 min | **Poziom:** Beginner → Intermediate
**Cel:** Przebudujesz swój vault tak, żeby AI mogło go efektywnie przeszukiwać, rozumieć i wykorzystywać jako bazę wiedzy.

### Kontekst

Większość ludzi traktuje Obsidiana jak folder z notatkami. To błąd. Vault to **baza danych wiedzy** — i jak każda baza, potrzebuje struktury. Kiedy podłączysz AI (Smart Connections, Copilot, Claude Code przez MCP), jakość wyników zależy bezpośrednio od jakości struktury Twojego vault'u.

Zasada: **Garbage in, garbage out.** Jeśli notatki nie mają tagów, metadanych i powiązań — AI znajdzie mniej. To się nazywa **context engineering** — świadome przygotowanie danych, z których AI korzysta.

### Teoria

#### Struktura folderów — nie za płaska, nie za głęboka

Rekomendowana struktura dla AI-ready vault'u:

```
Vault/
├── 00-Inbox/              ← surowe notatki, do przetworzenia
├── 10-Projects/           ← aktywne projekty (praca, studia)
│   ├── PJATK-AI-Lider/
│   ├── Firma-Automatyzacje/
│   └── SaveurPlan/
├── 20-Areas/              ← obszary odpowiedzialności (stałe)
│   ├── Maritime-Freight/
│   ├── Management/
│   └── Biohacking/
├── 30-Resources/          ← materiały referencyjne
│   ├── Tools/
│   ├── Templates/
│   └── Snippets/
├── 40-Archive/            ← zakończone projekty
└── 90-Meta/               ← dashboardy, MOC, konfiguracja
    ├── MOC-Logistyka.md
    └── Dashboard.md
```

To wariant systemu **PARA** (Projects, Areas, Resources, Archive) z numerowanymi folderami, żeby utrzymać kolejność w drzewku.

#### 🔀 Alternatywne systemy organizacji vault'u

| System | Opis | Kiedy wybrać zamiast PARA |
|--------|------|---------------------------|
| **Zettelkasten** | Atomowe notatki (1 idea = 1 notatka) połączone linkami. Brak hierarchii folderów — struktura wynika z powiązań. Inspiracja: Niklas Luhmann. | Jeśli piszesz dużo (research, publikacje) i chcesz, żeby idee łączyły się emergentnie. Wymaga dyscypliny w linkowaniu. |
| **Johnny Decimal** | Numeryczny system: obszary (10-19, 20-29...) → kategorie (11, 12...) → pliki. Max 10 kategorii na obszar. | Jeśli lubisz sztywny porządek i masz jasno zdefiniowane domeny. Dobry dla osób, które gubią się w elastyczności PARA. |
| **ACCESS** | Atlas (MOC), Calendar, Cards (Zettel), Extras, Sources, Spaces. Autorstwo: Nick Milo (Linking Your Thinking). | Jeśli chcesz połączyć MOC-centric workflow z Zettelkasten. Bardziej rozbudowany niż PARA, ale i bardziej kompletny. |
| **Flat + tags** | Zero folderów, cała organizacja przez tagi i wyszukiwanie. | Jeśli masz mały vault (<200 notatek) lub ufasz w pełni wyszukiwaniu semantycznemu (Smart Connections). |

Nie ma jednego „najlepszego" systemu. PARA jest rekomendowany w tym kursie, bo jest prosty, sprawdzony i dobrze współpracuje z AI (jasna kategoryzacja). Ale jeśli już masz działający system — **nie przebudowuj na siłę**, tylko dodaj metadata i linki.

#### Properties (YAML frontmatter) — metadata dla AI

Każda notatka powinna mieć metadata na górze pliku. To daje AI kontekst bez czytania całej treści:

```yaml
---
title: "Stawki Maersk Gdańsk-Jeddah Q1 2026"
tags: [maritime, rates, maersk, middle-east]
date: 2026-03-15
project: Maritime-Freight
type: reference    # note | reference | meeting | task | template
status: active     # draft | active | archive
related:
  - "[[Maersk Surcharges 2026]]"
  - "[[Trasa Gdańsk-Jeddah]]"
---
```

**Dlaczego to ważne?**
- `tags` — Smart Connections używa tagów do filtrowania wyników
- `type` — Copilot może filtrować po typie (np. „pokaż tylko meeting notes")
- `related` — jawne powiązania pomagają AI budować kontekst
- `project` — pozwala AI rozumieć, do jakiego projektu należy notatka

#### Linki i backlinksy — sieć, nie drzewo

Obsidian opiera się na `[[wiki links]]`. Każdy link tworzy dwustronną relację (backlink). Im więcej powiązań, tym lepiej AI rozumie strukturę Twojej wiedzy.

**Praktyka:**
- Linkuj agresywnie — każda wzmianka o innym temacie powinna być linkiem
- Używaj aliasów: `[[Maersk|Maersk Line]]`
- Twórz MOC (Maps of Content) — notatki-indeksy, które zbierają linki do powiązanych tematów

#### Tagi — taksonomia, nie chaos

Ustal system tagów i trzymaj się go. Przykład:

```
#praca            #studia           #osobiste
#maritime         #pjatk            #biohacking
#rates            #projekt          #fitness
#automatyzacja    #ai               #suplementacja
#ksef             #transformacja
```

Zasada: **max 3 poziomy zagnieżdżenia** (np. `#praca/maritime/rates`). Więcej = chaos.

### Przykłady

**Przykład 1: Notatka „przed" i „po"**

❌ PRZED (plik `notatka.md`):
```markdown
Spotkanie z Maersk 15.03 - nowe stawki na Q2, trzeba sprawdzić surcharges
```

✅ PO (plik `Meeting-Maersk-2026-03-15.md`):
```yaml
---
title: "Meeting Maersk — nowe stawki Q2 2026"
tags: [maritime, rates, maersk, meeting]
date: 2026-03-15
type: meeting
project: Maritime-Freight
status: active
related:
  - "[[Maersk Surcharges 2026]]"
  - "[[Trasa Gdańsk-Jeddah]]"
  - "[[Q2 Rate Review]]"
---

# Meeting Maersk — Q2 2026

## Uczestnicy
- Karol (nasza firma)
- Jan Kowalski (Maersk)

## Ustalenia
- Nowe stawki od 01.04: wzrost ~8% na [[Trasa Gdańsk-Jeddah|trasie Gdańsk-Jeddah]]
- [[Maersk Surcharges 2026|Surcharges]]: BAF bez zmian, LSS +$15/TEU
- Termin na akceptację: 25.03

## Action items
- [ ] Porównać z [[CMA CGM Rates Q2|ofertą CMA CGM]]
- [ ] Przygotować zestawienie dla zarządu
- [ ] Odpowiedzieć Markowi do piątku
```

Widzisz różnicę? AI (Smart Connections, Copilot, Claude Code) z drugą wersją:
- Wie, że to meeting note
- Zna powiązane tematy (trasy, surcharges, inni przewoźnicy)
- Może automatycznie zaproponować powiązane notatki
- Może wygenerować follow-up na podstawie action items

### Ćwiczenia

🟢 **Ćwiczenie 1:** Stwórz strukturę folderów PARA w swoim vault'u. Jeśli masz istniejące notatki — przenieś 10 najważniejszych do odpowiednich folderów.

🟢 **Ćwiczenie 2:** Wybierz 5 swoich notatek i dodaj do nich YAML frontmatter (title, tags, date, type, status). Użyj spójnego systemu tagów.

🟡 **Ćwiczenie 3:** Stwórz MOC (Map of Content) dla jednego ze swoich obszarów — np. `MOC-Maritime.md` — notatka, która linkuje do wszystkich powiązanych notatek o frachcie morskim.

🟡 **Ćwiczenie 4:** Przejrzyj 10 notatek i dodaj `[[wiki links]]` tam, gdzie wspominasz inne tematy. Sprawdź, jak zmienia się graf view.

🔴 **Ćwiczenie 5:** Stwórz szablon (Template) notatki z meeting'u, który automatycznie wstawia frontmatter. Użyj natywnej funkcji Templates lub Templater.

### Podsumowanie

- Vault AI-ready to: jasna struktura folderów + properties/metadata + linki + spójne tagi
- Context engineering = jakość Twojego vault'u wpływa na jakość odpowiedzi AI
- System PARA (Projects, Areas, Resources, Archive) jest sprawdzonym fundamentem
- MOC (Maps of Content) to notatki-indeksy, które pomagają i Tobie, i AI
- Następna lekcja: podłączamy AI do tego fundamentu

---

## Lekcja 1.3: Pluginy AI — Smart Connections, Copilot, Nova

**Czas:** ~45 min | **Poziom:** Intermediate
**Cel:** Zainstalujesz i skonfigurujesz trzy kluczowe pluginy AI. Będziesz umieć przeszukiwać vault semantycznie i rozmawiać z własnymi notatkami.

### Kontekst

Masz uporządkowany vault z metadanymi i linkami. Teraz dodajemy warstwę AI, która sprawi, że vault zacznie „myśleć" — podpowiadać powiązania, odpowiadać na pytania na podstawie Twoich notatek, i edytować treść na Twoje polecenie.

Trzy pluginy, trzy role:

| Plugin | Rola | Koszt | API Key? |
|--------|------|-------|----------|
| **Smart Connections** | Odkrywanie powiązań (embeddings) | Darmowy (core) | Nie (lokalny model) |
| **Copilot** | Chat z vault'em, edycja, VaultQA | Darmowy (z API key) / Plus | Tak (OpenAI, Anthropic, itp.) |
| **Nova** | Inline edycja tekstu (stream) | Darmowy (z API key) | Tak |

#### 🔀 Inne pluginy AI warte uwagi

| Plugin | Rola | Wyróżnik |
|--------|------|----------|
| **Khoj** | Self-hosted AI asystent (chat, search, agenty). Open-source. | Możesz hostować na swoim serwerze — pełna kontrola nad danymi. Obsługuje web search i automatyzacje. |
| **Smart Second Brain (Ollama)** | Chat z vault'em przez lokalne modele (Ollama). | 100% offline, zero kosztów API. Jakość zależy od sprzętu i modelu. Idealne jeśli GDPR jest priorytetem. |
| **Text Generator** | Generowanie tekstu w notatkach z różnych modeli. | Prosty, lekki, bez ambicji bycia „całym asystentem". Dobry do szybkiego generowania drafts. |
| **Canvas Conversation** | Chat z AI bezpośrednio na Obsidian Canvas. | Wizualny workflow — widzisz konwersację jako graf. Ciekawe do brainstormingu. |
| **AI for Templater** | Rozszerzenie Templater o wywołania AI (system prompts w szablonach). | Łączy Templater + AI w jednym — szablony, które same generują treść. Bardziej zaawansowane niż workflow opisany w Lekcji 1.4. |

W tym kursie skupiamy się na Smart Connections + Copilot jako głównej kombinacji (najdojrzalsze, największa baza użytkowników). Ale warto wiedzieć, że ekosystem jest bogaty.

### Teoria i instrukcja instalacji

#### Smart Connections — odkrywaj, co się łączy

Smart Connections używa **embeddingów** (wektorowych reprezentacji tekstu) do znajdowania notatek semantycznie powiązanych z tym, co aktualnie czytasz. Nie szuka słów kluczowych — szuka **znaczenia**.

**Instalacja:**
1. `Settings → Community plugins → Browse`
2. Szukaj „Smart Connections"
3. `Install → Enable`
4. Plugin automatycznie zaczyna indeksować vault (lokalnie, bez wysyłania danych)

**Konfiguracja zero-setup:**
- Smart Connections v4 działa od razu po instalacji
- Wbudowany lokalny model embeddingów — nie potrzebujesz API key
- Indeksowanie zajmie kilka minut (zależy od rozmiaru vault'u)

**Jak używać:**
1. Otwórz dowolną notatkę
2. Kliknij ikonę Smart Connections w panelu bocznym (lub `Cmd/Ctrl+P → Open: Connections view`)
3. Zobaczysz listę powiązanych notatek, posortowanych wg. similarity score
4. Kliknij wynik, żeby otworzyć notatkę, lub przeciągnij go do edytora, żeby wstawić link

**Smart Lookup** — semantyczne wyszukiwanie:
- `Cmd/Ctrl+P → Open: Lookup view`
- Wpisz pytanie w języku naturalnym (np. „stawki na Bliski Wschód")
- Wyniki oparte na znaczeniu, nie literalnym matchowaniu

**Opcjonalne rozszerzenia (Smart Plugins):**
- **Smart Context** — buduj „paczki kontekstu" z wybranych notatek do użycia w AI
- **Smart Chat** — chat z notatkami bezpośrednio w Obsidianie

#### Copilot — AI asystent w vault'u

Copilot to bardziej zaawansowany plugin, który dodaje chat, edycję tekstu i przeszukiwanie vault'u.

**Instalacja:**
1. `Settings → Community plugins → Browse`
2. Szukaj „Copilot"
3. `Install → Enable`
4. Ustaw API key: `Settings → Copilot → Basic Settings → API Keys`

**Konfiguracja z Anthropic API (Claude):**
1. Wejdź na https://console.anthropic.com
2. Stwórz API key
3. W Copilot Settings: wklej key w pole „Anthropic API Key"
4. Wybierz model (np. `claude-sonnet-4-20250514`)
5. Kliknij „Save and Reload"

**Uwaga GDPR:** Dane wysyłane do API opuszczają Twój komputer. Jeśli w vault'u masz dane firmowe, rozważ:
- Użycie lokalnego modelu (Ollama) zamiast API chmurowego
- Wyłączenie indeksowania wrażliwych folderów (`Settings → Copilot → Exclusions`)
- Konsultację z działem IT w firmie

**Tryby pracy Copilot:**

1. **Chat mode** — rozmowa z AI (jak ChatGPT, ale w Obsidianie)
   - Otwórz panel: kliknij ikonę Copilot w ribbonie lub `Cmd/Ctrl+P → Open Copilot Chat Window`
   - Pytaj o cokolwiek — AI nie ma automatycznie kontekstu vault'u

2. **Vault QA mode** — przeszukiwanie vault'u
   - Przełącz na tryb VaultQA w panelu
   - AI przeszukuje Twoje notatki i odpowiada na podstawie ich treści
   - Wymaga indeksowania (automatyczne po włączeniu)

3. **Komendy inline** — edycja tekstu
   - Zaznacz tekst → prawy klik → Copilot: Summarize / Expand / Fix Grammar / itp.
   - Lub custom prompts: stwórz własne komendy w `Settings → Copilot → Commands`

4. **Composer** — edycja notatek z AI
   - `@composer` w chacie — AI może edytować Twoje notatki bezpośrednio
   - Pokazuje diff przed zastosowaniem zmian

#### Nova — inline streaming (opcjonalny)

Nova to lekki plugin, który dodaje AI-edycję bezpośrednio w edytorze. Zaznaczasz tekst, stosujesz transformację, i zmiany streamują się w miejscu.

**Kiedy Nova zamiast Copilot:** Gdy chcesz szybko przetworzyć tekst (tłumaczenie, streszczenie, rozwinięcie) bez otwierania panelu czatu.

**Instalacja:**
1. `Settings → Community plugins → Browse → "Nova"` → Install → Enable
2. Skonfiguruj API key (OpenAI, Anthropic, lub Ollama)

**Użycie:**
- Zaznacz tekst → `Cmd/Ctrl+P → Nova: Apply transformation`
- Lub skonfiguruj skrót klawiszowy

### Przykłady

**Przykład 1: Smart Connections w pracy**
Otwierasz notatkę „Meeting Maersk Q2 2026". Smart Connections automatycznie pokazuje:
- „Stawki CMA CGM Q1 2026" (score: 0.87)
- „Surcharges 2026 przegląd" (score: 0.82)
- „Meeting Maersk Q4 2025" (score: 0.79)

Klikasz i widzisz, że CMA CGM miał niższe stawki w Q1 — to daje Ci argument negocjacyjny.

**Przykład 2: Copilot VaultQA na studiach**
W panelu Copilot pytasz: „Jakie były główne wnioski z wykładu o EU AI Act?"
Copilot przeszukuje vault, znajduje notatki z zajęć i odpowiada z cytowaniami.

**Przykład 3: Copilot Composer w pracy**
Masz notatkę z chaotycznymi notatkami ze spotkania. `@composer przeformatuj tę notatkę jako strukturalny protokół spotkania z action items` — Copilot edytuje notatkę, pokazuje diff, czekasz na zatwierdzenie.

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zainstaluj Smart Connections. Poczekaj na indeksowanie. Otwórz 3 różne notatki i sprawdź, jakie powiązania proponuje AI. Czy są trafne?

🟢 **Ćwiczenie 2:** Zainstaluj Copilot. Skonfiguruj API key (Anthropic lub OpenAI). Zadaj proste pytanie w chat mode i sprawdź, czy odpowiada.

🟡 **Ćwiczenie 3:** Włącz tryb VaultQA w Copilot. Zadaj pytanie, na które odpowiedź znajduje się w Twoich notatkach. Czy Copilot ją znalazł? Jak dokładna jest odpowiedź?

🟡 **Ćwiczenie 4:** Użyj Copilot inline commands na jednej notatce — spróbuj: Summarize, Expand, Fix Grammar. Porównaj wyniki.

🔴 **Ćwiczenie 5:** Stwórz custom command w Copilot, np. „Przetłumacz na angielski" lub „Wyciągnij action items z notatki". Przetestuj na 3 różnych notatkach.

### Podsumowanie

- Smart Connections = pasywne odkrywanie powiązań (zero-setup, lokalne, darmowe)
- Copilot = aktywny asystent (chat, VaultQA, edycja — wymaga API key)
- Nova = szybka inline edycja tekstu z AI
- Pamiętaj o GDPR — dane wysyłane do API opuszczają Twój komputer
- Zacznij od Smart Connections (zero konfiguracji), potem dodaj Copilot gdy poczujesz potrzebę

---

## Lekcja 1.4: Templater + AI — automatyczne generowanie i przetwarzanie notatek

**Czas:** ~45 min | **Poziom:** Intermediate
**Cel:** Zbudujesz szablony notatek, które automatycznie generują treść z AI — od notatek z meetingów po streszczenia artykułów.

### Kontekst

Templater to jeden z najpotężniejszych pluginów Obsidiana. Pozwala tworzyć szablony z logiką JavaScript — czyli szablony, które „robią rzeczy": pobierają datę, pytają o input, a nawet wysyłają zapytania do API.

W połączeniu z AI (przez Copilot lub bezpośrednie wywołania API), Templater staje się maszyną do generowania notatek. Zamiast ręcznie formatować protokół ze spotkania, klikasz skrót i szablon robi resztę.

### Teoria

#### Templater — podstawy

**Instalacja:**
1. `Settings → Community plugins → Browse → "Templater"` → Install → Enable
2. `Settings → Templater → Template Folder Location` → wskaż folder (np. `30-Resources/Templates`)

#### 🔀 Alternatywy dla Templater

| Narzędzie | Opis | Kiedy wybrać |
|-----------|------|--------------|
| **Obsidian Templates (core)** | Wbudowana funkcja szablonów. Proste wstawianie tekstu, `{{date}}`, `{{title}}`. | Jeśli potrzebujesz tylko prostych szablonów bez logiki. Zero konfiguracji. |
| **QuickAdd** | Plugin do szybkiego tworzenia notatek, dodawania treści, uruchamiania makr. Bardziej wizualna konfiguracja niż Templater. | Jeśli chcesz budować workflow'y z menu wielokrotnego wyboru i integrować z innymi pluginami (np. Kanban, Dataview). |
| **Buttons** | Plugin dodający klikalne przyciski w notatkach, uruchamiające komendy/szablony. | Jeśli chcesz „dashboardy" z przyciskami do typowych akcji. Dobry w połączeniu z Templater lub QuickAdd. |
| **Dataview + Templater** | Dataview generuje dynamiczne widoki (tabele, listy) z metadata notatek. W połączeniu z Templater — potężny combo. | Jeśli chcesz dashboardy, które automatycznie agregują notatki wg. tagów, statusów, dat. |
| **AI for Templater** | Rozszerzenie dodające AI (OpenAI) bezpośrednio do składni Templater. Szablony mogą wywoływać API i wstawiać odpowiedzi. | Jeśli chcesz, żeby szablon SAM generował treść (np. automatyczne streszczenie wklejonego tekstu). Bardziej zaawansowane niż Templater + Copilot osobno. |

W kursie używamy Templater, bo jest najpotężniejszy i najlepiej udokumentowany. Ale QuickAdd jest świetną alternatywą, jeśli wolisz wizualną konfigurację.

**Składnia:**
```
<% tp.date.now("YYYY-MM-DD") %>          → 2026-03-29
<% tp.file.title %>                       → nazwa pliku
<% tp.system.prompt("Temat?") %>          → popup z pytaniem
<% tp.file.cursor() %>                    → pozycja kursora po wstawieniu
```

#### Szablony AI-ready

**Szablon 1: Meeting Note z automatycznym frontmatter**

Stwórz plik `30-Resources/Templates/Template-Meeting.md`:

```markdown
---
title: "Meeting — <% tp.system.prompt("Z kim?") %>"
tags: [meeting, <% tp.system.prompt("Projekt (tag)?") %>]
date: <% tp.date.now("YYYY-MM-DD") %>
type: meeting
status: active
---

# Meeting — <% tp.file.title %>

## Uczestnicy
- <% tp.system.prompt("Uczestnicy (po przecinku)?") %>

## Agenda
- <% tp.file.cursor() %>

## Ustalenia


## Action Items
- [ ] 

## Notatki


---
*Utworzono: <% tp.date.now("YYYY-MM-DD HH:mm") %>*
```

**Użycie:** `Cmd/Ctrl+P → Templater: Create new note from template → Template-Meeting`

**Szablon 2: Daily Note z promptem do AI**

```markdown
---
title: "Daily — <% tp.date.now("YYYY-MM-DD") %>"
tags: [daily]
date: <% tp.date.now("YYYY-MM-DD") %>
type: note
---

# <% tp.date.now("dddd, D MMMM YYYY") %>

## 🎯 Priorytety na dziś
1. 
2. 
3. 

## 📝 Notatki


## 📊 Co zrobiłem
- 

## 💡 Pomysły / Wnioski


## 🔗 Powiązane
- 

---
*Poranne planowanie: <% tp.date.now("HH:mm") %>*
```

**Szablon 3: Research Note — przetwarzanie artykułu**

```markdown
---
title: "<% tp.system.prompt("Tytuł artykułu/źródła?") %>"
tags: [research, <% tp.system.prompt("Temat (tag)?") %>]
date: <% tp.date.now("YYYY-MM-DD") %>
type: reference
source: "<% tp.system.prompt("URL lub źródło?") %>"
status: active
---

# <% tp.file.title %>

## TL;DR
> *Uzupełnij po przeczytaniu lub użyj Copilot: Summarize*

## Kluczowe wnioski
1. 
2. 
3. 

## Cytaty / ważne fragmenty
> 

## Jak to się odnosi do moich projektów
- [[]]

## Action items
- [ ] 

---
*Źródło: frontmatter.source*
```

#### Integracja Templater z Copilot

Nie musisz budować skomplikowanych API callów w Templater — wystarczy, że szablon przygotuje strukturę, a Copilot dopełni treść:

1. Tworzysz notatkę z szablonu (Templater)
2. Wklejasz surowy tekst (np. ze spotkania)
3. Zaznaczasz tekst → Copilot: „Przeformatuj jako protokół spotkania"
4. Efekt: ustrukturyzowana notatka z metadata + AI-przetworzona treść

#### Skróty klawiszowe — automatyzacja codziennej pracy

Ustaw hotkeys w `Settings → Hotkeys`:
- `Alt+M` → Templater: Insert Template → Meeting
- `Alt+D` → Templater: Insert Template → Daily
- `Alt+R` → Templater: Insert Template → Research

Efekt: tworzenie nowej notatki z pełnym frontmatter = jedno naciśnięcie klawisza.

### Przykłady

**Przykład 1: Meeting z klientem — kompletny workflow**
1. `Alt+M` → popup: „Z kim?" → „Maersk, Jan K." → „maritime"
2. Notatkę robi się z pełnym frontmatter, strukturą sekcji
3. Podczas spotkania robisz notatki w sekcji „Notatki"
4. Po spotkaniu: zaznaczasz chaotyczne notatki → Copilot: „Wyciągnij action items i ustrukturyzuj"
5. Rezultat: porządny protokół z tagami, linkami, action items — w 2 minuty po spotkaniu

**Przykład 2: Research na studia**
1. `Alt+R` → „EU AI Act overview" → „ai, prawo" → URL artykułu
2. Kopiujesz kluczowe fragmenty do sekcji „Cytaty"
3. Copilot VaultQA: „Porównaj to z moimi wcześniejszymi notatkami o GDPR"
4. Dodajesz wnioski i linki do powiązanych notatek

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zainstaluj Templater. Stwórz folder `Templates` i stwórz w nim szablon Meeting Note (skopiuj powyższy i dostosuj do swoich potrzeb).

🟢 **Ćwiczenie 2:** Stwórz nową notatkę z szablonu Meeting. Sprawdź, czy popup'y działają i frontmatter jest poprawny.

🟡 **Ćwiczenie 3:** Stwórz szablon Daily Note i Research Note. Ustaw skróty klawiszowe (`Alt+M`, `Alt+D`, `Alt+R`).

🟡 **Ćwiczenie 4:** Użyj workflow Meeting + Copilot: stwórz notatkę z szablonu, wklej przykładowy tekst ze spotkania, użyj Copilot do przeformatowania.

🔴 **Ćwiczenie 5:** Stwórz własny szablon „Project Brief" dla nowego projektu w firmie. Powinien zawierać: frontmatter, opis, cele, kamienie milowe, zasoby, ryzyka. Przetestuj z AI-asystentem.

### Podsumowanie

- Templater zamienia szablony w interaktywne generatory notatek
- Kombinacja Templater + Copilot = struktura (automatyczna) + treść (AI-generowana)
- Kluczowe szablony: Meeting, Daily, Research, Project Brief
- Skróty klawiszowe to game-changer — 1 klik zamiast 5 minut formatowania
- Następny krok: quiz modułowy i mini-projekt

---

## Quiz Modułowy: Moduł 1

### Pytania

**Q1.** Jaka jest główna różnica między Cline a Claude Code?
- A) Cline jest darmowy, Claude Code płatny
- B) Cline to rozszerzenie VS Code (model-agnostic), Claude Code to natywne narzędzie Anthropic
- C) Cline działa tylko z GPT, Claude Code tylko z Claude
- D) Nie ma różnicy — to to samo narzędzie

**Q2.** Dlaczego struktura vault'u wpływa na jakość odpowiedzi AI?
- A) AI czyta tylko pliki z poprawnym YAML frontmatter
- B) AI (embeddings, RAG) opiera się na kontekście — lepsza struktura = lepszy kontekst dla modelu
- C) Obsidian wymaga struktury PARA, żeby pluginy AI działały
- D) Nie wpływa — AI jest wystarczająco inteligentne

**Q3.** Co robi Smart Connections i czym różni się od Copilot?
- A) Smart Connections to chat, Copilot to wyszukiwarka
- B) Smart Connections to pasywne odkrywanie powiązań (embeddings), Copilot to aktywny asystent (chat, edycja, VaultQA)
- C) Smart Connections wymaga API key, Copilot nie
- D) Smart Connections działa tylko online, Copilot offline

**Q4.** Masz notatkę z chaotycznymi notatkami ze spotkania. Który workflow jest najefektywniejszy?
- A) Ręcznie przeformatować notatkę
- B) Wkleić do ChatGPT i skopiować wynik z powrotem
- C) Użyć szablonu Templater (struktura) + Copilot Composer (przetworzenie treści) — bezpośrednio w vault'u
- D) Usunąć i napisać od nowa

**Q5.** Dlaczego przy korzystaniu z Copilot w kontekście firmowym ważne jest myślenie o GDPR?
- A) Copilot automatycznie publikuje notatki w internecie
- B) Dane wysyłane do API chmurowego (OpenAI, Anthropic) opuszczają Twój komputer — to może naruszać politykę firmy ws. danych
- C) GDPR zabrania używania AI w firmach
- D) Copilot sprzedaje dane reklamodawcom

**Q6.** Co to jest MOC (Map of Content) i jak pomaga AI?
- A) Specjalny format pliku dla AI
- B) Notatka-indeks z linkami do powiązanych notatek — pomaga AI budować kontekst i Tobie nawigować
- C) Plugin do Obsidiana
- D) Mapa grafowa generowana automatycznie

**Q7.** Jaki plugin AI działa bez żadnego API key i bez internetu (po indeksowaniu)?
- A) Copilot
- B) Nova
- C) Smart Connections (core)
- D) Żaden — wszystkie wymagają API

**Q8.** Jakie properties (YAML) są najważniejsze dla AI-ready notatki?
- A) Tylko `title`
- B) `tags`, `type`, `related` — dają AI kontekst o kategorii, typie i powiązaniach
- C) `color` i `icon`
- D) Properties nie mają znaczenia dla AI

### Odpowiedzi

1. **B** — Cline to rozszerzenie VS Code, model-agnostic (podłączysz dowolny LLM). Claude Code to natywne narzędzie Anthropic (CLI + VS Code extension).
2. **B** — AI korzysta z RAG (Retrieval Augmented Generation) i embeddingów. Im lepsza struktura, metadata i powiązania — tym trafniejszy kontekst trafia do modelu.
3. **B** — Smart Connections pasywnie pokazuje powiązane notatki (lokalne embeddingi). Copilot to aktywny asystent z chatem, edycją i VaultQA.
4. **C** — Templater daje strukturę automatycznie, Copilot przetwarza treść AI — wszystko w vault'u, bez kopiowania do zewnętrznych narzędzi.
5. **B** — Dane wysyłane do API opuszczają komputer. W firmie z danymi klientów/stawkami to wymaga analizy GDPR i ewentualnie lokalnego modelu.
6. **B** — MOC to notatka-hub z linkami. Pomaga AI rozumieć strukturę wiedzy i Tobie szybko nawigować.
7. **C** — Smart Connections Core działa z wbudowanym lokalnym modelem embeddingów, bez API key i bez internetu po indeksowaniu.
8. **B** — Tags, type i related dają AI kontekst do filtrowania i rozumienia relacji między notatkami.

---

## Mini-Projekt: System notatek z zajęć na PJATK z AI-asystentem

### Brief

Zbudujesz działający system do robienia i przetwarzania notatek z zajęć na studiach PJATK (program „Lider AI Transformacji Cyfrowej"), zintegrowany z AI.

### Wymagania

1. **Struktura vault'u** — folder `10-Projects/PJATK-AI-Lider/` z podfolderami na moduły/przedmioty
2. **Szablon Templater** — „Lecture Note" z automatycznym frontmatter (data, przedmiot, prowadzący, tagi)
3. **MOC** — `MOC-PJATK.md` linkujący do wszystkich notatek z zajęć
4. **Smart Connections** — zainstalowany i działający, potwierdzenie że znajduje powiązania
5. **Copilot** — skonfigurowany, VaultQA odpowiada na pytania o treść notatek

### Kamienie milowe

1. ✅ Struktura folderów utworzona
2. ✅ Szablon „Lecture Note" gotowy i przetestowany
3. ✅ Min. 3 notatki z zajęć (istniejące lub nowe) z pełnym frontmatter
4. ✅ MOC-PJATK.md z linkami do notatek
5. ✅ Smart Connections pokazuje trafne powiązania między notatkami
6. ✅ Copilot VaultQA odpowiada na pytanie „Jakie tematy przerabialiśmy na PJATK?"

### Rubric (samoocena)

- [ ] Vault ma jasną strukturę folderów (nie flat dump)
- [ ] Każda notatka z zajęć ma kompletny YAML frontmatter
- [ ] Min. 10 wiki links między notatkami
- [ ] MOC istnieje i jest aktualny
- [ ] Smart Connections poprawnie indeksuje vault
- [ ] Copilot odpowiada na pytania o treść notatek (VaultQA)
- [ ] Mam skróty klawiszowe do tworzenia nowych notatek z szablonu

---

*Moduł 1 ukończony. Następny: Moduł 2 — Cline, agent kodujący w VS Code.*
-e 

---
---


# Moduł 2: Cline — agent kodujący w VS Code ⭐

**Czas całkowity:** ~3h | **Poziom:** Bazowy → Średniozaawansowany
**Wymagania wstępne:** Moduł 1 ukończony, VS Code zainstalowany, Cline zainstalowany (lub gotowość do instalacji)
**Po tym module:** Będziesz umieć wydawać Cline'owi złożone polecenia, kontrolować jego zachowanie przez .clinerules, i rozszerzać jego możliwości przez MCP.

---

## Lekcja 2.1: Interfejs i pierwszy workflow — panel, approve/reject, kontekst

**Czas:** ~45 min | **Poziom:** Beginner
**Cel:** Zrozumiesz interfejs Cline'a, nauczysz się wydawać polecenia i świadomie zarządzać zatwierdzaniem zmian.

### Kontekst

Cline to nie autocomplete (jak GitHub Copilot inline suggestions). To **autonomiczny agent** — dajesz mu zadanie, a on sam planuje kroki, czyta pliki, edytuje kod, uruchamia komendy w terminalu, a nawet testuje wyniki w przeglądarce. Ale — i to kluczowe — **każdy krok wymaga Twojego zatwierdzenia** (chyba że włączysz auto-accept). To model „human-in-the-loop": AI proponuje, Ty decydujesz.

### Teoria

#### Instalacja i konfiguracja

**Instalacja:**
1. VS Code → Extensions (`Ctrl+Shift+X`) → szukaj „Cline" → Install
2. Po instalacji: ikona Cline pojawi się w panelu bocznym (sidebar)

**Konfiguracja API providera:**

Cline nie ma własnego modelu — musisz podłączyć zewnętrzny LLM. Masz już GitHub Copilot (student account), ale Cline obsługuje wiele providerów:

| Provider | Model | Koszt | Uwagi |
|----------|-------|-------|-------|
| **Anthropic** | Claude Sonnet/Opus | Pay-per-use (~$3-15/M tokenów) | Najlepsza jakość agentowa |
| **OpenRouter** | Wiele modeli | Pay-per-use (różne ceny) | Agregator — dostęp do Claude, GPT, Gemini z jednego API key |
| **OpenAI** | GPT-4o, o3 | Pay-per-use | Dobra alternatywa |
| **Google** | Gemini 2.5 | Darmowy tier dostępny | Budżetowa opcja na start |
| **Ollama** | Llama, Qwen, itp. | Darmowy (lokalne) | 100% offline, wymaga GPU. Jakość niższa niż Claude/GPT. |

**Konfiguracja (np. Anthropic):**
1. Kliknij ikonę Cline w sidebar
2. W panelu: kliknij ikonę ustawień (⚙️) lub „API Configuration"
3. Wybierz provider: `Anthropic`
4. Wklej API key z https://console.anthropic.com
5. Wybierz model: `claude-sonnet-4-20250514` (rekomendowany balans cena/jakość)

#### 🔀 Alternatywy konfiguracji API

| Podejście | Opis | Kiedy wybrać |
|-----------|------|--------------|
| **OpenRouter** | Jeden API key, dostęp do 100+ modeli (Claude, GPT, Gemini, open-source). Porównujesz ceny i jakość. | Jeśli chcesz elastycznie przełączać modele bez zakładania kont u każdego providera. Świetne na start. |
| **Ollama (lokalnie)** | Uruchamiasz model na swoim komputerze. Zero kosztów, pełna prywatność. | Jeśli GDPR jest priorytetem lub nie chcesz płacić. Potrzebujesz GPU (min. 8GB VRAM) dla sensownej jakości. |
| **LM Studio** | GUI do pobierania i uruchamiania lokalnych modeli. Prostsze niż Ollama. | Jeśli chcesz lokalny model bez terminala. Interfejs „plug and play". |
| **AWS Bedrock / Azure OpenAI** | Enterprise API z compliance (SOC 2, HIPAA). | Jeśli firma wymaga enterprise-grade security. Wymaga konfiguracji konta cloud. |

#### Interfejs Cline — anatomia panelu

Po otwarciu panelu Cline (ikona w sidebar) widzisz:

```
┌──────────────────────────────┐
│ 🔧 Model: claude-sonnet-4   │  ← aktualny model + provider
│ 💰 Cost: $0.00              │  ← koszt bieżącego zadania
├──────────────────────────────┤
│                              │
│  [Historia konwersacji]      │  ← co Cline zrobił/zaproponował
│                              │
│  ┌────────────────────┐      │
│  │ Cline wants to:    │      │
│  │ Edit file: app.py  │      │  ← propozycja zmiany
│  │ [Diff preview]     │      │
│  │                    │      │
│  │ [✅ Accept] [❌ Reject] │  ← Twoja decyzja
│  └────────────────────┘      │
├──────────────────────────────┤
│ 💬 Wpisz polecenie...        │  ← input
│ [@file] [📎 image]          │  ← kontekst
└──────────────────────────────┘
```

**Kluczowe elementy:**

1. **Approve / Reject** — przy KAŻDEJ akcji (edycja pliku, komenda terminala) Cline pyta o zgodę. Widzisz diff przed zatwierdzeniem.
2. **Cost tracker** — na bieżąco widzisz koszt tokenów (ważne przy API pay-per-use!)
3. **Context mentions** — `@file`, `@folder`, `@url`, `@problems` — dodajesz kontekst do promptu
4. **Timeline** — historia kroków z możliwością cofnięcia (revert)

#### Pierwszy workflow — krok po kroku

**Zadanie testowe:** „Stwórz skrypt Python, który czyta plik CSV i wypisuje podsumowanie."

1. Otwórz folder projektu w VS Code
2. Otwórz panel Cline
3. Wpisz: `Stwórz skrypt Python read_csv.py, który wczytuje plik data.csv i wypisuje: liczbę wierszy, nazwy kolumn i 5 pierwszych rekordów.`
4. Cline zaplanuje kroki:
   - ✏️ Create file: `read_csv.py` → **[Accept]**
   - 🖥️ Run command: `pip install pandas` → **[Accept]**
   - 🖥️ Run command: `python read_csv.py` → **[Accept]**
5. Sprawdź wynik. Jeśli coś nie działa — opisz problem w chacie, Cline poprawi.

**Wskazówki do wydawania poleceń:**

- **Bądź konkretny:** ❌ „Zrób mi coś z danymi" → ✅ „Stwórz skrypt Python, który czyta sales.csv i generuje wykres słupkowy sprzedaży per miesiąc"
- **Dawaj kontekst:** Użyj `@file` żeby wskazać plik, który Cline powinien przeczytać przed pracą
- **Rozbijaj na kroki:** Zamiast „Zbuduj aplikację webową" → „Najpierw stwórz strukturę projektu Flask z routingiem"
- **Określ ograniczenia:** „Nie modyfikuj pliku config.py" / „Użyj biblioteki openpyxl, nie pandas"

#### Zarządzanie kosztami

Cline pokazuje koszt na bieżąco. Kilka porad:

- **Sonnet** (~$3/M input, $15/M output) to najlepszy balans cena/jakość dla codziennej pracy
- **Haiku** (~$0.25/M) — tańszy, dobry do prostych zadań
- **Ustaw limit:** W ustawieniach Cline możesz ustawić max koszt per task
- **Śledź na OpenRouter:** Dashboard pokazuje wydatki per model

### Przykłady

**Przykład 1: Prosta automatyzacja logistyczna**
```
Prompt: "Stwórz skrypt Python, który czyta plik Excel stawki_q2.xlsx 
z kolumnami: trasa, carrier, cena_20ft, cena_40ft. 
Skrypt powinien znaleźć najtańszego przewoźnika dla każdej trasy 
i zapisać wynik do cheapest_rates.csv"
```
Cline: stworzy plik, zainstaluje openpyxl, uruchomi, pokaże wynik.

**Przykład 2: Debugging z kontekstem**
```
Prompt: "@app.py Ten skrypt rzuca błąd KeyError na linii 45. 
@errors.log Oto log z błędem. Znajdź przyczynę i napraw."
```
Cline: przeczyta oba pliki, zdiagnozuje problem, zaproponuje fix z diffem.

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zainstaluj Cline i skonfiguruj API provider (Anthropic, OpenRouter lub inny). Upewnij się, że koszt trackera działa.

🟢 **Ćwiczenie 2:** Wydaj Cline'owi proste polecenie: „Stwórz plik hello.py, który wypisuje 'Hello from Cline!' i uruchom go." Przejdź cały cykl: approve create → approve run → sprawdź output.

🟡 **Ćwiczenie 3:** Użyj `@file` do wskazania istniejącego pliku i poproś Cline'a o refaktoryzację: „@app.py Dodaj docstringi do wszystkich funkcji i popraw nazwy zmiennych na opisowe."

🟡 **Ćwiczenie 4:** Poproś Cline'a o zadanie wielokrokowe: „Stwórz projekt Python z: requirements.txt, main.py (CLI do konwersji walut), i README.md z opisem. Potem uruchom i przetestuj."

🔴 **Ćwiczenie 5:** Celowo odrzuć (Reject) jedną z propozycji Cline'a i napisz feedback: „Nie chcę pandas — użyj natywnego csv module." Obserwuj, jak Cline adaptuje się do Twojego feedbacku.

### Podsumowanie

- Cline = autonomiczny agent w VS Code, nie autocomplete
- Model human-in-the-loop: AI proponuje, Ty zatwierdzasz każdą zmianę
- Kontekst (`@file`, `@folder`, `@url`) drastycznie poprawia jakość wyników
- Koszt trackera to Twój najlepszy przyjaciel — śledź wydatki
- Konkretne, ustrukturyzowane prompty = lepsza praca agenta

---

## Lekcja 2.2: .clinerules i zarządzanie kontekstem projektu

**Czas:** ~45 min | **Poziom:** Intermediate
**Cel:** Nauczysz się kontrolować zachowanie Cline'a przez pliki reguł — projekt-specific, globalne i warunkowe. Zbudujesz zestaw reguł dla projektu logistycznego.

### Kontekst

Wyobraź sobie, że mówisz nowemu pracownikowi: „Zawsze pisz komentarze po polsku, nie ruszaj plików konfiguracyjnych, i testuj każdą zmianę przed commitowaniem." Nie będziesz tego powtarzać przy każdym zadaniu — napiszesz to raz w onboardingu. Właśnie tym jest `.clinerules` — trwałe instrukcje, które Cline czyta przy każdym zadaniu.

### Teoria

#### Anatomia .clinerules

`.clinerules` to folder w katalogu głównym projektu z plikami Markdown (.md). Każdy plik = zestaw instrukcji.

```
your-project/
├── .clinerules/           ← folder z regułami
│   ├── coding.md          ← standardy kodowania
│   ├── security.md        ← reguły bezpieczeństwa
│   ├── project-context.md ← kontekst projektu
│   └── testing.md         ← wymagania testowania
├── src/
└── ...
```

**Jak to działa technicznie:** Treść aktywnych plików `.clinerules` jest dołączana do system prompt Cline'a. To oznacza, że:
- Reguły wpływają na KAŻDĄ interakcję (nie tylko tę, w której je stworzyłeś)
- Zajmują tokeny z context window — trzymaj je zwięzłe (<1000 tokenów per plik)
- Aktualizacje wchodzą przy następnym zadaniu (nie w trakcie bieżącego)

#### Dwa poziomy reguł

| Poziom | Lokalizacja | Zakres | Użycie |
|--------|-------------|--------|--------|
| **Workspace** | `.clinerules/` w katalogu projektu | Tylko ten projekt | Standardy zespołu, kontekst projektu, ograniczenia |
| **Global** | Folder Cline Rules w systemie | Wszystkie projekty | Twoje osobiste preferencje, styl, język |

#### Reguły warunkowe (conditional rules)

Od Cline v3.13 możesz dodać YAML frontmatter, żeby reguła aktywowała się tylko dla określonych plików:

```yaml
---
paths:
  - "src/api/**"
  - "src/services/**"
---
# Backend Guidelines
- Używaj dependency injection
- Wszystkie zapytania DB przez repository pattern
- Loguj błędy, nie rzucaj wyjątków
```

Ta reguła aktywuje się TYLKO gdy pracujesz z plikami w `src/api/` lub `src/services/`. Zero marnowania tokenów na frontend rules przy pracy backend.

#### Toggleable rules (UI)

W Cline v3.13+ masz popover pod polem input, który pokazuje wszystkie reguły (global + workspace) z przełącznikami on/off. Nie musisz ręcznie przenosić plików — klikasz toggle.

#### Reguły vs Workflows vs Skills

Ważne rozróżnienie — Cline ma trzy mechanizmy instrukcji:

| Mechanizm | Kiedy się aktywuje | Koszt tokenów | Użycie |
|-----------|-------------------|---------------|--------|
| **Rules (.clinerules)** | Zawsze (system prompt) | Stały, każda wiadomość | Standardy, ograniczenia, kontekst |
| **Workflows** | Na żądanie (slash command) | Tylko gdy wywołasz | Wielokrokowe procesy (np. `/deploy`, `/pr-review`) |
| **Skills** | Na żądanie | Tylko gdy wywołasz | Reużywalne umiejętności |

Zasada: jeśli coś powinno działać ZAWSZE → rule. Jeśli to sekwencja kroków na żądanie → workflow.

#### 🔀 Alternatywy dla .clinerules

| Mechanizm | Narzędzie | Opis |
|-----------|-----------|------|
| **CLAUDE.md** | Claude Code | Odpowiednik .clinerules w Claude Code. Markdown w katalogu projektu, czytany automatycznie. Podobna filozofia, ale specyficzny dla Claude Code. |
| **.cursorrules** | Cursor IDE | Reguły projektowe w Cursor. Analogiczna koncepcja, inny format. |
| **.github/copilot-instructions.md** | GitHub Copilot | Instrukcje dla Copilot w kontekście repo. Mniej zaawansowane niż .clinerules. |
| **System prompt (custom)** | Dowolny agent | Ręczne ustawianie system prompt w ustawieniach narzędzia. Mniej wygodne, ale uniwersalne. |
| **.continuerules** | Continue.dev | Reguły dla Continue. Analogiczne do .clinerules. |

### Przykłady reguł

**Przykład 1: Kontekst projektu logistycznego**

`.clinerules/project-context.md`:
```markdown
# Kontekst projektu: System Freight Forwarding

## O projekcie
Budujemy narzędzia automatyzujące pracę spedycji morskiej (~70 pracowników, Warszawa).
Stack: Python, openpyxl, pandas, Make.com (webhooks).

## Terminologia
- TEU = Twenty-foot Equivalent Unit (jednostka kontenera)
- FCL = Full Container Load
- LCL = Less than Container Load  
- BAF = Bunker Adjustment Factor (dopłata paliwowa)
- THC = Terminal Handling Charges
- B/L = Bill of Lading (konosament)

## Ograniczenia
- NIGDY nie hardcoduj stawek ani danych klientów w kodzie
- Dane wrażliwe (stawki, nazwy klientów) trzymaj w plikach .env lub w Obsidian vault
- Komentarze w kodzie PO POLSKU
- Nazwy zmiennych i funkcji PO ANGIELSKU
- Logi i komunikaty błędów PO POLSKU
```

**Przykład 2: Standardy kodowania**

`.clinerules/coding.md`:
```markdown
# Standardy kodowania

## Python
- Python 3.11+
- Type hints dla parametrów i return values
- Docstringi w formacie Google style
- Używaj pathlib zamiast os.path
- Formatuj z black, lintuj z ruff

## Ogólne
- Przed każdą zmianą: wyjaśnij CO i DLACZEGO
- Po każdej zmianie: uruchom testy (jeśli istnieją)
- Commituj z formatem: type(scope): description
- Nie modyfikuj plików w folderze /config bez pytania
```

**Przykład 3: Self-improving rule**

`.clinerules/self-improve.md`:
```markdown
# Self-Improving Cline

Przed zakończeniem każdego zadania, które wymagało wielu kroków 
lub otrzymało feedback korygujący:

1. Zaproponuj ulepszenie istniejących .clinerules na podstawie 
   tego, czego się nauczyłeś w tym zadaniu
2. Poczekaj na moją akceptację przed zmianą reguł
3. Nigdy nie zmieniaj reguł bez pytania
```

### Ćwiczenia

🟢 **Ćwiczenie 1:** Stwórz folder `.clinerules/` w jednym ze swoich projektów. Dodaj plik `basics.md` z 3 regułami: język komentarzy, format commit messages, i jedna zakazana akcja (np. „nie modyfikuj README").

🟢 **Ćwiczenie 2:** Przetestuj regułę — wydaj Cline'owi polecenie, które narusza jedną z reguł (np. „edytuj README"). Czy Cline respektuje ograniczenie?

🟡 **Ćwiczenie 3:** Stwórz `project-context.md` dla Twojego projektu logistycznego (lub studyjnego). Uwzględnij: opis projektu, terminologię domenową, ograniczenia techniczne.

🟡 **Ćwiczenie 4:** Stwórz regułę warunkową (conditional) — np. reguła testowania aktywna tylko dla plików `*_test.py`. Przetestuj, czy aktywuje się poprawnie.

🔴 **Ćwiczenie 5:** Dodaj regułę `self-improve.md`. Wykonaj złożone zadanie, a na koniec oceń, czy Cline zaproponował sensowne ulepszenia reguł.

### Podsumowanie

- `.clinerules` to trwałe instrukcje dołączane do system prompt — wpływają na KAŻDE zadanie
- Dwa poziomy: workspace (projektowe) i global (osobiste)
- Reguły warunkowe (YAML frontmatter) oszczędzają tokeny — aktywują się tylko dla matching plików
- Rules = zawsze aktywne; Workflows = na żądanie; Skills = reużywalne umiejętności
- Trzymaj reguły zwięzłe (<1000 tokenów) — każdy token kosztuje
- Self-improving rules pozwalają Cline'owi uczyć się Twoich preferencji

---

## Lekcja 2.3: MCP w Cline — rozszerzanie możliwości agenta

**Czas:** ~45 min | **Poziom:** Intermediate
**Cel:** Zrozumiesz, czym jest MCP (Model Context Protocol), zainstalujesz serwer MCP w Cline i zobaczysz, jak agent zyskuje nowe umiejętności — np. dostęp do systemu plików, bazy danych czy API.

### Kontekst

Bez MCP, Cline potrafi: edytować pliki, uruchamiać komendy, przeglądać strony. Ale co, jeśli chcesz, żeby Cline mógł przeszukać Twój vault Obsidiana? Albo odpytać bazę danych? Albo pobrać dane z API logistycznego? Tu wchodzi **MCP — Model Context Protocol**.

MCP to otwarty standard stworzony przez Anthropic (listopad 2024), który standaryzuje komunikację między agentami AI a zewnętrznymi narzędziami. Pomyśl o nim jak o **USB-C dla AI** — jeden standard, wiele urządzeń.

### Teoria

#### MCP — architektura w 60 sekund

```
┌────────────┐     ┌────────────┐     ┌──────────────┐
│   CLINE    │────►│ MCP CLIENT │────►│  MCP SERVER   │
│ (VS Code)  │     │ (w Cline)  │     │ (narzędzie)   │
│            │◄────│            │◄────│               │
└────────────┘     └────────────┘     └───────┬──────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │   DANE / USŁUGI    │
                                    │ • Pliki (Obsidian) │
                                    │ • Baza danych      │
                                    │ • API (REST/GraphQL)│
                                    │ • Git, Jira, Slack │
                                    └───────────────────┘
```

**Trzy komponenty MCP:**

1. **Host** — aplikacja AI (Cline, Claude Desktop, Cursor)
2. **Client** — warstwa w hoście zarządzająca połączeniem (wbudowana w Cline)
3. **Server** — serwis udostępniający tools, resources i prompts

**Co MCP Server może udostępniać:**

| Typ | Opis | Przykład |
|-----|------|---------|
| **Tools** | Funkcje do wykonania (akcje) | `search_notes`, `create_task`, `query_db` |
| **Resources** | Dane do odczytu | Pliki, wyniki zapytań, konfiguracje |
| **Prompts** | Szablony promptów | Gotowe instrukcje do typowych zadań |

#### Instalacja MCP Server w Cline

**Metoda 1: MCP Marketplace (najłatwiejsza)**
1. Panel Cline → ikona MCP (lub `Manage MCP Servers`)
2. Przeglądaj marketplace → wybierz serwer → „Install"
3. Cline automatycznie sklonuje repo, skonfiguruje i uruchomi server

**Metoda 2: Ręczna konfiguracja**
1. Panel Cline → `Manage MCP Servers` → ikona ustawień
2. Otwiera się `cline_mcp_settings.json`
3. Dodaj konfigurację:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/your/obsidian/vault"
      ]
    }
  }
}
```

**Metoda 3: „Cline, zrób to sam"**
Wpisz w Cline: `„Stwórz MCP server, który przeszukuje pliki Markdown w moim folderze ~/Documents/Obsidian/MyVault"`
Cline potrafi sam stworzyć, zainstalować i skonfigurować MCP server!

#### Przydatne MCP Servers

| Server | Co robi | Zastosowanie w Twoim workflow |
|--------|---------|-------------------------------|
| **Filesystem** | Czyta/pisze pliki w określonych folderach | Dostęp do vault'u Obsidiana |
| **Git** | Operacje Git (diff, log, commit) | Zarządzanie repozytorium z AI |
| **Memory** | Persistent knowledge graph | Agent pamięta kontekst między sesjami |
| **Sequential Thinking** | Refleksyjne rozwiązywanie problemów | Lepsze planowanie złożonych zadań |
| **Fetch** | Pobieranie stron web | Scraping dokumentacji, researching |
| **Brave Search** | Wyszukiwanie web | Agent szuka aktualnych informacji |
| **SQLite** | Zapytania do bazy SQLite | Analiza danych lokalnych |

#### 🔀 Alternatywy i źródła MCP Servers

| Źródło | Opis | Link |
|--------|------|------|
| **MCP Marketplace (Cline)** | Wbudowany w Cline marketplace z one-click install. Kuratorowany zbiór. | Dostępny w panelu Cline |
| **GitHub MCP Servers repo** | Oficjalne referencyjne serwery od Anthropic + lista community servers. | github.com/modelcontextprotocol/servers |
| **Smithery** | Katalog MCP servers z wyszukiwarką. Instalacja przez CLI. | smithery.ai |
| **Glama** | Kolejny katalog z ocenami i opisami serwerów. | glama.ai/mcp/servers |
| **MCP.so** | Community directory z kategoryzacją. | mcp.so |
| **npm / PyPI** | Wiele serwerów dostępnych jako pakiety npm (`@modelcontextprotocol/server-*`) lub pip. | npmjs.com / pypi.org |

#### MCP + Obsidian — kluczowa integracja

Dla Twojego workflow to najważniejszy use case. MCP Filesystem server daje Cline'owi dostęp do Twojego vault'u Obsidiana:

```json
{
  "mcpServers": {
    "obsidian-vault": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/Karol/Documents/Obsidian/MojVault"
      ]
    }
  }
}
```

Teraz Cline może:
- Czytać Twoje notatki z Obsidiana jako kontekst
- Tworzyć nowe notatki z wynikami pracy
- Przeszukiwać vault semantycznie (z dodatkowym serwerem search)

**Uwaga bezpieczeństwa:** MCP Filesystem server daje agentowi dostęp do plików. Wskaż konkretny folder (vault), nie cały dysk. Rozważ tryb read-only jeśli nie chcesz, żeby agent modyfikował notatki.

#### Tworzenie własnego MCP Server

Cline sam potrafi stworzyć MCP server! Wystarczy opisać, co chcesz:

```
Prompt: "Stwórz MCP server w Python (FastMCP), który:
1. Ma tool 'search_rates' — szuka stawek w pliku rates.csv 
   po trasie i przewoźniku
2. Ma tool 'add_rate' — dodaje nową stawkę do pliku
3. Ma resource 'rate_summary' — zwraca podsumowanie wszystkich stawek

Zainstaluj go w moim Cline."
```

Cline stworzy serwer, doda konfigurację do `cline_mcp_settings.json` i przetestuje.

### Przykłady

**Przykład 1: Agent z dostępem do vault'u**
```
1. Instalujesz MCP Filesystem → vault Obsidiana
2. Prompt: "Przeczytaj moje notatki o stawkach Maersk z Q1 2026 
   i porównaj z obecnymi stawkami CMA CGM. 
   Zapisz porównanie jako nową notatkę w 20-Areas/Maritime-Freight/"
3. Cline: czyta notatki → analizuje → tworzy nowy plik .md z porównaniem
```

**Przykład 2: Agent z dostępem do bazy danych**
```
1. Instalujesz MCP SQLite → baza z historią zapytań ofertowych
2. Prompt: "Pokaż mi top 10 tras pod względem liczby zapytań 
   w ostatnim kwartale. Wizualizuj jako wykres."
3. Cline: query do SQLite → generuje skrypt matplotlib → uruchamia
```

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zainstaluj MCP Filesystem server z Cline MCP Marketplace (lub ręcznie). Wskaż folder testowy (nie od razu cały vault). Sprawdź, czy Cline widzi pliki.

🟢 **Ćwiczenie 2:** Poproś Cline'a: „Wylistuj wszystkie pliki .md w folderze [testowy] i wypisz ich tytuły." Potwierdź, że MCP działa.

🟡 **Ćwiczenie 3:** Zainstaluj drugi MCP server (np. Git lub Memory). Użyj go w praktyce — np. „Pokaż ostatnie 5 commitów w tym repo."

🟡 **Ćwiczenie 4:** Poproś Cline'a o stworzenie prostego custom MCP server: „Stwórz MCP server, który jako tool ma `generate_meeting_id` — generuje unikalny ID spotkania w formacie MTG-YYYY-MM-DD-NNN."

🔴 **Ćwiczenie 5:** Podłącz MCP Filesystem do swojego vault'u Obsidiana. Poproś Cline'a: „Przeczytaj moje notatki z folderu [Projects] i stwórz podsumowanie statusu wszystkich aktywnych projektów jako nową notatkę."

### Podsumowanie

- MCP = otwarty standard komunikacji agentów AI z zewnętrznymi narzędziami
- Cline obsługuje MCP natywnie — marketplace, ręczna konfiguracja, lub „Cline, zrób to sam"
- Filesystem MCP + vault Obsidiana = agent, który czyta Twoje notatki
- MCP Servers istnieją na: Cline Marketplace, GitHub, Smithery, Glama, npm
- Cline potrafi sam tworzyć custom MCP servers
- Bezpieczeństwo: wskazuj konkretne foldery, nie cały dysk

---

## Quiz Modułowy: Moduł 2

### Pytania

**Q1.** Co wyróżnia Cline na tle GitHub Copilot inline suggestions?
- A) Cline jest darmowy
- B) Cline to autonomiczny agent (planuje, edytuje, uruchamia), Copilot to głównie autocomplete
- C) Cline działa tylko z Claude, Copilot z GPT
- D) Nie ma różnicy

**Q2.** Masz projekt logistyczny z terminologią domenową (TEU, FCL, BAF). Jak najlepiej nauczyć Cline'a tej terminologii?
- A) Powtarzać definicje w każdym prompcie
- B) Stworzyć plik `.clinerules/project-context.md` z terminologią — Cline będzie ją znał przy każdym zadaniu
- C) Zmienić nazwy plików na zawierające terminy
- D) Nie da się — Cline nie rozumie terminologii branżowej

**Q3.** Czym różnią się .clinerules (rules) od workflows w Cline?
- A) Niczym — to synonimy
- B) Rules są zawsze aktywne (system prompt), workflows aktywują się na żądanie (slash command) — workflows oszczędzają tokeny
- C) Rules działają tylko globalnie, workflows tylko per projekt
- D) Rules są płatne, workflows darmowe

**Q4.** Chcesz, żeby Cline miał dostęp do Twojego vault'u Obsidiana. Co zrobisz?
- A) Skopiujesz wszystkie notatki do VS Code
- B) Zainstalujesz MCP Filesystem server wskazujący na folder vault'u
- C) Wyeksportujesz vault do PDF i wkleisz w prompt
- D) To niemożliwe

**Q5.** Jaki jest najważniejszy powód, żeby trzymać .clinerules zwięzłe (<1000 tokenów per plik)?
- A) VS Code nie obsługuje dłuższych plików
- B) Każdy token rules zajmuje context window — za długie reguły = mniej miejsca na Twój kod i konwersację
- C) Cline ignoruje reguły dłuższe niż 1000 tokenów
- D) Estetyka kodu

**Q6.** Cline chce zmodyfikować plik `config.py`, ale Twoja reguła mówi „nie modyfikuj plików konfiguracyjnych". Co powinno się stać?
- A) Cline zignoruje regułę
- B) Cline powinien odmówić lub zapytać o potwierdzenie — reguły wpływają na zachowanie agenta
- C) VS Code zablokuje edycję
- D) Plik zostanie zmodyfikowany, ale reguła doda komentarz

**Q7.** Czym jest MCP (Model Context Protocol)?
- A) Protokół szyfrowania danych w AI
- B) Otwarty standard komunikacji agentów AI z zewnętrznymi narzędziami i źródłami danych — „USB-C dla AI"
- C) Wewnętrzny format plików Cline
- D) Nazwa modelu AI

**Q8.** Chcesz, żeby reguła testowania aktywowała się TYLKO przy plikach `*_test.py`. Jak to zrobisz?
- A) Napiszesz to w treści reguły
- B) Dodasz YAML frontmatter z `paths: ["**/*_test.py"]` na górze pliku reguły — Cline aktywuje ją warunkowo
- C) Stworzysz osobny folder `.clinerules-test/`
- D) Użyjesz MCP

### Odpowiedzi

1. **B** — Cline to autonomiczny agent: sam planuje kroki, tworzy pliki, uruchamia komendy. Copilot to głównie inline autocomplete z elementami agent mode.
2. **B** — `.clinerules/project-context.md` z terminologią to jednorazowa konfiguracja. Cline czyta go przy każdym zadaniu — nie trzeba powtarzać.
3. **B** — Rules (always-on, system prompt) vs Workflows (on-demand, slash command). Workflow oszczędza tokeny, bo ładuje się tylko gdy go wywołasz.
4. **B** — MCP Filesystem server daje Cline'owi dostęp do plików w określonym folderze. Wskazujesz vault, Cline czyta notatki.
5. **B** — Reguły są częścią system prompt. Im dłuższe, tym mniej context window zostaje na Twój kod i konwersację.
6. **B** — Reguły wpływają na zachowanie agenta. Cline powinien respektować ograniczenie lub explicite zapytać o override.
7. **B** — MCP to otwarty standard Anthropic — standaryzuje komunikację AI ↔ narzędzia/dane.
8. **B** — YAML frontmatter z `paths` to mechanizm conditional rules w Cline — reguła aktywuje się tylko dla matching plików.

---

## Mini-Projekt: Automatyzacja zadania z pracy za pomocą Cline

### Brief

Zbudujesz automatyzację realnego zadania z Twojej pracy w spedycji morskiej, używając Cline'a z odpowiednimi .clinerules i opcjonalnie MCP.

### Wymagania

1. **Zdefiniuj zadanie** — wybierz jedno powtarzalne zadanie z pracy (np. porównanie stawek, generowanie raportu, parsowanie emaili)
2. **.clinerules** — stwórz min. 2 pliki reguł: `project-context.md` (terminologia, ograniczenia) + `coding.md` (standardy)
3. **Skrypt/narzędzie** — Cline stworzy działający skrypt/narzędzie rozwiązujący zadanie
4. **Dokumentacja** — README.md wygenerowany przez Cline z opisem, jak użyć narzędzia
5. **(Bonus) MCP** — podłącz MCP server do vault'u Obsidiana i użyj notatek jako kontekstu

### Kamienie milowe

1. ✅ Zdefiniowane zadanie do automatyzacji (1 zdanie)
2. ✅ Folder `.clinerules/` z min. 2 plikami reguł
3. ✅ Cline stworzył działający skrypt (przeszedł cykl approve → test → fix)
4. ✅ README.md wygenerowany przez Cline
5. ✅ Skrypt uruchomiony i przetestowany z realnymi (lub testowymi) danymi
6. ✅ (Bonus) MCP Filesystem podłączony do vault'u

### Przykładowe zadania do wyboru

- Porównanie stawek z dwóch plików Excel → raport CSV z najtańszym przewoźnikiem per trasa
- Parser emaili z zapytaniami ofertowymi → ustrukturyzowany JSON/CSV
- Generator notatki do Obsidiana z wynikami analizy stawek
- Skrypt sprawdzający dostępność trasy (mock API) i zapisujący wynik

### Rubric (samoocena)

- [ ] .clinerules zawierają kontekst domenowy (terminologia logistyczna)
- [ ] Cline respektował reguły podczas tworzenia skryptu
- [ ] Skrypt działa na testowych danych
- [ ] README jest czytelne i kompletne
- [ ] Użyłem approve/reject świadomie (nie klikałem „Accept" na oślep)
- [ ] Śledzę koszt (ile kosztowało to zadanie w tokenach?)
- [ ] (Bonus) MCP dostarczył kontekst z vault'u Obsidiana

---

*Moduł 2 ukończony. Następny: Moduł 3 — Claude Code, terminal i VS Code Extension.*
-e 

---
---


# Moduł 3: Claude Code — terminal i VS Code Extension

**Czas całkowity:** ~3h | **Poziom:** Bazowy → Średniozaawansowany
**Wymagania wstępne:** Moduł 1 i 2 ukończone, konto Anthropic (Pro/Max) lub API key
**Po tym module:** Będziesz umieć używać Claude Code z terminala (CLI) i VS Code Extension. Skonfigurujesz CLAUDE.md, auto memory i hooks.

---

## Lekcja 3.1: CLI — instalacja, REPL, podstawowe komendy

**Czas:** ~45 min | **Poziom:** Beginner
**Cel:** Zainstalujesz Claude Code CLI, zrozumiesz REPL i wykonasz pierwsze zadania z terminala.

### Kontekst

Claude Code to agent Anthropic żyjący w terminalu. Dlaczego terminal? Maksymalna kontrola: context rewind, subagenty, hooks, piping, skrypty. Pamiętaj: Claude Code Extension w VS Code **zawiera** CLI — instalując jedno, dostajesz oba.

### Teoria

#### Instalacja

**Wymagania:** Node.js 18+ (`node --version`)

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

**Plany i koszty:**

| Plan | Koszt | Kiedy wybrać |
|------|-------|--------------|
| **Claude Pro** | $20/mies. | Na start, nauka |
| **Claude Max** | $100/mies. | Codzienna praca |
| **Claude Max 200** | $200/mies. | Intensywne kodowanie |
| **API pay-as-you-go** | Per token | Precyzyjna kontrola kosztów, CI/CD |

#### 🔀 Alternatywne metody uwierzytelnienia

| Metoda | Opis | Kiedy wybrać |
|--------|------|--------------|
| **Konto Anthropic (OAuth)** | Logowanie przez przeglądarkę. Najprostsze. | Osobiste użycie, nauka. |
| **API Key** | Klucz z console.anthropic.com. | Skrypty, CI/CD, kontrola budżetu. |
| **Amazon Bedrock** | Claude przez AWS. Enterprise compliance (SOC 2, HIPAA). | Firma wymaga AWS + compliance. |
| **Google Vertex AI** | Claude przez GCP. | Firma na Google Cloud. |
| **OpenRouter proxy** | Jeden key, routing do Claude + inne modele. | Elastyczność multi-model. |

#### REPL — interaktywna sesja

```bash
cd ~/projects/my-logistics-app
claude
```

Claude automatycznie: rozpoznaje projekt, ładuje CLAUDE.md, ładuje auto memory.

**Kluczowe komendy:**

| Komenda | Co robi |
|---------|---------|
| `/help` | Lista komend |
| `/init` | Auto-generuje CLAUDE.md z analizy codebase |
| `/memory` | Zarządzanie pamięcią (view/edit) |
| `/compact` | Kompresuje kontekst (oszczędza tokeny) |
| `/clear` | Czyści kontekst (nowe zadanie) |
| `/cost` | Koszt bieżącej sesji |
| `/model` | Zmiana modelu (Sonnet, Opus, Haiku) |
| `Esc × 2` | **Context rewind** — cofa konwersację + zmiany w kodzie |
| `#` | Quick memory — np. `# zawsze używaj type hints` |

#### Jednorazowe polecenia i pipe'y

```bash
claude "wyjaśnij co robi main.py"
cat error.log | claude "zdiagnozuj ten błąd"
git diff HEAD~3 | claude "podsumuj i zaproponuj commit message"
claude --model opus "zrefaktoryzuj auth module"
```

#### Tryby pracy

| Tryb | Opis | Kiedy |
|------|------|-------|
| **Normal** | Pyta o zgodę przy każdej akcji | Domyślny, bezpieczny |
| **Plan mode** | Opisuje plan, czeka na akceptację | Złożone zadania |
| **Auto-accept** | Wykonuje bez pytania | Zaufane, powtarzalne zadania. Ostrożnie! |

### Przykłady

**Przykład 1: Szybka analiza**
```bash
cd ~/projects/freight-tools
claude "przejrzyj rates_parser.py i zaproponuj 3 ulepszenia"
```

**Przykład 2: Pipe z gitem**
```bash
git diff HEAD~3 | claude "podsumuj zmiany, zaproponuj commit message"
```

**Przykład 3: Context rewind**
1. Prosisz o refaktoryzację → wynik nie odpowiada
2. `Esc × 2` — wracasz do momentu przed zmianami
3. Piszesz lepszy prompt → Claude próbuje inaczej, bez utraty historii

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zainstaluj CLI, uruchom `claude --version`, zaloguj się.

🟢 **Ćwiczenie 2:** W katalogu projektu: `claude` → „Opisz strukturę tego projektu."

🟡 **Ćwiczenie 3:** Pipe: `cat [plik] | claude "wyjaśnij ten kod"` — przetestuj z 2-3 plikami.

🟡 **Ćwiczenie 4:** Przetestuj `/cost`, `/model`, `/compact` w sesji REPL.

🔴 **Ćwiczenie 5:** Context rewind: poproś o rozwiązanie, cofnij (`Esc×2`), poproś inaczej. Porównaj.

### Podsumowanie

- CLI = agent terminalowy z REPL, pipe'ami, context rewind
- `Esc × 2` to supermoc — cofa konwersację + zmiany w kodzie
- Trzy tryby: normal (bezpieczny), plan (review), auto-accept (ostrożnie)
- Quick memory (`#`) uczy Claude'a w locie
- CLI to fundament — Extension jest GUI nakładką

---

## Lekcja 3.2: VS Code Extension — Plan mode, @-mentions, inline diffs

**Czas:** ~45 min | **Poziom:** Intermediate
**Cel:** Opanujesz graficzny interfejs Claude Code w VS Code.

### Kontekst

CLI = „manualna skrzynia biegów". Extension = „automat z nawigacją". Ten sam silnik, wygodniejszy interfejs. Rekomendowany przez Anthropic jako domyślny w VS Code.

### Teoria

#### Instalacja

VS Code → Extensions (`Ctrl+Shift+X`) → „Claude Code" (wydawca: **Anthropic**) → Install → Restart.

**Uwaga:** Nie pomyl z community extension Daniela Liedke (72K+ instalacji) — to inny produkt.

#### 🔀 Claude Code Extension vs Cline — porównanie

| Cecha | Claude Code Extension | Cline |
|-------|----------------------|-------|
| **Producent** | Anthropic (oficjalne) | Cline Bot Inc. (open-source) |
| **Model** | Tylko Claude | Dowolny LLM (Claude, GPT, Gemini, Ollama...) |
| **Memory** | CLAUDE.md + auto memory (cross-session) | .clinerules (per sesja) |
| **Context rewind** | Tak (Esc×2 w terminalu) | Timeline z revert |
| **Subagenty** | Tak (parallel agents) | Nie |
| **Hooks** | Tak (17 event types) | Nie |
| **MCP** | Natywne (`claude mcp add`) | Marketplace + ręczne |
| **Open-source** | Nie | Tak (Apache 2.0) |
| **Browser automation** | Nie (natywnie) | Tak |

**Rekomendacja:** Używaj obu — Extension do memory/hooks/subagentów, Cline do szybkich zadań i innych modeli.

#### Interfejs

- **Spark icon (✱)** — Editor Toolbar, Activity Bar, Status Bar
- **Inline diffs** — zmiany side-by-side w edytorze
- **@-mentions**: `@plik.py`, `@folder/`, `@plik.py#5-20` (konkretne linie)
- **Wiele kart** — równoległe sesje

#### Plan mode

1. Przełącz na Plan mode (wskaźnik na dole prompt box)
2. Opisz zadanie
3. Claude generuje plan jako **pełny markdown** w nowej karcie
4. Dodaj **inline komentarze** (jak code review!)
5. Claude aktualizuje → akceptujesz → wykonuje

#### Skróty

| Skrót | Akcja |
|-------|-------|
| `Alt+K` / `Opt+K` | Wstaw @-mention zaznaczonego tekstu |
| `/` w prompt box | Menu komend (model, thinking, usage) |

#### Remote Control

`/remote-control` → URL → steruj z telefonu. Przydatne gdy zostawiasz Claude'a pracującego.

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zainstaluj Extension, otwórz panel (Spark), wyślij polecenie.

🟢 **Ćwiczenie 2:** @-mention: zaznacz kod → `Alt+K` → poproś o wyjaśnienie.

🟡 **Ćwiczenie 3:** Plan mode: zadanie 3+ kroków, przejrzyj plan, dodaj komentarz.

🟡 **Ćwiczenie 4:** Dwie sesje w kartach — implementacja + testy równolegle.

🔴 **Ćwiczenie 5:** `/remote-control` — steruj z telefonu.

### Podsumowanie

- Extension = GUI z inline diffs, Plan mode (komentarze!) i @-mentions
- @-mentions z zakresem linii → precyzyjny kontekst
- Wiele sesji w kartach → równoległa praca
- Extension zawiera CLI w terminalu VS Code

---

## Lekcja 3.3: CLAUDE.md, memory, hooks — konfiguracja pod projekt

**Czas:** ~45 min | **Poziom:** Intermediate → Advanced
**Cel:** Skonfigurujesz trzy filary personalizacji Claude Code.

### Kontekst

Trzy warstwy personalizacji:
1. **CLAUDE.md** — Twoje instrukcje (odpowiednik .clinerules)
2. **Auto memory** — notatki Claude'a (uczy się sam)
3. **Hooks** — deterministyczne skrypty na zdarzenia

### Teoria

#### CLAUDE.md — trzy poziomy hierarchii

```
~/.claude/CLAUDE.md              ← GLOBAL (osobiste preferencje)
projekt/CLAUDE.md                ← PROJECT (team, commitowane do git)
projekt/.claude/CLAUDE.local.md  ← LOCAL (Twoje, .gitignore)
```

**Kluczowa zasada:** Imperatywy > opisy.
- ✅ „Użyj TypeScript strict" → 94% compliance
- ❌ „Projekt używa TypeScript" → 73% compliance

#### /init — automatyczne generowanie

```bash
claude → /init
```
Claude analizuje codebase → generuje CLAUDE.md ze stackiem, komendami, konwencjami. Jeśli CLAUDE.md istnieje → sugeruje ulepszenia.

#### Auto memory

Od v2.1.59 (luty 2026) Claude automatycznie zapisuje: komendy build, Twoje korekty, wnioski z debuggingu, wzorce architektury.

- `/memory` — przeglądaj i edytuj
- `#` w prompt — quick add (np. `# zawsze generuj docstringi`)
- **Limit:** ~200 linii MEMORY.md — potem ucina bez ostrzeżenia

#### 🔀 CLAUDE.md vs .clinerules — porównanie

| Cecha | CLAUDE.md (Claude Code) | .clinerules (Cline) |
|-------|------------------------|---------------------|
| **Hierarchia** | 3 poziomy (global/project/local) | 2 poziomy (global/workspace) |
| **Auto memory** | Tak — Claude sam zapisuje | Nie |
| **Auto-generowanie** | `/init` analizuje codebase | Ręczne lub „Cline, stwórz" |
| **Conditional** | .claude/rules/ z frontmatter | YAML frontmatter |
| **Hooks** | 17 event types | Brak |
| **Subagenty** | Tak (z własną pamięcią) | Nie |

#### Hooks — deterministyczna automatyzacja

Hooks to skrypty uruchamiane automatycznie. Nie zależą od decyzji LLM — ZAWSZE się wykonają.

| Hook | Kiedy | Przykład |
|------|-------|---------|
| `PreToolUse` | Przed akcją | Blokuj edycję `/config` |
| `PostToolUse` | Po akcji | Auto-format (Black/Prettier) |
| `Stop` | Koniec odpowiedzi | Wymuś weryfikację |
| `InstructionsLoaded` | Start sesji | Loguj załadowane CLAUDE.md |

**Konfiguracja** w `.claude/settings.json`:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "write.*\\.py$",
      "command": "black $FILE_PATH && ruff check $FILE_PATH --fix"
    }]
  }
}
```

Lub interaktywnie: `/hooks` w REPL.

#### 🔀 Alternatywy hooks

| Mechanizm | Opis | Relacja z Claude Code hooks |
|-----------|------|----------------------------|
| **Git hooks (pre-commit)** | Standardowe hooki Git. Niezależne od AI. | Komplementarne — Git hook na commit, Claude hook na edycję. |
| **Husky + lint-staged** | npm setup do pre-commit. | Komplementarne — Husky na commit, Claude hook na zapis. |
| **Make.com webhooks** | Zewnętrzne automatyzacje HTTP. | Claude Code HTTP hooks (od Feb 2026) triggerują Make.com. |
| **VS Code tasks.json** | Automatyczne komendy VS Code. | Mniej granularne niż Claude Code hooks. |

#### Custom slash commands

Folder `.claude/commands/` z plikami .md:

```markdown
# .claude/commands/review.md
Przejrzyj zmiany w branchu vs main.
Sprawdź: testy, hardcoded values, konwencje.
Ocena 1-5. $ARGUMENTS = dodatkowy kontekst.
```

Użycie: `/review sprawdź moduł rates`

### Przykłady

**CLAUDE.md dla projektu logistycznego:**
```markdown
# Freight Tools — automatyzacja spedycji

## Stack
- Python 3.12, pandas, openpyxl, flask
- Baza: SQLite (rates.db), Testy: pytest

## Komendy
- Test: `pytest tests/ -v`
- Lint: `ruff check .`
- Format: `black .`
- Run: `flask run --port 5001`

## Konwencje
- Komentarze po polsku, nazwy po angielsku
- Type hints obowiązkowe
- Nie hardcoduj stawek ani danych klientów
- Loguj operacje CRUD na stawkach

## Terminologia
- TEU, FCL, LCL, BAF, THC, B/L (patrz glossary.md)
```

**Quick memory w praktyce:**
```
Sesja 1: Claude używa os.path
Ty: "# zawsze używaj pathlib zamiast os.path"
→ Zapisane do memory

Sesja 2: Claude automatycznie używa pathlib ✅
```

### Ćwiczenia

🟢 **Ćwiczenie 1:** `/init` w projekcie — co Claude odkrył? Uzupełnij braki.

🟢 **Ćwiczenie 2:** Stwórz `~/.claude/CLAUDE.md` z 3 globalnymi preferencjami.

🟡 **Ćwiczenie 3:** Hook PostToolUse: auto-format Python po edycji. Test.

🟡 **Ćwiczenie 4:** Custom command `/brief` generujący project brief. Test.

🔴 **Ćwiczenie 5:** Przez 3 sesje koryguj Claude'a → sprawdź `/memory`.

### Podsumowanie

- CLAUDE.md = 3 poziomy instrukcji, imperatywy > opisy
- Auto memory = Claude sam się uczy (cross-session, ~200 linii limit)
- Hooks = deterministyczne (ZAWSZE się wykonają, nie zależą od LLM)
- `/init` = auto-generuje CLAUDE.md
- `#` = najszybsze quick memory
- Custom commands = reużywalne workflow'y

---

## Quiz Modułowy: Moduł 3

**Q1.** CLI vs Extension — kluczowa różnica?
- B) CLI: context rewind, pipe'y, skrypty. Extension: inline diffs, Plan mode z komentarzami, GUI ✅

**Q2.** Context rewind (Esc×2)?
- B) Cofa konwersację + zmiany w kodzie jednocześnie ✅

**Q3.** Global CLAUDE.md „npm" vs Project „pnpm" — co wygra?
- B) Project — bardziej specyficzny, ładuje się później ✅

**Q4.** Auto memory vs CLAUDE.md?
- B) CLAUDE.md = Twoje instrukcje, auto memory = notatki Claude'a z korekt ✅

**Q5.** Hooks vs CLAUDE.md — przewaga hooks?
- B) Hooks deterministyczne (ZAWSZE), CLAUDE.md to guidance (LLM interpretuje) ✅

**Q6.** Extension vs Cline — kiedy które?
- B) Extension: memory/hooks/subagenty + Claude. Cline: inne modele, open-source ✅

**Q7.** Co robi /init?
- B) Analizuje codebase, auto-generuje CLAUDE.md ✅

**Q8.** Najszybsze dodanie preferencji do pamięci?
- B) `#` przed instrukcją — Claude zapisuje do memory ✅

---

## Mini-Projekt: Refaktoryzacja kodu z Claude Code

### Brief
Weź istniejący skrypt/projekt i przeprowadź pełny cykl refaktoryzacji z CLAUDE.md, auto memory i hooks.

### Wymagania
1. **CLAUDE.md** — ręcznie lub `/init` + korekty
2. **Refaktoryzacja** — min. 3 zmiany (rename, restructure, optimize)
3. **Plan mode** — dla min. jednego zadania
4. **Quick memory** — `#` min. 2×
5. **(Bonus) Hook** — auto-format po edycji

### Rubric
- [ ] CLAUDE.md z imperatywnymi instrukcjami
- [ ] Refaktoryzacja poprawiła jakość kodu
- [ ] Context rewind użyty min. 1×
- [ ] Auto memory zawiera sensowne notatki po sesji
- [ ] Koszt śledzony (`/cost`)
- [ ] (Bonus) Hook działa automatycznie

---

*Moduł 3 ukończony. Następny: Moduł 4 — Integracja: Obsidian ↔ VS Code ↔ AI.*
-e 

---
---


# Moduł 4: Integracja — spójny workflow ⭐

**Czas całkowity:** ~3.5h | **Poziom:** Intermediate → Advanced
**Wymagania wstępne:** Moduły 1-3 ukończone
**Po tym module:** Będziesz mieć działający pipeline: notatki z Obsidiana zasilają agentów kodujących, wyniki wracają do vault'u — zintegrowany, powtarzalny workflow.

---

## Lekcja 4.1: Claude Code + MCP + Obsidian vault — AI czyta i pisze do Twoich notatek

**Czas:** ~60 min | **Poziom:** Intermediate
**Cel:** Podłączysz Claude Code (i/lub Cline) do vault'u Obsidiana przez MCP. Agent będzie czytał Twoje notatki jako kontekst i zapisywał wyniki z powrotem.

### Kontekst

Do tej pory pracowałeś z trzema narzędziami osobno. Teraz je łączysz. Kluczowa idea: **Twój vault Obsidiana to baza wiedzy, z której agenty kodujące czerpią kontekst i do której zwracają wyniki.** To zamienia zbiór narzędzi w **system**.

### Teoria

#### Architektura integracji

```
┌─────────────────────────────────────────────────┐
│                TWÓJ SYSTEM                       │
│                                                  │
│  ┌──────────────┐         ┌──────────────────┐  │
│  │  OBSIDIAN     │◄──MCP──►│   VS CODE        │  │
│  │  (Vault)      │         │                  │  │
│  │               │         │  Claude Code     │  │
│  │  Smart Conn.  │         │  i/lub Cline     │  │
│  │  Copilot      │         │                  │  │
│  │  Templater    │         │  MCP Filesystem  │  │
│  └──────┬───────┘         └────────┬─────────┘  │
│         │                          │             │
│         └──────────┬───────────────┘             │
│                    │                             │
│           Pliki .md na dysku                     │
│           (wspólny fundament)                    │
└─────────────────────────────────────────────────┘
```

Trzy warstwy połączenia:
1. **Pliki na dysku** — Obsidian vault to folder z .md. VS Code może go otworzyć bezpośrednio.
2. **MCP Filesystem** — agent (Claude Code/Cline) czyta/pisze pliki w vault'u.
3. **Dedykowane MCP** — serwery specjalizowane (np. Obsidian MCP, search, SQLite).

#### Konfiguracja MCP Filesystem → Obsidian

**Dla Claude Code** (w `.claude/settings.json` lub `claude mcp add`):
```bash
claude mcp add obsidian-vault \
  npx -y @modelcontextprotocol/server-filesystem \
  /Users/Karol/Documents/Obsidian/MojVault
```

**Dla Cline** (w `cline_mcp_settings.json`):
```json
{
  "mcpServers": {
    "obsidian-vault": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "C:/Users/Karol/Documents/Obsidian/MojVault"]
    }
  }
}
```

**Bezpieczeństwo — najważniejsze zasady:**
- Wskaż TYLKO folder vault'u, nie cały dysk
- Rozważ tryb read-only jeśli nie chcesz, żeby agent modyfikował notatki
- Wyklucz foldery z danymi wrażliwymi (np. `.obsidian/`, foldery z danymi klientów)
- Pamiętaj o GDPR: dane przechodzą przez API do chmury providera (chyba że używasz lokalnego modelu)

#### 🔀 Alternatywne metody integracji Obsidian ↔ AI

| Metoda | Opis | Kiedy wybrać |
|--------|------|--------------|
| **MCP Filesystem** (opisane wyżej) | Ogólny serwer plików. Agent widzi surowe pliki .md. | Najłatwiejsze, zero zależności. Wystarczy dla większości użytkowników. |
| **Obsidian Local REST API (plugin)** | Plugin Obsidiana udostępniający REST API na localhost. Agent odpytuje API. | Jeśli chcesz API z metadanymi Obsidiana (tagi, linki, frontmatter) — nie tylko surowy tekst. |
| **Smart Connections MCP** | MCP server korzystający z embeddingów Smart Connections. Semantyczne wyszukiwanie. | Jeśli chcesz, żeby agent szukał po ZNACZENIU, nie po nazwach plików. Zaawansowane. |
| **Claude Code + Obsidian CLI** | Obsidian CLI (od v1.12+) + Connect Pro — ChatGPT/Claude wykonuje akcje w vault'u. | Nowość 2026. Wymaga Obsidian CLI + Connect Pro subscription. |
| **Bezpośrednie otwarcie vault'u w VS Code** | Otwórz folder vault'u jako workspace w VS Code. Agent widzi pliki natywnie. | Najprostsze — zero MCP. Ale agent nie ma semantic search. |
| **Make.com / n8n + Obsidian** | Webhook workflow: zewnętrzne zdarzenie → automatycznie tworzy notatkę. | Jeśli chcesz integrację z innymi narzędziami (email, CRM, Slack). |

#### Praktyczny workflow: agent czyta notatki, tworzy kod, zapisuje wynik

**Scenariusz:** Masz notatki o stawkach frachtowych w Obsidianie. Chcesz, żeby agent przeanalizował je i stworzył skrypt porównujący.

```
Krok 1: Agent czyta notatki
Prompt: "Przeczytaj notatki z folderu 20-Areas/Maritime-Freight/ 
         w moim vault'u Obsidiana. Zrób listę wszystkich tras 
         i przewoźników, o których pisałem."

Krok 2: Agent tworzy kod
Prompt: "Na podstawie tych danych stwórz skrypt Python, 
         który porównuje stawki i generuje raport."

Krok 3: Agent zapisuje wynik do vault'u
Prompt: "Zapisz raport jako notatkę Markdown 
         w 20-Areas/Maritime-Freight/Rate-Comparison-Q2-2026.md 
         z pełnym YAML frontmatter (tags, date, type: reference)."
```

### Ćwiczenia

🟢 **Ćwiczenie 1:** Podłącz MCP Filesystem do vault'u Obsidiana (Claude Code lub Cline). Potwierdź: poproś agenta o wylistowanie plików w jednym folderze.

🟢 **Ćwiczenie 2:** Poproś agenta: „Przeczytaj notatkę [nazwa] z mojego vault'u i streść ją w 3 zdaniach."

🟡 **Ćwiczenie 3:** Pełny pipeline: agent czyta → analizuje → tworzy nową notatkę w vault'u z frontmatter. Sprawdź, czy Obsidian ją widzi i indeksuje.

🔴 **Ćwiczenie 4:** Stwórz skrypt/komendę, która automatycznie generuje „Weekly Summary" — agent czyta notatki z ostatniego tygodnia i tworzy podsumowanie.

---

## Lekcja 4.2: Pipeline: notatki → kod → dokumentacja → notatki

**Czas:** ~45 min | **Poziom:** Intermediate
**Cel:** Zbudujesz powtarzalny pipeline, w którym wiedza płynie cyklicznie: Obsidian → agent → kod → dokumentacja → Obsidian.

### Kontekst

Jednorazowe „przeczytaj notatkę i zrób coś" to za mało. Prawdziwa wartość pojawia się, gdy masz **pipeline** — powtarzalny przepływ, w którym każdy krok produkuje input dla następnego.

### Teoria

#### Pipeline model

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│OBSIDIAN  │───►│  AGENT   │───►│   KOD    │───►│OBSIDIAN  │
│Notatki   │    │Claude/   │    │Skrypt,   │    │Dokument. │
│Kontekst  │    │Cline     │    │narzędzie │    │Wyniki    │
│Wymagania │    │          │    │          │    │Learnings │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
     ▲                                              │
     └──────────────────────────────────────────────┘
                    FEEDBACK LOOP
```

**Cztery fazy pipeline'u:**

1. **INPUT (Obsidian → Agent):** Notatki z wymaganiami, specyfikacjami, kontekstem domenowym
2. **PROCESS (Agent):** Agent czyta kontekst, planuje, koduje
3. **OUTPUT (Agent → Kod):** Skrypt, narzędzie, automatyzacja
4. **DOCUMENT (Kod → Obsidian):** Dokumentacja, wyniki, lessons learned wracają do vault'u

#### Szablony pipeline'ów

**Pipeline 1: Feature Development**
```
1. Notatka "Feature Brief" w Obsidianie (wymagania, akceptacja)
   → 2. Agent czyta brief, tworzy kod
   → 3. Agent generuje README i testy
   → 4. Agent zapisuje "Implementation Notes" do vault'u
   → 5. Linkujesz Implementation Notes do Feature Brief
```

**Pipeline 2: Research → Prototype**
```
1. Notatki z researchu (PJATK, artykuły, dokumentacja)
   → 2. Agent streszcza i syntetyzuje wiedzę
   → 3. Agent tworzy prototyp na podstawie syntezy
   → 4. Agent zapisuje "Prototype Report" z lessons learned
```

**Pipeline 3: Operational Automation (logistyka)**
```
1. SOP (Standard Operating Procedure) w vault'u
   → 2. Agent czyta SOP, identyfikuje kroki do automatyzacji
   → 3. Agent tworzy skrypt automatyzujący
   → 4. Agent aktualizuje SOP z linkiem do skryptu i instrukcją
```

#### Custom command do pipeline'u

`.claude/commands/pipeline-feature.md`:
```markdown
# Feature Development Pipeline

1. Przeczytaj notatkę feature brief z vault'u Obsidiana:
   path: 10-Projects/$ARGUMENTS/brief.md

2. Na podstawie briefu:
   - Stwórz strukturę plików projektu
   - Zaimplementuj core logic
   - Napisz testy
   - Wygeneruj README.md

3. Zapisz implementation notes do vault'u:
   path: 10-Projects/$ARGUMENTS/implementation-notes.md
   Format: YAML frontmatter + sekcje: Decyzje, Wyzwania, Następne kroki

4. Podsumuj w 3 zdaniach co zrobiłeś.
```

Użycie: `/pipeline-feature Maritime-Rate-Comparator`

#### 🔀 Alternatywne podejścia do pipeline'ów

| Podejście | Opis | Kiedy wybrać |
|-----------|------|--------------|
| **Custom commands** (opisane wyżej) | Slash commands w Claude Code. Uruchamiasz ręcznie. | Proste, szybkie. Dla indywidualnych pipeline'ów. |
| **Make.com / n8n** | Wizualne workflow no-code/low-code. Webhook triggers. | Jeśli pipeline integruje zewnętrzne API (email, CRM, Slack). |
| **GitHub Actions + Claude Code** | CI/CD pipeline: push → Claude Code review → deploy. | Automatyzacja w repo. Agent uruchamiany automatycznie przy push/PR. |
| **Cline Workflows** | Slash commands w Cline (`/workflow.md`). | Analogiczne do Claude Code commands, ale w ekosystemie Cline. |
| **Skrypt bash/Python** | Tradycyjny skrypt orkiestrujący: czyta notatki → wywołuje Claude API → zapisuje wynik. | Gdy chcesz pełną kontrolę i powtarzalność bez agenta. |
| **Obsidian Dataview + Templater** | Dataview query → Templater generuje notatkę → Copilot przetwarza. | Cały pipeline wewnątrz Obsidiana, bez VS Code. |

### Ćwiczenia

🟢 **Ćwiczenie 1:** Zbuduj prosty pipeline ręcznie: notatka w Obsidianie z wymaganiami → agent tworzy skrypt → agent zapisuje wynik do vault'u.

🟡 **Ćwiczenie 2:** Stwórz custom command do jednego ze swoich pipeline'ów. Przetestuj z `/twoja-komenda`.

🔴 **Ćwiczenie 3:** Zbuduj feedback loop: agent tworzy kod → testuje → jeśli test fail, czyta error → poprawia → testuje ponownie → zapisuje lessons learned do vault'u.

---

## Lekcja 4.3: Automatyzacje cross-tool — hooks, skrypty, Make.com

**Czas:** ~60 min | **Poziom:** Advanced
**Cel:** Połączysz narzędzia w automatyzacje wykraczające poza jedną aplikację — od webhook'ów po skrypty integrujące Obsidian, VS Code i zewnętrzne API.

### Kontekst

Poprzednie lekcje łączyły Obsidian ↔ agent wewnątrz VS Code. Teraz idziesz dalej: automatyzacje, które działają cross-tool — łączą email, Obsidian, agenty, Make.com i zewnętrzne API.

### Teoria

#### Warstwa 1: Claude Code hooks jako glue

Hooks w Claude Code mogą wywoływać zewnętrzne skrypty, tworząc pomost między narzędziami:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "python scripts/sync-to-obsidian.py"
      }]
    }]
  }
}
```

Ten hook po każdej turze Claude'a uruchamia skrypt, który synchronizuje wyniki do vault'u.

#### Warstwa 2: Make.com / n8n — wizualna orkiestracja

Masz już doświadczenie z Make.com (workflow Outlook → Google Sheets). Rozszerzamy to o AI:

**Przykład: Email → Obsidian → Agent → Odpowiedź**
```
Trigger: Nowy email z zapytaniem ofertowym (Outlook)
  → Make.com parsuje email (wyciąga trasę, towar, terminy)
  → Webhook tworzy notatkę w Obsidianie (przez Obsidian API lub bezpośredni zapis pliku)
  → Agent (Claude API) czyta notatkę + historyczne stawki z vault'u
  → Agent generuje draft odpowiedzi
  → Draft zapisany do vault'u + notyfikacja (Slack/email)
```

#### Warstwa 3: Skrypty integrujące

Prosty Python script łączący vault Obsidiana z Claude API:

```python
"""
sync_vault_summary.py
Czyta notatki z vault'u, generuje weekly summary przez Claude API,
zapisuje wynik z powrotem do vault'u.
"""
import anthropic
from pathlib import Path
from datetime import datetime, timedelta

VAULT_PATH = Path("/Users/Karol/Documents/Obsidian/MojVault")
SUMMARY_FOLDER = VAULT_PATH / "90-Meta"

def get_recent_notes(days=7):
    """Zbiera notatki zmodyfikowane w ostatnich N dniach."""
    cutoff = datetime.now() - timedelta(days=days)
    notes = []
    for md_file in VAULT_PATH.rglob("*.md"):
        if md_file.stat().st_mtime > cutoff.timestamp():
            notes.append({
                "path": str(md_file.relative_to(VAULT_PATH)),
                "content": md_file.read_text(encoding="utf-8")[:2000]
            })
    return notes

def generate_summary(notes):
    """Wysyła notatki do Claude API i generuje podsumowanie."""
    client = anthropic.Anthropic()
    notes_text = "\n---\n".join(
        f"## {n['path']}\n{n['content']}" for n in notes
    )
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""Przeanalizuj poniższe notatki z ostatniego tygodnia.
Stwórz podsumowanie w formacie:
1. Kluczowe tematy
2. Postępy w projektach  
3. Otwarte pytania / TODO

Notatki:
{notes_text}"""
        }]
    )
    return response.content[0].text

def save_summary(summary_text):
    """Zapisuje podsumowanie jako notatkę Obsidiana."""
    today = datetime.now().strftime("%Y-%m-%d")
    filename = f"Weekly-Summary-{today}.md"
    frontmatter = f"""---
title: "Weekly Summary — {today}"
tags: [meta, summary, weekly]
date: {today}
type: reference
status: active
---

"""
    (SUMMARY_FOLDER / filename).write_text(
        frontmatter + summary_text, encoding="utf-8"
    )
    print(f"✅ Summary saved: {filename}")

if __name__ == "__main__":
    notes = get_recent_notes(days=7)
    print(f"📝 Found {len(notes)} notes from last 7 days")
    summary = generate_summary(notes)
    save_summary(summary)
```

#### 🔀 Alternatywne platformy automatyzacji

| Platforma | Opis | Kiedy wybrać |
|-----------|------|--------------|
| **Make.com** | Wizualne workflow, 1000+ integracji, webhook'i. Freemium. | Gdy łączysz wiele SaaS (Outlook, Google Sheets, Slack). Już to znasz. |
| **n8n** | Open-source alternatywa Make.com. Self-hosted lub cloud. | Jeśli chcesz self-hosting (GDPR!) i pełną kontrolę. |
| **Zapier** | Największy marketplace integracji. Prostszy niż Make.com. | Jeśli chcesz zero-code i najprostszą konfigurację. Droższy. |
| **Python scripts** (opisane wyżej) | Skrypty z biblioteką `anthropic`. Pełna kontrola. | Gdy potrzebujesz custom logic i jesteś wygodny z kodem. |
| **GitHub Actions** | CI/CD z Claude Code Action. Automatyzacja na push/PR. | Dla workflow'ów wokół repo (code review, deploy, testy). |
| **Obsidian Dataview + cron** | Dataview queries + skrypt cron aktualizujący notatki. | Lekki, zero zewnętrznych zależności. Ale limitowany. |

### Ćwiczenia

🟢 **Ćwiczenie 1:** Stwórz prosty skrypt Python, który czyta 5 najnowszych notatek z vault'u i wypisuje ich tytuły. Bez AI — czysty file I/O.

🟡 **Ćwiczenie 2:** Rozszerz skrypt o wywołanie Claude API (biblioteka `anthropic`) — agent streszcza notatki. Zapisz wynik do vault'u.

🟡 **Ćwiczenie 3:** Skonfiguruj hook w Claude Code, który po każdej sesji (`Stop`) loguje podsumowanie do pliku w vault'u.

🔴 **Ćwiczenie 4:** (Jeśli używasz Make.com) Stwórz scenario: webhook → parsowanie → zapis notatki do vault'u (przez Google Drive lub bezpośrednio).

---

## Quiz Modułowy: Moduł 4

**Q1.** Jak najprościej dać agentowi (Claude Code/Cline) dostęp do vault'u Obsidiana?
- A) Skopiować notatki do VS Code
- B) MCP Filesystem server wskazujący na folder vault'u — agent czyta/pisze pliki .md
- C) Wyeksportować vault do PDF
- D) Zainstalować plugin w Obsidianie

**Q2.** Co to jest pipeline w kontekście integracji narzędzi?
- A) Rura w systemie operacyjnym
- B) Powtarzalny przepływ: notatki (kontekst) → agent (przetwarzanie) → kod (output) → dokumentacja (powrót do vault'u) — cykliczny, z feedback loop
- C) Połączenie internetowe
- D) Format pliku

**Q3.** Chcesz, żeby agent po każdej sesji automatycznie zapisywał podsumowanie do vault'u. Jak to zrobisz?
- A) Będę ręcznie kopiować
- B) Claude Code hook `Stop` uruchamiający skrypt, który zapisuje podsumowanie do vault'u
- C) Ustawię alarm w telefonie
- D) To niemożliwe

**Q4.** Dlaczego przy integracji MCP Filesystem z vault'em ważne jest myślenie o GDPR?
- A) Obsidian jest nielegalne w UE
- B) Dane z vault'u wysyłane do API chmurowego opuszczają Twój komputer — przy danych firmowych to wymaga analizy GDPR i ewentualnie lokalnego modelu
- C) GDPR nie dotyczy notatek
- D) MCP jest niezgodne z prawem UE

### Odpowiedzi

1. **B** — MCP Filesystem to najprostszy sposób. Zero konfiguracji po stronie Obsidiana.
2. **B** — Pipeline to cykliczny przepływ danych między narzędziami z feedback loop.
3. **B** — Hook `Stop` odpala się po turze Claude'a. Skrypt może zapisać podsumowanie do vault'u.
4. **B** — Dane firmowe w vault'u przesyłane do API chmurowego to kwestia GDPR.

---

## Mini-Projekt: End-to-end workflow dla realnego zadania

### Brief
Zbuduj kompletny, powtarzalny pipeline łączący Obsidian ↔ Agent ↔ Kod dla jednego realnego zadania z pracy lub ze studiów.

### Wymagania
1. **MCP podłączony** do vault'u Obsidiana
2. **Input w Obsidianie** — notatka z wymaganiami/specyfikacją
3. **Agent przetwarza** — czyta notatkę, generuje output (kod/raport/automatyzację)
4. **Output wraca do Obsidiana** — jako nowa notatka z frontmatter i linkami
5. **Custom command lub skrypt** — pipeline uruchamiany jednym poleceniem

### Rubric
- [ ] MCP Filesystem działa (agent czyta vault)
- [ ] Notatka-input ma kompletny frontmatter
- [ ] Agent poprawnie wykorzystał kontekst z notatek
- [ ] Output zapisany w vault'u z frontmatter i linkami do input'u
- [ ] Pipeline jest powtarzalny (custom command lub skrypt)

---

*Moduł 4 ukończony. Następny: Moduł 5 — Master Class.*
-e 

---
---


# Moduł 5: Master Class — praktyka i skalowanie

**Czas całkowity:** ~3.5h | **Poziom:** Advanced
**Wymagania wstępne:** Moduły 1-4 ukończone
**Po tym module:** Będziesz umieć zastosować cały ekosystem do realnych case studies z logistyki i studiów, oraz budować własne rozszerzenia (skills, pluginy, agenty).

---

## Lekcja 5.1: Case study logistyka — KPI dashboard, rate cards, automatyzacje

**Czas:** ~60 min | **Poziom:** Advanced
**Cel:** Zastosujesz cały zintegrowany workflow do trzech realnych scenariuszy z branży spedycji morskiej.

### Case Study A: KPI Dashboard dla zarządu

**Problem:** Zarząd potrzebuje miesięcznego przeglądu KPI: liczba shipmentów, avg stawki, top trasy, margin analysis. Dane rozproszone w plikach Excel i notatkach.

**Rozwiązanie z Twoim workflow:**

```
1. OBSIDIAN (Input):
   - Notatki z meetingów z przewoźnikami (stawki, warunki)
   - MOC-Maritime z linkami do wszystkich notatek operacyjnych

2. AGENT (Process):
   Prompt: "Przeczytaj notatki z 20-Areas/Maritime-Freight/ 
   i plik data/shipments_q1.xlsx.
   Stwórz dashboard HTML z:
   - Wykres: shipmentów per miesiąc
   - Tabela: top 10 tras wg. wolumenu
   - Porównanie stawek: Maersk vs CMA CGM vs MSC
   - Trend margin'u per trasa"

3. KOD (Output):
   Agent tworzy: dashboard.html (Chart.js), 
   data_processor.py, README.md

4. OBSIDIAN (Document):
   Agent zapisuje KPI-Report-Q1-2026.md do vault'u
   z frontmatter, wykresami i action items
```

**Narzędzia:** Claude Code + MCP Filesystem + CLAUDE.md z terminologią morską

### Case Study B: Automatyczny rate card generator

**Problem:** Przy każdym zapytaniu ofertowym ręcznie kompilujesz stawki od kilku przewoźników. Zajmuje 30-45 min per zapytanie.

**Rozwiązanie:**

```
1. OBSIDIAN: Notatki z aktualnymi stawkami per przewoźnik/trasa

2. .claude/commands/rate-card.md:
   "Przeczytaj aktualne stawki z vault'u.
   Dla trasy: $ARGUMENTS
   Wygeneruj rate card jako:
   - Porównanie przewoźników (tabela)
   - Rekomendacja (najtańszy, najszybszy, best value)
   - Uwagi o surcharges i validity dates
   Zapisz jako notatka w 10-Projects/Rate-Cards/"

3. Użycie: /rate-card Gdańsk-Jeddah

4. Wynik: gotowy rate card w 2 minuty zamiast 30
```

### Case Study C: Inbox processor — zapytania ofertowe z email

**Problem:** Zapytania ofertowe przychodzą emailem w różnych formatach. Ręczne parsowanie i wprowadzanie do systemu to żmudna praca.

**Rozwiązanie (Make.com + Agent + Obsidian):**
```
1. Make.com: Trigger na nowy email z subject "RFQ" / "Zapytanie"
   → Parsuje: trasa, towar, ilość, termin
   → Tworzy notatkę w Obsidian vault (webhook → plik .md)

2. Agent (cron lub manual): Czyta nowe RFQ z vault'u
   → Porównuje z bazą stawek
   → Generuje draft odpowiedzi
   → Zapisuje draft do vault'u

3. Ty: Przeglądasz draft w Obsidianie, poprawiasz, wysyłasz
```

### Ćwiczenia

🟢 **Ćwiczenie 1:** Wybierz jeden case study (A, B lub C) i zaimplementuj uproszczoną wersję z testowymi danymi.

🟡 **Ćwiczenie 2:** Stwórz custom command dla wybranego case study. Przetestuj na realnych (lub realistycznych) danych.

🔴 **Ćwiczenie 3:** Zbuduj kompletny pipeline dla case study B (rate card) — od notatek w vault'u przez agenta po gotowy rate card.

---

## Lekcja 5.2: Case study studia — research, projekty, prezentacje z AI

**Czas:** ~45 min | **Poziom:** Advanced
**Cel:** Zastosujesz workflow do zadań akademickich na PJATK: research, projekty, prezentacje.

### Case Study D: Research Assistant dla pracy semestralnej

**Scenariusz:** Piszesz pracę o AI w logistyce (program „Lider AI Transformacji Cyfrowej").

**Workflow:**
```
1. OBSIDIAN: Folder 10-Projects/PJATK-AI-Praca/
   - research-notes/ (notatki z artykułów)
   - outline.md (szkic pracy)
   - bibliography.md (źródła)

2. AGENT (Research phase):
   "/research EU AI Act logistics implications"
   → Agent szuka aktualnych źródeł (web search)
   → Zapisuje streszczenia do research-notes/
   → Aktualizuje bibliography.md

3. AGENT (Writing phase):
   "/write-section Rozdział 3: Implementacja AI w spedycji"
   → Agent czyta outline + research notes
   → Generuje draft sekcji
   → Zapisuje do drafts/chapter-3.md

4. OBSIDIAN: Review, edycja, Copilot do polish'u
```

### Case Study E: Prototyp projektu z dokumentacją

**Scenariusz:** Projekt na studia — prototyp aplikacji z dokumentacją.

**Workflow:**
```
1. OBSIDIAN: Specyfikacja projektu (wymagania, user stories)
2. CLINE/CLAUDE CODE: Scaffolding + implementacja
3. AGENT: Generuje dokumentację techniczną
4. OBSIDIAN: Dokumentacja wraca do vault'u, linkowana do spec'u
5. BONUS: Agent generuje prezentację (pptx) z dokumentacji
```

#### 🔀 Alternatywne narzędzia do pracy akademickiej z AI

| Narzędzie | Opis | Kiedy rozważyć |
|-----------|------|----------------|
| **Zotero + Obsidian** | Zotero zarządza bibliografią, plugin eksportuje do Obsidiana. | Jeśli masz dużo źródeł akademickich. Standardowe narzędzie w academia. |
| **Semantic Scholar API** | Darmowe API do przeszukiwania papers. Można podłączyć jako MCP. | Jeśli potrzebujesz systematycznego przeglądu literatury. |
| **Perplexity** | AI search engine z cytowaniami. | Szybki research z gotowymi źródłami. Nie integruje się z vault'em. |
| **Elicit / Consensus** | AI do analizy papers naukowych. | Research-heavy projekty. Specjalizowane, ale nie integrują się z workflow. |
| **Gamma / Beautiful.ai** | AI do generowania prezentacji. | Jeśli potrzebujesz ładnych slajdów szybko. Ale poza Twoim vault'em. |

### Ćwiczenia

🟢 **Ćwiczenie 1:** Stwórz folder projektu studenckiego w vault'u z outline.md i 3 research notes.

🟡 **Ćwiczenie 2:** Użyj agenta do wygenerowania draftu jednej sekcji pracy na podstawie notatek. Zapisz do vault'u.

🔴 **Ćwiczenie 3:** Zbuduj custom command `/research [temat]`, który szuka aktualnych informacji, streszcza i zapisuje do vault'u z bibliografią.

---

## Lekcja 5.3: Budowanie własnych skills, pluginów i agentów

**Czas:** ~60 min | **Poziom:** Advanced
**Cel:** Nauczysz się rozszerzać ekosystem: tworzenie skills w Claude Code, custom MCP servers, i łączenie agentów w zespoły.

### Teoria

#### Skills w Claude Code

Skills to reużywalne instrukcje z kontekstem, bardziej zaawansowane niż komendy:

```
.claude/skills/
├── rate-analysis/
│   ├── SKILL.md          ← instrukcje + opis
│   └── templates/        ← szablony
└── report-generator/
    ├── SKILL.md
    └── examples/
```

**SKILL.md:**
```markdown
---
name: rate-analysis
description: "Analizuje stawki frachtowe z plików Excel/CSV"
---

# Rate Analysis Skill

## Kiedy użyć
Gdy użytkownik prosi o analizę, porównanie lub raport stawek frachtowych.

## Kroki
1. Przeczytaj plik z danymi (Excel/CSV)
2. Zidentyfikuj kolumny: trasa, przewoźnik, stawka 20ft, stawka 40ft
3. Wygeneruj: tabelę porównawczą, wykres trendów, rekomendację
4. Zapisz wynik do vault'u Obsidiana z frontmatter

## Format output'u
!`cat templates/rate-report-template.md`
```

#### Subagenty (Claude Code)

Subagenty to autonomiczne instancje Claude'a ze swoim kontekstem, uprawnieniami i pamięcią:

```markdown
# .claude/agents/researcher.md
---
name: researcher
model: claude-sonnet-4-20250514
memory: project
permissions:
  allow_file_read: true
  allow_file_write: false  # read-only!
  allow_shell_exec: false
---

Jesteś research assistant. Twoim zadaniem jest:
1. Przeczytać wskazane materiały
2. Wyciągnąć kluczowe wnioski
3. Zapisać streszczenie w formacie Markdown

Nigdy nie modyfikujesz istniejących plików.
Nigdy nie uruchamiasz komend w terminalu.
```

Użycie: `@researcher Przeanalizuj notatki z folderu Maritime-Freight/`

#### Custom MCP Server — Twój własny tooling

Stwórz MCP server specyficzny dla Twojej firmy:

```python
# freight_mcp.py — MCP server dla spedycji
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("freight-tools")

@mcp.tool()
def search_rates(route: str, carrier: str = None) -> str:
    """Szuka stawek frachtowych po trasie i przewoźniku."""
    # Czyta z CSV/bazy danych
    ...

@mcp.tool()  
def calculate_total_cost(
    base_rate: float, 
    baf: float, 
    thc: float, 
    currency: str = "USD"
) -> str:
    """Kalkuluje pełny koszt frachtu z surcharges."""
    total = base_rate + baf + thc
    return f"Total cost: {total} {currency} (base: {base_rate}, BAF: {baf}, THC: {thc})"

@mcp.tool()
def generate_rate_card(route: str) -> str:
    """Generuje rate card dla podanej trasy."""
    # Porównuje stawki, generuje Markdown
    ...
```

Instalacja w Claude Code: `claude mcp add freight-tools python freight_mcp.py`

#### 🔀 Alternatywne sposoby rozszerzania ekosystemu

| Metoda | Opis | Złożoność |
|--------|------|-----------|
| **Custom commands** | Pliki .md w `.claude/commands/`. Najprostsze. | ⭐ Łatwe |
| **Skills** | Strukturyzowane instrukcje z szablonami i dynamic content. | ⭐⭐ Średnie |
| **MCP Servers (community)** | Gotowe serwery z marketplace'ów. | ⭐ Łatwe (instalacja) |
| **MCP Servers (custom)** | Własne serwery w Python/Node. | ⭐⭐⭐ Zaawansowane |
| **Subagenty** | Autonomiczne instancje z własnymi uprawnieniami. | ⭐⭐⭐ Zaawansowane |
| **Plugins** | Paczki: skills + agenty + hooks + MCP. Reużywalne i shareable. | ⭐⭐⭐⭐ Expert |
| **Obsidian plugins (JS)** | Własny plugin do Obsidiana w JavaScript. | ⭐⭐⭐ Zaawansowane |
| **Cline MCP + custom tools** | MCP server podłączony do Cline. | ⭐⭐⭐ Zaawansowane |

### Ćwiczenia

🟢 **Ćwiczenie 1:** Stwórz prosty skill w `.claude/skills/` z SKILL.md opisującym jedno zadanie z Twojej pracy.

🟡 **Ćwiczenie 2:** Poproś Claude Code o stworzenie custom MCP server z jednym tool'em: `search_notes(keyword)` — szuka w vault'u Obsidiana.

🔴 **Ćwiczenie 3:** Stwórz subagenta `@reviewer` z uprawnieniami read-only, który analizuje kod i daje feedback bez możliwości edycji.

---

## Quiz Końcowy: Moduły 4-5

**Q1.** Jaki jest najważniejszy element, który łączy Obsidian, Cline i Claude Code w spójny system?
- A) Internet
- B) Pliki .md na dysku + MCP jako standardowy protokół komunikacji
- C) Jeden klucz API
- D) Ten sam model AI

**Q2.** Masz SOP (Standard Operating Procedure) w Obsidianie. Chcesz, żeby agent zidentyfikował kroki do automatyzacji. Jaki pipeline zastosujesz?
- A) Skopiuję SOP do ChatGPT
- B) Agent czyta SOP z vault'u (MCP) → identyfikuje automatyzowalne kroki → tworzy skrypt → aktualizuje SOP z linkiem do narzędzia
- C) Napiszę skrypt ręcznie
- D) Wydrukuję SOP

**Q3.** Czym jest skill w Claude Code?
- A) Umiejętność programisty
- B) Reużywalna, strukturyzowana instrukcja z szablonami i dynamic content, bardziej zaawansowana niż command
- C) Plugin do Obsidiana
- D) Typ pliku

**Q4.** Chcesz, żeby zapytania ofertowe z emaila automatycznie trafiały do vault'u Obsidiana. Jakie narzędzie orkiestrujące wybierzesz?
- A) Ręczne kopiowanie
- B) Make.com lub n8n — webhook trigger na email → parsowanie → zapis do vault'u
- C) Alarm w telefonie
- D) Excel macro

### Odpowiedzi

1. **B** — Pliki .md na dysku to wspólny fundament. MCP standaryzuje komunikację agent ↔ narzędzia.
2. **B** — To pipeline: Input (SOP) → Process (agent) → Output (skrypt) → Document (aktualizacja SOP).
3. **B** — Skills to instrukcje z dynamic content (shell output, szablony), bardziej zaawansowane niż zwykłe komendy.
4. **B** — Make.com/n8n to idealne narzędzia do automatyzacji cross-tool z webhook'ami.

---

# Projekt Capstone: AI-Powered Logistics Assistant

## Brief

Zbudujesz **kompletny system** integrujący wszystkie narzędzia i techniki z kursu. System łączy Obsidian (baza wiedzy) → Claude Code/Cline (agenty) → automatyzacje → dokumentację w jeden spójny workflow dla Twojej pracy w spedycji morskiej.

## Opis systemu

**AI-Powered Logistics Assistant** to zestaw narzędzi i konfiguracji, który:

1. **Bazę wiedzy** (Obsidian vault) — uporządkowane notatki o stawkach, trasach, przewoźnikach, SOP, spotkaniach
2. **Agentów** (Claude Code/Cline) — skonfigurowanych pod logistykę (CLAUDE.md/.clinerules z terminologią, hooks, custom commands)
3. **Automatyzacje** — pipeline'y: zapytanie → analiza → rate card → raport
4. **Feedback loop** — wyniki pracy agentów wracają do vault'u jako dokumentacja

## Wymagania szczegółowe

### Część 1: Obsidian Vault (Moduł 1)
- [ ] Struktura PARA z folderami logistycznymi
- [ ] Min. 15 notatek z pełnym frontmatter (tags, type, related)
- [ ] Min. 2 MOC (Map of Content) — np. MOC-Maritime, MOC-Rates
- [ ] Smart Connections zainstalowany i poprawnie indeksujący
- [ ] Copilot skonfigurowany (VaultQA odpowiada na pytania)
- [ ] Min. 3 szablony Templater (Meeting, Daily, Rate Note)

### Część 2: Agent Setup (Moduły 2-3)
- [ ] Cline z .clinerules/ (min. 2 pliki: context + coding)
- [ ] Claude Code z CLAUDE.md (<200 linii, terminologia morska)
- [ ] Min. 2 custom commands (np. /rate-card, /weekly-summary)
- [ ] Min. 1 hook (np. PostToolUse → auto-lint)
- [ ] MCP Filesystem podłączony do vault'u

### Część 3: Integracja (Moduł 4)
- [ ] Działający pipeline: notatka → agent → kod/raport → notatka
- [ ] Custom command uruchamiający pipeline jednym poleceniem
- [ ] Agent poprawnie czyta kontekst z vault'u i wykorzystuje terminologię

### Część 4: Praktyka (Moduł 5)
- [ ] Min. 1 case study zrealizowany (rate card LUB KPI dashboard LUB inbox processor)
- [ ] Min. 1 skill LUB custom MCP server
- [ ] Dokumentacja systemu w vault'u (jak uruchomić, jak używać)

## Kamienie milowe

| Tydzień | Milestone | Estymacja |
|---------|-----------|-----------|
| 1 | Vault uporządkowany, pluginy AI skonfigurowane | 2-3h |
| 2 | Cline + .clinerules działające | 2-3h |
| 3 | Claude Code + CLAUDE.md + commands | 2-3h |
| 4 | MCP + pipeline zintegrowany | 2-3h |
| 5 | Case study zrealizowany | 2-3h |
| 6 | Dokumentacja, polish, prezentacja | 2-3h |

## Stretch goals (opcjonalne)

- [ ] Subagent `@researcher` do automatycznego researchu
- [ ] Make.com scenario: email → Obsidian → agent
- [ ] Dashboard HTML z KPI (generowany przez agenta)
- [ ] Prezentacja PPTX wygenerowana z vault'u (do pokazania na PJATK)
- [ ] Custom MCP server z toolami logistycznymi (search_rates, calculate_cost)

## Rubric końcowy

| Kryterium | Punkty | Opis |
|-----------|--------|------|
| Vault structure | /10 | PARA, frontmatter, linki, MOC, Smart Connections |
| Agent config | /10 | .clinerules/CLAUDE.md, commands, hooks |
| Integration | /10 | MCP, pipeline, feedback loop |
| Practical value | /10 | Czy system realnie oszczędza czas w pracy? |
| Documentation | /5 | Czy inny osoba mogłaby to uruchomić z Twojej dokumentacji? |
| Creativity | /5 | Stretch goals, niestandardowe rozwiązania |
| **TOTAL** | **/50** | |

## Finalny output

Po ukończeniu capstone powinieneś mieć:

1. **Vault Obsidiana** — uporządkowana baza wiedzy logistycznej z AI
2. **Konfiguracja VS Code** — Cline + Claude Code gotowe do pracy
3. **Pipeline'y** — powtarzalne workflow'y uruchamiane jednym poleceniem
4. **Dokumentacja** — README + notatki w vault'u opisujące system
5. **Portfolio piece** — coś, co możesz pokazać na PJATK i/lub zarządowi firmy

---

*🎓 Gratulacje! Ukończyłeś kurs „AI-Powered Workflow — Claude Code, Cline & Obsidian". Od podstaw do Master Class.*

*Pamiętaj: narzędzia AI zmieniają się szybko. Najważniejsze, czego się nauczyłeś, to nie konkretne komendy — lecz SPOSÓB MYŚLENIA o integracji narzędzi. Context engineering, pipeline'y, feedback loops — te koncepty przetrwają zmiany w narzędziach.*
