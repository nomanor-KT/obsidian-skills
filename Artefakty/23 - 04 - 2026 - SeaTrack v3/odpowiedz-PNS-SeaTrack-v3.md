# SeaTrack v3 - odpowiedzi techniczne dla PNS (IT)

Dziekujemy za przygotowanie wstepnego planu wdrozenia.
Ponizej przekazujemy odpowiedzi na pytania techniczne oraz dodatkowe kwestie, ktore warto domknac przed go-live.
Celem jest potwierdzenie modelu wdrozenia na obecnej infrastrukturze i jasny podzial odpowiedzialnosci.

## Odpowiedzi na pytania PNS

1. **Kod zrodlowy, instalacja, uprawnienia**

   Tak, dostarczany jest gotowy kod zrodlowy aplikacji (frontend React/Vite + backend Node.js).
   Wdrozenie po stronie serwera rekomendujemy realizowac przez IT.
   Wymagane sa:
   - dostep odczyt/zapis do katalogu aplikacji,
   - dostep odczyt/zapis do katalogow logow i zalacznikow,
   - dostep do portu backendu za reverse proxy.

   Poza konfiguracja uslug i standardowych polityk serwerowych nie ma potrzeby dodatkowych uprawnien administracyjnych dla warstwy aplikacyjnej.

2. **Praca jako proces produkcyjny / uruchamianie**

   Aplikacja powinna dzialac jako ciagly proces produkcyjny, nie w modelu recznego uruchamiania po deployu.
   Rekomendowane jest uruchomienie backendu pod menedzerem procesow:
   - PM2 (wariant prosty i szybki),
   - ewentualnie systemd (Linux) lub odpowiednik uslugi na Windows.

3. **Aktualizacje aplikacji**

   Standardowo aktualizacja obejmuje wdrozenie nowej wersji, build frontendu i restart procesu backendu.
   `npm install` jest wymagane tylko wtedy, gdy zmieniaja sie zaleznosci.
   W praktyce oznacza to kontrolowany redeploy bez zmiany modelu infrastruktury.

4. **Odpowiedzialnosc za wdrozenie nowych wersji**

   Rekomendowany model na start (RACI):
   - IT: wdrozenie na serwer, utrzymanie procesu, monitoring infrastruktury,
   - strona aplikacyjno-biznesowa: release notes, testy akceptacyjne, decyzja o publikacji wersji.

   Taki podzial minimalizuje ryzyko i przyspiesza obsluge incydentow.

5. **Wysylka maili: SMTP relay vs Outlook desktop**

   Preferujemy SMTP relay/API zamiast zaleznosci od Outlook desktop na serwerze.
   W obecnej wersji dostepne sa:
   - endpoint wysylki przez API (model serwerowy),
   - opcja otwierania draftu w Outlook Classic (wariant pomocniczy).

   Dla srodowiska produkcyjnego rekomendujemy model relay/API, bez zaleznosci od klienta desktopowego.

6. **AD oraz srodowisko Windows/Linux**

   Brak twardej zaleznosci od Active Directory.
   Poza opcjonalnym Outlook Classic aplikacja nie wymusza srodowiska Windows.
   Dopuszczalne i operacyjnie preferowane jest wdrozenie na Linux Ubuntu z nginx jako reverse proxy.

## Dodatkowe kwestie wymagajace decyzji przed go-live

- **"Cyfrowe teczki" (zalaczniki do zlecen):**
  W obecnym kodzie obowiazuja limity:
  - do 20 plikow na przesylke,
  - do 25 MB na plik,
  - typy: pdf/doc/docx/xls/xlsx.

  Rekomendacja pojemnosci:
  - start od 100 GB przestrzeni na dokumenty,
  - monitoring przyrostu,
  - regularny backup (retencja i test odtworzenia).

- **Skalowanie integracji API armatorow:**
  Obecny wzorzec adapterow jest gotowy do rozszerzen.
  Przy kolejnych armatorach potrzebne beda:
  - nowe credentials,
  - whitelist domen i regul firewall,
  - testy wydajnosci, timeoutow i rate limit.

- **Lacznosc API i firewall:**
  Wymagana lacznosc outbound HTTPS (443) do API armatorow (co najmniej Maersk/CMA/Hapag) oraz do relay/API mailowego.
  Dodatkowo rekomendowane:
  - monitoring bledow 429/5xx,
  - retry/cooldown zgodny z polityka providerow,
  - alerty przy przekroczeniu progow bledow.

- **Bezpieczenstwo i utrzymanie:**
  Przed uruchomieniem warto domknac:
  - polityke logowania i rotacje logow,
  - backup katalogu zalacznikow,
  - procedure rollback wersji,
  - wlasciciela dyzurowego (on-call) po stronie utrzymania.

## Rekomendacja koncowa

Start na istniejacej infrastrukturze jest zasadny i bezpieczny, pod warunkiem domkniecia powyzszych punktow (szczegolnie firewall, backup i model utrzymania).
Dedykowany serwer warto rozwazyc dopiero po wzroscie wolumenu dokumentow lub liczby aktywnych integracji API.

## Zalacznik - checklista uruchomieniowa (skrot)

[ ] Potwierdzony model wdrozenia (Linux + nginx lub Windows + IIS/reverse proxy)
[ ] Ustalony owner wdrozen i owner utrzymania (RACI)
[ ] Skonfigurowany proces backendu jako usluga ciagla (PM2/systemd)
[ ] Otwarty outbound firewall (API armatorow + relay/API mail)
[ ] Zweryfikowane credentials i testy polaczen do wszystkich aktywnych API
[ ] Potwierdzony storage dla "cyfrowych teczek" + limity + monitoring
[ ] Wlaczony backup logow i zalacznikow + test odtworzenia
[ ] Gotowa procedura rollback i kontakt on-call na incydenty
