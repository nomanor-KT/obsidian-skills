---
name: property-copywriter
description: "Use when raw property data needs premium real-estate copy. Trigger on listings, CRM notes, or rough drafts that should become persuasive, high-end property marketing text."
---

# Property-Copywriter Skill

Zaawansowana transformacja surowych danych o nieruchomościach w ekskluzywne, perswazyjne opisy marketingowe. System automatycznie eliminuje kolokwializmy, zastępując je terminologią z zakresu architektury, designu i lifestyle'u premium.

## Zastosowanie

Skorzystaj z tego skill, gdy:
- Masz surowe dane z CRM / arkusza / notatek i potrzebujesz profesjonalnego tekstu sprzedażowego
- Chcesz wyeliminować potoczny język z opisu nieruchomości
- Piszesz dla biura nieruchomości i potrzebujesz premium tone, ale bez pretensjonalności
- Musisz szybko stworzyć headline + opis dla ogłoszenia

## Proces Transformacji

### Krok 1: Analiza Surowych Danych
Skill przeanalizuje dostarczone informacje i wyciągnie:
- **Podstawowe dane**: metraż, liczba pokoi, piętro, rok budowy
- **Lokalizacja**: dzielnica, okolica, bliskość infrastruktury
- **Cechy wyróżniające**: balkon, taras, garaż, wykończenie, widoki
- **Stan**: do remontu, po remoncie, deweloperski, pod klucz
- **Unique selling points**: co wyróżnia tę nieruchomość?

### Krok 2: Identyfikacja Kolokwializmów
Skill rozpozna i oznacze potoczne określenia wymagające transformacji:

| Kolokwializm | Premium Alternative |
|--------------|---------------------|
| ładny widok | panoramiczne widoki / ekspozycja na [kierunek] |
| duży pokój | przestronna przestrzeń / salon o powierzchni XY m² |
| fajny balkon | reprezentacyjny taras / balkon z ekspozycją południową |
| blisko metra | doskonała komunikacja / bezpośrednia bliskość transportu |
| dobra okolica | prestiżowa lokalizacja / otoczona zielenią dzielnica |
| nowy blok | nowoczesna inwestycja / współczesna architektura |
| czynsz niski | optymalna struktura kosztów eksploatacyjnych |
| jasne mieszkanie | naturalne doświetlenie / ekspozycja zapewniająca światło |
| zadbane | perfekcyjnie utrzymane / w nienagannym stanie |

### Krok 3: Zastosowanie Terminologii Premium
Skill wzbogaci opis o profesjonalną terminologię:

**Architektura & Design:**
- funkcjonalny układ pomieszczeń
- harmonijne proporcje wnętrza
- przemyślana aranżacja przestrzeni
- eleganckie wykończenie
- designerskie detale

**Lifestyle & Komfort:**
- komfort życia codziennego
- wysoki standard wykończenia
- wyjątkowa jakość wykonania
- atmosfera spokoju i prywatności
- idealna dla osób ceniących [wygodę/elegancję/styl]

**Lokalizacja:**
- prestiżowa dzielnica
- doskonała infrastruktura
- bezpośrednia bliskość [szkół/parków/restauracji]
- privileged location
- otoczenie pełne zieleni

### Krok 4: Konstrukcja Headline
Skill wygeneruje przyciągający uwagę nagłówek (15–25 słów):

**Formuła Headline:**
- **[Unique Feature]** + **[Lokalizacja]** + **[Kluczowa Wartość]**

**Przykłady:**
- "Przestronny apartament z panoramicznym tarasem w sercu Mokotowa — idealna przestrzeń dla rodziny"
- "Nowoczesne 3-pokojowe mieszkanie z garażem — prestiżowa okolica Wilanowa"
- "Designerskie wnętrze z widokiem na park — funkcjonalny układ w nowej inwestycji"

### Krok 5: Budowa Opisu (2–3 Akapity)

**Struktura:**

**Akapit 1 — Wprowadzenie (Emocja + Fakty)**
- Rozpocznij od unikalnego value proposition
- Połącz emocję z kluczowymi faktami (metraż, pokoje)
- Podkreśl główny atut (lokalizacja / widok / stan)

**Akapit 2 — Szczegóły (Features & Benefits)**
- Funkcjonalny układ pomieszczeń
- Dodatkowe atuty (balkon, garaż, piwnica)
- Stan wykończenia i jakość materiałów
- Infrastruktura / okolica

**Akapit 3 — Zamknięcie (Lifestyle & CTA)**
- Dla kogo to mieszkanie (rodzina, singiel, para)?
- Jak będzie się tu żyło? (spokój, dynamika, wygoda)
- Subtelne Call-to-Action (opcjonalnie)

## Input

Skill przyjmuje:
- **Tekst surowy** — notatki, wypunktowania, dane z arkusza
- **Format dowolny** — skill sam rozpozna strukturę

**Przykład inputu:**
```
3 pokoje, 65m2, 5 piętro, Mokotów
balkon 8m2, widok na park
po remoncie, nowe okna
blisko metra Wilanowska
cena 850k
```

## Output

Skill wygeneruje:
1. **Headline** (przyciągający, 15–25 słów)
2. **Opis główny** (2–3 akapity, ~150–250 słów)
3. **Tone**: Premium aspirational — wysoka jakość, ale bez pretensjonalności

**Przykład outputu:**
```markdown
### Przestronny apartament z balkonem i widokiem na park — prestiżowy Mokotów

Przedstawiamy wyjątkowe 3-pokojowe mieszkanie o powierzchni 65 m², położone na 5. piętrze w prestiżowej dzielnicy Mokotów. Nieruchomość wyróżnia się przemyślanym układem funkcjonalnym oraz reprezentacyjnym balkonem o powierzchni 8 m², z którego rozpościerają się malownicze widoki na otaczającą zieleń.

Apartament został perfekcyjnie odnowiony — nowe okna zapewniają doskonałą izolację akustyczną i termiczną, a wysokiej klasy wykończenie podkreśla charakter wnętrza. Lokalizacja gwarantuje komfort życia codziennego: bezpośrednia bliskość stacji metra Wilanowska, rozbudowana infrastruktura handlowo-usługowa oraz dostęp do parków i terenów rekreacyjnych.

Idealna przestrzeń dla rodziny lub pary ceniącej połączenie miejskiego stylu życia z atmosferą spokoju. To propozycja dla osób poszukujących funkcjonalnego mieszkania w jednej z najbardziej pożądanych lokalizacji Warszawy.
```

## Słownik Transformacji (Premium Vocabulary)

### Podstawowe Określenia
- ~~mieszkanie~~ → apartament / przestrzeń mieszkalna / nieruchomość
- ~~pokój~~ → pomieszczenie / strefa / przestrzeń
- ~~kuchnia~~ → aneks kuchenny / przestrzeń kulinarna / wykończona kuchnia
- ~~łazienka~~ → łazienka z ___ / przestrzeń sanitarna wykończona w ___

### Cechy Pozytywne
- ~~ładny~~ → estetyczny / elegancki / harmonijny
- ~~duży~~ → przestronny / o powierzchni ___ m²
- ~~jasny~~ → naturalnie doświetlony / z ekspozycją na ___
- ~~nowy~~ → nowoczesny / współczesny / z ___ roku

### Lokalizacja
- ~~blisko~~ → bezpośrednia bliskość / w odległości ___ minut od
- ~~dobra okolica~~ → prestiżowa dzielnica / pożądana lokalizacja
- ~~centrum~~ → serce miasta / centralna lokalizacja / reprezentacyjna część ___

### Stan
- ~~po remoncie~~ → perfekcyjnie odnowiony / w nienagannym stanie
- ~~do remontu~~ → z potencjałem aranżacyjnym / do własnej adaptacji
- ~~nowe okna~~ → stolarka okienna najwyższej klasy / izolacja termiczna

## Anti-Patterns (Czego Unikać)

❌ **Przesadna ekskluzywność:**
- "Rezydencja godna króla" (za dużo)
- "Apartament klasy ultra-premium" (pretensjonalność)

❌ **Puste slogany:**
- "Mieszkanie Twoich marzeń" (bez konkretów)
- "Idealna oferta" (zbyt ogólne)

❌ **Kolokwializmy:**
- "Super mieszkanko na start"
- "Sztos lokalizacja"
- "Okazja życia"

✅ **Dobrze:**
- Konkretne fakty + emocja
- Premium language, ale czytelny
- Value proposition na początku
- Features → Benefits

## Przykłady Transformacji

### Przykład 1: Przed → Po

**PRZED (surowe dane):**
```
2 pokoje, 45m2, Śródmieście
ładny widok, po remoncie
blisko wszystkiego, metro obok
balkon, jasne
```

**PO (premium copy):**
```
### Nowoczesny apartament z balkonem w sercu Śródmieścia — doskonała komunikacja

Przedstawiamy kompaktowy 2-pokojowy apartament o powierzchni 45 m², położony w najbardziej dynamicznej części Warszawy. Nieruchomość została perfekcyjnie odnowiona, a naturalne doświetlenie podkreśla harmonijny układ wnętrza. Balkon umożliwia relaks z widokiem na panoramę miasta.

Lokalizacja gwarantuje wyjątkową wygodę — bezpośrednia bliskość stacji metra, rozbudowana infrastruktura handlowo-usługowa i kulturalna w zasięgu spaceru. Idealna propozycja dla singla lub młodej pary ceniącej miejski styl życia i doskonałą komunikację z każdą częścią miasta.
```

---

### Przykład 2: Przed → Po

**PRZED (surowe dane):**
```
Kawalerka 28m2, Praga Północ
stary blok, ale zadbany
tanio, dobra lokata
```

**PO (premium copy):**
```
### Funkcjonalna kawalerka na Pradze Północ — optymalne rozwiązanie inwestycyjne

Oferujemy kompaktowe mieszkanie o powierzchni 28 m², zlokalizowane w dzielnicy Praga Północ — jednej z najdynamiczniej rozwijających się części Warszawy. Nieruchomość znajduje się w perfekcyjnie utrzymanym budynku z charakterystyczną architekturą, a przemyślany układ zapewnia maksymalną funkcjonalność przestrzeni.

Optymalna struktura kosztów eksploatacyjnych oraz rosnąca atrakcyjność dzielnicy czynią tę nieruchomość interesującą propozycją inwestycyjną. Idealna dla osoby poszukującej pierwszego mieszkania lub stabilnej lokaty kapitału w perspektywicznej lokalizacji.
```

## Dostosowania

Jeśli piszesz dla różnych segmentów:

1. **Ultra-luxury** (rezydencje top-tier) — dodaj "rezydencja", "enklawa", "privileged"
2. **Mid-market** (standardowe oferty) — zmniejsz intensywność, zostaw praktyczne benefits
3. **Inwestycje** (dla developerów) — podkreśl ROI, lokalizację, potencjał wzrostu wartości

## Przykłady Zapytań
- `/property-copywriter`
- "Przekształć te dane w premium opis: [wklej surowe dane]"
- "Napisz headline i opis dla tej nieruchomości: [dane]"
- "Popraw ten opis, usuń kolokwializmy: [obecny tekst]"

## Wymagane Umiejętności Agenta
- Analiza strukturalna danych tekstowych
- Transformacja języka potocznego → premium terminology
- Copywriting perswazyjny (emocja + fakty)
- Tworzenie headlines (attention-grabbing)
- Znajomość terminologii real estate, architektury, designu

## Gotchas

- **Przesada premium:** Nie zamieniaj zwykłej oferty w pretensjonalny katalog luksusu.
- **Brak konkretów:** Jeśli input nie ma faktów (metraż, lokalizacja, atuty), nie dopisuj ich sam.
- **Zbyt dużo przymiotników:** Premium ma brzmieć pewnie, nie puchato.
- **Mieszanie segmentów:** Inaczej pisz dla rynku mid-market, inaczej dla premium i inwestycji.
- **Slogany bez wartości:** Unikaj fraz typu "mieszkanie marzeń" bez dowodu w treści.

## Granice skilla

- Ten skill tworzy copy marketingowe nieruchomości.
- Ten skill nie wycenia nieruchomości i nie robi analizy prawnej oferty.
- Ten skill nie zastępuje analizy rynku ani due diligence.
