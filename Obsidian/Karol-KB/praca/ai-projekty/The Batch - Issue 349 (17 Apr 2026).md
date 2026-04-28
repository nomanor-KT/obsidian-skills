# The Batch #349 — 17 kwietnia 2026

**Źródło:** [deeplearning.ai/the-batch/issue-349](https://www.deeplearning.ai/the-batch/issue-349/)
**Tagi:** #ai #newsletter #thebatch

---

## List Andrew Ng: AI-native zespoły inżynierskie

Główna teza: małe zespoły korzystające z agentów AI działają fundamentalnie inaczej niż tradycyjne zespoły.

**Kluczowe zmiany:**
- Gdy kodowanie przyspiesza 10-100x, wszystko inne staje się wąskim gardłem — PM, design, marketing, legal
- Proporcja inżynierów do PM spada z 8:1 nawet do 1:1
- Najszybsze zespoły to te, gdzie inżynier rozumie produkt i sam decyduje co budować
- Generalista wygrywa — przy 2-osobowym zespole oboje muszą ogarniać kilka specjalizacji
- Praca w jednym miejscu (nie remote) = mniej bottlenecków komunikacyjnych
- Litera skupia się na zespołach 2-10 osób; koordynacja większych — temat na przyszłość

**Rekomendacje Ng:**
- Inżynierowie: uczcie się product managementu
- PM-owie: uczcie się budować produkty
- Znajomość narzędzi AI pomaga myśleć przez pryzmat różnych ról

---

## Meta Muse Spark — koniec open weights

**Co się stało:** Meta wypuściła Muse Spark — pierwszy model od roku, zamknięty (nie open-weights), multimodalny model reasoningowy.

**Specyfikacja:**
- Input: tekst, obraz, dźwięk (do 262k tokenów); output: tekst
- 3 tryby reasoning: instant / thinking / contemplating
- Dostępny przez meta.ai i aplikację Meta AI; API preview dla wybranych partnerów
- Niedostępne publicznie: architektura, dane treningowe, liczba parametrów

**Wyniki benchmarków (Artificial Analysis Intelligence Index):**
- 4. miejsce ogólnie (52 pkt) za: Claude Opus 4.6 max reasoning (53), Gemini 3.1 Pro + GPT-5.4 (57)
- Token-efficient: ~59M tokenów vs ~158M dla Claude Opus 4.6
- Coding Index: 47 — słabszy od GPT-5.4 (57), Gemini (56), Claude Sonnet 4.6 (51)
- Wyróżnia się: multimodal (1. miejsce CharXiv Reasoning 86.4%), health (1. HealthBench Hard 42.8%)

**Technicznie:**
- Contemplating mode = równolegle wiele agentów, które proponują rozwiązania i agregują wyniki
- "Thought compression" — RL penalizuje za zbędne tokeny reasoning
- >1000 lekarzy kuratorowało dane medyczne

**Kontekst:**
- Meta spędziła $14.3 mld na 49% udziałów w Scale AI (VI 2025), zatrudniła Alexandr Wang jako chief AI officer
- Pivot od open-weights = cios dla developerów budujących na Llama
- Meta celuje w segment biznesowy (OpenAI, Google, Anthropic)

**Trend:** Muse Spark i Kimi K2.5 (Agent Swarm) wskazują kierunek — zamiast trenować coraz większe modele, orchestracja wielu agentów w czasie inferencji.

---

## Eli Lilly + Insilico Medicine — AI w odkrywaniu leków

**Deal:** Eli Lilly płaci do $2.75 mld firmie Insilico Medicine za prawa do leków odkrytych przez AI.
- $115M upfront za prawa ekskluzywne do niesprecyzowanych kandydatów przed testami na ludziach
- Reszta tied do kamieni milowych R&D, regulacyjnych i komercyjnych

**Insilico Medicine:**
- Założona 2014, Hong Kong
- 28 kandydatów na leki przez AI, ~połowa w badaniach klinicznych
- Rentosertib (IPF — zwłóknienie płuc) — pozytywna faza 2a
- Garutadustat (IBD) — faza 2a od I 2026

**Jak działa pipeline AI:**
1. **PandaOmics** — analiza datasety biologiczne + publikacje + patenty + granty → ranking kandydatów białkowych (target identification)
2. **Chemistry42** — ~30 równoległych modeli generatywnych projektuje cząsteczki optymalizowane pod: wiązanie, toksyczność, rozpuszczalność

**Efekty:**
- Od identyfikacji targetu do cząsteczki gotowej do testów przedklinicznych: **18 miesięcy** (vs tradycyjne 5-6 lat)
- Syntetyzowane i testowane: ~60-200 cząsteczek na program (vs tradycyjne 200k-1M przesiewanych)
- Wynik fazy 2a Rentosertib: +98.4 ml FVC u pacjentów (placebo: -20.3 ml)

**Ważne zastrzeżenie:** Żaden lek odkryty przez AI nie uzyskał jeszcze zatwierdzenia regulacyjnego. 70% kandydatów w fazie 2 odpada.

---

## Regulacje AI w stanach USA — mozaika przepisów

**Sytuacja:** >1500 projektów ustaw w stanach, ponad 100 już uchwalonych praw w 40 stanach — mimo że administracja Trumpa naciska na regulacje federalne, nie stanowe.

**Kluczowe stany:**

| Stan | Co uchwalono / planują |
|------|------------------------|
| **Kalifornia** | Niewidoczny watermark na AI output (od VIII 2026); ocena ryzyk katastroficznych przez deweloperów; zakaz chatbotów dyskutujących o samookaleczeniu z małoletnimi |
| **Kolorado** | Ochrona przed dyskryminacją algorytmiczną w high-stakes decisions (edukacja, finanse, zdrowie, mieszkanie) — od VII 2026; coroczne audyty |
| **Minnesota** | Zakaz AI undressing photos; zakaz dynamicznych cen opartych na zachowaniu; ubezpieczenia zdrowotne nie mogą odmawiać opieki bez lekarza (od VIII) |
| **Nowy Jork** | Od I 2027: firmy >$500M przychodu muszą blokować generowanie broni bio i narzędzi hackingowych; roczne audyty |
| **Ohio** | Zakaz klonowania głosu/wizerunku do reklam; AI bez osobowości prawnej (rozważane) |
| **Utah** | Zakaz deepfakes seksualnych; ubezpieczenia nie mogą odmawiać opieki przez AI bez lekarza |

**Federalne vs stanowe:**
- Trump XII 2025: executive order zniechęcający do regulacji stanowych, grozi wstrzymaniem funduszy federalnych
- III 2026: federalne wytyczne — skupiają się na ochronie dzieci i cenach energii przez centra danych AI

**Dlaczego to ważne:** Jeden model AI może jednocześnie wymagać audytu bias w Kolorado, watermarku w Kalifornii i raportowania w Nowym Jorku — przy federalnych próbach unieważnienia tych wymogów. Wzrost kosztów compliance, ryzyko prawne, fragmentacja.

---

## Badanie: Persona Generators (Google)

**Problem:** LLM symulując użytkowników daje zbyt uśrednione odpowiedzi — nie odwzorowuje rozrzutu opinii w realnej populacji.

**Rozwiązanie:** Persona Generators (Paglieri, Cross et al., Google) — system generujący 25 zróżnicowanych person za pomocą algorytmu ewolucyjnego AlphaEvolve.

**Jak działa:**
1. Gemini 2.5 Pro generuje 30 kwestionariuszy (zdrowie, finanse, teorie spiskowe itp.) z "osiami różnorodności" (np. tolerancja ryzyka, zaufanie do instytucji)
2. AlphaEvolve iteracyjnie (500 iteracji, 10 równoległych wersji kodu) generuje kod tworzący 25 person maksymalizujących różnorodność odpowiedzi
3. Każda persona odpowiada na kwestionariusz (Gemma 3-27B-IT przez bibliotekę Concordia); odpowiedzi → wektory
4. Mierzonych 6 metryk różnorodności (m.in. średnia odległość wektorów)

**Wyniki:**
- Persona Generators pokrywają 82% możliwych odpowiedzi
- Nemotron Personas: 76%
- Concordia memory generator: 46%

**Zastosowanie:** Symulacja reakcji użytkowników na nowe produkty/funkcje — sposób na obejście bottlenecku PM bez drogich badań z prawdziwymi użytkownikami.

---

*Notatka wygenerowana na podstawie The Batch #349, Andrew Ng / DeepLearning.AI*
