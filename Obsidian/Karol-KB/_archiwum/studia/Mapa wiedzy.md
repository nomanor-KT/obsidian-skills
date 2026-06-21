---
typ: referencja
tags: [typ/referencja, studia/ai-lider]
status: aktywny
---


# 🗺️ Mapa wiedzy – Lider AI w Transformacji Cyfrowej

> Studia podyplomowe PJATK | Partner merytoryczny: Microsoft Polska
> 9 zjazdów weekendowych (październik 2025 – czerwiec 2026) | ~160 godzin

---

## 📚 Struktura programu (9 bloków)

| Blok | Temat | Godziny |
|------|-------|---------|
| I | Wprowadzenie do AI w Biznesie | 16h |
| II | Zarządzanie Wdrożeniami AI | 20h |
| III | Zarządzanie Danymi w AI | 20h |
| IV | Budowanie Organizacji AI-First | 16h |
| V | Etyka, Regulacje i Bezpieczeństwo | 16h |
| VI | AI w Optymalizacji Codziennej Pracy | 20h |
| VII | Zaawansowane Architektury AI (RAG, Agenci) | 16h |
| VIII | Infrastruktura i MLOps | 16h |
| IX | Projekt Końcowy (obrona w Microsoft) | 16–20h |

---

## 🧠 Blok I – Wprowadzenie do AI w Biznesie

### Historia i ewolucja AI
- **1956** – Artificial Intelligence (Dartmouth, Alan Turing)
- **1997** – Machine Learning (uczenie na danych)
- **2017** – Deep Learning (sieci neuronowe, CNN, RNN, Transformery)
- **2021** – Generative AI (ChatGPT, DALL-E, modele językowe)

### Kluczowe pojęcia
- **Token** – jednostka tekstu (~4 znaki / 0,75 słowa w j. angielskim)
- **Prompt** – instrukcja dla modelu (System Prompt + User Prompt)
- **Context** – kontekst rozmowy wpływający na jakość odpowiedzi
- **LLM** – Large Language Model (GPT-4o, Claude, LLaMA, DeepSeek)
- **Agent** – autonomiczny system AI działający wieloetapowo
- **RAG** – Retrieval-Augmented Generation (AI + własne dane)
- **Copilot** – asystent AI zintegrowany z narzędziami pracy (M365)

### Modele AI na rynku
| Firma | Modele |
|-------|--------|
| Microsoft/OpenAI | GPT-4o, DALL-E, Phi-4 |
| Meta | LLaMA 2, LLaMA 3 |
| Anthropic | Claude Sonnet 3.7 |
| DeepSeek | DeepSeek R1 |
| Google | Gemini |

### Zastosowania Azure OpenAI
- **Content Generation** – generowanie treści
- **Summarization** – streszczanie dokumentów
- **Semantic Search** – wyszukiwanie semantyczne
- **Code Generation** – generowanie kodu

---

## 🚀 Blok II – Zarządzanie Wdrożeniami AI

### Dlaczego projekty AI się nie udają (TOP 5)
1. Źle zdefiniowany problem (technologia szuka problemu)
2. Brak danych lub dane złej jakości
3. Brak właściciela biznesowego (projekty sieroty)
4. Organizacja nieprzygotowana (brak procesu, governance)
5. Problem zbyt trudny technologicznie lub zbyt zmienny

### Projekt AI vs. projekt IT
| Cecha | IT | AI |
|-------|----|----|
| Wynik | Znany | Niepewny |
| Logika | Zaprogramowana | Wytrenowana |
| Wymagania | Stabilne | Ewoluują |
| Dane | Mała rola | Dane = sukces/porażka |
| Wdrożenie | Koniec | Początek |

### Cykl życia projektu AI (7 etapów)
1. **Definicja problemu** – KPI, zakres, właściciel biznesowy
2. **Data Understanding** – inwentaryzacja i ocena danych
3. **Data Preparation** – czyszczenie, normalizacja, integracja
4. **Model Development** – budowa i trening modeli
5. **Model Evaluation** – ocena jakości, testy z użytkownikami, GO/NO-GO
6. **Deployment** – wdrożenie do środowiska produkcyjnego
7. **Operations** – monitoring, retraining, zarządzanie dryftem

### AI Opportunity Filter (kryteria dobrego use case)
- ✅ Czy to jest powtarzalne?
- ✅ Czy to boli biznes?
- ✅ Czy są dane?
- ✅ Czy da się zmierzyć efekt?
- ✅ Czy ryzyko regulacyjne jest akceptowalne?

### Build vs. Buy vs. Partner
- **BUY** – szybki time-to-value, standardowe procesy, wczesna adopcja AI
- **BUILD** – unikalne dane, przewaga konkurencyjna, pełna kontrola
- **PARTNER** – kompetencje zewnętrzne, złożone projekty

### Szacowanie ROI z AI
- Oszczędność = liczba godzin × koszt godziny
- Przychód = wzrost konwersji × wolumen × marża
- Koszt uniknięty = błędy × koszt błędu × wolumen
- Zawsze 3 scenariusze: **konserwatywny / bazowy / ambitny**

### Spektakularne porażki AI (case studies)
| Firma | Problem | Lekcja |
|-------|---------|--------|
| Amazon | Bias płci w rekrutacji AI | Audyt danych, fairness testing |
| Microsoft Tay | Chatbot przejęty przez trolli | Filtry treści, kill switch |
| IBM Watson | Błędne rekomendacje onkologiczne | Walidacja kliniczna, realne dane |
| Zillow | Straty 500M$ na prognozach cen | Monitoring driftu, human-in-the-loop |
| Tesla Autopilot | Wypadki, hype > możliwości | Komunikacja = rzeczywistość |
| Holandia | Dyskryminujący algorytm zasiłkowy | Etyczna ocena, prawo do wyjaśnienia |

---

## 📊 Blok III – Zarządzanie Danymi w AI

### Hierarchia danych
```
Dane → Informacja → Wiedza → Mądrość
```

### Typy baz danych
| Typ | Zastosowanie | Przykłady |
|-----|-------------|---------|
| **SQL (Relacyjne)** | Transakcje, CRM, ERP | SQL Server, PostgreSQL |
| **NoSQL** | Logi, IoT, Big Data | MongoDB, CosmosDB, Redis |
| **Wektorowe** | AI, wyszukiwanie semantyczne, RAG | Azure AI Search, Pinecone, Weaviate |

### Metodyka CRISP-DM (6 faz)
1. **Business Understanding** – cele biznesowe, kryteria sukcesu
2. **Data Understanding** – eksploracja, profilowanie, jakość
3. **Data Preparation** – czyszczenie, feature engineering, integracja
4. **Modeling** – wybór algorytmów, trening modeli
5. **Evaluation** – ocena względem KPI, GO/NO-GO
6. **Deployment** – wdrożenie, monitoring, raport końcowy

### Architektura danych
- **ETL** – Extract → Transform → Load (tradycyjne hurtownie)
- **ELT** – Extract → Load → Transform (chmura, lakehouse)
- **Data Warehouse** – schema-on-write, SQL, ACID, BI
- **Data Lake** – schema-on-read, surowe dane, elastyczność
- **Lakehouse** – połączenie obu (Delta Lake, Microsoft Fabric)

### Architektura Medalion (Medallion Architecture)
| Warstwa | Zawartość | Użytkownicy |
|---------|-----------|-------------|
| 🥉 **Bronze** | Surowe dane | Inżynierowie danych |
| 🥈 **Silver** | Oczyszczone, zwalidowane | Analitycy danych |
| 🥇 **Gold** | Zagregowane, gotowe do BI/AI | Biznes, zarząd |

### Jakość danych w AI
- **Kompletność** – brak braków
- **Spójność** – zgodność między źródłami
- **Aktualność** – dane nie zdezaktualizowane
- **Dokładność** – precyzja wartości

### Przygotowanie danych dla modeli AI
- **EDA** (Exploratory Data Analysis) – statystyki opisowe, wizualizacje, korelacje
- **Feature Engineering** – tworzenie i selekcja cech, skalowanie, transformacje
- **Imputacja braków** – średnia/mediana, KNN, MICE
- **Obsługa outlierów** – Z-score, IQR, transformacje logarytmiczne

### Formaty plików
| Format | Zastosowanie |
|--------|-------------|
| CSV | Eksport/import, proste dane tabelaryczne |
| JSON | API, logi, zagnieżdżone struktury |
| YAML | Konfiguracje, CI/CD |
| Parquet | Big Data, analityka, ML (kolumnowy, skompresowany) |
| TOON | Interakcje z LLM (minimalny zużycie tokenów) |

---

## 🔒 Blok IV – Budowanie Organizacji AI-First

### AI-Ready vs. AI-First
| AI-Ready | AI-First |
|----------|----------|
| Uporządkowane procesy | Projektowana wokół AI |
| Jasne role i odpowiedzialności | Oparta na AI w prawie każdym procesie |
| Wiarygodne dane | Szybko eksperymentująca i skalująca |

### 3 Fundamenty organizacji AI
1. **Dane** – wiemy jakie mamy, gdzie są, jak uzyskać dostęp, ufamy im
2. **Procesy** – znamy je, podążamy nimi, weryfikujemy regularnie
3. **Ludzie** – edukacja, narzędzia, granice, ciągłe uczenie

### Governance AI
- Jasne zasady użycia AI
- Klasyfikacja danych (klasy wrażliwości)
- Human-in-the-loop (HITL)
- Rejestry inicjatyw i audyty
- Odpowiedzialności i role

### Demokratyzacja AI
- Przejście od AI tylko w IT → AI dla wszystkich
- Narzędzia no-code/low-code
- Zmiana roli zespołów technicznych (z wykonawców na enablerów)

### Klient w dobie AI
- AI zmienia sposób podejmowania decyzji przez klientów
- Klient deleguje wybór agentom AI
- Firmy muszą być widoczne i zrozumiałe dla agentów AI (MCP, A2A)

---

## ⚖️ Blok V – Etyka, Regulacje i Bezpieczeństwo AI

### Kluczowe regulacje
| Regulacja | Zakres |
|-----------|--------|
| **RODO/GDPR** | Ochrona danych osobowych w UE |
| **EU AI Act** | Klasy ryzyka AI, obowiązki dostawców i użytkowników |
| **ISO 27001** | Zarządzanie bezpieczeństwem informacji |
| **ISO 42001** | Zarządzanie systemami AI |
| **ISO 27701** | Zarządzanie prywatnością (PIMS) |

### Klasy ryzyka AI (EU AI Act)
- 🔴 **Niedopuszczalne** – zakaz (np. scoring społeczny)
- 🟠 **Wysokie** – ścisłe wymogi (medycyna, rekrutacja, kredyty)
- 🟡 **Ograniczone** – obowiązek transparentności
- 🟢 **Minimalne** – brak szczególnych wymogów

### Techniki ochrony danych
| Technika | Odwracalność | Status RODO |
|----------|-------------|-------------|
| **Anonimizacja** | Nie | Nie są danymi osobowymi |
| **Pseudonimizacja** | Tak (z kluczem) | Nadal dane osobowe |
| **Tokenizacja** | Tak/ograniczona | Nadal dane osobowe |

### Zagrożenia bezpieczeństwa AI
- **Prompt Injection / Jailbreak** – manipulacja modelem
- **XPIA** – Cross-Prompt Injection Attack
- **Deepfakes** – fałszywe treści audio/wideo
- **Bias w modelach** – dyskryminacja przez stronnicze dane
- **Zatrucie danych** – manipulacja danymi treningowymi
- **Wyciek danych** – dane z modelu lub RAG

###📖 Case Studies – Praktyczne Wyzwania

- **[[Case_Study_LLM_Bank_Assistant]]** – Implementacja asystenta AI w banku detalicznym  
  ↳ *Wgląd w: autoryzacja dostępu, ochrona danych klientów, compliance regulacyjny (KNF, GDPR), hallucynacje LLM, nadzór człowieka*

### Pięć napięć etycznych AI
1. **Zdolność vs. Kontrola** – autonomia agentów vs. nadzór człowieka
2. **Demokratyzacja vs. Degradacja** – vibe coding, bezpieczeństwo kodu
3. **Bliskość vs. Bezpieczeństwo** – chatboty emocjonalne, ryzyko psychologiczne
4. **Pamięć vs. Prywatność** – prawo do bycia zapomnianym vs. parametry modelu
5. **Prawda vs. Zaufanie** – deepfakes, dywidenda kłamcy

### Bias w AI – źródła i metody minimalizacji
- **Źródła**: niereprezentatywne dane, historyczne uprzedzenia, jednorodne zespoły
- **Minimalizacja**: audyt danych, metryki fairness, diverse teams, ciągły monitoring

---

## 🛠️ Blok VI – AI w Optymalizacji Codziennej Pracy

### Techniki Prompt Engineering
| Technika | Opis |
|----------|------|
| **Zero-Shot** | Tylko instrukcja, bez przykładów |
| **One-Shot** | Instrukcja + 1 przykład |
| **Few-Shot** | Instrukcja + kilka przykładów |
| **Chain of Thought (CoT)** | Krok po kroku, łańcuch myśli |
| **Self-Consistency** | Kilka niezależnych analiz, konsensus |
| **Tree of Thoughts (ToT)** | Drzewo możliwości, eksploracja rozwiązań |
| **RAG** | Wzbogacenie o własne dane |
| **Prompt Chaining** | Sekwencja promptów |

### Wzorce promptów
- **RTF**: Role → Task → Format
- **TAG**: Task → Action → Goal
- **BAB**: Before → After → Bridge
- **CARE**: Context → Action → Result → Example
- **RISE**: Role → Input → Steps → Expectation

### Narzędzia AI do pracy
- **GitHub Copilot** – kodowanie, IDE
- **Microsoft Copilot** – M365 (Teams, Outlook, Word, Excel)
- **Azure AI Foundry** – budowanie agentów
- **Streamlit** – szybkie aplikacje AI w Pythonie

### Poziomy autonomii agentów
1. Chat (jednorazowe zapytanie)
2. Chat + RAG (asystent z wiedzą)
3. Agent (wykonuje polecenia)
4. Autonomiczny Agent (sam decyduje co robić)

---

## 🏗️ Blok VII – Zaawansowane Architektury AI

### RAG (Retrieval-Augmented Generation)
**Pipeline RAG:**
1. **Preparation** – definicja domeny, dokumenty testowe, zapytania
2. **Chunking** – podział dokumentów na fragmenty
3. **Chunk Enrichment** – wzbogacenie metadanymi (tytuł, słowa kluczowe, embeddingi)
4. **Embedding** – wektoryzacja fragmentów
5. **Information Retrieval** – wyszukiwanie semantyczne (vector/hybrid/keyword)
6. **LLM Generation** – generowanie odpowiedzi na podstawie kontekstu

### Strategie chunkowania
| Strategia | Kiedy używać |
|-----------|-------------|
| Fixed-size | Proste, nieustrukturyzowane teksty |
| Sentence-based | Proza, artykuły |
| Recursive | Markdown, LaTeX |
| Document Layout | Faktury, formularze, raporty |
| LLM Augmentation | Obrazy, tabele, transkrypcje |

### Embeddingi
- Matematyczna reprezentacja znaczenia tekstu
- Wyszukiwanie semantyczne (cosine similarity)
- Modele: text-embedding-3-large (OpenAI), ada-v2
- Bazy wektorowe: Azure AI Search, Pinecone, Weaviate, Milvus

### Systemy wieloagentowe
- Koordynacja wielu agentów AI
- Wzorce: ReAct, Self-Critique, Task Decomposition
- Narzędzia: Semantic Kernel, LangChain, Azure AI Foundry

---

## ⚙️ Blok VIII – Infrastruktura i MLOps

### Cykl życia modelu AI
```
Eksperyment → Trening → Ewaluacja → Wdrożenie → Monitoring → Retraining
```

### Kluczowe pojęcia MLOps
- **Model Drift** – degradacja jakości modelu w czasie
- **Concept Drift** – zmiana wzorców w danych (np. pandemia)
- **CI/CD dla AI** – automatyzacja pipeline'ów ML
- **Monitoring** – śledzenie jakości, kosztów, anomalii

### Chmura vs. On-Premise
| Aspekt | Chmura | On-Premise |
|--------|--------|-----------|
| Skalowalność | Wysoka | Ograniczona |
| Koszty | OPEX (zmienne) | CAPEX (stałe) |
| Bezpieczeństwo | Zależne od dostawcy | Pełna kontrola |
| Czas wdrożenia | Szybki | Długi |

### Narzędzia Azure
- **Azure Data Factory** – orkiestracja pipeline'ów danych
- **Azure Databricks** – Big Data, ML, Spark
- **Azure ML** – MLOps, trening modeli
- **Microsoft Fabric** – lakehouse, OneLake, Power BI
- **Azure AI Foundry** – budowanie agentów AI
- **Azure AI Search** – wyszukiwanie semantyczne i wektorowe
- **Microsoft Purview** – governance, klasyfikacja danych

---

## 📋 Projekt Końcowy

### Struktura projektu (7 etapów)
1. Diagnoza i wybór obszaru
2. Koncepcja rozwiązania + KPI + ROI
3. Strategia danych
4. Architektura i modele
5. Ryzyka i zgodność regulacyjna
6. Plan wdrożenia i ROI
7. Prezentacja i obrona (w siedzibie Microsoft)

### Kryteria oceny
| Kryterium | Waga |
|-----------|------|
| Wartość biznesowa | 40% |
| Realność wdrożenia | 20% |
| Zgodność regulacyjna | 15% |
| Klarowność wizji | 15% |
| Jakość prezentacji | 10% |

### AI Canvas (szablon projektu)
- Problem
- Użytkownicy
- Wartość biznesowa
- Wzorzec AI
- Dane
- Ryzyka
- ROI (prosty)

---

## 👥 Wykładowcy

| Osoba | Rola | Firma |
|-------|------|-------|
| Michał Furmankiewicz | Engineering Lead | Microsoft Polska |
| Kamil Stachowicz | Cloud & AI Lead | Microsoft Polska |
| dr Agnieszka Niezgoda | AI Lead | Microsoft Polska |
| Tomasz Dreslerski | Enterprise Commercial Lead | Microsoft Polska |
| Jan Grzybowski | CEO | Inspeerity |
| Piotr Michałowski | AI Lead | InPost |
| Cezary Kuik | AI Product Manager | Allegro |
| Maciej Kacymirow | Head of Tax | Greenberg Traurig |
| dr Maciej Tąkiel | Dyrektor Innowacji | Greenberg Traurig |
| Ewa Dolińska-Wysocka | Radca Prawny | Bielik/Speakleash |
| dr Paweł Kowalski | Przewodniczący Rady | LuminAI Institute |

---

## 🔗 Powiązane notatki

- [[Test]] – Freight Forwarding (przykładowa notatka)

---

*Tagi: #AI #studia #PJATK #Microsoft #LLM #RAG #MLOps #etyka #regulacje #dane #transformacja-cyfrowa*
