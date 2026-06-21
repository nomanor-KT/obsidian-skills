---
typ: referencja
tags: [typ/referencja, studia/ai-lider]
---


# Fiszki Egzaminacyjne - Lider AI w Transformacji Cyfrowej

## Pytania i Odpowiedzi (20 Fiszek)

**Q1: Czym różni się projekt AI od tradycyjnego projektu IT?**
A: Projektem AI rządzi niepewność wyniku, logika jest wytrenowana na danych (zamiast zaprogramowana), wymagania mogą ewoluować podczas projektu, wdrożenie to dopiero początek życia modelu, a sukces/porażka zależą od danych.

**Q2: Wymień 5 etapów potoku (pipeline) usługi RAG.**
A: 1) Preparation (przygotowanie), 2) Chunking (podział), 3) Chunk Enrichment (wzbogacanie), 4) Embedding (wektoryzacja), 5) Information Retrieval (wyszukiwanie), 6) LLM Generation (generowanie przez model).

**Q3: Na czym polegają 3 fundamenty organizacji AI-First?**
A: 1) Dane – dostęp, wiedza i zaufanie; 2) Procesy – znane, przestrzegane i sprawdzane; 3) Ludzie – edukacja, narzędzia i granice, po których można się bezpiecznie poruszać.

**Q4: Czym zajmuje się proces Data Preparation w metodyce CRISP-DM?**
A: Data Preparation dotyczy czyszczenia danych, feature engineering (tworzenia cech), obsługi braków, skalowania i integracji źródeł przygotowujących pod modelowanie.

**Q5: Jakie metryki są używane do obliczania szacowanego ROI projektu AI?**
A: Obejmują oszczędności (zysk czasu * koszt), wzrost przychodu (konwersja * wolumen * marża) i koszty uniknięte (błędy * koszt * wolumen) – dla 3 scenariuszy (konserwatywny, bazowy, ambitny).

**Q6: Czym się różni Lakehouse od Data Warehouse?**
A: Lakehouse (np. Databricks, Microsoft Fabric) stanowi hybrydę – elastyczność i otwartość formatów Data Lake ("schema-on-read") z transakcyjnością i ACID Data Warehouse ("schema-on-write").

**Q7: Wyjaśnij czym się zajmuje technika w prompt engineering o nazwie RAG?**
A: RAG (Retrieval-Augmented Generation) wzmacnia bazową wiedzę generatywnego modelu LLM o własne (lokalne/wewnętrzne) dane wyszukiwane na podstawie zapytania użytkownika.

**Q8: Co nazywamy "Prompt Injection"?**
A: Prompt Injection to rodzaj ataku bezpieczeństwa, polegający na celowej manipulacji wejściowymi (input) instrukcjami w celu nakłaniania modelu (np. Jailbreaking) do naruszenia zasad lub wydobycia niewłaściwych danych.

**Q9: O co chodzi w koncepcji 'Human-in-the-loop' (HITL)?**
A: HITL odnosi się do projektów AI, gdzie część krytycznych procesów (np. oceny medyczne) wykorzystuje model jedynie jako wsparcie (Copilot), a finalną decyzję i jej weryfikację zachowuje człowiek.

**Q10: Podaj 3 największe "pułapki" / powody nieudanych wdrożeń AI w biznesie.**
A: 1) Źle zdefiniowany problem (szukanie na siłę problemu pod technologię AI); 2) Brak danych lub ich zła jakość; 3) Brak właściciela biznesowego (projekty sieroty).

**Q11: W czym przydają się bazy wektorowe i podaj jeden przykład takiej platformy.**
A: Bazy wektorowe przechowują teksty (bądź obiekty) w postaci numerycznej (embeddingi) – umożliwiają wyszukiwanie semantyczne np. do RAG. Przykłady: Azure AI Search, Pinecone, Milvus.

**Q12: Rozwiń cykl życia inżynierii MLOps (od testów po produkcję).**
A: Eksperyment → Trening → Ewaluacja → Wdrożenie → Monitoring → Retraining.

**Q13: Co to jest Architektura Medalionowa w inżynierii danych?**
A: Podział logiczny danych: warstwa Bronze (surowe dane, inżynieryjne), Silver (wyczyszczone/zweryfikowane) i Gold (najwyższej jakości, biznesowe i AI-Ready).

**Q14: Jakie kryteria ocenia "AI Opportunity Filter" przy analizowaniu potencjalnego przypadku użycia?**
A: Pyta czy problem powtarzalny, czy "boli biznes", czy ma wystarczające dane, czy da się ocenić wynik metrykami i czy ryzyko (RODO/AI Act) jest akceptowalne.

**Q15: Czy techniki anonimizacji różnią się od pseudonimizacji i dlaczego jest to ważne z punktu GDPR (RODO)?**
A: Tak. W świetle RODO w pełni zanonimizowane dane nie podlegają ustawie. Pseudonimizacja nadal wykorzystuje klucz szyfrujący, co oznacza, że są traktowane jako dane osobowe na gruncie RODO.

**Q16: Co klasyfikuje się jako "Dyskryminujący Model" (bias) z punku widzenia etyki?**
A: Do Bias modelowego dochodzi, gdy algorytm AI wydaje skrzywione społecznie decyzje (np. dyskryminacja rasowa, wiekowa) – często źródłem są niereprezentatywne pule danych uczących.

**Q17: EU AI Act definiuje pewne zakresy systemów. Opisz krótko klasy ryzyka AI.**
A: Systemy dzielimy na: 1) Niedopuszczalne (np. scoring społeczny - zakazane), 2) Wysokie (medycyna, rekrutacja), 3) Ograniczone ryzyko (np. czatboty - trzeba tylko wyrażać ostrzeżenie) i 4) Ryzyko Minimalne (bez wymogów).

**Q18: Jak definiuje się "Model Drift" i "Concept Drift"?**
A: Model Drift to postępująca degradacja modelu w zderzeniu z bieżącym światem (accuracy models falls), podczas gdy Concept Drift odnosi się do skokowej lub globalnej zmiany zjawisk w zachowaniu danych wejściowych (np. zmiana popytu przez C19).

**Q19: Od czego zależy czy wybralibyśmy wdrożenie poprzez zbudowanie samemu (Build) a kupienie AI opartej na subskrypcji/gotowej (Buy)?**
A: Jeśli potrzebujemy standardowego procesu, braku wczesnego zaplecza i "fast time to value", wybieramy BUY (gotowe). Jeśli mamy bardzo unikalne dane, customowe modele lub potrzebujemy kontroli/przewagi, wybieramy zaplecze BUILD.

**Q20: Jaka struktura (pattern/framework) jest idealna pod pisanie inżynierii poleceń (Promptów) - tzw. RTF?**
A: R - Role (Zdefiniuj rolę experta), T - Task (Opisz co system ma zrobić na danym poziomie), F - Format (Zdefiniuj dokładny kształt, strukturę w jakiej się zwraca).