---
name: firecrawl-research
description: Integrate Firecrawl for web search, content scraping, and extraction into research workflows. Use when you need to discover URLs and pull clean markdown from web pages, then pipe results into Obsidian vault via obsidian-second-brain. Pair with browserbase-integration for interactive browser flows.
---

# Firecrawl Research Integration

Use Firecrawl to search the web and extract page content for knowledge capture into Obsidian.

## When to Use

- User asks to research a topic and compile findings into notes.
- Need to pull content from a URL and turn it into markdown for the vault.
- Scraping multiple pages to aggregate information for decision-making or documentation.
- Extracting structured data (lists, tables, FAQs) from web pages.

## Key Workflows

### 1. Search + Scrape + Capture

1. Use Firecrawl `/search` to find relevant URLs for a query.
2. Use Firecrawl `/scrape` to extract markdown-clean content from the best results.
3. Pass the content to `obsidian-second-brain` for vault storage (see pairing guidance below).
4. Link results back to source URLs in the note.

### 2. Single-Page Deep Extract

1. User provides a URL.
2. Firecrawl `/scrape` extracts the content with intelligent cleaning (removes nav, ads, footers).
3. Obsidian-second-brain imports it into `RAW/` folder for later triage.

## Integration with Obsidian Workflow

- After scraping, always route to `obsidian-second-brain` to decide where content lands (new note, embed, or RAW triage).
- Tag results with `#source/firecrawl` and the query date for traceability.
- If content is large, create a reference note and link to the external source.

## Pair With

- `obsidian-second-brain` for vault routing and storage.
- `browserbase-integration` when pages require interaction (clicks, form fills, pagination).
- `document-handler` if the extracted content needs PDF export or compilation.

## Setup Notes

- Requires Firecrawl API key (free tier: up to 500 requests/month).
- Firecrawl output is already markdown; no additional parsing needed.
- Use `scrape` for speed on single pages; use `search` when discovery is needed.
