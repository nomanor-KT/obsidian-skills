---
typ: notatka
tags: [typ/notatka, studia/ai-lider]
date: 2026-04-01
---


# Case Study: Wdrażanie LLM-Based Assistant w Mobilnej Aplikacji Bankowej

**Status:** Case study z kursu AI Leadership  
**Temat:** Implementacja asystenta konwersacyjnego opartego na LLM w instytucji finansowej  
**Data:** Kwiecień 2026

---

## 📋 Streszczenie

Przypadek dotyczy polskiego banku detalicznego obsługującego kilka milionów klientów, który chce wprowadzić asystenta AI w swojej aplikacji mobilnej. Projekt wymaga równoważenia innowacji technologicznej z rygorystycznymi wymogami regulacyjnymi i bezpieczeństwa danych finansowych.

---

## 🏢 Kontekst Organizacyjny

### Infrastruktura IT
- **On-premise:** Core banking system i CRM
- **Cloud:** Systemy analityczne, marketingowe, środowiska developerskie
- **Bezpieczeństwo:** Dojrzały system IAM zintegrowany z aplikacją mobilną

### Dane zaklasyfikowane
- Dane klientów i historia transakcji = **WYSOCE POUFNE**
- Opisy produktów, regulacje, FAQ = **UMIARKOWANIE BEZPIECZNE**

### Regulacje
- Nadzór KNF (Komisja Nadzoru Finansowego)
- GDPR
- Tajemnica bankowa

### Istniejący support klientów
- Call center
- Chat z botami regułowymi
- FAQ i help artikuły

---

## 🎯 Cel Biznesowy

### Zamierzone funkcjonalności asystenta
- Odpowiadanie na pytania o konta, karty, opłaty i usługi brokowe
- Wyjaśnianie transakcji i aktywności konta w zrozumiałym języku
- Prowadzenie klientów przez procesy (blokada karty, zmiana limitów)
- Zmniejszenie obciążenia call center

### Ograniczenia
- ❌ **NIE** może udzielać indywidualnych porad finansowych
- ❌ **NIE** może ujawniać poufne dane klientów systemom zewnętrznym

### Proponowane dodatkowe funkcjonalności
- *Jakie usługi wykonywać autonomicznie?*
- *Kiedy przekazywać do agenta?*

---

## ❓ Kluczowe Założenia i Pytania Otwarte

### Stan decyzji architektonicznej
Kierownictwo zatwierdziło użycie LLM, ale **architektura jest niezdefiniowana**:
- Publiczna usługa LLM (chmura)
- Model prywatny/hostowany
- Podejście hybrydowe

### Niejasności dotyczące bezpieczeństwa
- **Autoryzacja:** Jak LLM powinien mieć dostęp do systemu?
- **Auditowanie:** Jak logować prompty i odpowiedzi?
- **SCA:** Jak silne uwierzytelnianie klientów integruje się z LLM?

### Harmonogram
- **Pilot:** Kilka miesięcy
- **Wymogi:** KNF, zespoły prawne i bezpieczeństwa muszą zatwierdzić przed produkcją

---

## 🔍 Zadanie Projektowe

Jako część zespołu cross-funkcyjnego (architektura IT, bezpieczeństwo, compliance, operacje), należy omówić:

### 1️⃣ Kluczowe Decyzje

**Pytania do rozstrzygnięcia:**
- [ ] Jakie funkcjonalności wdrożyć w pilotażu?
- [ ] Jaka architektura najlepsza?
- [ ] Jakie dane mogą być dostępne dla LLM i jak są izolowane?
- [ ] Gdzie powinien działać LLM (cloud/on-prem/hybrid)?
- [ ] Jak obsługiwać tożsamość klienta i kontekst sesji?

**Ramy decyzyjne:**
- Bezpieczeństwo
- Tożsamość i dostęp (Identity)
- Dane (Data Governance)
- Compute
- Governance
- Operacje
- Koszt
- Niezawodność

### 2️⃣ Ryzyka i Kompromisy

| Ryzyko | Opis |
|--------|------|
| **Wycieki danych** | Ujawnienie tajemnicy bankowej, naruszenie GDPR |
| **Halucynacje LLM** | Nieprawidłowe odpowiedzi mogące wprowadzić klienta w błąd |
| **Zależność od dostawcy trzeciego** | Vendor lock-in, brak kontroli nad modelem |
| **Opóźnienia i dostępność** | Wpływ na UX i zaufanie klientów |
| **Compliance regulacyjny** | Wymogi KNF i audytu |

### 3️⃣ Gotowość Operacyjna

- [ ] Monitoring outputów LLM i interakcji użytkowników
- [ ] Nadzór człowieka i fallback do agentów
- [ ] Response na incydenty i audytu
- [ ] Regularne testy i aktualizacji modelu
- [ ] Kontrola kosztów

---

## 📚 Dodatkowe Materiały

- Microsoft Learn: [AI adoption - Cloud Adoption Framework](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/)

---

## 🔗 Powiązane Notatki

- [[Mapa wiedzy]] - AI Leadership
- [[Projekt_koncowy_podsumowanie]] - Podsumowanie kursu
- [[praca/ai-projekty/INDEX]] - Projekty AI w pracy

---

## 💭 Notatki Robocze

*Miejsce na własną analizę i wnioski.*

---

*Źródło: RAW/Case_study_Agnieszka_Niezgoda.docx*
