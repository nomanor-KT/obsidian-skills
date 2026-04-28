# MSC Data Exchange Agreement
## Analiza + plan działań (dla Karola, Prawnego i Zarządu)

Data: 21-03-2026
Dotyczy: M&M air sea cargo S.A - MSC Data Exchange Agreement
Cel: Ustalić, co można podpisać teraz, a co wymaga decyzji i zabezpieczeń.

## 1) Werdykt

**WAIT** - nie podpisywać teraz indywidualnie bez zamknięcia checklisty formalno-technicznej.

Dlaczego:
- Umowa nakłada na M&M szerokie obowiązki bezpieczeństwa i odpowiedzialność, a nie tylko "proste odczyty ETA/ETD".
- W obecnej wersji są pola puste i załączniki/schedule wymagają uzupełnienia lub doprecyzowania.
- Stanowisko Prawnego i Szefa jest spójne: najpierw pozytywna opinia techniczna PNS/IT + model nadzoru i odpowiedzialności, potem podpis.

## 2) Co dokładnie wynika z umowy (prostym językiem)

1. To nie jest tylko "dostęp do API".
Umowa mówi o "exchange of data" (wymianie danych) i daje ramy prawne pod przetwarzanie danych po obu stronach.

2. W Schedule 1 realny scope jest wąski.
W tabeli zaznaczone jako in-scope jest "Equipment Tracking and Tracing" po stronie danych od MSC do M&M.
Większość pozostałych typów danych jest out-of-scope.

3. Ale główny tekst umowy jest szeroki.
Są zapisy o migracji "Data Customer Data" do systemu dostawcy i o licencji na dane klienta dla dostawcy.
To wymaga doprecyzowania, żeby nie było nadinterpretacji przy samym trackingu.

4. Bezpieczeństwo po stronie M&M jest bardzo wymagające.
Schedule 2 zawiera rozbudowaną listę kontroli (zarządzanie ryzykiem, MFA, szyfrowanie, testy bezpieczeństwa, backup, incident response, monitoring, itd.).

5. Odpowiedzialność jest asymetryczna.
Odpowiedzialność MSC jest mocno ograniczona, a M&M ma szeroki obowiązek indemnizacji (pokrywania roszczeń) przy naruszeniach po swojej stronie.

6. Są dodatkowe obowiązki formalne.
- MSC ma prawo audytu dokumentacji/obszarów związanych z umową.
- Prawo i sąd: England & Wales.
- Umowa auto-odnawia się rocznie, wypowiedzenie z 3-miesięcznym wyprzedzeniem.

## 3) Najważniejsze luki do zamknięcia przed podpisem

1. Dane stron i daty są nieuzupełnione (wzór, nie finalny dokument).
2. Commencement Date jest puste.
3. Schedule 3 (Final Customers) jest pusty.
4. Trzeba jasno zapisać, że w fazie 1 zakres to wyłącznie tracking (ETA/ETD i milestone), bez dodatkowych feedów.
5. Trzeba formalnie określić, gdzie i jak działa SeaTrack (lokalnie/on-prem), kto odpowiada za utrzymanie i nadzór.

## 4) Co trzeba zrobić teraz (kolejność)

### Krok 1 - Scope memo (Karol -> Prawny + Szef)
1. Jedna strona: "Co wysyłamy, co odbieramy, czego nie robimy".
2. Wprost: czy M&M wysyła jakiekolwiek dane do MSC; jeśli tak, jakie i w jakim minimalnym zakresie.
3. Potwierdzenie: faza 1 to tylko tracking.

### Krok 2 - Lista poprawek umowy (Prawny -> MSC)
1. Dookreślić i ograniczyć zapis o migracji Data Customer Data do realnego zakresu.
2. Dookreślić Schedule 1 i 3.
3. Dopisać, że brak transferu danych poza uzgodnionym trackingiem (jeśli to stan faktyczny).
4. Dodać załącznik techniczny: opis API, pola, retencja logów, zasady incidentów.

### Krok 3 - Opinia techniczna PNS/IT (warunek GO)
1. Security review rozwiązania SeaTrack.
2. Wskazanie wymagań do wdrożenia i stałego nadzoru.
3. Ocena kosztu, czasu i odpowiedzialności operacyjnej.

### Krok 4 - Decyzja zarządcza
1. Dopiero po Krokach 1-3: GO/NO-GO.
2. Podpis tylko przez uprawnioną osobę po stronie M&M.

## 5) Pytania, które Karol ma zadać PNS (konkretny brief)

1. Czy obecna architektura SeaTrack spełnia minimalnie wymagania z Schedule 2?
2. Jakie braki krytyczne trzeba zamknąć przed produkcją?
3. Kto i jak będzie prowadził stały nadzór (monitoring, patching, reagowanie na incydenty)?
4. Jakie logi i backup są wymagane oraz jak długo je trzymać?
5. Czy potrzebny jest dodatkowy zapis o ograniczeniu odpowiedzialności/ubezpieczeniu cyber?

## 6) Co powiedzieć teraz zespołowi (jedna linia)

"Nie blokujemy tematu, ale nie podpisujemy na skróty: najpierw precyzyjny zakres + opinia PNS/IT + domknięcie zapisów prawnych, potem decyzja i wdrożenie."