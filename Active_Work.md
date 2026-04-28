# BIEŻĄCY KONTEKST — KAROL TOREBKO
*Stan na: 2026-04-11 | Następna aktualizacja: 2026-04-18*
*Dokument dynamiczny — aktualizuj co tydzień lub na początku miesiąca*

***

## 🎯 JAK UŻYWAĆ TEGO PLIKU (INSTRUKCJA DLA AI)
To jest mój aktualny stan gry. Zawsze łącz ten plik z moim `Profile.md`:
- `Profile.md` = kim jestem (styl, wartości, reguły decyzyjne) — niezmienny
- `Active_Work.md` = co robię teraz (projekty, priorytety, dostępność) — zmienny
- `profil_czytelniczy.md` = mój plan lekturowy, preferencje literackie, historia lektur — szczegółowa baza wiedzy
- `profil_treningowy.md` = mój profil treningowy i medyczny (żelazne zasady bezpieczeństwa, dozwolone/zakazane pozycje, aktualny plan)

Przy każdej interakcji:
1. **Priorytety:** Skupiaj moje działania na Celach Głównych. Pilnuj deadlinów.
2. **Dostępność:** Nie proponuj działań w godzinach 8–16 pn–pt (praca operacyjna). Czas na pracę w skupieniu = wieczory po pracy + weekendy. Treningi M/W/F o 6:30.
3. **Decyzje:** Nie wracaj do tematów z sekcji "Ostatnie Decyzje" — są zamknięte.
4. **Ludzie:** Uwzględniaj zależności z sekcji "Kluczowe Osoby" przy planowaniu.
5. **Kontekst prywatny:**
   - Żona ma zaplanowaną operację (18/05). To wpływa na mój stan mentalny i dostępność.
   - Żołądek OK — regeneracja zakończona.
   - W planowaniu treningu i wysiłku zawsze respektuj zasady z `profil_treningowy.md` (m.in. zakaz Valsalvy i kontrola ciśnienia wewnątrzbrzusznego).
   - Uwzględniaj przy planowaniu obciążenia — nie pytaj o to proaktywnie.
Jeśli brakuje Ci danych — pytaj. Nie zgaduj.

***

## 🏆 CELE NA TEN OKRES
*Kwiecień 2026 / Q2 2026*

1. **SeaTrack v3 — odblokować wdrożenie firmowe** — kluczowy krok: spotkanie z PNS (IT), po którym rusza deployment
2. **Budżet działu — uzyskać założenia budżetowe 2026** — poprosić szefa o przesłanie targetu rocznego (do tej pory niedostarczone)
3. **KSeF — utrzymanie** — system wdrożony i działa, tylko kosmetyka; tryb maintenance

***

## 🚀 AKTYWNE PROJEKTY (TOP 5)

| Nazwa Projektu | Cel / Oczekiwany rezultat | Deadline | Status i następny krok | Kto/Co blokuje |
|----------------|--------------------------|----------|------------------------|----------------|
| **SeaTrack v3** | Wdrożenie aplikacji trackingowej w firmie (integracja z Transsoft REST) | Brak twardego deadline'u | 🟢 PNS potwierdził docelowe ścieżki Linux (`/opt/seatrackv3`, `/var/lib/appdata/seatrackv3/...`), SSH przez klucz, gotowy `.env`, SMTP relay `smtpcsi.mumpl.local` (25/587) i Node.js LTS + npm. Następny krok: logowanie po SSH, deploy kodu i test inicjacji połączeń do API armatorów pod reguły FW. | Czekam na klucz/poświadczenia i passphrase; FW 443 do API armatorów otwierany po pierwszych próbach połączeń |
| **Budżet działu / pozyskiwanie zleceń** | Realizacja targetu miesięcznego + uzyskanie założeń budżetowych 2026 | Koniec każdego miesiąca | ✅ Prośba o założenia budżetowe 2026 wysłana; czekam na odpowiedź i ewentualne doprecyzowanie targetu | Szef — brak odpowiedzi / założeń |
| **KSeF** | Utrzymanie wdrożonego systemu | Ciągły | ✅ Wdrożony i działa — tylko kosmetyka; tryb asynchroniczny | — |
| **Plan czytelniczy — klasyka** | Realizacja ustrukturyzowanego planu lekturowego | Cel roczny | ✅ Skończone: *Dallas '63* (King); w trakcie: Capote — *Z zimną krwią* | Dyscyplina własna |
| **Optymalizacja suplementacji (rodzina)** | Dobór suplementacji dla siebie, żony i dzieci | Brak twardego deadline'u | W toku — research i wdrażanie | Brak — projekt własny |

### 🅿️ Parking Lot (odłożone — nie priorytetyzuj)
- **Operacja żony (guz ślinianki)** — termin 18/05/2026, zmiana niezłośliwa. Nie projekt do zarządzania, ale kontekst wpływający na głowę i dostępność.
- **CentrumDowodzenia** — projekt poboczny (mapa świata + moduł AI szukający powiązań tematycznych); bardzo tokenożerny, niepewna przyszłość rozwoju.
- **karcianka** — temat hobbistyczny, odłożony na nieokreślony czas.
- **Nauka estetycznego pisma ręcznego** — cel nadrzędny na później; do opracowania: plan działania, lista zakupów (narzędzia papiernicze), harmonogram treningu i metodyka ćwiczeń.

***

## 📅 DOSTĘPNOŚĆ W TYM OKRESIE

- **Pn–Pt 8:00–16:00:** Praca operacyjna w M&M Air Sea Cargo — tryb "strażak", gaszenie bieżących pożarów. Brak czasu na pracę w skupieniu.
- **Czas na pracę głęboką:** Wieczory po pracy (w domu) + weekendy
- **Treningi:** Poniedziałek/Środa/Piątek, 6:30 rano (protokół "Safe Hypertrophy" — 3x w tygodniu, ~60 min; szczegóły bezpieczeństwa i plan ćwiczeń: `profil_treningowy.md`)
- **Aktualizacja tygodnia (11–13.04):** Zjazd ze studiów podyplomowych — weekend zajęty.
- **Nieobecności / wyjazdy w kwietniu:** Zjazd podyplomowy 11–13.04
- **Sztywne bloki:**
  - 18 maja — operacja żony

***

## 👥 KLUCZOWE OSOBY I RELACJE (Aktualnie)

| Osoba | Rola / Kontekst | Aktualna zależność lub status |
|-------|-----------------|-------------------------------|
| PNS (IT) | Dział IT firmy | Kluczowy do odblokowania wdrożenia SeaTrack v3 — serwer wstępnie wskazany, trwa przygotowanie konfiguracji |
| Szef | Przełożony | Musi przesłać założenia budżetowe 2026 — do tej pory nie dostarczone |
| Thomas | Transsoft (dostawca TMS) | SeaTrack — kontakt techniczny ws. integracji REST |
| Żona | Prywatnie | Operacja guza ślinianki 18/05/2026 — zmiana niezłośliwa |

***

## ✅ OSTATNIE DECYZJE (Nie wracaj do tych tematów)

- 11.03.2026: KSeF prowadzony równolegle (asynchronicznie), a główny fokus projektowy przeniesiony w pełni na SeaTrack.
- 12.03.2026: SeaTrack dokumenty: faza testów bez zmian architektury; target docelowy to wdrożenie on-prem na firmowym serwerze.
- 11.04.2026: KSeF uznany za zamknięty — wdrożony i działa, pozostaje w trybie maintenance.
- 22.03.2026: Tracking MAERSK odblokowany (routing adaptera per armator, OAuth poprawiony). Endpoint CMA zaktualizowany do `apis.cma-cgm.net:443`.

***

## ⚡ AKTYWNE WORKFLOWY I SKRÓTY

| Hasło / Komenda | Co robi | Kiedy używać |
|-----------------|---------|--------------|
| Newsletter RSS | Przegląd branżowych artykułów z kanałów RSS | Co poniedziałek — automatyczny newsletter |
| `/briefing` | Poranny przegląd dnia: priorytety + plan | Każde rano |
| `/review` | Tygodniowy przegląd: co zrobiono, co się przesuwa | Piątek/weekend |
| `/decyzja [temat]` | Analiza opcji wg reguł decyzyjnych z Profile.md | Na żądanie |

***

## 📚 PLAN CZYTELNICZY — SZCZEGÓŁY

**Aktualnie czytane:**
- Truman Capote — *Z zimną krwią*

**Kolejne kroki (po zakończeniu Capote):**
1. Joseph Conrad — *Jądro ciemności*
2. Daniel Keyes — *Kwiaty dla Algernona*
3. Milan Kundera — *Nieznośna lekkość bytu*

**Charakterystyka planu:**
- Realizacja bloków tematycznych: System a Jednostka → Egzystencjalizm i Absurd → Koniec Świata → Dekonstrukcja Rozumu
- Przeczytane: Orwell, Huxley, Bradbury, Heller, Kesey, Burgess, Camus (2x), Kafka, Bułhakow, McCarthy, Sapkowski (tom 1), King (*Dallas '63*)
- Pełny szczegółowy plan i biblioteczka dostępne w: `profil_czytelniczy.md`

***

## ⏳ BIEŻĄCE OGRANICZENIA I ZASOBY

- **Dostępny czas tygodniowo na pracę własną:** ~10–12h (wieczory po pracy + weekendy)
- **Budżet na działania w tym okresie:** [DO UZUPEŁNIENIA — brak założeń budżetowych od szefa]
- **Bieżące wąskie gardła organizacyjne:**
  - Przestarzały TMS (Transsoft z lat 90.) — ogranicza efektywność i wymaga obejść
  - Praca operacyjna 8–16 zjada czas na myślenie strategiczne
  - Brak dedykowanych założeń budżetowych na 2026
- **Kontekst zdrowotny wpływający na zasoby:**
  - Żołądek OK — regeneracja zakończona
  - Nadciśnienie tętnicze i hipercholesterolemia (kontrolowane farmakologicznie)
  - Przepuklina rozworu przełykowego (brak aktywnego refluksu na IPP, ale obowiązuje rygor ochrony przed wzrostem ciśnienia wewnątrzbrzusznego)
  - Protokół suplementacyjny i dietetyczny (wpływa na rytm dnia i dostępność energii)
  - Treningi M/W/F 6:30 (sztywny harmonogram; protokół oddechowy i dobór pozycji zgodnie z `profil_treningowy.md`)

***

## 🛑 OTWARTE DECYZJE I BLOKADY (Gdzie potrzebuję pomocy AI)

### SeaTrack v3 — Kamienie milowe przed go-live

**Aktualny plan wykonawczy (po potwierdzeniu PNS):**
1. Odbieram klucz SSH i poświadczenia (passphrase oddzielnie SMS)
2. Loguję się na Linux i wdrażam kod do `/opt/seatrackv3`
3. Uzupełniam `.env` o parametry integracji (armatorzy/mail)
4. Uruchamiam backend i wykonuję testy inicjacji połączeń HTTPS do API armatorów
5. PNS na podstawie realnych prób domyka reguły FW Palo Alto (443)

**Po montażu — procedury do uzgodnienia (tydzień 24-28.04):**
- Harmonogram testów odtworzenia backupów (Veeam)
- Owner on-call i procedura escalation
- Plan monitorowania CheckMk (alerty, prógi)

**Firewall — punkty do przekazania PNS (outbound HTTPS 443):**
- api.maersk.com (Tracking Maersk OAuth)
- api.cma-cgm.net (Tracking CMA)
- api.hapag-lloyd.com (Tracking Hapag)
- SMTP relay `smtpcsi.mumpl.local` — potwierdzone 25/587

- **Blokada budżetowa:** Szef nie przesłał założeń budżetowych 2026 — trudno planować bez targetu
- **MSC API / Data Exchange Agreement:** Zakres operacyjny do potwierdzenia: z M&M do MSC przekazywany wyłącznie identyfikator trackingu (nr kontenera lub BL), zwrotnie z MSC odbierane dane ETA/ETD i ewentualnie vessel; nie podpisywać przed domknięciem: (1) zakresu danych i Schedule 1/3, (2) opinii technicznej PNS/IT dot. bezpieczeństwa i nadzoru, (3) decyzji zarządczej o odpowiedzialności i kosztach utrzymania.
