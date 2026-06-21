---
name: markitdown
description: Convert files, URIs, and web content to Markdown with Microsoft MarkItDown. Use when the user needs reliable document-to-markdown conversion, CLI or Python API guidance, plugin setup, Azure Document Intelligence or Content Understanding routing, or the MarkItDown MCP server.
---

# MarkItDown

Use MarkItDown when the task is: convert a file or URI to Markdown, choose the right MarkItDown entrypoint, or route the output to the next KarolOS skill.

## Kiedy uzywac

- Convert PDF, DOCX, PPTX, XLSX, HTML, CSV, JSON, XML, EPUB, images, audio, ZIP, or URLs.
- Need a quick CLI command for one-off conversion.
- Need Python API usage inside a script or pipeline.
- Need MCP exposure with `convert_to_markdown(uri)`.
- Need better OCR or structured extraction via Azure Document Intelligence or Azure Content Understanding.

## Co zrobic z wynikiem

- Vault note -> `obsidian-second-brain`.
- Report or DOCX/PDF output -> `document-handler`.
- Clean article from a normal web page -> prefer `defuddle`.
- Do not reprocess extracted Markdown unless a downstream skill needs it.

## Do not use

- For simple article cleanup, use `defuddle` instead.
- For generating finished documents from scratch, use `document-handler`.

## Fast choice

1. One file now -> CLI.
2. Code or pipeline -> Python API.
3. Agent tool -> `markitdown-mcp`.
4. OCR for embedded images -> enable plugins with `llm_client` and `llm_model`.
5. Cloud extraction or multimodal docs -> Azure Document Intelligence or Content Understanding.

## Instalacja

Base install:

```bash
pip install markitdown
```

Full install:

```bash
pip install 'markitdown[all]'
```

Common extras:

```bash
pip install 'markitdown[pdf, docx, pptx]'
pip install 'markitdown[az-doc-intel]'
pip install 'markitdown[az-content-understanding]'
```

## CLI

Basic conversion:

```bash
markitdown path-to-file.pdf > document.md
```

Save to file:

```bash
markitdown path-to-file.pdf -o document.md
```

From stdin:

```bash
cat path-to-file.pdf | markitdown
```

Useful flags:

```bash
markitdown --list-plugins
markitdown path-to-file.pdf --use-plugins
markitdown path-to-file.pdf -d -e "<document_intelligence_endpoint>"
markitdown path-to-file.pdf --use-cu --cu-endpoint "<content_understanding_endpoint>"
markitdown path-to-file.pdf --use-cu --cu-endpoint "<content_understanding_endpoint>" --cu-analyzer "my-analyzer"
markitdown path-to-file.pdf --use-cu --cu-endpoint "<content_understanding_endpoint>" --cu-file-types pdf,jpeg,mp4
```

If input has no clear filename or extension, supply `--extension`, `--mime-type`, or `--charset`.

## Python API

Minimal usage:

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("test.xlsx")
print(result.text_content)
```

Plugins:

```python
from markitdown import MarkItDown
from openai import OpenAI

md = MarkItDown(
    enable_plugins=True,
    llm_client=OpenAI(),
    llm_model="gpt-4o",
)
result = md.convert("document_with_images.pdf")
```

Document Intelligence:

```python
from markitdown import MarkItDown

md = MarkItDown(docintel_endpoint="<document_intelligence_endpoint>")
result = md.convert("test.pdf")
```

Content Understanding:

```python
from markitdown import MarkItDown

md = MarkItDown(
    cu_endpoint="<content_understanding_endpoint>",
    cu_analyzer_id="my-invoice-analyzer",
)
result = md.convert("invoice.pdf")
```

## MCP

Use `markitdown-mcp` when an agent or client needs a single tool surface.

```bash
markitdown-mcp
```

HTTP mode:

```bash
markitdown-mcp --http --host 127.0.0.1 --port 3001
```

The MCP server exposes one tool: `convert_to_markdown(uri)` for `http:`, `https:`, `file:`, and `data:` URIs.

## Gotchas

- Plugins are off by default.
- OCR plugin needs `llm_client` and `llm_model`.
- Document Intelligence and Content Understanding require valid endpoints and billable API calls.
- `cu_analyzer_id` is routed by compatibility automatically.
- For streams without filenames, pass `StreamInfo` or CLI hints.

## Granice skilla

- This skill is for extraction and conversion, not authoring new documents.
- For simple web article cleanup, choose `defuddle` first.