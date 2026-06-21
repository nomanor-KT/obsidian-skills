---
name: document-handler
description: Create, edit, analyze, and extract content from PDF, Word (DOCX), and Excel (XLSX) files. Use when working with business documents, reports, or structured data. Pair with obsidian-second-brain to import document content into the vault, and with firecrawl-research or browserbase-integration to export web findings as documents.
---

# Document Handler

Work with office documents: PDFs, Word files, and Excel spreadsheets.

## When to Use

- Need to extract text, tables, or metadata from existing PDFs.
- Creating reports or multi-page summaries from research findings.
- Building dynamic Word documents with content from Obsidian notes.
- Converting Excel data into structured markdown tables for the vault.
- Analyzing document structure (headings, sections, form fields).

## Key Workflows

### 1. PDF → Obsidian

1. User has a PDF (manual, paper, report).
2. Use `pdf` skill to extract text and structure.
3. Pass clean markdown to `obsidian-second-brain` for vault import.
4. Tag with `#source/pdf` and original filename.

### 2. Web Research → Word Report

1. Collect findings via `firecrawl-research` or `browserbase-integration`.
2. Store findings in Obsidian as notes or raw content.
3. Use `docx` skill to create a formatted report.
4. Populate report with vault content, source links, and summary.
5. Export as DOCX for sharing or printing.

### 3. Excel Data → Structured Notes

1. User has an Excel file with data (contacts, tasks, decisions).
2. Use `xlsx` skill to parse sheets and extract tables.
3. Convert each table to markdown format.
4. Import via `obsidian-second-brain` as linked, structured notes.
5. Maintain link to source file for updates.

## Integration with Obsidian Workflow

- Documents are often sources for vault content: always tag them and create backlinks.
- When exporting from Obsidian to Word/PDF, maintain metadata (created date, topic, related notes).
- Large extracts should be chunked into themed notes rather than one giant dump.

## Pair With

- `obsidian-second-brain` for importing document content and exporting vault notes.
- `firecrawl-research` to combine web scraping with document compilation.
- `browserbase-integration` for extracting content from authenticated pages and compiling into reports.

## Setup Notes

- PDF: supports text extraction, form detection, and structure analysis.
- DOCX: supports formatting (bold, italic, headings), tables, comments, and templates.
- XLSX: supports multiple sheets, formulas, and cell formatting; extraction converts to plain data.
- All skills output clean markdown or structured tables suitable for vault storage.
