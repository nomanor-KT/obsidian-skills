# Research & Extraction Workflow Routing

How to use Firecrawl, Browserbase, and Document Handler together.

## Decision Tree

### Start: What do you need?

1. **"I need to research a topic online"**
   - Go to `firecrawl-research`
   - Output: Markdown content → stored in Obsidian via `obsidian-second-brain`

2. **"I need to scrape content from a complex page (login, JS, clicks)"**
   - Go to `browserbase-integration`
   - Prerequisite: Simple URLs should use `firecrawl-research` first (faster)
   - Output: HTML/JSON → routed to `obsidian-second-brain` or compiled to document

3. **"I need to work with an existing PDF, Excel, or Word file"**
   - Go to `document-handler`
   - Input: Local file or URL-fetched file
   - Output: Extracted text/tables → stored in Obsidian or re-exported as new document

### Common Workflows

#### Research → Obsidian Note
1. User: "Find everything about X"
2. `firecrawl-research` searches and scrapes top URLs
3. Outputs: List of relevant pages with clean markdown
4. `obsidian-second-brain` imports results as RAW or reference notes
5. User manually processes or auto-tags with `#source/firecrawl`

#### Multi-Page Research → PDF Report
1. User: "Compile findings about X into a report"
2. `firecrawl-research` scrapes multiple URLs
3. `document-handler` creates DOCX report with formatted findings
4. Export as PDF for sharing

#### PDF Analysis → Vault
1. User has a research paper or manual (PDF)
2. `document-handler` extracts text and structure
3. `obsidian-second-brain` stores extracted content in thematic notes
4. Tag with `#source/pdf` and maintain link to original

#### Excel Data → Structured Notes
1. User has an Excel sheet with data
2. `document-handler` parses sheets into markdown tables
3. `obsidian-second-brain` creates linked reference notes for each row/category
4. Vault becomes live mirror of spreadsheet data

#### Authenticated Pages → Vault
1. User needs content from login-protected site
2. `browserbase-integration` uses cookie-sync or direct auth
3. Fetches protected pages with session maintained
4. Output routed to `obsidian-second-brain` for storage
5. Tag with `#source/browserbase`

## Skill Relationships

```
firecrawl-research
    ↓ (finds URLs & scrapes)
    └→ obsidian-second-brain
        ↓ (import into vault)
        └→ Obsidian notes
        
browserbase-integration
    ↓ (interactive extraction)
    └→ obsidian-second-brain
        ↓ (import or compile)
        ├→ Obsidian notes
        └→ document-handler

document-handler
    ├→ Extract from existing docs → obsidian-second-brain
    ├→ Create reports from vault content → DOCX/PDF export
    └→ Convert Excel → structured Obsidian notes
```

## Quick Decision Matrix

| Scenario | Skill | Why |
|----------|-------|-----|
| Simple URL scrape | `firecrawl-research` | Fast, no overhead |
| Many URLs + search | `firecrawl-research` | Built for discovery |
| Login required | `browserbase-integration` | Handles auth & session |
| JavaScript rendering | `browserbase-integration` | Waits for JS |
| PDF text extraction | `document-handler` | Purpose-built |
| Excel → Markdown | `document-handler` | Converts tabular data |
| Word doc creation | `document-handler` | Creates formatted docs |
| Store in vault | `obsidian-second-brain` | Always route here first |
| Need source tracking | Tag with `#source/[skill]` | Maintains provenance |

## Tags for Traceability

After using any research skill, always tag the resulting note:
- `#source/firecrawl` — from web search/scrape
- `#source/browserbase` — from browser automation
- `#source/pdf`, `#source/docx`, `#source/xlsx` — from document extraction
- `#research/[topic]` — topic area for easy filtering

## Example Commands

### Search & Import
```
Use firecrawl-research to search "containerization best practices"
Output findings to obsidian-second-brain
Tag as #source/firecrawl #research/devops
```

### Extract from PDF
```
I have a white paper (PDF) on supply chain logistics
Use document-handler to extract key sections
Create Obsidian notes per section via obsidian-second-brain
```

### Compile Multi-Source Report
```
Research: shipping regulations (firecrawl-research)
Fetch: protected compliance page (browserbase-integration)
Compile: findings into DOCX report (document-handler)
Store backup: summary to Obsidian (obsidian-second-brain)
```

## Notes

- All routes eventually go to `obsidian-second-brain` for vault storage or compilation
- Browserbase should be second choice: use `firecrawl-research` for simple pages first
- Document Handler can both extract (input) and create (output); route accordingly
- Always maintain source attribution for research provenance
