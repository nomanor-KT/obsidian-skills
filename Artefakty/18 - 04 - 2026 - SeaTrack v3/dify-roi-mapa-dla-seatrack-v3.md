# Dify - mapa ROI dla SeaTrack v3

Data: 2026-04-18
Kontekst: decyzja po analizie repo `langgenius/dify`

## 1) Werdykt

GO (fazowo, bez wdrozenia produkcyjnego teraz).

Dlaczego:
- Dify ma realna wartosc jako akcelerator workflow AI + RAG + API.
- Najwiekszy zysk dla nas to standaryzacja procesow i szybsza obsluga tematow operacyjnych bez pisania wszystkiego od zera.
- Pelny self-hosting przed domknieciem etapu SeaTrack z PNS bylby ryzykiem rozproszenia focusu.

## 2) Co z repo jest dla nas najcenniejsze

- Workflow canvas: szybkie skladanie procesow AI bez duzego developmentu.
- RAG pipeline: ingest dokumentow operacyjnych i odpowiedzi z kontekstem.
- Agent/tools: mozliwosc podpiecia narzedzi i krokow decyzyjnych.
- API-first: mozna traktowac Dify jako silnik, a nie tylko interfejs web.
- LLMOps: observability i iteracja promptow na danych produkcyjnych.

## 3) Ograniczenia, o ktorych trzeba pamietac

- Licencja: "Dify Open Source License" (Apache 2.0 + dodatkowe warunki).
- Self-hosting to nie jeden kontener: API, worker, DB, Redis, sandbox, proxy itd.
- Potrzebny baseline security (sekrety, hasla, siec, backup).

## 4) Mapa ROI - use-case'y dla SeaTrack

Skala:
- Wplyw: 1-5
- Wysilek: 1-5 (5 = najtrudniej)
- ROI = Wplyw / Wysilek (orientacyjnie)

### A. Asystent Incydentow Integracji (TOP 1)
- Problem: zgubione kroki przy errorach API armatorow i eskalacjach.
- Co robi: prowadzi operatora przez runbook (diagnoza -> akcja -> eskalacja -> szablon maila).
- Wplyw: 5
- Wysilek: 2
- ROI: 2.5
- Uwagi: szybki efekt, niski koszt, bez ingerencji w core SeaTrack.

### B. Q&A na dokumentacji SeaTrack (TOP 2)
- Problem: wiedza jest rozproszona w markdownach, checklistach i mailach.
- Co robi: odpowiedzi na pytania zespolu na podstawie aktualnej bazy wiedzy.
- Wplyw: 4
- Wysilek: 2
- ROI: 2.0
- Uwagi: idealny use-case RAG, latwy start od istniejacych artefaktow.

### C. Generator komunikacji do klienta (TOP 3)
- Problem: reczne pisanie podobnych statusow i eskalacji.
- Co robi: generuje wiadomosci status/escalation/follow-up z kontrola tonu i checklista.
- Wplyw: 4
- Wysilek: 2
- ROI: 2.0
- Uwagi: duza oszczednosc czasu operacyjnego.

### D. Klasyfikacja i priorytetyzacja zgloszen
- Problem: brak stalej triage logiki dla naplywajacych tematow.
- Co robi: taguje i priorytetyzuje sprawy (pilne, blokada klienta, maintenance).
- Wplyw: 4
- Wysilek: 3
- ROI: 1.33
- Uwagi: wymaga dopracowania zasad i walidacji.

### E. Copilot decyzji operacyjnych
- Problem: decyzje ad hoc pod presja czasu.
- Co robi: sugeruje 3 opcje dzialania + ryzyko + rekomendacje.
- Wplyw: 3
- Wysilek: 3
- ROI: 1.0
- Uwagi: wartosciowe, ale zalezne od dojrzalosci danych i promptow.

## 5) Czego nie robic teraz

- Nie stawiac od razu pelnego produkcyjnego Dify na firmowej infrastrukturze.
- Nie budowac multi-tenant i niestandardowego frontendu bez analizy licencji.
- Nie spinac od razu wszystkich procesow SeaTrack w jeden duzy workflow.

## 6) Plan minimum (2 tygodnie, niskie ryzyko)

### Tydzien 1
- Wybrac 1 use-case: Asystent Incydentow Integracji.
- Zebrac zrodla: runbooki, checklisty, szablony eskalacji.
- Zdefiniowac "Definition of Done":
  - 80% przypadkow obsluzonych bez recznego szukania dokumentow.
  - Czas odpowiedzi operatora krotszy o min. 20%.

### Tydzien 2
- Zrobic lekki PoC (lokalny lub sandbox) z jednym workflow.
- Przetestowac na 10 realistycznych scenariuszach incydentowych.
- Spisac decyzje: GO pilot / WAIT / NO-GO.

## 7) Kryteria decyzji po PoC

GO do pilota, jesli jednoczesnie:
- min. 7/10 scenariuszy przechodzi bez krytycznych bledow,
- czas obslugi spada >= 20%,
- zespol ocenia przydatnosc min. 4/5,
- brak krytycznych ryzyk licencyjno-bezpieczenstwa.

WAIT, jesli potencjal jest, ale trzeba dopiac:
- jakosc danych wejsciowych,
- governance promptow,
- polityke bezpieczenstwa i sekretow.

NO-GO, jesli:
- brak mierzalnej oszczednosci czasu,
- zbyt duzy narzut operacyjny utrzymania,
- ryzyko licencyjne nieakceptowalne dla planowanego modelu uzycia.

## 8) Decyzja operacyjna na teraz

- Trzymamy fokus na SeaTrack deployment (PNS).
- Rownolegle przygotowujemy material pod lekki PoC (bez wdrozenia produkcyjnego).
- Po odblokowaniu etapu z PNS odpalamy 1 kontrolowany pilot.
