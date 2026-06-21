---
name: browserbase-integration
description: Use Browserbase for interactive browser automation — clicks, form fills, pagination, cookie sync, and HTML/JSON extraction. Use when pages require multi-step navigation, authentication, or JavaScript rendering. Pair with obsidian-second-brain for capturing results into the vault and firecrawl-research for simpler scraping.
---

# Browserbase Integration

Automate browser interactions and extract content from dynamic pages.

## When to Use

- Page requires clicking buttons, filling forms, or navigating multi-step flows.
- Content is rendered by JavaScript (not in initial HTML).
- Need to maintain session cookies across requests (e.g., logged-in research).
- Extracting data behind paywalls or CAPTCHAs is not needed; focus on accessible content only.

## Key Workflows

### 1. Multi-Step Page Navigation

1. Create a Browserbase session.
2. Use Browserbase CLI commands: `click`, `fill`, `navigate`, `extract_html`.
3. Chain steps to simulate real user behavior (click → wait → extract).
4. Export final HTML/JSON.
5. Pass to `obsidian-second-brain` for storage.

### 2. Cookie Sync from Local Chrome

1. User logs into a website in Chrome locally.
2. Browserbase `cookie-sync` exports cookies.
3. Import cookies into Browserbase persistent context.
4. Use authenticated session to fetch protected pages.
5. Route results to Obsidian vault.

### 3. Pagination or Dynamic Loading

1. Browserbase fetches the initial page.
2. CLI script clicks "Load More" or navigates pagination.
3. Collect all paginated content.
4. Consolidate into a single note via `obsidian-second-brain`.

## Integration with Obsidian Workflow

- After browser extraction, route to `obsidian-second-brain` with context: what was the task, what was extracted, and why.
- Tag results with `#source/browserbase` and session date.
- If content is repetitive or large, create a summary first before storing.

## Pair With

- `obsidian-second-brain` for vault storage and routing.
- `firecrawl-research` for simple URL scraping (no interaction needed).
- `document-handler` if results need to be compiled into PDF or multi-page reports.

## Setup Notes

- Requires Browserbase API credentials.
- Browserbase CLI is the primary interface; no code needed for simple tasks.
- Free tier allows limited concurrency; batch large jobs.
- HTML extraction is available; JSON extraction depends on page structure.
