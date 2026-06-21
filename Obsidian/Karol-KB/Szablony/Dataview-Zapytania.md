---
typ: referencja
tags: [typ/referencja, workflow]
date: 2026-04-25
---

# Dataview -- gotowe zapytania

Po zainstalowaniu wtyczki Dataview, wklej te bloki kodu do dowolnej notki. Beda dynamicznie generowac listy na podstawie frontmattera.

---

## Wszystkie notki intel o Hormuzie (chronologicznie)

```dataview
TABLE date AS "Data", file.folder AS "Folder"
FROM #typ/intel AND #temat/hormuz
SORT date DESC
```

## Aktywne projekty

```dataview
TABLE status AS "Status", date AS "Data"
WHERE typ = "projekt" AND status = "aktywny"
SORT date DESC
```

## Ostatnie newslettery

```dataview
TABLE date AS "Data", file.folder AS "Zrodlo"
FROM #typ/newsletter
SORT date DESC
LIMIT 10
```

## Kontakty -- lista z firma i stanowiskiem

```dataview
TABLE firma AS "Firma", stanowisko AS "Stanowisko", data_dodania AS "Dodano"
WHERE typ = "kontakt"
SORT data_dodania DESC
```

## Notki z danego tygodnia (przyklad: W17)

```dataview
TABLE date AS "Data", typ AS "Typ"
WHERE date >= date("2026-04-20") AND date <= date("2026-04-26")
SORT date ASC
```

## Notki per armator -- Maersk

```dataview
LIST
FROM #armator/maersk
SORT date DESC
```

## Wszystko ze statusem "czekam"

```dataview
TABLE date AS "Data", file.folder AS "Folder"
WHERE status = "czekam"
SORT date DESC
```

## Notki bez frontmattera (do ogarniecia)

```dataview
LIST
WHERE !typ
SORT file.name ASC
```

---

## Powiazane
- [[MOC|Glowna mapa vaulta]]
- [[Szablony/Prompt-RAW-Processing|Prompt RAW Processing]]
